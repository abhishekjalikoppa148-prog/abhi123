import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const premium = searchParams.get('premium');

    let query = supabaseAdmin
      .from('content_library_themes')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (premium !== null) {
      query = query.eq('is_premium', premium === 'true');
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('[/api/content/themes GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch theme library' },
      { status: 500 }
    );
  }
}
