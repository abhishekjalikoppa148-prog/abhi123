import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Get website ID from Supabase
    const { data: website, error: findError } = await supabaseAdmin
      .from('birthday_websites')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (findError || !website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Get analytics data from Supabase
    const { data: analytics, error: analyticsError } = await supabaseAdmin
      .from('website_analytics')
      .select('*')
      .eq('website_id', website.id)
      .order('visit_timestamp', { ascending: false })
      .limit(1000);

    if (analyticsError) throw analyticsError;

    const rows = analytics || [];

    // Calculate metrics
    const totalViews = rows.length;
    const uniqueVisitors = new Set(
      rows.map((a: any) => `${a.device_type}-${a.browser}`)
    ).size;

    const deviceBreakdown = rows.reduce((acc: any, a: any) => {
      acc[a.device_type] = (acc[a.device_type] || 0) + 1;
      return acc;
    }, {});

    const browserBreakdown = rows.reduce((acc: any, a: any) => {
      acc[a.browser] = (acc[a.browser] || 0) + 1;
      return acc;
    }, {});

    const countryBreakdown = rows.reduce((acc: any, a: any) => {
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
        recentVisits: rows.slice(0, 50),
      },
    });
  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics' },
      { status: 500 }
    );
  }
}
