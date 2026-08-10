import { PlanId } from './types';

export interface PlanLimits {
  maxPhotos: number;
  maxVideos: number;
  hasAI: boolean;
  hasCustomDomain: boolean;
  hasVideoUpload: boolean;
  hasAdvancedAnimations: boolean;
  hasQRCode: boolean;
  expirationDays: number;
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  basic: {
    maxPhotos: 10,
    maxVideos: 0,
    hasAI: false,
    hasCustomDomain: false,
    hasVideoUpload: false,
    hasAdvancedAnimations: false,
    hasQRCode: false,
    expirationDays: 30
  },
  premium: {
    maxPhotos: 30,
    maxVideos: 1,
    hasAI: true,
    hasCustomDomain: false,
    hasVideoUpload: true,
    hasAdvancedAnimations: true,
    hasQRCode: true,
    expirationDays: 365
  },
  ultimate: {
    maxPhotos: 999,
    maxVideos: 5,
    hasAI: true,
    hasCustomDomain: true,
    hasVideoUpload: true,
    hasAdvancedAnimations: true,
    hasQRCode: true,
    expirationDays: 36500 // Lifetime
  }
};

export function checkPlanLimit(planId: PlanId, feature: keyof PlanLimits, currentValue: number): boolean {
  const limits = PLAN_LIMITS[planId];
  const limit = limits[feature];
  
  if (typeof limit === 'number') {
    return currentValue < limit;
  }
  
  return limit as boolean;
}

export function canAddPhoto(planId: PlanId, currentPhotoCount: number): boolean {
  return checkPlanLimit(planId, 'maxPhotos', currentPhotoCount);
}

export function canAddVideo(planId: PlanId, currentVideoCount: number): boolean {
  return checkPlanLimit(planId, 'maxVideos', currentVideoCount);
}

export function hasFeatureAccess(planId: PlanId, feature: keyof PlanLimits): boolean {
  const limits = PLAN_LIMITS[planId];
  return limits[feature] as boolean;
}

export function getExpirationDate(planId: PlanId): Date {
  const now = new Date();
  const days = PLAN_LIMITS[planId].expirationDays;
  now.setDate(now.getDate() + days);
  return now;
}

export function isWebsiteExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

export function getDaysUntilExpiration(expiresAt: string): number {
  const expiration = new Date(expiresAt);
  const now = new Date();
  const diff = expiration.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getUpgradeSuggestion(planId: PlanId): PlanId {
  if (planId === 'basic') return 'premium';
  if (planId === 'premium') return 'ultimate';
  return 'ultimate';
}
