import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { db } from '../database';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config';
import { logger } from '../utils/logger';
import { cache } from '../services/redis';

export class AuthController {
  async signup(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const { email, password, name } = request.body;

    // Check if user exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

    // Create user
    const [user] = await db('users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
        email_verification_token: uuidv4(),
      })
      .returning('*');

    // Create free subscription
    await db('subscriptions').insert({
      user_id: user.id,
      plan: 'free',
      status: 'active',
      credits_quota: 10000,
      credits_used: 0,
      credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Generate JWT
    const token = await reply.server.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Send verification email (implementation depends on email service)
    // await emailService.sendVerificationEmail(user.email, user.email_verification_token);

    logger.info(`User signed up: ${user.email}`);

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.email_verified,
      },
      token,
    });
  }

  async login(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const { email, password } = request.body;

    // Find user
    const user = await db('users').where({ email }).whereNull('deleted_at').first();

    if (!user || !user.password_hash) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if MFA is enabled
    if (user.mfa_enabled) {
      // Return temp token for MFA verification
      const tempToken = await reply.server.jwt.sign(
        { id: user.id, mfaPending: true },
        { expiresIn: '5m' }
      );
      return reply.send({
        mfaRequired: true,
        tempToken,
      });
    }

    // Generate JWT
    const token = await reply.server.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = uuidv4();

    // Create session
    await db('sessions').insert({
      user_id: user.id,
      token,
      refresh_token: refreshToken,
      ip_address: request.ip,
      user_agent: request.headers['user-agent'],
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      last_activity_at: new Date(),
    });

    // Update last login
    await db('users').where({ id: user.id }).update({
      last_login_at: new Date(),
      last_login_ip: request.ip,
    });

    logger.info(`User logged in: ${user.email}`);

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.email_verified,
      },
      token,
      refreshToken,
    });
  }

  async sendMagicLink(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const { email } = request.body;

    const user = await db('users').where({ email }).whereNull('deleted_at').first();

    if (!user) {
      // Don't reveal if user exists
      return reply.send({ message: 'If the email exists, a magic link has been sent' });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store magic link token in cache
    await cache.set(`magic_link:${token}`, { userId: user.id, email: user.email }, 900);

    // Send magic link email
    // await emailService.sendMagicLink(user.email, token);

    logger.info(`Magic link sent to: ${user.email}`);

    return reply.send({ message: 'If the email exists, a magic link has been sent' });
  }

  async verifyMagicLink(
    request: FastifyRequest<{ Querystring: { token: string } }>,
    reply: FastifyReply
  ) {
    const { token } = request.query;

    const data = await cache.get<{ userId: string; email: string }>(`magic_link:${token}`);

    if (!data) {
      throw new AppError('Invalid or expired magic link', 401);
    }

    // Delete used token
    await cache.del(`magic_link:${token}`);

    // Generate JWT
    const jwtToken = await reply.server.jwt.sign({
      id: data.userId,
      email: data.email,
    });

    logger.info(`User logged in via magic link: ${data.email}`);

    return reply.send({
      token: jwtToken,
    });
  }

  async refreshToken(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    const session = await db('sessions')
      .where({ refresh_token: refreshToken })
      .where('expires_at', '>', new Date())
      .first();

    if (!session) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await db('users').where({ id: session.user_id }).first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate new tokens
    const token = await reply.server.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = uuidv4();

    // Update session
    await db('sessions').where({ id: session.id }).update({
      token,
      refresh_token: newRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      last_activity_at: new Date(),
    });

    return reply.send({
      token,
      refreshToken: newRefreshToken,
    });
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (token) {
      await db('sessions').where({ token }).delete();
    }

    return reply.send({ message: 'Logged out successfully' });
  }

  async googleAuth(request: FastifyRequest, reply: FastifyReply) {
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.google.clientId}&redirect_uri=${config.google.callbackUrl}&response_type=code&scope=email profile`;
    return reply.redirect(googleAuthUrl);
  }

  async googleCallback(request: FastifyRequest, reply: FastifyReply) {
    // Handle Google OAuth callback
    // Implementation depends on OAuth library
    throw new AppError('Not implemented', 501);
  }

  async githubAuth(request: FastifyRequest, reply: FastifyReply) {
    // Redirect to GitHub OAuth
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${config.github.callbackUrl}&scope=user:email`;
    return reply.redirect(githubAuthUrl);
  }

  async githubCallback(request: FastifyRequest, reply: FastifyReply) {
    // Handle GitHub OAuth callback
    // Implementation depends on OAuth library
    throw new AppError('Not implemented', 501);
  }

  async setupMFA(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    if (!userId) throw new AppError('Authentication required', 401);

    const user = await db('users').where({ id: userId }).first();
    if (!user) throw new AppError('User not found', 404);

    if (user.mfa_enabled) {
      throw new AppError('MFA is already enabled', 400);
    }

    // Generate MFA secret
    const secret = speakeasy.generateSecret({
      name: `Audio AI Studio (${user.email})`,
      issuer: 'Audio AI Studio',
    });

    // Store temp secret in cache (user needs to verify before enabling)
    await cache.set(`mfa_setup:${userId}`, secret.base32, 600); // 10 minutes

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    return reply.send({
      secret: secret.base32,
      qrCode: qrCodeUrl,
    });
  }

  async verifyMFA(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const userId = request.userId;
    if (!userId) throw new AppError('Authentication required', 401);

    const { token, setup } = request.body;

    const user = await db('users').where({ id: userId }).first();
    if (!user) throw new AppError('User not found', 404);

    let secret: string;

    if (setup) {
      // Verifying during setup
      const tempSecret = await cache.get<string>(`mfa_setup:${userId}`);
      if (!tempSecret) {
        throw new AppError('MFA setup expired', 400);
      }
      secret = tempSecret;
    } else {
      // Verifying during login
      if (!user.mfa_secret) {
        throw new AppError('MFA not enabled', 400);
      }
      secret = user.mfa_secret;
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      throw new AppError('Invalid MFA token', 401);
    }

    if (setup) {
      // Enable MFA
      await db('users').where({ id: userId }).update({
        mfa_enabled: true,
        mfa_secret: secret,
      });

      await cache.del(`mfa_setup:${userId}`);

      return reply.send({ message: 'MFA enabled successfully' });
    }

    // Generate full JWT after MFA verification
    const jwtToken = await reply.server.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.send({
      token: jwtToken,
    });
  }

  async disableMFA(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const userId = request.userId;
    if (!userId) throw new AppError('Authentication required', 401);

    const { token } = request.body;

    const user = await db('users').where({ id: userId }).first();
    if (!user || !user.mfa_enabled) {
      throw new AppError('MFA not enabled', 400);
    }

    // Verify token before disabling
    const verified = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      throw new AppError('Invalid MFA token', 401);
    }

    await db('users').where({ id: userId }).update({
      mfa_enabled: false,
      mfa_secret: null,
    });

    return reply.send({ message: 'MFA disabled successfully' });
  }
}
