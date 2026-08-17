import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getUserById } from '@/lib/supabase/db';
import { EmailService } from '@/lib/email';

export async function GET(request: NextRequest) {
  return handleExpirationCheck(request);
}

export async function POST(request: NextRequest) {
  return handleExpirationCheck(request);
}

async function handleExpirationCheck(request: NextRequest) {
  try {
    // Optional cron secret check if header is provided
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const results = {
      expiredWebsites: 0,
      expiredUsers: 0,
      warningSent: 0,
    };

    // Check for expired websites in Supabase
    const { data: expiredWebsites } = await supabaseAdmin
      .from('birthday_websites')
      .select('id, user_id, person_name, slug, expires_at')
      .lt('expires_at', now.toISOString())
      .eq('payment_status', 'paid');

    if (expiredWebsites && expiredWebsites.length > 0) {
      for (const website of expiredWebsites) {
        // Update expired websites
        await supabaseAdmin
          .from('birthday_websites')
          .update({ payment_status: 'expired' } as any)
          .eq('id', (website as any).id);
        results.expiredWebsites++;
      }
    }

    // Check for expired user plans in Supabase
    const { data: expiredUsers } = await supabaseAdmin
      .from('users')
      .select('id, name, email')
      .lt('plan_expires_at', now.toISOString())
      .eq('plan_status', 'active')
      .neq('plan', 'free');

    if (expiredUsers && expiredUsers.length > 0) {
      for (const user of expiredUsers) {
        // Update expired user plans
        await supabaseAdmin
          .from('users')
          .update({ plan_status: 'expired', plan: 'free' } as any)
          .eq('id', (user as any).id);
        results.expiredUsers++;
      }
    }

    // Check for websites expiring in 7 days (send warning)
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + 7);

    const { data: expiringSoon } = await supabaseAdmin
      .from('birthday_websites')
      .select('id, user_id, person_name, slug, expires_at')
      .gte('expires_at', now.toISOString())
      .lte('expires_at', warningDate.toISOString())
      .eq('payment_status', 'paid');

    if (expiringSoon && expiringSoon.length > 0) {
      for (const website of expiringSoon) {
        const user = await getUserById((website as any).user_id);
        if (user) {
          const daysLeft = Math.ceil(
            (new Date((website as any).expires_at).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          await EmailService.sendExpiringSoonEmail(
            (user as any).email,
            (user as any).name,
            `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/birthday/${(website as any).slug}`,
            daysLeft
          ).catch(() => {});
          results.warningSent++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Expiration check completed',
      results,
    });
  } catch (error) {
    console.error('[/api/cron/check-expiration] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check expiration' },
      { status: 500 }
    );
  }
}
