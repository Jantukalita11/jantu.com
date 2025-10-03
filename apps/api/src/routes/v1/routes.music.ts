import { Router } from 'express';

export const router = Router();

router.post('/generate', async (req, res) => {
  const { prompt } = req.body as { prompt: string };
  return res.json({ trackId: 'track_123', url: 'https://example.com/music.mp3', prompt });
});
