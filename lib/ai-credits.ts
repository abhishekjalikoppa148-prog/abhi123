import { PlanId } from './types';

export interface AICreditConfig {
  dailyLimit: number;
  resetTime: number;
}

export const PLAN_AI_LIMITS: Record<PlanId, number> = {
  basic: 5,
  premium: 25,
  ultimate: 999 // Unlimited
};

export function getDailyAILimit(planId: PlanId): number {
  return PLAN_AI_LIMITS[planId] || 5;
}

export function calculateResetTime(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

export function hasAICreditsRemaining(usedToday: number, planId: PlanId): boolean {
  const limit = getDailyAILimit(planId);
  return usedToday < limit;
}

export function getRemainingAICredits(usedToday: number, planId: PlanId): number {
  const limit = getDailyAILimit(planId);
  return Math.max(0, limit - usedToday);
}

export function shouldResetCredits(lastResetTime: number): boolean {
  return Date.now() > lastResetTime;
}
