import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { slug, deviceType, browser, country, referrer } =
      await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Get website by slug from Supabase
    const { data: website, error: findError } = await supabaseAdmin
      .from('birthday_websites')
      .select('id, views')
      .eq('slug', slug)
      .maybeSingle();

    if (findError || !website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Increment views
    await supabaseAdmin
      .from('birthday_websites')
      .update({ views: (website.views || 0) + 1 })
      .eq('id', website.id);

    // Log detailed analytics in Supabase
    await supabaseAdmin.from('website_analytics').insert({
      id: `an-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      website_id: website.id,
      device_type: deviceType || 'unknown',
      browser: browser || 'unknown',
      country: country || null,
      referrer: referrer || null,
      visit_timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}
