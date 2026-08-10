import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      websiteId,
      planId,
      userId,
      amount
    } = await request.json();

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Update website payment status
    await query(
      `UPDATE birthday_websites 
       SET payment_status = 'paid', payment_id = ?, plan_id = ?
       WHERE id = ?`,
      [razorpay_payment_id, planId, websiteId]
    );

    // Create order record
    const orderId = `ORD-${Date.now()}`;
    await query(
      `INSERT INTO orders 
       (id, user_id, user_name, user_email, website_id, website_slug, person_name, plan_id, plan_name, amount, currency, payment_method, payment_id, status, created_at)
       SELECT ?, u.name, u.email, ?, w.slug, w.person_name, ?, ?, ?, ?, 'INR', 'razorpay', ?, 'completed', NOW()
       FROM users u, birthday_websites w
       WHERE u.id = ? AND w.id = ?`,
      [orderId, websiteId, planId, planId, amount, razorpay_payment_id, userId, websiteId]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
