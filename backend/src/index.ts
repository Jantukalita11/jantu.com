import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import staticFiles from '@fastify/static';
import path from 'path';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import projectRoutes from './routes/projects';
import ttsRoutes from './routes/tts';
import sttRoutes from './routes/stt';
import voiceCloneRoutes from './routes/voice-clone';
import jobRoutes from './routes/jobs';
import billingRoutes from './routes/billing';
import apiRoutes from './routes/api';

// Import middleware
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';

dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Register plugins
fastify.register(cors, {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://audioaistudio.com', 'https://www.audioaistudio.com']
    : ['http://localhost:3000'],
  credentials: true,
});

fastify.register(helmet);

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key',
});

fastify.register(multipart, {
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

fastify.register(staticFiles, {
  root: path.join(__dirname, '../uploads'),
  prefix: '/uploads/',
});

// Register middleware
fastify.register(requestLogger);
fastify.setErrorHandler(errorHandler);

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(userRoutes, { prefix: '/api/user' });
fastify.register(projectRoutes, { prefix: '/api/projects' });
fastify.register(ttsRoutes, { prefix: '/api/tts' });
fastify.register(sttRoutes, { prefix: '/api/stt' });
fastify.register(voiceCloneRoutes, { prefix: '/api/voice-clone' });
fastify.register(jobRoutes, { prefix: '/api/jobs' });
fastify.register(billingRoutes, { prefix: '/api/billing' });
fastify.register(apiRoutes, { prefix: '/api/v1' });

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`🚀 Server running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();