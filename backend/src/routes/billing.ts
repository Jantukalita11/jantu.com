import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// GET /api/billing/subscription
router.get('/subscription', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get subscription endpoint - to be implemented',
  });
}));

// POST /api/billing/subscribe
router.post('/subscribe', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Create subscription endpoint - to be implemented',
  });
}));

// POST /api/billing/cancel
router.post('/cancel', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Cancel subscription endpoint - to be implemented',
  });
}));

export default router;