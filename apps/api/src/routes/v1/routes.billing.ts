import { Router } from 'express';
import Stripe from 'stripe';
import { env } from '../../config/env';

export const router = Router();
const stripe = env.stripeSecret ? new Stripe(env.stripeSecret, { apiVersion: '2023-10-16' }) : null;

router.get('/plans', (_req, res) => {
  return res.json({
    plans: [
      { id: 'free', price: 0, credits: 10000 },
      { id: 'starter', price: 5, credits: 30000 },
      { id: 'creator', price: 11, credits: 100000 },
      { id: 'pro', price: 99, credits: 500000 },
      { id: 'scale', price: 330, credits: 2000000 },
      { id: 'business', price: 1320, credits: 11000000 },
    ]
  });
});

router.post('/checkout', async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
  const { priceId } = req.body;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: 'http://localhost:3000/dashboard?success=1',
    cancel_url: 'http://localhost:3000/pricing?cancel=1',
  });
  return res.json({ url: session.url });
});
