import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type Role = 'owner' | 'admin' | 'editor' | 'viewer';

export interface AuthUser {
  userId: string;
  email?: string;
  roles?: Role[];
}

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthUser;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, env.jwtSecret) as any;
    req.auth = { userId: String(payload.sub), email: payload.email, roles: payload.roles ?? ['owner'] };
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireRole(required: Role) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.auth) return res.status(401).json({ error: 'Unauthorized' });
    const roles = req.auth.roles ?? [];
    if (!roles.includes(required) && !roles.includes('owner')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
