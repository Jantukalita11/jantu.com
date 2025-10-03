import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { STTService } from '../services/stt';
import { JobService } from '../services/jobs';

const prisma = new PrismaClient();
const sttService = new STTService();
const jobService = new JobService();

const sttRequestSchema = z.object({
  language: z.string().optional().default('en'),
  punctuation: z.boolean().optional().default(true),
  speakerDiarization: z.boolean().optional().default(false),
  timestamps: z.boolean().optional().default(true),
  format: z.enum(['json', 'text', 'srt', 'vtt']).optional().default('json'),
});

export default async function sttRoutes(fastify: FastifyInstance) {
  // Transcribe audio
  fastify.post('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const data = await request.file();
      
      if (!data) {
        return reply.status(400).send({ error: 'No audio file provided' });
      }

      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg'];
      if (!allowedTypes.includes(data.mimetype)) {
        return reply.status(400).send({ error: 'Invalid file type. Supported: MP3, WAV, M4A, OGG' });
      }

      // Parse options
      const options = sttRequestSchema.parse({
        language: data.fields?.language?.value,
        punctuation: data.fields?.punctuation?.value === 'true',
        speakerDiarization: data.fields?.speakerDiarization?.value === 'true',
        timestamps: data.fields?.timestamps?.value === 'true',
        format: data.fields?.format?.value,
      });

      // Check credits
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userData) {
        return reply.status(404).send({ error: 'User not found' });
      }

      // Estimate credits (roughly 1 credit per minute of audio)
      const estimatedCredits = Math.ceil((data.file.bytesRead || 0) / 1000000); // 1 credit per MB
      
      if (userData.creditsUsed + estimatedCredits > userData.creditsLimit) {
        return reply.status(402).send({ 
          error: 'Insufficient credits',
          creditsNeeded: estimatedCredits,
          creditsAvailable: userData.creditsLimit - userData.creditsUsed,
        });
      }

      // Create job
      const job = await jobService.createJob({
        type: 'STT',
        ownerId: user.id,
        input: {
          filename: data.filename,
          mimetype: data.mimetype,
          size: data.file.bytesRead,
          ...options,
        },
        status: 'PENDING',
      });

      // Process STT asynchronously
      sttService.processSTT(job.id, data.file, options, user.id).catch(error => {
        console.error('STT processing error:', error);
      });

      return reply.send({
        jobId: job.id,
        status: 'pending',
        estimatedCredits,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  });

  // Get STT job status
  fastify.get('/jobs/:jobId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { jobId } = request.params as { jobId: string };
      const user = (request as any).user;

      const job = await prisma.job.findFirst({
        where: {
          id: jobId,
          ownerId: user.id,
          type: 'STT',
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

  // Get supported languages
  fastify.get('/languages', async (request, reply) => {
    try {
      const languages = await sttService.getSupportedLanguages();
      return reply.send({ languages });
    } catch (error) {
      throw error;
    }
  });
}