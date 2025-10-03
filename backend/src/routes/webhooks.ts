import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// POST /api/webhooks/stripe
router.post('/stripe', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Stripe webhook endpoint - to be implemented',
  });
}));

export default router;