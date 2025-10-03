import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { db } from '../database';

export async function userRoutes(server: FastifyInstance) {
  // Get current user profile
  server.get('/me', { preHandler: authenticate }, async (request, reply) => {
    const user = await db('users').where({ id: request.userId }).first();
    return reply.send({ user });
  });

  // Update user profile
  server.patch('/me', { preHandler: authenticate }, async (request, reply) => {
    const { name, avatar_url } = request.body as any;
    await db('users').where({ id: request.userId }).update({ name, avatar_url });
    return reply.send({ message: 'Profile updated' });
  });

  // Get user usage statistics
  server.get('/me/usage', { preHandler: authenticate }, async (request, reply) => {
    const subscription = await db('subscriptions')
      .where({ user_id: request.userId, status: 'active' })
      .first();
    
    const usage = await db('usage_records')
      .where({ user_id: request.userId })
      .where('created_at', '>=', subscription?.credits_reset_at || new Date())
      .sum('credits_consumed as total')
      .groupBy('service')
      .select('service');

    return reply.send({ subscription, usage });
  });
}
