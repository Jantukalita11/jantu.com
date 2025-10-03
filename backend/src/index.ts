import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';

import { config } from '@/config';
import { errorHandler } from '@/middleware/errorHandler';
import { rateLimiter } from '@/middleware/rateLimiter';
import { logger } from '@/utils/logger';
import { connectDatabase } from '@/config/database';
import { connectRedis } from '@/config/redis';
import { setupQueues } from '@/services/queue';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import projectRoutes from '@/routes/projects';
import voiceRoutes from '@/routes/voices';
import ttsRoutes from '@/routes/tts';
import sttRoutes from '@/routes/stt';
import dubbingRoutes from '@/routes/dubbing';
import billingRoutes from '@/routes/billing';
import webhookRoutes from '@/routes/webhooks';
import adminRoutes from '@/routes/admin';

async function startServer() {
  try {
    // Initialize database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Initialize Redis
    await connectRedis();
    logger.info('Redis connected successfully');

    // Setup job queues
    await setupQueues();
    logger.info('Job queues initialized');

    // Create Express app
    const app = express();
    const server = createServer(app);

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    app.use(cors({
      origin: [config.frontendUrl, 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Compression
    app.use(compression());

    // Logging
    app.use(morgan('combined', { 
      stream: { write: (message) => logger.info(message.trim()) } 
    }));

    // Rate limiting
    app.use('/api', rateLimiter);

    // Body parsing middleware
    app.use('/api/webhooks', express.raw({ type: 'application/json' })); // For Stripe webhooks
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: config.nodeEnv,
      });
    });

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/voices', voiceRoutes);
    app.use('/api/tts', ttsRoutes);
    app.use('/api/stt', sttRoutes);
    app.use('/api/dubbing', dubbingRoutes);
    app.use('/api/billing', billingRoutes);
    app.use('/api/webhooks', webhookRoutes);
    app.use('/api/admin', adminRoutes);

    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ 
        success: false, 
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
      });
    });

    // Global error handler
    app.use(errorHandler);

    // Start server
    const port = config.port;
    server.listen(port, () => {
      logger.info(`Server running on port ${port} in ${config.nodeEnv} mode`);
      logger.info(`API URL: ${config.apiUrl}`);
      logger.info(`Frontend URL: ${config.frontendUrl}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();