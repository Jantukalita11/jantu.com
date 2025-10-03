import rateLimit from 'express-rate-limit';
import { getRedisClient } from '@/config/redis';
import { config } from '@/config';
import { logger } from '@/utils/logger';

// Redis store for rate limiting
class RedisStore {
  private client = getRedisClient();
  
  async increment(key: string): Promise<{ totalHits: number; timeToExpire?: number }> {
    try {
      const multi = this.client.multi();
      multi.incr(key);
      multi.expire(key, Math.ceil(config.rateLimit.windowMs / 1000));
      multi.ttl(key);
      
      const results = await multi.exec();
      
      if (!results) {
        throw new Error('Redis multi command failed');
      }
      
      const totalHits = results[0][1] as number;
      const ttl = results[2][1] as number;
      
      return {
        totalHits,
        timeToExpire: ttl > 0 ? ttl * 1000 : undefined,
      };
    } catch (error) {
      logger.error('Redis rate limit store error:', error);
      // Fallback to allowing the request if Redis fails
      return { totalHits: 1 };
    }
  }
  
  async decrement(key: string): Promise<void> {
    try {
      await this.client.decr(key);
    } catch (error) {
      logger.error('Redis rate limit decrement error:', error);
    }
  }
  
  async resetKey(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Redis rate limit reset error:', error);
    }
  }
}

// General rate limiter
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore() as any,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    const userId = (req as any).user?.id;
    return userId ? `rate_limit:user:${userId}` : `rate_limit:ip:${req.ip}`;
  },
});

// Stricter rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore() as any,
  keyGenerator: (req) => `auth_rate_limit:ip:${req.ip}`,
});

// API rate limiter based on plan tier
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    const user = (req as any).user;
    if (!user) return 10; // Unauthenticated users
    
    const planLimits = config.planLimits[user.subscription?.planTier?.toLowerCase() || 'free'];
    return planLimits.apiConcurrency * 10; // Allow 10x concurrency limit per minute
  },
  message: {
    success: false,
    error: 'API rate limit exceeded for your plan tier',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore() as any,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    return userId ? `api_rate_limit:user:${userId}` : `api_rate_limit:ip:${req.ip}`;
  },
});

// File upload rate limiter
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 uploads per minute
  message: {
    success: false,
    error: 'Upload rate limit exceeded, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore() as any,
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    return userId ? `upload_rate_limit:user:${userId}` : `upload_rate_limit:ip:${req.ip}`;
  },
});