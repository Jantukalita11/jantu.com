import { Router } from 'express';

export const router = Router();

router.post('/stripe', (req, res) => {
  // Placeholder for Stripe webhook signature verification
  res.json({ received: true });
});
