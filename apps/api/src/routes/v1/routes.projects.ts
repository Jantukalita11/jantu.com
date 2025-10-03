import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';

export const router = Router();

router.use(requireAuth);

router.get('/', (_req, res) => {
  return res.json({ projects: [{ id: 'p1', name: 'Podcast intro' }] });
});

router.post('/', (req, res) => {
  const { name } = req.body as { name: string };
  return res.json({ id: 'p_new', name });
});
