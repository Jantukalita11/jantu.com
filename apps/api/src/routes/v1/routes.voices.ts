import { Router } from 'express';

export const router = Router();

router.get('/', (_req, res) => {
  return res.json({
    voices: [
      { id: 'alloy', name: 'Alloy', language: 'en', gender: 'neutral' },
      { id: 'ember', name: 'Ember', language: 'en', gender: 'female' },
    ]
  });
});

router.post('/clone', (_req, res) => {
  // Placeholder for instant cloning submission
  return res.json({ cloneId: 'vc_123', status: 'processing' });
});
