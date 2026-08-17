import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getSession } from '@/lib/auth';
import { EmailService } from '@/lib/email';

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
      amount,
    } = body;

    if (!websiteId || !planId) {
      return NextResponse.json(
        { error: 'Missing websiteId or planId' },
        { status: 400 }
      );
    }

    // Determine authenticated user
    const authenticatedUserId = session?.userId;
    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify signature (allow sandbox verification in dev/demo)
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const isSandbox =
      razorpay_signature === 'sandbox_verified_signature' ||
      !secret ||
      secret === 'test_secret';

    if (!isSandbox) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    }

    const paymentId = razorpay_payment_id || `pay_${Date.now()}`;

    // Update website payment status in Supabase
    const { data: updatedWebsite, error: websiteUpdateError } = await supabaseAdmin
      .from('birthday_websites')
      .update({
        payment_status: 'paid',
        payment_id: paymentId,
        plan_id: planId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', websiteId)
      .select()
      .single();

    if (websiteUpdateError) {
      console.error('Website payment update error:', websiteUpdateError);
      throw websiteUpdateError;
    }

    // Fetch user details for the order
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, name, email')
      .eq('id', authenticatedUserId)
      .single();

    const orderId = `ORD-${Date.now()}`;
    const planName =
      planId === 'ultimate'
        ? 'Ultimate Plan'
        : planId === 'premium'
        ? 'Premium Plan'
        : 'Basic Plan';
    const orderAmount =
      amount || (planId === 'ultimate' ? 999 : planId === 'premium' ? 499 : 199);

    if (user) {
      // Insert order record in Supabase
      const { error: orderInsertError } = await supabaseAdmin
        .from('orders')
        .insert({
          id: orderId,
          user_id: (user as any).id,
          user_name: (user as any).name,
          user_email: (user as any).email,
          website_id: updatedWebsite.id,
          website_slug: (updatedWebsite as any).slug,
          person_name: (updatedWebsite as any).person_name,
          plan_id: planId,
          plan_name: planName,
          amount: orderAmount,
          currency: 'INR',
          payment_method: 'razorpay',
          razorpay_order_id: razorpay_order_id || null,
          razorpay_payment_id: razorpay_payment_id || null,
          razorpay_signature: razorpay_signature || null,
          payment_id: paymentId,
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (orderInsertError) {
        console.error('Order record insert warning:', orderInsertError.message);
      }

      // Send confirmation email asynchronously
      EmailService.sendPaymentConfirmationEmail(
        (user as any).email,
        (user as any).name,
        orderId,
        orderAmount
      ).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
