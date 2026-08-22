import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
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
    } = body;

    const { data, error } = await supabaseAdmin
      .from('content_library_music')
      .update({
        ...(title !== undefined && { title }),
        ...(artist !== undefined && { artist }),
        ...(audio_url !== undefined && { audio_url }),
        ...(duration_seconds !== undefined && { duration_seconds }),
        ...(genre !== undefined && { genre }),
        ...(mood !== undefined && { mood }),
        ...(category !== undefined && { category }),
        ...(is_active !== undefined && { is_active }),
        ...(is_default !== undefined && { is_default }),
        ...(sort_order !== undefined && { sort_order }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[/api/admin/content/music/[id] PUT] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update music track' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('content_library_music')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Music track deleted' });
  } catch (error: any) {
    console.error('[/api/admin/content/music/[id] DELETE] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete music track' },
      { status: 500 }
    );
  }
}
