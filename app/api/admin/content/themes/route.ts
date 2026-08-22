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
    const active = searchParams.get('active');
    const premium = searchParams.get('premium');

    let query = supabaseAdmin
      .from('content_library_themes')
      .select('*')
      .order('sort_order', { ascending: true });

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
    console.error('[/api/admin/content/themes GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch theme library' },
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
      id,
      name,
      description,
      badge,
      bg_gradient,
      card_style,
      accent,
      preview_image,
      icon_name,
      is_active = true,
      is_premium = false,
      sort_order = 0,
    } = body;

    if (!id || !name || !bg_gradient || !card_style || !accent || !preview_image) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, bg_gradient, card_style, accent, preview_image' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('content_library_themes')
      .insert({
        id,
        name,
        description,
        badge,
        bg_gradient,
        card_style,
        accent,
        preview_image,
        icon_name,
        is_active,
        is_premium,
        sort_order,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[/api/admin/content/themes POST] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create theme' },
      { status: 500 }
    );
  }
}
