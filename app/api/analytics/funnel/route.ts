import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

type FunnelStep =
  | 'landing'
  | 'demo'
  | 'templates'
  | 'onboarding'
  | 'builder'
  | 'checkout'
  | 'payment'
  | 'success';

const VALID_STEPS: FunnelStep[] = [
  'landing',
  'demo',
  'templates',
  'onboarding',
  'builder',
  'checkout',
  'payment',
  'success',
];

export async function POST(request: NextRequest) {
  try {
    const { step, userId, sessionId, metadata } = await request.json();

    if (!step || !sessionId) {
      return NextResponse.json(
        { error: 'Step and session ID required' },
        { status: 400 }
      );
    }

    if (!VALID_STEPS.includes(step)) {
      return NextResponse.json({ error: 'Invalid funnel step' }, { status: 400 });
    }

    // Track funnel event in Supabase
    await supabaseAdmin.from('funnel_events').insert({
      id: `funnel-${sessionId}-${step}-${Date.now()}`,
      step,
      user_id: userId || null,
      session_id: sessionId,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Funnel event tracked',
    });
  } catch (error) {
    console.error('Funnel tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track funnel event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get funnel events from Supabase
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('funnel_events')
      .select('step, session_id, user_id')
      .gte('created_at', startDate.toISOString());

    if (eventsError) throw eventsError;

    const rows = events || [];

    // Aggregate by step
    const funnelMap = new Map<
      string,
      { count: number; sessions: Set<string>; users: Set<string> }
    >();

    VALID_STEPS.forEach((step) => {
      funnelMap.set(step, {
        count: 0,
        sessions: new Set(),
        users: new Set(),
      });
    });

    rows.forEach((row: any) => {
      const entry = funnelMap.get(row.step);
      if (entry) {
        entry.count++;
        if (row.session_id) entry.sessions.add(row.session_id);
        if (row.user_id) entry.users.add(row.user_id);
      }
    });

    const landingSessions =
      funnelMap.get('landing')?.sessions.size ||
      funnelMap.get('templates')?.sessions.size ||
      1;

    const funnelWithRates = VALID_STEPS.map((step, index) => {
      const data = funnelMap.get(step)!;
      const uniqueSessions = data.sessions.size;
      const rate =
        index === 0
          ? 100
          : Math.min(100, (uniqueSessions / Math.max(landingSessions, 1)) * 100);

      return {
        step,
        count: data.count,
        uniqueSessions: uniqueSessions,
        uniqueUsers: data.users.size,
        conversionRate: Math.round(rate * 10) / 10,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        funnel: funnelWithRates,
        period: `${days} days`,
        overallConversion: funnelMap.get('success')?.sessions.size || 0,
      },
    });
  } catch (error) {
    console.error('Funnel data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funnel data' },
      { status: 500 }
    );
  }
}
