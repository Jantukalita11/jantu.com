import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { BillingService } from '../services/billing';

const prisma = new PrismaClient();
const billingService = new BillingService();

export default async function billingRoutes(fastify: FastifyInstance) {
  // Get billing information
  fastify.get('/info', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        include: { team: true },
      });

      if (!userData) {
        return reply.status(404).send({ error: 'User not found' });
      }

      const billingInfo = await billingService.getBillingInfo(userData);

      return reply.send(billingInfo);
    } catch (error) {
      throw error;
    }
  });

  // Get invoices
  fastify.get('/invoices', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { limit = 50, offset = 0 } = request.query as any;

      const invoices = await prisma.invoice.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      return reply.send({ invoices });
    } catch (error) {
      throw error;
    }
  });

  // Get specific invoice
  fastify.get('/invoices/:invoiceId', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { invoiceId } = request.params as { invoiceId: string };
      const user = (request as any).user;

      const invoice = await prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          ownerId: user.id,
        },
      });

      if (!invoice) {
        return reply.status(404).send({ error: 'Invoice not found' });
      }

      return reply.send({ invoice });
    } catch (error) {
      throw error;
    }
  });

  // Create checkout session
  fastify.post('/checkout', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { planType, successUrl, cancelUrl } = request.body as any;

      if (!planType || !successUrl || !cancelUrl) {
        return reply.status(400).send({ error: 'Missing required fields' });
      }

      const checkoutSession = await billingService.createCheckoutSession(
        user.id,
        planType,
        successUrl,
        cancelUrl
      );

      return reply.send({ checkoutUrl: checkoutSession.url });
    } catch (error) {
      throw error;
    }
  });

  // Create portal session
  fastify.post('/portal', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { returnUrl } = request.body as any;

      const portalSession = await billingService.createPortalSession(user.id, returnUrl);

      return reply.send({ portalUrl: portalSession.url });
    } catch (error) {
      throw error;
    }
  });

  // Update subscription
  fastify.put('/subscription', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { planType } = request.body as any;

      if (!planType) {
        return reply.status(400).send({ error: 'Plan type is required' });
      }

      const updatedSubscription = await billingService.updateSubscription(user.id, planType);

      return reply.send({ subscription: updatedSubscription });
    } catch (error) {
      throw error;
    }
  });

  // Cancel subscription
  fastify.post('/subscription/cancel', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;

      await billingService.cancelSubscription(user.id);

      return reply.send({ message: 'Subscription cancelled successfully' });
    } catch (error) {
      throw error;
    }
  });

  // Resume subscription
  fastify.post('/subscription/resume', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;

      await billingService.resumeSubscription(user.id);

      return reply.send({ message: 'Subscription resumed successfully' });
    } catch (error) {
      throw error;
    }
  });

  // Get usage for current period
  fastify.get('/usage', { preHandler: authenticate }, async (request, reply) => {
    try {
      const user = (request as any).user;
      const { period = 'current' } = request.query as any;

      const usage = await billingService.getUsage(user.id, period);

      return reply.send({ usage });
    } catch (error) {
      throw error;
    }
  });

  // Webhook for Stripe events
  fastify.post('/webhook', async (request, reply) => {
    try {
      const signature = request.headers['stripe-signature'] as string;
      const body = request.body;

      await billingService.handleWebhook(body, signature);

      return reply.send({ received: true });
    } catch (error) {
      console.error('Billing webhook error:', error);
      return reply.status(400).send({ error: 'Webhook processing failed' });
    }
  });
}