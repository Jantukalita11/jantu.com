import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// GET /api/voices
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get voices endpoint - to be implemented',
  });
}));

// POST /api/voices/clone
router.post('/clone', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Clone voice endpoint - to be implemented',
  });
}));

// GET /api/voices/:id/preview
router.get('/:id/preview', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Get voice preview endpoint - to be implemented',
  });
}));

export default router;