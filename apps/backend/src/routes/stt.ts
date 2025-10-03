import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { sttQueue } from '../services/queue';
import { db } from '../database';
import { checkCredits } from '../services/credits';
import { AppError } from '../middleware/errorHandler';

export async function sttRoutes(server: FastifyInstance) {
  // Transcribe audio
  server.post('/transcribe', { preHandler: authenticate }, async (request, reply) => {
    const { audio_file_id, language, enable_diarization } = request.body as any;
    
    const creditsNeeded = 10; // Base cost
    const hasCredits = await checkCredits(request.userId!, creditsNeeded);
    if (!hasCredits) throw new AppError('Insufficient credits', 402);

    const [job] = await db('jobs')
      .insert({
        user_id: request.userId,
        type: 'transcription',
        status: 'queued',
        input_data: { audio_file_id, language, enable_diarization },
      })
      .returning('*');

    await sttQueue.add({ jobId: job.id, audioFileId: audio_file_id, language, enableDiarization: enable_diarization });

    return reply.send({ jobId: job.id, status: 'queued' });
  });

  // Get transcription
  server.get('/transcriptions/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as any;
    const transcription = await db('transcriptions')
      .where({ id, user_id: request.userId })
      .first();
    return reply.send({ transcription });
  });
}
