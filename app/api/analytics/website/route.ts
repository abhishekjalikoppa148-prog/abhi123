import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Get website ID
    const websites = await query('SELECT id FROM birthday_websites WHERE slug = ?', [slug]) as any[];
    if (websites.length === 0) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    const websiteId = websites[0].id;

    // Get analytics data
    const analytics = await query(
      `SELECT * FROM website_analytics WHERE website_id = ? ORDER BY visit_timestamp DESC LIMIT 1000`,
      [websiteId]
    ) as any[];

    // Calculate metrics
    const totalViews = analytics.length;
    const uniqueVisitors = new Set(analytics.map(a => a.device_type + a.browser)).size;
    
    const deviceBreakdown = analytics.reduce((acc: any, a: any) => {
      acc[a.device_type] = (acc[a.device_type] || 0) + 1;
      return acc;
    }, {});

    const browserBreakdown = analytics.reduce((acc: any, a: any) => {
      acc[a.browser] = (acc[a.browser] || 0) + 1;
      return acc;
    }, {});

    const countryBreakdown = analytics.reduce((acc: any, a: any) => {
      if (a.country) {
        acc[a.country] = (acc[a.country] || 0) + 1;
      }
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors,
        deviceBreakdown,
        browserBreakdown,
        countryBreakdown,
        recentVisits: analytics.slice(0, 50)
      }
    });
  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}
