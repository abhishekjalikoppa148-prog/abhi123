import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getOrdersByUserId } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await getOrdersByUserId(session.userId);

    const orders = rows.map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      userName: r.user_name,
      userEmail: r.user_email,
      websiteId: r.website_id,
      websiteSlug: r.website_slug,
      personName: r.person_name,
      planId: r.plan_id,
      planName: r.plan_name,
      amount: r.amount,
      currency: r.currency || 'INR',
      paymentMethod: r.payment_method || 'razorpay',
      paymentId: r.payment_id,
      status: r.status,
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }));

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('[/api/orders GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
