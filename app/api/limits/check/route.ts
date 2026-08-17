import { NextRequest, NextResponse } from 'next/server';
import { PLAN_LIMITS, canAddPhoto, canAddVideo, hasFeatureAccess } from '@/lib/limits';
import { PlanId } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { planId, feature, currentValue } = await request.json();

    if (!planId || !feature) {
      return NextResponse.json({ error: 'Plan ID and feature are required' }, { status: 400 });
    }

    let allowed = false;
    let limit = 0;

    const limits = PLAN_LIMITS[planId as PlanId];
    if (!limits) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }

    switch (feature) {
      case 'photos':
        allowed = canAddPhoto(planId as PlanId, currentValue);
        limit = limits.maxPhotos;
        break;
      case 'videos':
        allowed = canAddVideo(planId as PlanId, currentValue);
        limit = limits.maxVideos;
        break;
      case 'ai':
        allowed = hasFeatureAccess(planId as PlanId, 'hasAI');
        break;
      case 'video_upload':
        allowed = hasFeatureAccess(planId as PlanId, 'hasVideoUpload');
        break;
      case 'advanced_animations':
        allowed = hasFeatureAccess(planId as PlanId, 'hasAdvancedAnimations');
        break;
      case 'qr_code':
        allowed = hasFeatureAccess(planId as PlanId, 'hasQRCode');
        break;
      default:
        return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      allowed,
      limit,
      current: currentValue,
      remaining: typeof limit === 'number' ? Math.max(0, limit - currentValue) : null
    });
  } catch (error) {
    console.error('Limit check error:', error);
    return NextResponse.json({ error: 'Failed to check limits' }, { status: 500 });
  }
}
