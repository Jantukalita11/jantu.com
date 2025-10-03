import { Router } from 'express';

export const router = Router();

router.post('/message', async (req, res) => {
  const { text } = req.body as { text: string };
  return res.json({ reply: `Echo: ${text}`, contextId: 'ctx_123' });
});
