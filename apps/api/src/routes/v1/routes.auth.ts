import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

export const router = Router();

const SignInSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/signin', (req, res) => {
  const parse = SignInSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const { email } = parse.data;
  const token = jwt.sign({ sub: 'user_1', email }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
  return res.json({ token });
});

router.get('/me', (req, res) => {
  const authz = req.headers.authorization;
  if (!authz) return res.status(401).json({ error: 'Unauthorized' });
  const token = authz.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    return res.json({ user: payload });
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});
