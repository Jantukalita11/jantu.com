import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { db } from '../database';

export async function webhookRoutes(server: FastifyInstance) {
  // List webhooks
  server.get('/', { preHandler: authenticate }, async (request, reply) => {
    const webhooks = await db('webhooks').where({ user_id: request.userId });
    return reply.send({ webhooks });
  });

  // Create webhook
  server.post('/', { preHandler: authenticate }, async (request, reply) => {
    const { url, events } = request.body as any;
    const [webhook] = await db('webhooks')
      .insert({ user_id: request.userId, url, events })
      .returning('*');
    return reply.send({ webhook });
  });
}
