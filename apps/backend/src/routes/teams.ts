import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { db } from '../database';

export async function teamRoutes(server: FastifyInstance) {
  // List user's teams
  server.get('/', { preHandler: authenticate }, async (request, reply) => {
    const teams = await db('team_members')
      .join('teams', 'team_members.team_id', 'teams.id')
      .where({ 'team_members.user_id': request.userId })
      .select('teams.*', 'team_members.role');
    return reply.send({ teams });
  });

  // Create team
  server.post('/', { preHandler: authenticate }, async (request, reply) => {
    const { name, slug } = request.body as any;
    const [team] = await db('teams')
      .insert({ name, slug, owner_id: request.userId })
      .returning('*');
    
    await db('team_members').insert({
      team_id: team.id,
      user_id: request.userId,
      role: 'owner',
      joined_at: new Date(),
    });

    return reply.send({ team });
  });
}
