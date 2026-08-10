import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

type FunnelStep = 'landing' | 'demo' | 'templates' | 'onboarding' | 'builder' | 'checkout' | 'payment' | 'success';

export async function POST(request: NextRequest) {
  try {
    const { step, userId, sessionId, metadata } = await request.json();

    if (!step || !sessionId) {
      return NextResponse.json({ error: 'Step and session ID required' }, { status: 400 });
    }

    const validSteps: FunnelStep[] = ['landing', 'demo', 'templates', 'onboarding', 'builder', 'checkout', 'payment', 'success'];
    
    if (!validSteps.includes(step)) {
      return NextResponse.json({ error: 'Invalid funnel step' }, { status: 400 });
    }

    // Track funnel event
    await query(
      `INSERT INTO funnel_events (id, step, user_id, session_id, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [`funnel-${sessionId}-${step}-${Date.now()}`, step, userId || null, sessionId, JSON.stringify(metadata || {})]
    );

    return NextResponse.json({ success: true, message: 'Funnel event tracked' });
  } catch (error) {
    console.error('Funnel tracking error:', error);
    return NextResponse.json({ error: 'Failed to track funnel event' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get funnel data
    const funnelData = await query(
      `SELECT step, COUNT(*) as count, 
       COUNT(DISTINCT session_id) as unique_sessions,
       COUNT(DISTINCT user_id) as unique_users
       FROM funnel_events 
       WHERE created_at >= ?
       GROUP BY step
       ORDER BY FIELD(step, 'landing', 'demo', 'templates', 'onboarding', 'builder', 'checkout', 'payment', 'success')`,
      [startDate]
    );

    // Calculate conversion rates
    const stepOrder = ['landing', 'demo', 'templates', 'onboarding', 'builder', 'checkout', 'payment', 'success'];
    const funnelMap = new Map();
    
    (funnelData as any[]).forEach(row => {
      funnelMap.set(row.step, {
        count: row.count,
        uniqueSessions: row.unique_sessions,
        uniqueUsers: row.unique_users
      });
    });

    const funnel = stepOrder.map(step => {
      const data = funnelMap.get(step) || { count: 0, uniqueSessions: 0, uniqueUsers: 0 };
      return { step, ...data };
    });

    // Calculate conversion rates
    const landingSessions = funnelMap.get('landing')?.uniqueSessions || 1;
    const funnelWithRates = funnel.map((step, index) => {
      const rate = index === 0 ? 100 : (step.uniqueSessions / landingSessions) * 100;
      return { ...step, conversionRate: Math.round(rate * 10) / 10 };
    });

    return NextResponse.json({
      success: true,
      data: {
        funnel: funnelWithRates,
        period: `${days} days`,
        overallConversion: funnelMap.get('success')?.unique_sessions || 0
      }
    });
  } catch (error) {
    console.error('Funnel data fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch funnel data' }, { status: 500 });
  }
}
