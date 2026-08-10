import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { websiteId, planId, amount } = await request.json();

    if (!websiteId || !planId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In production, integrate with Razorpay API
    // For now, return a mock order response
    const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const receiptId = `receipt_${orderId}`;

    const orderData = {
      id: orderId,
      entity: 'order',
      amount: amount * 100, // Razorpay expects amount in paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: 'INR',
      receipt: receiptId,
      offer_id: null,
      status: 'created',
      attempts: 0,
      notes: [],
      created_at: Math.floor(Date.now() / 1000)
    };

    return NextResponse.json({
      success: true,
      order: orderData,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
