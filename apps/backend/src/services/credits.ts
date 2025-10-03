import { db } from '../database';
import { logger } from '../utils/logger';

export async function checkCredits(
  userId: string,
  creditsNeeded: number,
  teamId?: string
): Promise<boolean> {
  const subscription = await db('subscriptions')
    .where(teamId ? { team_id: teamId } : { user_id: userId })
    .where('status', 'active')
    .first();

  if (!subscription) {
    return false;
  }

  const availableCredits = subscription.credits_quota - subscription.credits_used;
  return availableCredits >= creditsNeeded;
}

export async function deductCredits(
  userId: string,
  creditsUsed: number,
  service: string,
  teamId?: string,
  metadata?: any
): Promise<void> {
  const subscription = await db('subscriptions')
    .where(teamId ? { team_id: teamId } : { user_id: userId })
    .where('status', 'active')
    .first();

  if (!subscription) {
    throw new Error('No active subscription found');
  }

  // Update subscription credits
  await db('subscriptions')
    .where({ id: subscription.id })
    .increment('credits_used', creditsUsed);

  // Record usage
  await db('usage_records').insert({
    user_id: userId,
    team_id: teamId,
    service,
    credits_consumed: creditsUsed,
    metadata,
  });

  logger.info(`Deducted ${creditsUsed} credits from user ${userId} for ${service}`);
}

export async function getUsage(userId: string, teamId?: string, period: 'day' | 'month' = 'month') {
  const startDate = new Date();
  if (period === 'day') {
    startDate.setHours(0, 0, 0, 0);
  } else {
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
  }

  const query = db('usage_records')
    .where('created_at', '>=', startDate)
    .sum('credits_consumed as total_credits')
    .select('service')
    .groupBy('service');

  if (teamId) {
    query.where({ team_id: teamId });
  } else {
    query.where({ user_id: userId });
  }

  return await query;
}

export async function resetCredits(subscriptionId: string): Promise<void> {
  const subscription = await db('subscriptions').where({ id: subscriptionId }).first();

  if (!subscription) {
    return;
  }

  await db('subscriptions').where({ id: subscriptionId }).update({
    credits_used: 0,
    credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  logger.info(`Reset credits for subscription ${subscriptionId}`);
}
