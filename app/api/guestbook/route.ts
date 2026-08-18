import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/guestbook?websiteId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'websiteId is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Map snake_case → camelCase for frontend
    const entries = (data || []).map((row: any) => ({
      id: row.id,
      authorName: row.author_name,
      relationship: row.relationship,
      message: row.message,
      sticker: row.sticker,
      likes: row.likes,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('[GET /api/guestbook] Error:', error);
    return NextResponse.json({ entries: [] });
  }
}

// POST /api/guestbook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { websiteId, authorName, relationship, message, sticker } = body;

    if (!websiteId || !authorName?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'websiteId, authorName, and message are required' }, { status: 400 });
    }

    // Basic sanitization
    const cleanName = String(authorName).slice(0, 100);
    const cleanMessage = String(message).slice(0, 1000);
    const cleanRelationship = relationship ? String(relationship).slice(0, 50) : 'Friend';
    const cleanSticker = sticker ? String(sticker).slice(0, 10) : '🎉';

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert({
        website_id: websiteId,
        author_name: cleanName,
        relationship: cleanRelationship,
        message: cleanMessage,
        sticker: cleanSticker,
        likes: 0,
      })
      .select('*')
      .single();

    if (error) throw error;

    const entry = {
      id: data.id,
      authorName: data.author_name,
      relationship: data.relationship,
      message: data.message,
      sticker: data.sticker,
      likes: data.likes,
      createdAt: data.created_at,
    };

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/guestbook] Error:', error);
    return NextResponse.json({ error: 'Failed to add guestbook entry' }, { status: 500 });
  }
}
