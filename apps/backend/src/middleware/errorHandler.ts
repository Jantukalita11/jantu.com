import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;

  // Handle known errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if ('statusCode' in error && error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Handle validation errors
  if (error.name === 'ValidationError' || error.validation) {
    statusCode = 400;
    message = 'Validation Error';
    details = error.validation;
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
    details = undefined;
  } else if (statusCode === 500) {
    details = {
      message: error.message,
      stack: error.stack,
    };
  }

  reply.status(statusCode).send({
    error: {
      message,
      statusCode,
      details,
    },
  });
}
