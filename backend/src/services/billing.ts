import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export class BillingService {
  private plans = {
    FREE: {
      name: 'Free',
      price: 0,
      credits: 10000,
      features: ['TTS', 'STT', 'Studio access (limited)', 'API access'],
    },
    STARTER: {
      name: 'Starter',
      price: 500, // $5.00 in cents
      credits: 30000,
      features: ['Everything in Free', 'Commercial license', 'Instant voice cloning', 'Dubbing Studio'],
    },
    CREATOR: {
      name: 'Creator',
      price: 1100, // $11.00 in cents
      credits: 100000,
      features: ['Everything in Starter', 'Professional voice cloning', 'Higher quality audio'],
    },
    PRO: {
      name: 'Pro',
      price: 9900, // $99.00 in cents
      credits: 500000,
      features: ['Everything in Creator', '44.1kHz PCM API output', 'Higher concurrency'],
    },
    SCALE: {
      name: 'Scale',
      price: 33000, // $330.00 in cents
      credits: 2000000,
      features: ['Everything in Pro', 'Multi-seat workspace', 'Team admin controls'],
    },
    BUSINESS: {
      name: 'Business',
      price: 132000, // $1320.00 in cents
      credits: 11000000,
      features: ['Everything in Scale', 'Low-latency TTS', 'Dedicated support SLA'],
    },
    ENTERPRISE: {
      name: 'Enterprise',
      price: 0, // Custom pricing
      credits: 0, // Custom credits
      features: ['Custom everything', 'DPA/SLAs', 'HIPAA BAA', 'Custom SSO'],
    },
  };

  async getBillingInfo(user: any) {
    const plan = this.plans[user.planType as keyof typeof this.plans];
    
    return {
      currentPlan: {
        type: user.planType,
        name: plan.name,
        price: plan.price,
        credits: plan.credits,
        features: plan.features,
      },
      subscription: {
        status: user.subscriptionStatus,
        trialEndsAt: user.trialEndsAt,
        subscriptionEndsAt: user.subscriptionEndsAt,
      },
      usage: {
        creditsUsed: user.creditsUsed,
        creditsLimit: user.creditsLimit,
        creditsRemaining: user.creditsLimit - user.creditsUsed,
        resetDate: user.lastResetAt,
      },
      team: user.team ? {
        id: user.team.id,
        name: user.team.name,
        seatLimit: user.team.seatLimit,
      } : null,
    };
  }

  async createCheckoutSession(userId: string, planType: string, successUrl: string, cancelUrl: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const plan = this.plans[planType as keyof typeof this.plans];
    if (!plan) {
      throw new Error('Invalid plan type');
    }

    if (plan.price === 0) {
      // Free plan - just update user
      await prisma.user.update({
        where: { id: userId },
        data: {
          planType: planType as any,
          subscriptionStatus: 'ACTIVE',
          creditsLimit: plan.credits,
        },
      });

      return { url: successUrl };
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} Plan`,
              description: `${plan.credits.toLocaleString()} credits per month`,
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planType,
      },
    });

    return session;
  }

  async createPortalSession(userId: string, returnUrl: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.subscriptionId) {
      throw new Error('No active subscription found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscriptionId,
      return_url: returnUrl,
    });

    return session;
  }

  async updateSubscription(userId: string, planType: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.subscriptionId) {
      throw new Error('No active subscription found');
    }

    const plan = this.plans[planType as keyof typeof this.plans];
    if (!plan) {
      throw new Error('Invalid plan type');
    }

    // Update subscription in Stripe
    const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
    
    await stripe.subscriptions.update(user.subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} Plan`,
            },
            unit_amount: plan.price,
            recurring: {
              interval: 'month',
            },
          },
        },
      ],
    });

    // Update user in database
    await prisma.user.update({
      where: { id: userId },
      data: {
        planType: planType as any,
        creditsLimit: plan.credits,
      },
    });

    return { planType, creditsLimit: plan.credits };
  }

  async cancelSubscription(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.subscriptionId) {
      throw new Error('No active subscription found');
    }

    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'CANCELED',
      },
    });
  }

  async resumeSubscription(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.subscriptionId) {
      throw new Error('No active subscription found');
    }

    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: false,
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'ACTIVE',
      },
    });
  }

  async getUsage(userId: string, period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'current':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    }

    const usageLogs = await prisma.usageLog.findMany({
      where: {
        ownerId: userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalCredits = usageLogs.reduce((sum, log) => sum + log.credits, 0);
    const usageByType = usageLogs.reduce((acc, log) => {
      if (!acc[log.type]) {
        acc[log.type] = { credits: 0, count: 0 };
      }
      acc[log.type].credits += log.credits;
      acc[log.type].count += 1;
      return acc;
    }, {} as any);

    return {
      period,
      totalCredits,
      usageByType,
      logs: usageLogs.slice(0, 100),
    };
  }

  async handleWebhook(body: any, signature: string) {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
    }
  }

  private async handleCheckoutCompleted(session: any) {
    const { userId, planType } = session.metadata;
    const plan = this.plans[planType as keyof typeof this.plans];

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionId: session.customer,
        planType: planType as any,
        subscriptionStatus: 'ACTIVE',
        creditsLimit: plan.credits,
      },
    });
  }

  private async handleSubscriptionUpdated(subscription: any) {
    // Handle subscription updates
    console.log('Subscription updated:', subscription.id);
  }

  private async handleSubscriptionDeleted(subscription: any) {
    // Handle subscription cancellation
    console.log('Subscription deleted:', subscription.id);
  }

  private async handlePaymentSucceeded(invoice: any) {
    // Handle successful payment
    console.log('Payment succeeded:', invoice.id);
  }

  private async handlePaymentFailed(invoice: any) {
    // Handle failed payment
    console.log('Payment failed:', invoice.id);
  }
}