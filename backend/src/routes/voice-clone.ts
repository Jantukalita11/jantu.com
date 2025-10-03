import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { VoiceCloneService } from '../services/voice-clone';

const prisma = new PrismaClient();
const voiceCloneService = new VoiceCloneService();

const createVoiceCloneSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  projectId: z.string().optional(),
});

export default async function voiceCloneRoutes(fastify: FastifyInstance) {
  // Get user's voice clones
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { limit = 50, offset = 0 } = request.query as any;

      const voiceClones = await prisma.voiceClone.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      return reply.send({ voiceClones });
    } catch (error) {
      throw error;
    }
  });

  // Create voice clone
  fastify.post('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const data = createVoiceCloneSchema.parse(request.body);

      // Check user's plan for voice cloning limits
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userData) {
        return reply.status(404).send({ error: 'User not found' });
      }

      // Check voice clone limits based on plan
      const cloneLimits = {
        FREE: 0,
        STARTER: 1,
        CREATOR: 3,
        PRO: 5,
        SCALE: 10,
        BUSINESS: 20,
        ENTERPRISE: 100,
      };

      const currentClones = await prisma.voiceClone.count({
        where: { ownerId: user.id },
      });

      if (currentClones >= cloneLimits[userData.planType as keyof typeof cloneLimits]) {
        return reply.status(403).send({ 
          error: 'Voice clone limit reached for your plan',
          limit: cloneLimits[userData.planType as keyof typeof cloneLimits],
        });
      }

      const voiceClone = await prisma.voiceClone.create({
        data: {
          ...data,
          ownerId: user.id,
        },
      });

      return reply.status(201).send({ voiceClone });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Upload samples for voice clone
  fastify.post('/:cloneId/samples', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { cloneId } = request.params as { cloneId: string };
      const user = (request as any).user;
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({ error: 'No audio file provided' });
      }

      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a'];
      if (!allowedTypes.includes(data.mimetype)) {
        return reply.status(400).send({ error: 'Invalid file type. Supported: MP3, WAV, M4A' });
      }

      // Check if voice clone exists and belongs to user
      const voiceClone = await prisma.voiceClone.findFirst({
        where: {
          id: cloneId,
          ownerId: user.id,
        },
      });

      if (!voiceClone) {
        return reply.status(404).send({ error: 'Voice clone not found' });
      }

      // Process sample upload
      const sampleUrl = await voiceCloneService.uploadSample(data, cloneId);

      // Update voice clone with new sample
      const currentSamples = voiceClone.samples as string[] || [];
      const updatedSamples = [...currentSamples, sampleUrl];

      const updatedClone = await prisma.voiceClone.update({
        where: { id: cloneId },
        data: {
          samples: updatedSamples,
        },
      });

      return reply.send({ 
        voiceClone: updatedClone,
        sampleUrl,
      });
    } catch (error) {
      throw error;
    }
  });

  // Start voice cloning process
  fastify.post('/:cloneId/train', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { cloneId } = request.params as { cloneId: string };
      const user = (request as any).user;

      const voiceClone = await prisma.voiceClone.findFirst({
        where: {
          id: cloneId,
          ownerId: user.id,
        },
      });

      if (!voiceClone) {
        return reply.status(404).send({ error: 'Voice clone not found' });
      }

      const samples = voiceClone.samples as string[];
      if (!samples || samples.length === 0) {
        return reply.status(400).send({ error: 'No samples uploaded' });
      }

      // Check minimum samples based on plan
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      const minSamples = userData?.planType === 'STARTER' ? 1 : 5;
      if (samples.length < minSamples) {
        return reply.status(400).send({ 
          error: `Minimum ${minSamples} samples required for your plan`,
        });
      }

      // Start training process
      await voiceCloneService.startTraining(cloneId, samples, user.id);

      return reply.send({ 
        message: 'Voice cloning started',
        status: 'training',
      });
    } catch (error) {
      throw error;
    }
  });

  // Get voice clone status
  fastify.get('/:cloneId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { cloneId } = request.params as { cloneId: string };
      const user = (request as any).user;

      const voiceClone = await prisma.voiceClone.findFirst({
        where: {
          id: cloneId,
          ownerId: user.id,
        },
      });

      if (!voiceClone) {
        return reply.status(404).send({ error: 'Voice clone not found' });
      }

      return reply.send({ voiceClone });
    } catch (error) {
      throw error;
    }
  });

  // Delete voice clone
  fastify.delete('/:cloneId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { cloneId } = request.params as { cloneId: string };
      const user = (request as any).user;

      const voiceClone = await prisma.voiceClone.findFirst({
        where: {
          id: cloneId,
          ownerId: user.id,
        },
      });

      if (!voiceClone) {
        return reply.status(404).send({ error: 'Voice clone not found' });
      }

      // Delete associated files
      await voiceCloneService.deleteCloneFiles(cloneId);

      await prisma.voiceClone.delete({
        where: { id: cloneId },
      });

      return reply.send({ message: 'Voice clone deleted successfully' });
    } catch (error) {
      throw error;
    }
  });

  // Test voice clone
  fastify.post('/:cloneId/test', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { cloneId } = request.params as { cloneId: string };
      const user = (request as any).user;
      const { text } = request.body as { text: string };

      if (!text || text.length === 0) {
        return reply.status(400).send({ error: 'Text is required' });
      }

      const voiceClone = await prisma.voiceClone.findFirst({
        where: {
          id: cloneId,
          ownerId: user.id,
          status: 'completed',
        },
      });

      if (!voiceClone) {
        return reply.status(404).send({ error: 'Voice clone not found or not ready' });
      }

      // Generate test audio
      const testAudio = await voiceCloneService.generateTestAudio(cloneId, text);

      return reply.send({
        audioUrl: testAudio,
        text,
      });
    } catch (error) {
      throw error;
    }
  });
}