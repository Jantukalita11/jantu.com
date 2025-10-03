import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const prisma = new PrismaClient();

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

const createTrackSchema = z.object({
  name: z.string().min(1).max(100),
  text: z.string().min(1).max(5000),
  voiceId: z.string().optional(),
  settings: z.object({
    speed: z.number().min(0.5).max(2.0).optional(),
    pitch: z.number().min(0.5).max(2.0).optional(),
    volume: z.number().min(0).max(1).optional(),
  }).optional(),
});

export default async function projectRoutes(fastify: FastifyInstance) {
  // Get user's projects
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { limit = 50, offset = 0 } = request.query as any;

      const projects = await prisma.project.findMany({
        where: { ownerId: user.id },
        include: {
          tracks: true,
          _count: {
            select: {
              tracks: true,
              jobs: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      return reply.send({ projects });
    } catch (error) {
      throw error;
    }
  });

  // Create project
  fastify.post('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const data = createProjectSchema.parse(request.body);

      const project = await prisma.project.create({
        data: {
          ...data,
          ownerId: user.id,
        },
        include: {
          tracks: true,
        },
      });

      return reply.status(201).send({ project });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Get specific project
  fastify.get('/:projectId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const user = (request as any).user;

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: user.id,
        },
        include: {
          tracks: {
            orderBy: { order: 'asc' },
          },
          jobs: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!project) {
        return reply.status(404).send({ error: 'Project not found' });
      }

      return reply.send({ project });
    } catch (error) {
      throw error;
    }
  });

  // Update project
  fastify.put('/:projectId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const user = (request as any).user;
      const data = updateProjectSchema.parse(request.body);

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: user.id,
        },
      });

      if (!project) {
        return reply.status(404).send({ error: 'Project not found' });
      }

      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data,
        include: {
          tracks: true,
        },
      });

      return reply.send({ project: updatedProject });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Delete project
  fastify.delete('/:projectId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const user = (request as any).user;

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: user.id,
        },
      });

      if (!project) {
        return reply.status(404).send({ error: 'Project not found' });
      }

      await prisma.project.delete({
        where: { id: projectId },
      });

      return reply.send({ message: 'Project deleted successfully' });
    } catch (error) {
      throw error;
    }
  });

  // Add track to project
  fastify.post('/:projectId/tracks', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const user = (request as any).user;
      const data = createTrackSchema.parse(request.body);

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: user.id,
        },
      });

      if (!project) {
        return reply.status(404).send({ error: 'Project not found' });
      }

      // Get next order number
      const lastTrack = await prisma.track.findFirst({
        where: { projectId },
        orderBy: { order: 'desc' },
      });

      const track = await prisma.track.create({
        data: {
          ...data,
          projectId,
          order: (lastTrack?.order || 0) + 1,
        },
      });

      return reply.status(201).send({ track });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Update track
  fastify.put('/:projectId/tracks/:trackId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { projectId, trackId } = request.params as { projectId: string; trackId: string };
      const user = (request as any).user;
      const data = createTrackSchema.partial().parse(request.body);

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: user.id,
        },
      });

      if (!project) {
        return reply.status(404).send({ error: 'Project not found' });
      }

      const track = await prisma.track.findFirst({
        where: {
          id: trackId,
          projectId,
        },
      });

      if (!track) {
        return reply.status(404).send({ error: 'Track not found' });
      }

      const updatedTrack = await prisma.track.update({
        where: { id: trackId },
        data,
      });

      return reply.send({ track: updatedTrack });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Delete track
  fastify.delete('/:projectId/tracks/:trackId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { projectId, trackId } = request.params as { projectId: string; trackId: string };
      const user = (request as any).user;

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: user.id,
        },
      });

      if (!project) {
        return reply.status(404).send({ error: 'Project not found' });
      }

      await prisma.track.delete({
        where: { id: trackId },
      });

      return reply.send({ message: 'Track deleted successfully' });
    } catch (error) {
      throw error;
    }
  });

  // Reorder tracks
  fastify.put('/:projectId/tracks/reorder', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const user = (request as any).user;
      const { trackIds } = request.body as { trackIds: string[] };

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: user.id,
        },
      });

      if (!project) {
        return reply.status(404).send({ error: 'Project not found' });
      }

      // Update track orders
      await Promise.all(
        trackIds.map((trackId, index) =>
          prisma.track.update({
            where: { id: trackId },
            data: { order: index + 1 },
          })
        )
      );

      return reply.send({ message: 'Tracks reordered successfully' });
    } catch (error) {
      throw error;
    }
  });
}