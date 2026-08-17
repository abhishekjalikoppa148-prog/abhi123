import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { EmailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Verify this is a cron job (simple API key check)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'default-cron-secret';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const results = {
      expiredWebsites: 0,
      expiredUsers: 0,
      warningSent: 0,
    };

    // Check for expired websites
    const expiredWebsites = await query<any[]>(
      'SELECT id, user_id, person_name, slug, expires_at FROM birthday_websites WHERE expires_at < NOW() AND payment_status = "paid"'
    );

    for (const website of expiredWebsites) {
      await query(
        'UPDATE birthday_websites SET payment_status = "expired" WHERE id = ?',
        [website.id]
      );
      results.expiredWebsites++;
    }

    // Check for expired user plans
    const expiredUsers = await query<any[]>(
      'SELECT id, name, email FROM users WHERE plan_expires_at < NOW() AND plan_status = "active" AND plan != "free"'
    );

    for (const user of expiredUsers) {
      await query(
        'UPDATE users SET plan_status = "expired", plan = "free" WHERE id = ?',
        [user.id]
      );
      results.expiredUsers++;
    }

    // Check for websites expiring in 7 days (send warning)
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + 7);
    
    const expiringSoon = await query<any[]>(
      'SELECT id, user_id, person_name, slug, expires_at FROM birthday_websites WHERE expires_at BETWEEN NOW() AND ? AND payment_status = "paid"',
      [warningDate]
    );

    for (const website of expiringSoon) {
      const userData = await query<any[]>('SELECT name, email FROM users WHERE id = ?', [website.user_id]);
      if (userData.length > 0) {
        const daysLeft = Math.ceil((new Date(website.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        await EmailService.sendExpiringSoonEmail(
          userData[0].email,
          userData[0].name,
          `${process.env.NEXT_PUBLIC_APP_URL}/birthday/${website.slug}`,
          daysLeft
        ).catch(() => {});
        results.warningSent++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Expiration check completed',
      results 
    });
  } catch (error) {
    console.error('[/api/cron/check-expiration] Error:', error);
    return NextResponse.json({ error: 'Failed to check expiration' }, { status: 500 });
  }
}
