import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { apiRateLimiter } from '@/middleware/rateLimiter';

const router = Router();

// Apply API rate limiting
router.use(apiRateLimiter);

// POST /api/stt/transcribe
router.post('/transcribe', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'STT transcribe endpoint - to be implemented',
  });
}));

// GET /api/stt/jobs/:id
router.get('/jobs/:id', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get STT job endpoint - to be implemented',
  });
}));

export default router;