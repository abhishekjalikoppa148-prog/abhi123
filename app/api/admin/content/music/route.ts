import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');

    let query = supabaseAdmin
      .from('content_library_music')
      .select('*')
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('[/api/admin/content/music GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch music library' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      artist,
      audio_url,
      duration_seconds,
      genre,
      mood,
      category,
      is_active = true,
      is_default = false,
      sort_order = 0,
    } = body;

    if (!title || !artist || !audio_url) {
      return NextResponse.json(
        { error: 'Missing required fields: title, artist, audio_url' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('content_library_music')
      .insert({
        title,
        artist,
        audio_url,
        duration_seconds,
        genre,
        mood,
        category,
        is_active,
        is_default,
        sort_order,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[/api/admin/content/music POST] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create music track' },
      { status: 500 }
    );
  }
}
