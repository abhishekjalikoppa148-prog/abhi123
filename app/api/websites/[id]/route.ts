import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getPhotoMemories } from '@/lib/supabase/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id } = await params;

    const { data: website, error } = await supabaseAdmin
      .from('birthday_websites')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Unpaid drafts only visible to owner/admin
    if (
      website.payment_status === 'unpaid' &&
      (!session || (session.userId !== website.user_id && session.role !== 'admin'))
    ) {
      return NextResponse.json({ error: 'Website not published' }, { status: 403 });
    }

    // Attach photos
    const photos = await getPhotoMemories(website.id);
    website.photos = photos;

    return NextResponse.json({ success: true, data: website, website });
  } catch (err: any) {
    console.error('[/api/websites/[id] GET Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch website' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const { data: existing, error: findError } = await supabaseAdmin
      .from('birthday_websites')
      .select('user_id')
      .eq('id', id)
      .maybeSingle();

    if (findError || !existing) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    if (existing.user_id !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Filter updatable fields
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.personName !== undefined) updates.person_name = body.personName;
    if (body.personNickname !== undefined) updates.person_nickname = body.personNickname;
    if (body.birthdayDate !== undefined) updates.birthday_date = body.birthdayDate;
    if (body.birthdayMessage !== undefined) updates.birthday_message = body.birthdayMessage;
    if (body.templateId !== undefined) updates.template_id = body.templateId;
    if (body.planId !== undefined) updates.plan_id = body.planId;
    if (body.paymentStatus !== undefined) updates.payment_status = body.paymentStatus;
    if (body.views !== undefined) updates.views = body.views;

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('birthday_websites')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: 'Website updated successfully',
      data: updated,
    });
  } catch (err: any) {
    console.error('[/api/websites/[id] PATCH Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update website' },
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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const { data: existing, error: findError } = await supabaseAdmin
      .from('birthday_websites')
      .select('user_id')
      .eq('id', id)
      .maybeSingle();

    if (findError || !existing) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    if (existing.user_id !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete photo memories first (also cascade-protected)
    await supabaseAdmin
      .from('photo_memories')
      .delete()
      .eq('website_id', id);

    // Delete birthday website
    const { error: deleteError } = await supabaseAdmin
      .from('birthday_websites')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: 'Website deleted successfully',
    });
  } catch (err: any) {
    console.error('[/api/websites/[id] DELETE Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete website' },
      { status: 500 }
    );
  }
}
