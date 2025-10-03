import { Router } from 'express';
import multer from 'multer';

export const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('video'), async (_req, res) => {
  return res.json({ projectId: 'dub_123', status: 'processing' });
});

router.post('/segments', (_req, res) => {
  return res.json({ ok: true });
});
