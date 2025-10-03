import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { JobService } from '../services/jobs';

const prisma = new PrismaClient();
const jobService = new JobService();

export default async function jobRoutes(fastify: FastifyInstance) {
  // Get user's jobs
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { limit = 50, offset = 0, type, status } = request.query as any;

      const where: any = { ownerId: user.id };
      if (type) where.type = type;
      if (status) where.status = status;

      const jobs = await prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      return reply.send({ jobs });
    } catch (error) {
      throw error;
    }
  });

  // Get specific job
  fastify.get('/:jobId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { jobId } = request.params as { jobId: string };
      const user = (request as any).user;

      const job = await jobService.getJob(jobId, user.id);
      if (!job) {
        return reply.status(404).send({ error: 'Job not found' });
      }

      return reply.send({ job });
    } catch (error) {
      throw error;
    }
  });

  // Cancel job
  fastify.post('/:jobId/cancel', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { jobId } = request.params as { jobId: string };
      const user = (request as any).user;

      const job = await jobService.cancelJob(jobId, user.id);
      return reply.send({ job });
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
      }
      throw error;
    }
  });

  // Get job statistics
  fastify.get('/stats/summary', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;

      const stats = await prisma.job.groupBy({
        by: ['status'],
        where: { ownerId: user.id },
        _count: { status: true },
      });

      const totalJobs = await prisma.job.count({
        where: { ownerId: user.id },
      });

      const completedJobs = await prisma.job.count({
        where: { 
          ownerId: user.id,
          status: 'COMPLETED',
        },
      });

      const failedJobs = await prisma.job.count({
        where: { 
          ownerId: user.id,
          status: 'FAILED',
        },
      });

      return reply.send({
        total: totalJobs,
        completed: completedJobs,
        failed: failedJobs,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat.status.toLowerCase()] = stat._count.status;
          return acc;
        }, {} as any),
      });
    } catch (error) {
      throw error;
    }
  });
}