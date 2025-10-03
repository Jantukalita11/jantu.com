import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth';
import { userRoutes } from './users';
import { projectRoutes } from './projects';
import { ttsRoutes } from './tts';
import { sttRoutes } from './stt';
import { voiceCloneRoutes } from './voiceClone';
import { dubbingRoutes } from './dubbing';
import { subscriptionRoutes } from './subscriptions';
import { teamRoutes } from './teams';
import { webhookRoutes } from './webhooks';
import { apiKeyRoutes } from './apiKeys';

export async function registerRoutes(server: FastifyInstance) {
  const apiPrefix = `/api/${server.config.apiVersion || 'v1'}`;

  // Register all routes
  server.register(authRoutes, { prefix: `${apiPrefix}/auth` });
  server.register(userRoutes, { prefix: `${apiPrefix}/users` });
  server.register(projectRoutes, { prefix: `${apiPrefix}/projects` });
  server.register(ttsRoutes, { prefix: `${apiPrefix}/tts` });
  server.register(sttRoutes, { prefix: `${apiPrefix}/stt` });
  server.register(voiceCloneRoutes, { prefix: `${apiPrefix}/voice-clones` });
  server.register(dubbingRoutes, { prefix: `${apiPrefix}/dubbing` });
  server.register(subscriptionRoutes, { prefix: `${apiPrefix}/subscriptions` });
  server.register(teamRoutes, { prefix: `${apiPrefix}/teams` });
  server.register(webhookRoutes, { prefix: `${apiPrefix}/webhooks` });
  server.register(apiKeyRoutes, { prefix: `${apiPrefix}/api-keys` });
}
