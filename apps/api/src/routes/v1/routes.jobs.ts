import { Router } from 'express';

export const router = Router();

router.get('/:jobId', (req, res) => {
  const { jobId } = req.params;
  return res.json({ jobId, status: 'queued' });
});
