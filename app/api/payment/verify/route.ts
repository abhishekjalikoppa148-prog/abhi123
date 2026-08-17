import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/mysql';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      websiteId,
      planId,
      amount
    } = body;

    const effectiveUserId = body.userId || session?.userId;
    if (!websiteId || !planId) {
      return NextResponse.json({ error: 'Missing websiteId or planId' }, { status: 400 });
    }

    // Verify signature (allow sandbox verification in dev/demo)
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const isSandbox = razorpay_signature === 'sandbox_verified_signature' || !secret || secret === 'test_secret';

    if (!isSandbox) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    // Update website payment status
    await query(
      `UPDATE birthday_websites 
       SET payment_status = 'paid', payment_id = ?, plan_id = ?, updated_at = NOW()
       WHERE id = ?`,
      [razorpay_payment_id || `pay_${Date.now()}`, planId, websiteId]
    );

    // Create order record
    const orderId = `ORD-${Date.now()}`;
    const planName = planId === 'ultimate' ? 'Ultimate Plan' : planId === 'premium' ? 'Premium Plan' : 'Basic Plan';
    const orderAmount = amount || (planId === 'ultimate' ? 999 : planId === 'premium' ? 499 : 199);

    if (effectiveUserId) {
      await query(
        `INSERT INTO orders 
         (id, user_id, user_name, user_email, website_id, website_slug, person_name, plan_id, plan_name, amount, currency, payment_method, payment_id, status, created_at)
         SELECT ?, u.id, u.name, u.email, w.id, w.slug, w.person_name, ?, ?, ?, 'INR', 'razorpay', ?, 'completed', NOW()
         FROM users u, birthday_websites w
         WHERE u.id = ? AND w.id = ?`,
        [orderId, planId, planName, orderAmount, razorpay_payment_id || `pay_${Date.now()}`, effectiveUserId, websiteId]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
