import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from './errorHandler';
import { db } from '../database';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
    userId?: string;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = await request.server.jwt.verify<AuthUser>(token);
    
    // Check if user exists and is active
    const user = await db('users')
      .where({ id: decoded.id })
      .whereNull('deleted_at')
      .first();

    if (!user) {
      throw new AppError('User not found', 401);
    }

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    request.userId = user.id;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Invalid or expired token', 401);
  }
}

export async function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes(request.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
  };
}

export async function optionalAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decoded = await request.server.jwt.verify<AuthUser>(token);
      request.user = decoded;
      request.userId = decoded.id;
    }
  } catch (error) {
    // Ignore authentication errors for optional auth
  }
}
