import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getDailyAILimit, calculateResetTime, shouldResetCredits } from '@/lib/ai-credits';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user's plan and AI usage
    const users = await query('SELECT plan_id FROM users WHERE id = ?', [userId]) as any[];
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    const planId = user.plan_id || 'basic';

    // Get AI usage record
    const usageRecords = await query(
      'SELECT * FROM ai_usage WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    ) as any[];

    let usedToday = 0;
    let lastResetTime = calculateResetTime();

    if (usageRecords.length > 0) {
      const lastUsage = usageRecords[0];
      if (shouldResetCredits(new Date(lastUsage.reset_time).getTime())) {
        // Reset credits
        usedToday = 0;
        lastResetTime = calculateResetTime();
      } else {
        usedToday = lastUsage.used_today;
        lastResetTime = new Date(lastUsage.reset_time).getTime();
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
        isUnlimited: dailyLimit >= 999
      }
    });
  } catch (error) {
    console.error('AI credits check error:', error);
    return NextResponse.json({ error: 'Failed to check AI credits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, planId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get current usage
    const usageRecords = await query(
      'SELECT * FROM ai_usage WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    ) as any[];

    let usedToday = 0;
    let recordId: string | null = null;

    if (usageRecords.length > 0) {
      const lastUsage = usageRecords[0];
      if (shouldResetCredits(new Date(lastUsage.reset_time).getTime())) {
        // Reset credits
        usedToday = 0;
      } else {
        usedToday = lastUsage.used_today;
        recordId = lastUsage.id;
      }
    }

    const dailyLimit = getDailyAILimit(planId || 'basic');

    if (usedToday >= dailyLimit) {
      return NextResponse.json({
        success: false,
        error: 'Daily AI credit limit reached',
        data: { usedToday, dailyLimit, remaining: 0 }
      }, { status: 429 });
    }

    // Increment usage
    const newUsedToday = usedToday + 1;
    const resetTime = new Date(calculateResetTime());

    if (recordId) {
      await query(
        'UPDATE ai_usage SET used_today = ?, reset_time = ? WHERE id = ?',
        [newUsedToday, resetTime, recordId]
      );
    } else {
      await query(
        'INSERT INTO ai_usage (id, user_id, used_today, reset_time, created_at) VALUES (?, ?, ?, ?, NOW())',
        [`ai-usage-${userId}-${Date.now()}`, userId, newUsedToday, resetTime]
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        usedToday: newUsedToday,
        dailyLimit,
        remaining: dailyLimit - newUsedToday
      }
    });
  } catch (error) {
    console.error('AI credit deduction error:', error);
    return NextResponse.json({ error: 'Failed to deduct AI credit' }, { status: 500 });
  }
}
