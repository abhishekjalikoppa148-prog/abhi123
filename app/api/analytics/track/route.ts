import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    const { slug, deviceType, browser, country, referrer } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Get website ID from slug
    const websites = await query('SELECT id FROM birthday_websites WHERE slug = ?', [slug]) as any[];
    if (websites.length === 0) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    const websiteId = websites[0].id;

    // Increment views
    await query('UPDATE birthday_websites SET views = views + 1 WHERE id = ?', [websiteId]);

    // Log detailed analytics
    await query(
      `INSERT INTO website_analytics (id, website_id, device_type, browser, country, referrer, visit_timestamp)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        `analytics-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        websiteId,
        deviceType || 'unknown',
        browser || 'unknown',
        country || null,
        referrer || null
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 });
  }
}
