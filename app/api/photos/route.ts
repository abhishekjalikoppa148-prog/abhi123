import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/photos?websiteId=xxx  — returns guest-submitted photos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'websiteId is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Guest photos are stored in photo_memories with a flag or by uploadedBy != owner
    // We use the photo_memories table and filter for guest uploads (uploaded_by IS NOT NULL)
    const { data, error } = await supabase
      .from('photo_memories')
      .select('*')
      .eq('website_id', websiteId)
      .not('memory_note', 'is', null)  // guest photos have a memory_note = 'guest_upload'
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      // If that filter doesn't work cleanly, return all extra photos
      const { data: fallback } = await supabase
        .from('photo_memories')
        .select('*')
        .eq('website_id', websiteId)
        .order('created_at', { ascending: false })
        .limit(50);

      const photos = (fallback || []).map((row: any) => ({
        id: row.id,
        url: row.url,
        caption: row.caption,
        uploadedBy: row.memory_note === 'guest_upload' ? 'Guest' : null,
        likes: 0,
        createdAt: row.created_at,
      })).filter((p: any) => p.uploadedBy === 'Guest');

      return NextResponse.json({ photos });
    }

    const photos = (data || []).map((row: any) => ({
      id: row.id,
      url: row.url,
      caption: row.caption,
      uploadedBy: 'Guest',
      likes: 0,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('[GET /api/photos] Error:', error);
    return NextResponse.json({ photos: [] });
  }
}

// POST /api/photos — guest uploads a photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { websiteId, url, caption, uploadedBy } = body;

    if (!websiteId || !url?.trim()) {
      return NextResponse.json({ error: 'websiteId and url are required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('photo_memories')
      .insert({
        website_id: websiteId,
        url: String(url).slice(0, 2048),
        caption: caption ? String(caption).slice(0, 300) : null,
        memory_note: 'guest_upload', // marker for guest photos
        memory_date: uploadedBy ? String(uploadedBy).slice(0, 100) : 'Guest',
        sort_order: 999, // guests sort after owner photos
      })
      .select('*')
      .single();

    if (error) throw error;

    const photo = {
      id: data.id,
      url: data.url,
      caption: data.caption,
      uploadedBy: data.memory_date || 'Guest',
      likes: 0,
      createdAt: data.created_at,
    };

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/photos] Error:', error);
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 });
  }
}
