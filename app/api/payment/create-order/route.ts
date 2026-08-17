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

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
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
