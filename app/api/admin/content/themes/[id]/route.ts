import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const {
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
    } = body;

    const { data, error } = await supabaseAdmin
      .from('content_library_themes')
      .update({
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(badge !== undefined && { badge }),
        ...(bg_gradient !== undefined && { bg_gradient }),
        ...(card_style !== undefined && { card_style }),
        ...(accent !== undefined && { accent }),
        ...(preview_image !== undefined && { preview_image }),
        ...(icon_name !== undefined && { icon_name }),
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
    console.error('[/api/admin/content/themes/[id] PUT] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update theme' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const { error } = await supabaseAdmin
      .from('content_library_themes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Theme deleted' });
  } catch (error: any) {
    console.error('[/api/admin/content/themes/[id] DELETE] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete theme' },
      { status: 500 }
    );
  }
}
