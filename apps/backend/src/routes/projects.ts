import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { db } from '../database';
import { AppError } from '../middleware/errorHandler';

export async function projectRoutes(server: FastifyInstance) {
  // List projects
  server.get('/', { preHandler: authenticate }, async (request, reply) => {
    const projects = await db('projects')
      .where({ user_id: request.userId })
      .whereNull('deleted_at')
      .orderBy('updated_at', 'desc');
    return reply.send({ projects });
  });

  // Create project
  server.post('/', { preHandler: authenticate }, async (request, reply) => {
    const { name, description, type } = request.body as any;
    const [project] = await db('projects')
      .insert({
        user_id: request.userId,
        name,
        description,
        type,
      })
      .returning('*');
    return reply.send({ project });
  });

  // Get project
  server.get('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as any;
    const project = await db('projects')
      .where({ id, user_id: request.userId })
      .whereNull('deleted_at')
      .first();
    if (!project) throw new AppError('Project not found', 404);
    return reply.send({ project });
  });

  // Update project
  server.patch('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as any;
    const updates = request.body;
    await db('projects').where({ id, user_id: request.userId }).update(updates);
    return reply.send({ message: 'Project updated' });
  });

  // Delete project
  server.delete('/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as any;
    await db('projects').where({ id, user_id: request.userId }).update({ deleted_at: new Date() });
    return reply.send({ message: 'Project deleted' });
  });
}
