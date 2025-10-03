import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { JobService } from './jobs';

const prisma = new PrismaClient();
const jobService = new JobService();

export class TTSService {
  private elevenLabsApiKey: string;
  private openaiApiKey: string;

  constructor() {
    this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || '';
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  async getAvailableVoices() {
    // Return predefined voices for now
    // In production, this would fetch from ElevenLabs API
    return [
      {
        id: 'rachel',
        name: 'Rachel',
        gender: 'female',
        language: 'en',
        accent: 'american',
        description: 'Clear, professional American English',
        preview: '/audio/previews/rachel.mp3',
      },
      {
        id: 'adam',
        name: 'Adam',
        gender: 'male',
        language: 'en',
        accent: 'american',
        description: 'Warm, conversational American English',
        preview: '/audio/previews/adam.mp3',
      },
      {
        id: 'emma',
        name: 'Emma',
        gender: 'female',
        language: 'en',
        accent: 'british',
        description: 'Sophisticated British English',
        preview: '/audio/previews/emma.mp3',
      },
      {
        id: 'david',
        name: 'David',
        gender: 'male',
        language: 'en',
        accent: 'british',
        description: 'Authoritative British English',
        preview: '/audio/previews/david.mp3',
      },
      {
        id: 'sarah',
        name: 'Sarah',
        gender: 'female',
        language: 'es',
        accent: 'mexican',
        description: 'Natural Mexican Spanish',
        preview: '/audio/previews/sarah.mp3',
      },
      {
        id: 'marco',
        name: 'Marco',
        gender: 'male',
        language: 'es',
        accent: 'spain',
        description: 'Clear European Spanish',
        preview: '/audio/previews/marco.mp3',
      },
    ];
  }

  calculateCredits(text: string, quality: string = 'standard'): number {
    const baseCredits = Math.ceil(text.length / 100); // 1 credit per 100 characters
    
    const qualityMultiplier = {
      standard: 1,
      high: 1.5,
      ultra: 2,
    };

    return Math.ceil(baseCredits * qualityMultiplier[quality as keyof typeof qualityMultiplier]);
  }

  async processTTS(jobId: string, input: any, userId: string) {
    try {
      await jobService.updateJobStatus(jobId, 'PROCESSING', 10);

      // Simulate TTS processing
      // In production, this would call ElevenLabs or OpenAI TTS API
      const audioUrl = await this.generateAudio(input);

      await jobService.updateJobStatus(jobId, 'PROCESSING', 50);

      // Update credits usage
      const creditsUsed = this.calculateCredits(input.text, input.quality);
      await prisma.user.update({
        where: { id: userId },
        data: {
          creditsUsed: {
            increment: creditsUsed,
          },
        },
      });

      // Log usage
      await prisma.usageLog.create({
        data: {
          ownerId: userId,
          type: 'TTS',
          credits: creditsUsed,
          metadata: {
            textLength: input.text.length,
            voice: input.voice,
            quality: input.quality,
          },
        },
      });

      await jobService.updateJobStatus(jobId, 'PROCESSING', 90);

      // Complete job
      await jobService.completeJob(jobId, {
        audioUrl,
        duration: 0, // Would be calculated from actual audio
        format: input.format,
        quality: input.quality,
        creditsUsed,
      });

    } catch (error) {
      console.error('TTS processing error:', error);
      await jobService.failJob(jobId, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async processBatchTTS(jobId: string, texts: string[], options: any, userId: string) {
    try {
      await jobService.updateJobStatus(jobId, 'PROCESSING', 5);

      const results = [];
      let totalCredits = 0;

      for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const progress = Math.floor((i / texts.length) * 80) + 5;
        
        await jobService.updateJobStatus(jobId, 'PROCESSING', progress);

        // Generate audio for this text
        const audioUrl = await this.generateAudio({ ...options, text });
        const credits = this.calculateCredits(text, options.quality);
        
        results.push({
          text,
          audioUrl,
          credits,
        });
        
        totalCredits += credits;
      }

      // Update credits usage
      await prisma.user.update({
        where: { id: userId },
        data: {
          creditsUsed: {
            increment: totalCredits,
          },
        },
      });

      // Log usage
      await prisma.usageLog.create({
        data: {
          ownerId: userId,
          type: 'TTS_BATCH',
          credits: totalCredits,
          metadata: {
            textCount: texts.length,
            totalLength: texts.reduce((sum, text) => sum + text.length, 0),
            options,
          },
        },
      });

      await jobService.updateJobStatus(jobId, 'PROCESSING', 95);

      // Complete job
      await jobService.completeJob(jobId, {
        results,
        totalCredits,
        totalTexts: texts.length,
      });

    } catch (error) {
      console.error('Batch TTS processing error:', error);
      await jobService.failJob(jobId, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async generateAudio(input: any): Promise<string> {
    // Simulate audio generation
    // In production, this would call ElevenLabs API or OpenAI TTS
    
    // For demo purposes, return a placeholder URL
    const filename = `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${input.format}`;
    const audioPath = path.join(__dirname, '../../uploads', filename);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.dirname(audioPath);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create a dummy audio file (in production, this would be the actual generated audio)
    fs.writeFileSync(audioPath, Buffer.from('dummy audio content'));

    return `/uploads/${filename}`;
  }

  async generateWithElevenLabs(text: string, voiceId: string, options: any) {
    if (!this.elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarity_boost || 0.5,
          },
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.elevenLabsApiKey,
          },
          responseType: 'arraybuffer',
        }
      );

      return response.data;
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      throw new Error('Failed to generate audio with ElevenLabs');
    }
  }

  async generateWithOpenAI(text: string, voice: string, options: any) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1',
          input: text,
          voice: voice,
          response_format: options.format || 'mp3',
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      return response.data;
    } catch (error) {
      console.error('OpenAI TTS API error:', error);
      throw new Error('Failed to generate audio with OpenAI');
    }
  }
}