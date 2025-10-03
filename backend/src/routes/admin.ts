import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// GET /api/admin/users
router.get('/users', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Admin get users endpoint - to be implemented',
  });
}));

// GET /api/admin/analytics
router.get('/analytics', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Admin analytics endpoint - to be implemented',
  });
}));

export default router;