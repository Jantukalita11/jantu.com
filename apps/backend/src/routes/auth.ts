import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthController } from '../controllers/auth';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const magicLinkSchema = z.object({
  email: z.string().email(),
});

export async function authRoutes(server: FastifyInstance) {
  const authController = new AuthController();

  // Email/Password signup
  server.post('/signup', {
    schema: {
      body: signupSchema,
    },
    handler: authController.signup.bind(authController),
  });

  // Email/Password login
  server.post('/login', {
    schema: {
      body: loginSchema,
    },
    handler: authController.login.bind(authController),
  });

  // Magic link request
  server.post('/magic-link', {
    schema: {
      body: magicLinkSchema,
    },
    handler: authController.sendMagicLink.bind(authController),
  });

  // Magic link verify
  server.get('/magic-link/verify', {
    handler: authController.verifyMagicLink.bind(authController),
  });

  // Refresh token
  server.post('/refresh', {
    handler: authController.refreshToken.bind(authController),
  });

  // Logout
  server.post('/logout', {
    handler: authController.logout.bind(authController),
  });

  // Google OAuth
  server.get('/google', {
    handler: authController.googleAuth.bind(authController),
  });

  server.get('/google/callback', {
    handler: authController.googleCallback.bind(authController),
  });

  // GitHub OAuth
  server.get('/github', {
    handler: authController.githubAuth.bind(authController),
  });

  server.get('/github/callback', {
    handler: authController.githubCallback.bind(authController),
  });

  // MFA endpoints
  server.post('/mfa/setup', {
    handler: authController.setupMFA.bind(authController),
  });

  server.post('/mfa/verify', {
    handler: authController.verifyMFA.bind(authController),
  });

  server.post('/mfa/disable', {
    handler: authController.disableMFA.bind(authController),
  });
}
