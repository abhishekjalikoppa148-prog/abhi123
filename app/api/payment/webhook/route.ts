import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin, getUserById } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
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

      const orderId = order?.id || payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert from paise to rupees
      const currency = payment.currency || 'INR';
      const notes = payment.notes || {};

      const websiteId = notes.websiteId;
      const planId = notes.planId || 'ultimate';
      const userId = notes.userId;

      if (!websiteId) {
        return NextResponse.json(
          { error: 'Missing websiteId in notes' },
          { status: 400 }
        );
      }

      // Check if order already processed (idempotency check in Supabase)
      if (orderId) {
        const { data: existingOrder } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('razorpay_order_id', orderId)
          .maybeSingle();

        if (existingOrder) {
          return NextResponse.json({
            success: true,
            message: 'Order already processed',
          });
        }
      }

      // Update website payment status in Supabase
      const { data: website } = await supabaseAdmin
        .from('birthday_websites')
        .update({
          payment_status: 'paid',
          payment_id: paymentId,
          plan_id: planId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', websiteId)
        .select()
        .maybeSingle();

      // Retrieve user info if available
      let user = null;
      if (userId) {
        user = await getUserById(userId);
      }

      // Create order record in Supabase
      const dbOrderId = `ORD-${Date.now()}`;
      await supabaseAdmin.from('orders').insert({
        id: dbOrderId,
        user_id: user?.id || website?.user_id || userId,
        user_name: user?.name || website?.creator_name || 'Customer',
        user_email: user?.email || 'customer@example.com',
        website_id: websiteId,
        website_slug: website?.slug || '',
        person_name: website?.person_name || 'Celebration',
        plan_id: planId,
        plan_name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
        amount: amount,
        currency: currency,
        payment_method: 'razorpay',
        razorpay_order_id: orderId || null,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        payment_id: paymentId,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
      });
    }

    return NextResponse.json({ success: true, message: 'Event received' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
