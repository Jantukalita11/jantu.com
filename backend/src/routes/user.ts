import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().url().optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

export default async function userRoutes(fastify: FastifyInstance) {
  // Get user profile
  fastify.get('/profile', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        include: { team: true },
      });

      if (!userData) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send({
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          role: userData.role,
          creditsUsed: userData.creditsUsed,
          creditsLimit: userData.creditsLimit,
          planType: userData.planType,
          subscriptionStatus: userData.subscriptionStatus,
          trialEndsAt: userData.trialEndsAt,
          subscriptionEndsAt: userData.subscriptionEndsAt,
          team: userData.team,
          createdAt: userData.createdAt,
        },
      });
    } catch (error) {
      throw error;
    }
  });

  // Update user profile
  fastify.put('/profile', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const data = updateProfileSchema.parse(request.body);

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data,
      });

      return reply.send({
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          role: updatedUser.role,
          creditsUsed: updatedUser.creditsUsed,
          creditsLimit: updatedUser.creditsLimit,
          planType: updatedUser.planType,
          subscriptionStatus: updatedUser.subscriptionStatus,
          trialEndsAt: updatedUser.trialEndsAt,
          subscriptionEndsAt: updatedUser.subscriptionEndsAt,
          createdAt: updatedUser.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Update password
  fastify.put('/password', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { currentPassword, newPassword } = updatePasswordSchema.parse(request.body);

      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userData || !userData.passwordHash) {
        return reply.status(400).send({ error: 'Password not set for this account' });
      }

      // Verify current password
      const bcrypt = require('bcryptjs');
      const isValid = await bcrypt.compare(currentPassword, userData.passwordHash);
      if (!isValid) {
        return reply.status(400).send({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

      return reply.send({ message: 'Password updated successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Get usage statistics
  fastify.get('/usage', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { period = '30d' } = request.query as any;

      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const usageLogs = await prisma.usageLog.findMany({
        where: {
          ownerId: user.id,
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Group by type and date
      const usageByType = usageLogs.reduce((acc, log) => {
        if (!acc[log.type]) {
          acc[log.type] = { totalCredits: 0, count: 0 };
        }
        acc[log.type].totalCredits += log.credits;
        acc[log.type].count += 1;
        return acc;
      }, {} as any);

      const usageByDate = usageLogs.reduce((acc, log) => {
        const date = log.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += log.credits;
        return acc;
      }, {} as any);

      return reply.send({
        period,
        totalCredits: usageLogs.reduce((sum, log) => sum + log.credits, 0),
        usageByType,
        usageByDate,
        logs: usageLogs.slice(0, 100), // Last 100 logs
      });
    } catch (error) {
      throw error;
    }
  });

  // Delete account
  fastify.delete('/account', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;

      // TODO: Implement proper account deletion with data retention policies
      // For now, just mark as deleted
      await prisma.user.update({
        where: { id: user.id },
        data: {
          email: `deleted_${user.id}@deleted.com`,
          name: 'Deleted User',
        },
      });

      return reply.send({ message: 'Account deleted successfully' });
    } catch (error) {
      throw error;
    }
  });
}