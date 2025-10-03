import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { voiceCloneQueue } from '../services/queue';
import { db } from '../database';

export async function voiceCloneRoutes(server: FastifyInstance) {
  // List voice clones
  server.get('/', { preHandler: authenticate }, async (request, reply) => {
    const clones = await db('voice_clones')
      .where({ user_id: request.userId })
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');
    return reply.send({ clones });
  });

  // Create voice clone
  server.post('/', { preHandler: authenticate }, async (request, reply) => {
    const { name, description, type, training_samples } = request.body as any;
    
    const [clone] = await db('voice_clones')
      .insert({
        user_id: request.userId,
        name,
        description,
        type,
        training_samples,
        status: 'pending',
      })
      .returning('*');

    await voiceCloneQueue.add({ cloneId: clone.id, userId: request.userId, type, trainingSamples: training_samples });

    return reply.send({ clone });
  });

  // Get voice clone
  server.get('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as any;
    const clone = await db('voice_clones')
      .where({ id, user_id: request.userId })
      .first();
    return reply.send({ clone });
  });
}
