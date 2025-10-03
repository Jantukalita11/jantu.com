import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { db } from '../database';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export async function apiKeyRoutes(server: FastifyInstance) {
  // List API keys
  server.get('/', { preHandler: authenticate }, async (request, reply) => {
    const keys = await db('api_keys')
      .where({ user_id: request.userId, active: true })
      .select('id', 'name', 'key_prefix', 'scopes', 'created_at', 'last_used_at');
    return reply.send({ keys });
  });

  // Create API key
  server.post('/', { preHandler: authenticate }, async (request, reply) => {
    const { name, scopes } = request.body as any;
    const key = `sk_${uuidv4().replace(/-/g, '')}`;
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');
    const keyPrefix = key.substring(0, 12);

    const [apiKey] = await db('api_keys')
      .insert({
        user_id: request.userId,
        name,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        scopes,
      })
      .returning(['id', 'name', 'key_prefix', 'scopes']);

    return reply.send({ apiKey, key });
  });

  // Delete API key
  server.delete('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as any;
    await db('api_keys').where({ id, user_id: request.userId }).update({ active: false });
    return reply.send({ message: 'API key deleted' });
  });
}
