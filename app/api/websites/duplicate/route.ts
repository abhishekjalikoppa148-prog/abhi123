import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getPhotoMemories } from '@/lib/supabase/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { websiteId } = await request.json();

    if (!websiteId) {
      return NextResponse.json({ error: 'Website ID required' }, { status: 400 });
    }

    // Get original website data from Supabase
    const { data: original, error: fetchError } = await supabaseAdmin
      .from('birthday_websites')
      .select('*')
      .eq('id', websiteId)
      .maybeSingle();

    if (fetchError || !original) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Verify ownership
    if (original.user_id !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create duplicate
    const newId = `site-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;

    const duplicateRecord = {
      id: newId,
      user_id: session.userId,
      slug: newSlug,
      creator_name: original.creator_name || session.name,
      person_name: original.person_name,
      person_nickname: original.person_nickname,
      person_age: original.person_age,
      relationship: original.relationship,
      birthday_date: original.birthday_date,
      fav_color: original.fav_color,
      fav_song: original.fav_song,
      fav_food: original.fav_food,
      fav_place: original.fav_place,
      hobbies: original.hobbies,
      personality: original.personality,
      custom_info: original.custom_info,
      birthday_message: original.birthday_message,
      template_id: original.template_id,
      accent_color: original.accent_color,
      font_style: original.font_style,
      bg_animation: original.bg_animation,
      button_style: original.button_style,
      photo_layout: original.photo_layout,
      music_id: original.music_id,
      music_title: original.music_title,
      music_artist: original.music_artist,
      music_audio_url: original.music_audio_url,
      payment_status: 'unpaid',
      plan_id: original.plan_id,
      expires_at: original.expires_at,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabaseAdmin
      .from('birthday_websites')
      .insert(duplicateRecord);

    if (insertError) throw insertError;

    // Duplicate photo memories
    const photos = await getPhotoMemories(websiteId);
    if (photos && photos.length > 0) {
      const duplicatePhotos = photos.map((photo: any, index: number) => ({
        id: `photo-${newId}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        website_id: newId,
        url: photo.url,
        caption: photo.caption,
        memory_date: photo.memory_date,
        memory_note: photo.memory_note,
        sort_order: photo.sort_order || index,
        created_at: new Date().toISOString(),
      }));

      await supabaseAdmin.from('photo_memories').insert(duplicatePhotos);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: newId,
        slug: newSlug,
        message: 'Website duplicated successfully',
      },
    });
  } catch (error: any) {
    console.error('Website duplication error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to duplicate website' },
      { status: 500 }
    );
  }
}
