import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// GET /api/users/profile
router.get('/profile', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get user profile endpoint - to be implemented',
  });
}));

// PUT /api/users/profile
router.put('/profile', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Update user profile endpoint - to be implemented',
  });
}));

// GET /api/users/usage
router.get('/usage', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get user usage endpoint - to be implemented',
  });
}));

export default router;