import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const prisma = new PrismaClient();

export class VoiceCloneService {
  private elevenLabsApiKey: string;

  constructor() {
    this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || '';
  }

  async uploadSample(file: any, cloneId: string): Promise<string> {
    // Save uploaded file
    const filename = `sample_${cloneId}_${Date.now()}.${this.getFileExtension(file.mimetype)}`;
    const filePath = path.join(__dirname, '../../uploads/voice-clones', cloneId, filename);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    const writeStream = fs.createWriteStream(filePath);
    file.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    return `/uploads/voice-clones/${cloneId}/${filename}`;
  }

  async startTraining(cloneId: string, samples: string[], userId: string) {
    try {
      // Update status to processing
      await prisma.voiceClone.update({
        where: { id: cloneId },
        data: { status: 'processing' },
      });

      // Simulate training process
      // In production, this would call ElevenLabs voice cloning API
      setTimeout(async () => {
        try {
          // Simulate successful training
          await prisma.voiceClone.update({
            where: { id: cloneId },
            data: { 
              status: 'completed',
              // In production, this would store the actual voice ID from ElevenLabs
              // voiceId: 'generated_voice_id',
            },
          });
        } catch (error) {
          console.error('Voice clone training error:', error);
          await prisma.voiceClone.update({
            where: { id: cloneId },
            data: { status: 'failed' },
          });
        }
      }, 30000); // 30 seconds simulation

    } catch (error) {
      console.error('Voice clone training start error:', error);
      throw error;
    }
  }

  async generateTestAudio(cloneId: string, text: string): Promise<string> {
    // Simulate audio generation
    // In production, this would use the trained voice model
    
    const filename = `test_${cloneId}_${Date.now()}.mp3`;
    const filePath = path.join(__dirname, '../../uploads/voice-clones', cloneId, filename);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create dummy audio file
    fs.writeFileSync(filePath, Buffer.from('dummy test audio content'));

    return `/uploads/voice-clones/${cloneId}/${filename}`;
  }

  async deleteCloneFiles(cloneId: string) {
    try {
      const cloneDir = path.join(__dirname, '../../uploads/voice-clones', cloneId);
      if (fs.existsSync(cloneDir)) {
        fs.rmSync(cloneDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.error('Error deleting clone files:', error);
    }
  }

  private getFileExtension(mimetype: string): string {
    const extensions: { [key: string]: string } = {
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'audio/mp4': 'm4a',
      'audio/m4a': 'm4a',
    };
    
    return extensions[mimetype] || 'mp3';
  }

  async cloneWithElevenLabs(samples: string[], name: string) {
    if (!this.elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      // Create voice clone
      const response = await axios.post(
        'https://api.elevenlabs.io/v1/voices/add',
        {
          name,
          files: samples.map(sample => ({
            file: sample,
            name: `sample_${Date.now()}`,
          })),
        },
        {
          headers: {
            'Accept': 'application/json',
            'xi-api-key': this.elevenLabsApiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('ElevenLabs voice cloning error:', error);
      throw new Error('Failed to create voice clone with ElevenLabs');
    }
  }
}