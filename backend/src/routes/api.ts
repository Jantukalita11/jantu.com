import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const prisma = new PrismaClient();

export default async function apiRoutes(fastify: FastifyInstance) {
  // API key authentication middleware
  const apiKeyAuth = async (request: any, reply: any) => {
    const apiKey = request.headers['x-api-key'] || request.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return reply.status(401).send({ error: 'API key required' });
    }

    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { owner: true },
    });

    if (!key) {
      return reply.status(401).send({ error: 'Invalid API key' });
    }

    // Update last used
    await prisma.apiKey.update({
      where: { id: key.id },
      data: { lastUsed: new Date() },
    });

    request.apiUser = key.owner;
  };

  // Generate TTS via API
  fastify.post('/tts', { preHandler: apiKeyAuth }, async (request, reply) => {
    try {
      const user = request.apiUser;
      const { text, voice, language, speed, pitch, format, quality } = request.body as any;

      if (!text) {
        return reply.status(400).send({ error: 'Text is required' });
      }

      // Check credits
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userData) {
        return reply.status(404).send({ error: 'User not found' });
      }

      // Calculate credits needed
      const creditsNeeded = Math.ceil(text.length / 100);
      
      if (userData.creditsUsed + creditsNeeded > userData.creditsLimit) {
        return reply.status(402).send({ 
          error: 'Insufficient credits',
          creditsNeeded,
          creditsAvailable: userData.creditsLimit - userData.creditsUsed,
        });
      }

      // For API, we'll do synchronous processing for simplicity
      // In production, you might want to use async processing with webhooks
      const audioUrl = await this.generateAudioSync({
        text,
        voice: voice || 'rachel',
        language: language || 'en',
        speed: speed || 1.0,
        pitch: pitch || 1.0,
        format: format || 'mp3',
        quality: quality || 'standard',
      });

      // Update credits
      await prisma.user.update({
        where: { id: user.id },
        data: {
          creditsUsed: {
            increment: creditsNeeded,
          },
        },
      });

      // Log usage
      await prisma.usageLog.create({
        data: {
          ownerId: user.id,
          type: 'TTS_API',
          credits: creditsNeeded,
          metadata: {
            textLength: text.length,
            voice,
            quality,
          },
        },
      });

      return reply.send({
        audioUrl,
        creditsUsed: creditsNeeded,
        duration: 0, // Would be calculated from actual audio
      });
    } catch (error) {
      throw error;
    }
  });

  // Generate STT via API
  fastify.post('/stt', { preHandler: apiKeyAuth }, async (request, reply) => {
    try {
      const user = request.apiUser;
      const data = await request.file();
      
      if (!data) {
        return reply.status(400).send({ error: 'No audio file provided' });
      }

      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a'];
      if (!allowedTypes.includes(data.mimetype)) {
        return reply.status(400).send({ error: 'Invalid file type' });
      }

      // Check credits
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userData) {
        return reply.status(404).send({ error: 'User not found' });
      }

      const creditsNeeded = Math.ceil((data.file.bytesRead || 0) / 1000000);
      
      if (userData.creditsUsed + creditsNeeded > userData.creditsLimit) {
        return reply.status(402).send({ 
          error: 'Insufficient credits',
          creditsNeeded,
          creditsAvailable: userData.creditsLimit - userData.creditsUsed,
        });
      }

      // Process STT synchronously
      const transcription = await this.transcribeAudioSync(data.file);

      // Update credits
      await prisma.user.update({
        where: { id: user.id },
        data: {
          creditsUsed: {
            increment: creditsNeeded,
          },
        },
      });

      // Log usage
      await prisma.usageLog.create({
        data: {
          ownerId: user.id,
          type: 'STT_API',
          credits: creditsNeeded,
          metadata: {
            fileSize: data.file.bytesRead,
            mimetype: data.mimetype,
          },
        },
      });

      return reply.send({
        text: transcription.text,
        duration: transcription.duration,
        creditsUsed: creditsNeeded,
      });
    } catch (error) {
      throw error;
    }
  });

  // Get API usage
  fastify.get('/usage', { preHandler: apiKeyAuth }, async (request, reply) => {
    try {
      const user = request.apiUser;
      const { period = '30d' } = request.query as any;

      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const usageLogs = await prisma.usageLog.findMany({
        where: {
          ownerId: user.id,
          type: {
            in: ['TTS_API', 'STT_API'],
          },
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const totalCredits = usageLogs.reduce((sum, log) => sum + log.credits, 0);

      return reply.send({
        period,
        totalCredits,
        requests: usageLogs.length,
        logs: usageLogs.slice(0, 100),
      });
    } catch (error) {
      throw error;
    }
  });

  // Helper methods (simplified for demo)
  private async generateAudioSync(options: any): Promise<string> {
    // Simulate audio generation
    const filename = `api_tts_${Date.now()}.${options.format}`;
    const filePath = `uploads/api/${filename}`;
    
    // In production, this would call the actual TTS service
    return `/uploads/api/${filename}`;
  }

  private async transcribeAudioSync(audioFile: any): Promise<any> {
    // Simulate transcription
    return {
      text: 'This is a simulated transcription result.',
      duration: 10.5,
    };
  }
}