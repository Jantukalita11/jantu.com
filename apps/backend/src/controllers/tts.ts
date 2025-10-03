import { FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config';
import { logger } from '../utils/logger';
import { ttsQueue } from '../services/queue';
import { checkCredits, deductCredits } from '../services/credits';
import { uploadToS3 } from '../services/s3';

export class TTSController {
  async generate(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const userId = request.userId!;
    const { text, voice_id, language, model, settings, output_format, sample_rate } = request.body;

    // Calculate credits needed (roughly 1 credit per 100 characters)
    const creditsNeeded = Math.ceil(text.length / 100);

    // Check if user has enough credits
    const hasCredits = await checkCredits(userId, creditsNeeded);
    if (!hasCredits) {
      throw new AppError('Insufficient credits', 402);
    }

    // Create job
    const [job] = await db('jobs')
      .insert({
        user_id: userId,
        type: 'tts_generation',
        status: 'queued',
        input_data: {
          text,
          voice_id,
          language,
          model,
          settings,
          output_format,
          sample_rate,
        },
      })
      .returning('*');

    // Add to queue
    await ttsQueue.add(
      {
        jobId: job.id,
        userId,
        text,
        voiceId: voice_id,
        language,
        model,
        settings,
        outputFormat: output_format,
        sampleRate: sample_rate,
      },
      {
        priority: model === 'ultra' ? 1 : 3,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );

    logger.info(`TTS job created: ${job.id} for user: ${userId}`);

    return reply.send({
      jobId: job.id,
      status: 'queued',
      estimatedTime: creditsNeeded * 0.5, // Rough estimate in seconds
    });
  }

  async generateStream(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const userId = request.userId!;
    const { text, voice_id, language, model, settings } = request.body;

    // Calculate credits
    const creditsNeeded = Math.ceil(text.length / 100);

    // Check credits
    const hasCredits = await checkCredits(userId, creditsNeeded);
    if (!hasCredits) {
      throw new AppError('Insufficient credits', 402);
    }

    try {
      // Call TTS inference endpoint with streaming
      const response = await axios.post(
        `${config.aiEndpoints.tts}/generate-stream`,
        {
          text,
          voice_id,
          language,
          settings,
        },
        {
          responseType: 'stream',
          headers: {
            'X-User-ID': userId,
            'X-Model': model,
          },
        }
      );

      // Deduct credits
      await deductCredits(userId, creditsNeeded, 'tts');

      // Stream audio back to client
      reply.type('audio/mpeg');
      return reply.send(response.data);
    } catch (error) {
      logger.error('TTS streaming error:', error);
      throw new AppError('Failed to generate speech', 500);
    }
  }

  async getVoices(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId!;

    // Get system voices
    const systemVoices = await this.fetchSystemVoices();

    // Get user's cloned voices
    const customVoices = await db('voice_clones')
      .where({ user_id: userId, status: 'ready' })
      .whereNull('deleted_at')
      .select('id', 'name', 'description', 'type', 'metadata');

    return reply.send({
      system: systemVoices,
      custom: customVoices,
    });
  }

  async getVoice(
    request: FastifyRequest<{ Params: { voiceId: string } }>,
    reply: FastifyReply
  ) {
    const { voiceId } = request.params;
    const userId = request.userId!;

    // Check if it's a system voice or custom voice
    if (voiceId.startsWith('custom_')) {
      const voice = await db('voice_clones')
        .where({ id: voiceId, user_id: userId })
        .whereNull('deleted_at')
        .first();

      if (!voice) {
        throw new AppError('Voice not found', 404);
      }

      return reply.send(voice);
    }

    // Fetch system voice details
    const systemVoice = await this.fetchSystemVoice(voiceId);
    return reply.send(systemVoice);
  }

  async getLanguages(request: FastifyRequest, reply: FastifyReply) {
    const languages = [
      { code: 'en', name: 'English', variants: ['en-US', 'en-GB', 'en-AU'] },
      { code: 'es', name: 'Spanish', variants: ['es-ES', 'es-MX', 'es-AR'] },
      { code: 'fr', name: 'French', variants: ['fr-FR', 'fr-CA'] },
      { code: 'de', name: 'German', variants: ['de-DE'] },
      { code: 'it', name: 'Italian', variants: ['it-IT'] },
      { code: 'pt', name: 'Portuguese', variants: ['pt-BR', 'pt-PT'] },
      { code: 'pl', name: 'Polish', variants: ['pl-PL'] },
      { code: 'tr', name: 'Turkish', variants: ['tr-TR'] },
      { code: 'ru', name: 'Russian', variants: ['ru-RU'] },
      { code: 'nl', name: 'Dutch', variants: ['nl-NL'] },
      { code: 'cs', name: 'Czech', variants: ['cs-CZ'] },
      { code: 'ar', name: 'Arabic', variants: ['ar-SA'] },
      { code: 'zh', name: 'Chinese', variants: ['zh-CN', 'zh-TW'] },
      { code: 'ja', name: 'Japanese', variants: ['ja-JP'] },
      { code: 'ko', name: 'Korean', variants: ['ko-KR'] },
      { code: 'hi', name: 'Hindi', variants: ['hi-IN'] },
      // Add more languages...
    ];

    return reply.send({ languages });
  }

  private async fetchSystemVoices() {
    // This would call your TTS model service to get available voices
    // For now, return mock data
    return [
      {
        id: 'voice_1',
        name: 'Sarah - Professional',
        gender: 'female',
        accent: 'American',
        age: 'adult',
        description: 'Professional female voice, ideal for business content',
        preview_url: 'https://example.com/preview/voice_1.mp3',
      },
      {
        id: 'voice_2',
        name: 'James - Narrator',
        gender: 'male',
        accent: 'British',
        age: 'adult',
        description: 'Deep male voice, perfect for audiobooks and narration',
        preview_url: 'https://example.com/preview/voice_2.mp3',
      },
      // Add more voices...
    ];
  }

  private async fetchSystemVoice(voiceId: string) {
    const voices = await this.fetchSystemVoices();
    const voice = voices.find((v) => v.id === voiceId);
    if (!voice) {
      throw new AppError('Voice not found', 404);
    }
    return voice;
  }
}
