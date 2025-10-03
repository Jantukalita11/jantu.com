import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { TTSService } from '../services/tts';
import { JobService } from '../services/jobs';

const prisma = new PrismaClient();
const ttsService = new TTSService();
const jobService = new JobService();

const ttsRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  voice: z.string().optional(),
  language: z.string().optional().default('en'),
  speed: z.number().min(0.5).max(2.0).optional().default(1.0),
  pitch: z.number().min(0.5).max(2.0).optional().default(1.0),
  format: z.enum(['mp3', 'wav', 'pcm']).optional().default('mp3'),
  quality: z.enum(['standard', 'high', 'ultra']).optional().default('standard'),
  ssml: z.boolean().optional().default(false),
});

export default async function ttsRoutes(fastify: FastifyInstance) {
  // Generate TTS
  fastify.post('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const body = ttsRequestSchema.parse(request.body);

      // Check credits
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userData) {
        return reply.status(404).send({ error: 'User not found' });
      }

      // Calculate credits needed
      const creditsNeeded = ttsService.calculateCredits(body.text, body.quality);
      
      if (userData.creditsUsed + creditsNeeded > userData.creditsLimit) {
        return reply.status(402).send({ 
          error: 'Insufficient credits',
          creditsNeeded,
          creditsAvailable: userData.creditsLimit - userData.creditsUsed,
        });
      }

      // Create job
      const job = await jobService.createJob({
        type: 'TTS',
        ownerId: user.id,
        input: body,
        status: 'PENDING',
      });

      // Process TTS asynchronously
      ttsService.processTTS(job.id, body, user.id).catch(error => {
        console.error('TTS processing error:', error);
      });

      return reply.send({
        jobId: job.id,
        status: 'pending',
        estimatedCredits: creditsNeeded,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Get available voices
  fastify.get('/voices', async (request, reply) => {
    try {
      const voices = await ttsService.getAvailableVoices();
      return reply.send({ voices });
    } catch (error) {
      throw error;
    }
  });

  // Get TTS job status
  fastify.get('/jobs/:jobId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { jobId } = request.params as { jobId: string };
      const user = (request as any).user;

      const job = await prisma.job.findFirst({
        where: {
          id: jobId,
          ownerId: user.id,
          type: 'TTS',
        },
      });

      if (!job) {
        return reply.status(404).send({ error: 'Job not found' });
      }

      return reply.send({
        id: job.id,
        status: job.status,
        progress: job.progress,
        output: job.output,
        error: job.error,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      });
    } catch (error) {
      throw error;
    }
  });

  // Batch TTS processing
  fastify.post('/batch', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { texts, voice, language, speed, pitch, format, quality } = request.body as any;

      if (!Array.isArray(texts) || texts.length === 0) {
        return reply.status(400).send({ error: 'Texts array is required' });
      }

      if (texts.length > 50) {
        return reply.status(400).send({ error: 'Maximum 50 texts per batch' });
      }

      // Calculate total credits needed
      const totalCredits = texts.reduce((sum, text) => {
        return sum + ttsService.calculateCredits(text, quality || 'standard');
      }, 0);

      // Check credits
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userData) {
        return reply.status(404).send({ error: 'User not found' });
      }

      if (userData.creditsUsed + totalCredits > userData.creditsLimit) {
        return reply.status(402).send({ 
          error: 'Insufficient credits',
          creditsNeeded: totalCredits,
          creditsAvailable: userData.creditsLimit - userData.creditsUsed,
        });
      }

      // Create batch job
      const job = await jobService.createJob({
        type: 'TTS',
        ownerId: user.id,
        input: {
          texts,
          voice,
          language,
          speed,
          pitch,
          format,
          quality,
          batch: true,
        },
        status: 'PENDING',
      });

      // Process batch TTS
      ttsService.processBatchTTS(job.id, texts, { voice, language, speed, pitch, format, quality }, user.id).catch(error => {
        console.error('Batch TTS processing error:', error);
      });

      return reply.send({
        jobId: job.id,
        status: 'pending',
        totalTexts: texts.length,
        estimatedCredits: totalCredits,
      });
    } catch (error) {
      throw error;
    }
  });
}