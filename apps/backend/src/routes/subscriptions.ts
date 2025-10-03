import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { db } from '../database';

export async function subscriptionRoutes(server: FastifyInstance) {
  // Get current subscription
  server.get('/current', { preHandler: authenticate }, async (request, reply) => {
    const subscription = await db('subscriptions')
      .where({ user_id: request.userId, status: 'active' })
      .first();
    return reply.send({ subscription });
  });

  // Upgrade/change plan
  server.post('/upgrade', { preHandler: authenticate }, async (request, reply) => {
    const { plan } = request.body as any;
    // Stripe integration would go here
    return reply.send({ message: 'Plan upgrade initiated' });
  });

  // Cancel subscription
  server.post('/cancel', { preHandler: authenticate }, async (request, reply) => {
    await db('subscriptions')
      .where({ user_id: request.userId, status: 'active' })
      .update({ status: 'canceled', canceled_at: new Date() });
    return reply.send({ message: 'Subscription canceled' });
  });
}
