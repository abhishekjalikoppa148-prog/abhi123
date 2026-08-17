import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { code, userId, orderValue } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code required' },
        { status: 400 }
      );
    }

    // Find coupon by code in Supabase
    const { data: coupons, error: couponError } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .ilike('code', code.toUpperCase().trim())
      .eq('is_active', true);

    if (couponError) throw couponError;

    if (!coupons || coupons.length === 0) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    const coupon = coupons[0];

    // Check if expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check if max uses reached
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json(
        { error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    // Check minimum order value
    if (coupon.min_order_value && orderValue < coupon.min_order_value) {
      return NextResponse.json(
        {
          error: `Minimum order value of ₹${coupon.min_order_value} required`,
        },
        { status: 400 }
      );
    }

    // Check if user already used this coupon
    if (userId) {
      const { count } = await supabaseAdmin
        .from('coupon_usages')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id)
        .eq('user_id', userId);

      if (count && count > 0) {
        return NextResponse.json(
          { error: 'You have already used this coupon' },
          { status: 400 }
        );
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderValue * Number(coupon.discount_value)) / 100;
    } else {
      discountAmount = Number(coupon.discount_value);
    }

    // Ensure discount doesn't exceed order value
    discountAmount = Math.min(discountAmount, orderValue);

    return NextResponse.json({
      success: true,
      data: {
        couponId: coupon.id,
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        discountAmount,
        finalPrice: orderValue - discountAmount,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { couponId, userId } = await request.json();

    if (!couponId || !userId) {
      return NextResponse.json(
        { error: 'Coupon ID and user ID required' },
        { status: 400 }
      );
    }

    // Record coupon usage in Supabase
    await supabaseAdmin.from('coupon_usages').insert({
      id: `cpu-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      coupon_id: couponId,
      user_id: userId,
      used_at: new Date().toISOString(),
    });

    // Increment coupon usage count
    const { data: coupon } = await supabaseAdmin
      .from('coupons')
      .select('used_count')
      .eq('id', couponId)
      .maybeSingle();

    if (coupon) {
      await supabaseAdmin
        .from('coupons')
        .update({ used_count: (coupon.used_count || 0) + 1 })
        .eq('id', couponId);
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon usage recorded',
    });
  } catch (error) {
    console.error('Coupon usage recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record coupon usage' },
      { status: 500 }
    );
  }
}
