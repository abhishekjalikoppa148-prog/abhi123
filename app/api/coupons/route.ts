import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  min_order_value: number | null;
  is_active: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { code, userId, orderValue } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
    }

    // Find coupon by code
    const coupons = await query(
      'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE',
      [code.toUpperCase()]
    ) as Coupon[];

    if (coupons.length === 0) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    const coupon = coupons[0];

    // Check if expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    // Check if max uses reached
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }

    // Check minimum order value
    if (coupon.min_order_value && orderValue < coupon.min_order_value) {
      return NextResponse.json({ 
        error: `Minimum order value of ₹${coupon.min_order_value} required` 
      }, { status: 400 });
    }

    // Check if user already used this coupon
    if (userId) {
      const userUsages = await query(
        'SELECT COUNT(*) as count FROM coupon_usages WHERE coupon_id = ? AND user_id = ?',
        [coupon.id, userId]
      ) as any[];
      
      if (userUsages[0]?.count > 0) {
        return NextResponse.json({ error: 'You have already used this coupon' }, { status: 400 });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderValue * coupon.discount_value) / 100;
    } else {
      discountAmount = coupon.discount_value;
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
        finalPrice: orderValue - discountAmount
      }
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { couponId, userId } = await request.json();

    if (!couponId || !userId) {
      return NextResponse.json({ error: 'Coupon ID and user ID required' }, { status: 400 });
    }

    // Record coupon usage
    await query(
      'INSERT INTO coupon_usages (id, coupon_id, user_id, used_at) VALUES (?, ?, ?, NOW())',
      [`usage-${couponId}-${userId}-${Date.now()}`, couponId, userId]
    );

    // Increment coupon usage count
    await query(
      'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
      [couponId]
    );

    return NextResponse.json({ success: true, message: 'Coupon usage recorded' });
  } catch (error) {
    console.error('Coupon usage recording error:', error);
    return NextResponse.json({ error: 'Failed to record coupon usage' }, { status: 500 });
  }
}
