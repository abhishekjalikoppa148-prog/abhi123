import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/gift-registry?websiteId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'websiteId is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('gift_registry')
      .select('*')
      .eq('website_id', websiteId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const links = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      icon: row.icon,
    }));

    return NextResponse.json({ links });
  } catch (error) {
    console.error('[GET /api/gift-registry] Error:', error);
    return NextResponse.json({ links: [] });
  }
}

// POST /api/gift-registry — add a gift link (owner only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { websiteId, title, url, icon } = body;

    if (!websiteId || !title?.trim() || !url?.trim()) {
      return NextResponse.json({ error: 'websiteId, title, and url are required' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('gift_registry')
      .insert({
        website_id: websiteId,
        title: String(title).slice(0, 200),
        url: String(url).slice(0, 2048),
        icon: icon ? String(icon).slice(0, 10) : null,
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({
      link: { id: data.id, title: data.title, url: data.url, icon: data.icon },
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/gift-registry] Error:', error);
    return NextResponse.json({ error: 'Failed to add gift link' }, { status: 500 });
  }
}
