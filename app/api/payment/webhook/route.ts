import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    // Handle payment.captured event
    if (eventType === 'payment.captured') {
      const { payment, order } = payload.payment.entity;
      
      const orderId = order.id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert from paise to rupees
      const currency = payment.currency;
      const status = payment.status;
      const notes = payment.notes || {};

      const websiteId = notes.websiteId;
      const planId = notes.planId;

      if (!websiteId || !planId) {
        return NextResponse.json({ error: 'Missing notes data' }, { status: 400 });
      }

      // Check if order already processed (idempotency)
      const existingOrder = await query(
        'SELECT id FROM orders WHERE razorpay_order_id = ?',
        [orderId]
      ) as any[];

      if (existingOrder.length > 0) {
        return NextResponse.json({ success: true, message: 'Order already processed' });
      }

      // Update website payment status
      await query(
        'UPDATE birthday_websites SET payment_status = ?, payment_id = ? WHERE id = ?',
        ['paid', paymentId, websiteId]
      );

      // Create order record
      await query(
        `INSERT INTO orders (id, user_id, website_id, plan_id, amount, currency, status, razorpay_order_id, razorpay_payment_id, razorpay_signature, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          `order_${Date.now()}`,
          notes.userId,
          websiteId,
          planId,
          amount,
          currency,
          'success',
          orderId,
          paymentId,
          signature
        ]
      );

      return NextResponse.json({ success: true, message: 'Payment processed successfully' });
    }

    return NextResponse.json({ success: true, message: 'Event received' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
