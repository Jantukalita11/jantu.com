import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const magicLinkSchema = z.object({
  email: z.string().email(),
});

export default async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request, reply) => {
    try {
      const { email, password, name } = registerSchema.parse(request.body);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.status(400).send({ error: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          creditsLimit: 10000, // Free tier
        },
      });

      // Generate JWT
      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          creditsUsed: user.creditsUsed,
          creditsLimit: user.creditsLimit,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          creditsUsed: user.creditsUsed,
          creditsLimit: user.creditsLimit,
        },
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Magic link (passwordless login)
  fastify.post('/magic-link', async (request, reply) => {
    try {
      const { email } = magicLinkSchema.parse(request.body);
      
      // Generate magic link token
      const token = fastify.jwt.sign(
        { email },
        { expiresIn: '15m' }
      );

      // Store token in database
      await prisma.user.upsert({
        where: { email },
        update: {
          magicLinkToken: token,
          magicLinkExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
        create: {
          email,
          magicLinkToken: token,
          magicLinkExpires: new Date(Date.now() + 15 * 60 * 1000),
          creditsLimit: 10000,
        },
      });

      // TODO: Send email with magic link
      // For now, return the token (in production, send via email)
      return reply.send({ 
        message: 'Magic link sent to your email',
        // Remove this in production
        token: process.env.NODE_ENV === 'development' ? token : undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Verify magic link
  fastify.post('/verify-magic-link', async (request, reply) => {
    try {
      const { token } = request.body as { token: string };
      
      const decoded = fastify.jwt.verify(token) as any;
      const user = await prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user || user.magicLinkToken !== token || !user.magicLinkExpires || user.magicLinkExpires < new Date()) {
        return reply.status(401).send({ error: 'Invalid or expired magic link' });
      }

      // Clear magic link token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          magicLinkToken: null,
          magicLinkExpires: null,
        },
      });

      // Generate session token
      const sessionToken = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          creditsUsed: user.creditsUsed,
          creditsLimit: user.creditsLimit,
        },
        token: sessionToken,
      });
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid magic link' });
    }
  });

  // Get current user
  fastify.get('/me', { preHandler: authenticate }, async (request, reply) => {
    const user = (request as any).user;
    
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: { team: true },
    });

    return reply.send({
      user: {
        id: userData!.id,
        email: userData!.email,
        name: userData!.name,
        role: userData!.role,
        creditsUsed: userData!.creditsUsed,
        creditsLimit: userData!.creditsLimit,
        team: userData!.team,
      },
    });
  });

  // Logout (client-side token removal)
  fastify.post('/logout', { preHandler: authenticate }, async (request, reply) => {
    return reply.send({ message: 'Logged out successfully' });
  });
}