import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  getDailyAILimit,
  calculateResetTime,
  shouldResetCredits,
} from '@/lib/ai-credits';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user's plan
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('plan_id, plan')
      .eq('id', userId)
      .single();
      
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const planId = ((user as any).plan_id || (user as any).plan || 'basic') as any;

    // Get AI usage record from Supabase
    const { data: usageRecords, error: usageError } = await supabaseAdmin
      .from('ai_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (usageError) throw usageError;

    let usedToday = 0;
    let lastResetTime = calculateResetTime();

    if (usageRecords && usageRecords.length > 0) {
      const lastUsage = usageRecords[0];
      if (
        lastUsage.reset_time &&
        shouldResetCredits(new Date(lastUsage.reset_time).getTime())
      ) {
        // Reset credits
        usedToday = 0;
        lastResetTime = calculateResetTime();
      } else {
        usedToday = lastUsage.used_today || 0;
        lastResetTime = lastUsage.reset_time
          ? new Date(lastUsage.reset_time).getTime()
          : calculateResetTime();
      }
    }

    const dailyLimit = getDailyAILimit(planId);
    const remaining = Math.max(0, dailyLimit - usedToday);

    return NextResponse.json({
      success: true,
      data: {
        usedToday,
        dailyLimit,
        remaining,
        resetTime: lastResetTime,
        isUnlimited: dailyLimit >= 999,
      },
    });
  } catch (error) {
    console.error('AI credits check error:', error);
    return NextResponse.json(
      { error: 'Failed to check AI credits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, planId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get current usage from Supabase
    const { data: usageRecords, error: usageError } = await supabaseAdmin
      .from('ai_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (usageError) throw usageError;

    let usedToday = 0;
    let recordId: string | null = null;

    if (usageRecords && usageRecords.length > 0) {
      const lastUsage = usageRecords[0];
      if (
        lastUsage.reset_time &&
        shouldResetCredits(new Date(lastUsage.reset_time).getTime())
      ) {
        usedToday = 0;
      } else {
        usedToday = lastUsage.used_today || 0;
        recordId = lastUsage.id;
      }
    }

    const dailyLimit = getDailyAILimit((planId || 'basic') as any);

    if (usedToday >= dailyLimit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Daily AI credit limit reached',
          data: { usedToday, dailyLimit, remaining: 0 },
        },
        { status: 429 }
      );
    }

    // Increment usage in Supabase
    const newUsedToday = usedToday + 1;
    const resetTime = new Date(calculateResetTime()).toISOString();

    if (recordId) {
      await supabaseAdmin
        .from('ai_usage')
        .update({
          used_today: newUsedToday,
          reset_time: resetTime,
        })
        .eq('id', recordId);
    } else {
      await supabaseAdmin.from('ai_usage').insert({
        id: `ai-usage-${userId}-${Date.now()}`,
        user_id: userId,
        used_today: newUsedToday,
        reset_time: resetTime,
        created_at: new Date().toISOString(),
      } as any);
    }

    return NextResponse.json({
      success: true,
      data: {
        usedToday: newUsedToday,
        dailyLimit,
        remaining: dailyLimit - newUsedToday,
      },
    });
  } catch (error) {
    console.error('AI credit deduction error:', error);
    return NextResponse.json(
      { error: 'Failed to deduct AI credit' },
      { status: 500 }
    );
  }
}
