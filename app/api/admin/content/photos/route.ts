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
    const premium = searchParams.get('premium');

    let query = supabaseAdmin
      .from('content_library_photos')
      .select('*')
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    if (premium !== null) {
      query = query.eq('is_premium', premium === 'true');
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('[/api/admin/content/photos GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch photo library' },
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
      description,
      image_url,
      thumbnail_url,
      category,
      tags,
      is_active = true,
      is_premium = false,
      sort_order = 0,
    } = body;

    if (!title || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields: title, image_url' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('content_library_photos')
      .insert({
        title,
        description,
        image_url,
        thumbnail_url,
        category,
        tags,
        is_active,
        is_premium,
        sort_order,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[/api/admin/content/photos POST] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create photo' },
      { status: 500 }
    );
  }
}
