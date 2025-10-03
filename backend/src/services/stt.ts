import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { JobService } from './jobs';

const prisma = new PrismaClient();
const jobService = new JobService();

export class STTService {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  async getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
      { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
      { code: 'da', name: 'Danish', nativeName: 'Dansk' },
      { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
      { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
      { code: 'pl', name: 'Polish', nativeName: 'Polski' },
      { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
      { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    ];
  }

  async processSTT(jobId: string, audioFile: any, options: any, userId: string) {
    try {
      await jobService.updateJobStatus(jobId, 'PROCESSING', 10);

      // Save uploaded file temporarily
      const tempPath = path.join(__dirname, '../../temp', `stt_${jobId}_${Date.now()}.tmp`);
      const tempDir = path.dirname(tempPath);
      
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Write file to temp location
      const writeStream = fs.createWriteStream(tempPath);
      audioFile.pipe(writeStream);

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      await jobService.updateJobStatus(jobId, 'PROCESSING', 30);

      // Transcribe using OpenAI Whisper
      const transcription = await this.transcribeWithOpenAI(tempPath, options);

      await jobService.updateJobStatus(jobId, 'PROCESSING', 80);

      // Calculate credits used (roughly 1 credit per minute)
      const creditsUsed = Math.ceil(transcription.duration / 60);

      // Update credits usage
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
          type: 'STT',
          credits: creditsUsed,
          metadata: {
            duration: transcription.duration,
            language: options.language,
            format: options.format,
          },
        },
      });

      await jobService.updateJobStatus(jobId, 'PROCESSING', 95);

      // Format output based on requested format
      const formattedOutput = this.formatTranscription(transcription, options.format);

      // Clean up temp file
      fs.unlinkSync(tempPath);

      // Complete job
      await jobService.completeJob(jobId, {
        transcription: formattedOutput,
        duration: transcription.duration,
        language: options.language,
        format: options.format,
        creditsUsed,
      });

    } catch (error) {
      console.error('STT processing error:', error);
      await jobService.failJob(jobId, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async transcribeWithOpenAI(audioPath: string, options: any) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const formData = new FormData();
      const audioFile = new File([fs.readFileSync(audioPath)], 'audio.mp3', { type: 'audio/mpeg' });
      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      formData.append('language', options.language);
      formData.append('response_format', 'verbose_json');
      formData.append('timestamp_granularities[]', 'word');
      formData.append('timestamp_granularities[]', 'segment');

      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('OpenAI Whisper API error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  private formatTranscription(transcription: any, format: string) {
    switch (format) {
      case 'text':
        return transcription.text;
      
      case 'srt':
        return this.formatAsSRT(transcription);
      
      case 'vtt':
        return this.formatAsVTT(transcription);
      
      case 'json':
      default:
        return transcription;
    }
  }

  private formatAsSRT(transcription: any) {
    if (!transcription.segments) {
      return `1\n00:00:00,000 --> 00:00:${Math.ceil(transcription.duration)},000\n${transcription.text}\n\n`;
    }

    return transcription.segments.map((segment: any, index: number) => {
      const start = this.formatTimestamp(segment.start);
      const end = this.formatTimestamp(segment.end);
      return `${index + 1}\n${start} --> ${end}\n${segment.text}\n\n`;
    }).join('');
  }

  private formatAsVTT(transcription: any) {
    let vtt = 'WEBVTT\n\n';
    
    if (transcription.segments) {
      transcription.segments.forEach((segment: any) => {
        const start = this.formatTimestampVTT(segment.start);
        const end = this.formatTimestampVTT(segment.end);
        vtt += `${start} --> ${end}\n${segment.text}\n\n`;
      });
    } else {
      vtt += `00:00:00.000 --> 00:00:${Math.ceil(transcription.duration)}.000\n${transcription.text}\n\n`;
    }

    return vtt;
  }

  private formatTimestamp(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  }

  private formatTimestampVTT(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }
}