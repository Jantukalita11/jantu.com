import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { TTSController } from '../controllers/tts';
import { authenticate } from '../middleware/auth';

const generateSchema = z.object({
  text: z.string().min(1).max(50000),
  voice_id: z.string(),
  language: z.string().optional().default('en'),
  model: z.enum(['standard', 'premium', 'ultra']).optional().default('standard'),
  settings: z
    .object({
      speed: z.number().min(0.5).max(2.0).optional().default(1.0),
      pitch: z.number().min(0.5).max(2.0).optional().default(1.0),
      stability: z.number().min(0).max(1).optional().default(0.5),
      similarity_boost: z.number().min(0).max(1).optional().default(0.75),
      style: z.number().min(0).max(1).optional().default(0),
    })
    .optional(),
  output_format: z.enum(['mp3', 'wav', 'ogg', 'flac']).optional().default('mp3'),
  sample_rate: z.number().optional().default(44100),
});

export async function ttsRoutes(server: FastifyInstance) {
  const ttsController = new TTSController();

  // Generate speech from text
  server.post(
    '/generate',
    {
      preHandler: authenticate,
      schema: {
        body: generateSchema,
      },
    },
    ttsController.generate.bind(ttsController)
  );

  // Stream speech generation
  server.post(
    '/generate-stream',
    {
      preHandler: authenticate,
    },
    ttsController.generateStream.bind(ttsController)
  );

  // Get available voices
  server.get(
    '/voices',
    {
      preHandler: authenticate,
    },
    ttsController.getVoices.bind(ttsController)
  );

  // Get voice details
  server.get(
    '/voices/:voiceId',
    {
      preHandler: authenticate,
    },
    ttsController.getVoice.bind(ttsController)
  );

  // Get supported languages
  server.get(
    '/languages',
    {
      preHandler: authenticate,
    },
    ttsController.getLanguages.bind(ttsController)
  );
}
