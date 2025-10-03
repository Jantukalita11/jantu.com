import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { apiRateLimiter } from '@/middleware/rateLimiter';

const router = Router();

// Apply API rate limiting
router.use(apiRateLimiter);

// POST /api/tts/generate
router.post('/generate', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'TTS generate endpoint - to be implemented',
  });
}));

// GET /api/tts/jobs/:id
router.get('/jobs/:id', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get TTS job endpoint - to be implemented',
  });
}));

export default router;