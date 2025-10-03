import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string;
    email: string;
    role: string;
    teamId?: string;
  };
}

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return reply.status(401).send({ error: 'No token provided' });
    }

    const decoded = request.jwt.verify(token) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { team: true },
    });

    if (!user) {
      return reply.status(401).send({ error: 'Invalid token' });
    }

    (request as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email,
      role: user.role,
      teamId: user.teamId || undefined,
    };
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as AuthenticatedRequest).user;
    
    if (!roles.includes(user.role)) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }
  };
};

export const requireTeam = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = (request as AuthenticatedRequest).user;
  
  if (!user.teamId) {
    return reply.status(403).send({ error: 'Team membership required' });
  }
};