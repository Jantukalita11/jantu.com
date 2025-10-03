import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// POST /api/dubbing/create
router.post('/create', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Create dubbing job endpoint - to be implemented',
  });
}));

// GET /api/dubbing/jobs/:id
router.get('/jobs/:id', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get dubbing job endpoint - to be implemented',
  });
}));

export default router;