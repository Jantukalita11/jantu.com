import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const statusCode = error.statusCode || 500;
  
  // Log error
  request.log.error(error);

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : error.message;

  reply.status(statusCode).send({
    error: message,
    statusCode,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
};