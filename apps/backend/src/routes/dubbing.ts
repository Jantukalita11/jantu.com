import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { dubbingQueue } from '../services/queue';
import { db } from '../database';

export async function dubbingRoutes(server: FastifyInstance) {
  // Create dubbing job
  server.post('/jobs', { preHandler: authenticate }, async (request, reply) => {
    const { video_file_id, target_language, subtitles, voice_assignments } = request.body as any;

    const [job] = await db('jobs')
      .insert({
        user_id: request.userId,
        type: 'dubbing',
        status: 'queued',
        input_data: { video_file_id, target_language, subtitles, voice_assignments },
      })
      .returning('*');

    await dubbingQueue.add({ jobId: job.id, videoFileId: video_file_id, targetLanguage: target_language });

    return reply.send({ jobId: job.id, status: 'queued' });
  });

  // Get dubbing job
  server.get('/jobs/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as any;
    const job = await db('jobs').where({ id, user_id: request.userId }).first();
    return reply.send({ job });
  });
}
