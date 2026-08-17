import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { websiteId, planId, amount } = await request.json();

    if (!websiteId || !planId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === 'rzp_test_mock') {
      const mockOrderId = `order_${websiteId}_${Date.now()}`;
      return NextResponse.json({
        success: true,
        order: {
          id: mockOrderId,
          entity: 'order',
          amount: amount * 100,
          amount_paid: 0,
          amount_due: amount * 100,
          currency: 'INR',
          receipt: `receipt_${websiteId}_${Date.now()}`,
          status: 'created',
          attempts: 0,
          notes: { websiteId, planId, userId: session.userId },
          created_at: Math.floor(Date.now() / 1000)
        },
        orderId: mockOrderId,
        key: keyId || 'rzp_test_demo123456'
      });
    }

    // Create Razorpay order
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `receipt_${websiteId}_${Date.now()}`,
        notes: {
          websiteId,
          planId,
          userId: session.userId
        }
      })
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error('Razorpay API error:', error);
      return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
    }

    const orderData = await orderResponse.json();

    return NextResponse.json({
      success: true,
      order: orderData,
      orderId: orderData.id,
      key: keyId
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
