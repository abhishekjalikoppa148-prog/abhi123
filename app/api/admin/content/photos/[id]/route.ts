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
      description,
      image_url,
      thumbnail_url,
      category,
      tags,
      is_active,
      is_premium,
      sort_order,
    } = body;

    const { data, error } = await supabaseAdmin
      .from('content_library_photos')
      .update({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(image_url !== undefined && { image_url }),
        ...(thumbnail_url !== undefined && { thumbnail_url }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags }),
        ...(is_active !== undefined && { is_active }),
        ...(is_premium !== undefined && { is_premium }),
        ...(sort_order !== undefined && { sort_order }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[/api/admin/content/photos/[id] PUT] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update photo' },
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
      .from('content_library_photos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Photo deleted' });
  } catch (error: any) {
    console.error('[/api/admin/content/photos/[id] DELETE] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
