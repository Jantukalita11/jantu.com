import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { config } from './config';
import { logger } from './utils/logger';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { db } from './database';
import { redisClient } from './services/redis';

const server = fastify({
  logger: config.env === 'development',
  trustProxy: true,
});

async function start() {
  try {
    // Register plugins
    await server.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    });

    await server.register(cors, {
      origin: config.corsOrigin,
      credentials: true,
    });

    await server.register(rateLimit, {
      max: config.rateLimit.max,
      timeWindow: config.rateLimit.window,
      redis: redisClient,
    });

    await server.register(multipart, {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
        files: 10,
      },
    });

    await server.register(jwt, {
      secret: config.jwtSecret,
      sign: {
        expiresIn: config.jwtExpiresIn,
      },
    });

    await server.register(cookie, {
      secret: config.jwtSecret,
    });

    // Health check
    server.get('/health', async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    });

    // Register routes
    await registerRoutes(server);

    // Error handler
    server.setErrorHandler(errorHandler);

    // Test database connection
    await db.raw('SELECT 1');
    logger.info('Database connected successfully');

    // Test Redis connection
    await redisClient.ping();
    logger.info('Redis connected successfully');

    // Start server
    const address = await server.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    logger.info(`Server listening on ${address}`);
    logger.info(`Environment: ${config.env}`);
  } catch (err) {
    logger.error('Error starting server:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await server.close();
  await db.destroy();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await server.close();
  await db.destroy();
  await redisClient.quit();
  process.exit(0);
});

start();
