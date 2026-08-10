import { NextRequest, NextResponse } from 'next/server';
import { PLAN_LIMITS, canAddPhoto, canAddVideo, hasFeatureAccess } from '@/lib/limits';

export async function POST(request: NextRequest) {
  try {
    const { planId, feature, currentValue } = await request.json();

    if (!planId || !feature) {
      return NextResponse.json({ error: 'Plan ID and feature are required' }, { status: 400 });
    }

    let allowed = false;
    let limit = 0;

    switch (feature) {
      case 'photos':
        allowed = canAddPhoto(planId, currentValue);
        limit = PLAN_LIMITS[planId].maxPhotos;
        break;
      case 'videos':
        allowed = canAddVideo(planId, currentValue);
        limit = PLAN_LIMITS[planId].maxVideos;
        break;
      case 'ai':
        allowed = hasFeatureAccess(planId, 'hasAI');
        break;
      case 'video_upload':
        allowed = hasFeatureAccess(planId, 'hasVideoUpload');
        break;
      case 'advanced_animations':
        allowed = hasFeatureAccess(planId, 'hasAdvancedAnimations');
        break;
      case 'qr_code':
        allowed = hasFeatureAccess(planId, 'hasQRCode');
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
