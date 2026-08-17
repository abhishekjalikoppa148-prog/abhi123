import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
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

    // Get original website data
    const websites = await query(
      'SELECT * FROM birthday_websites WHERE id = ?',
      [websiteId]
    ) as any[];

    if (websites.length === 0) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    const original = websites[0];

    // Verify ownership
    if (original.user_id !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create duplicate
    const newId = `website-${session.userId}-${Date.now()}`;
    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;

    await query(
      `INSERT INTO birthday_websites 
       (id, user_id, slug, creator_name, person_name, person_nickname, person_age, relationship, birthday_date, 
        fav_color, fav_song, fav_food, fav_place, hobbies, personality, custom_info,
        birthday_message, template_id, accent_color, font_style, bg_animation, button_style, photo_layout,
        music_id, music_title, music_artist, music_audio_url,
        payment_status, plan_id, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', ?, ?, NOW())`,
      [
        newId,
        session.userId,
        newSlug,
        original.creator_name || session.name,
        original.person_name,
        original.person_nickname,
        original.person_age,
        original.relationship,
        original.birthday_date,
        original.fav_color,
        original.fav_song,
        original.fav_food,
        original.fav_place,
        original.hobbies,
        original.personality,
        original.custom_info,
        original.birthday_message,
        original.template_id,
        original.accent_color,
        original.font_style,
        original.bg_animation,
        original.button_style,
        original.photo_layout,
        original.music_id,
        original.music_title,
        original.music_artist,
        original.music_audio_url,
        original.plan_id,
        original.expires_at
      ]
    );

    // Duplicate photo memories
    const photos = await query(
      'SELECT * FROM photo_memories WHERE website_id = ?',
      [websiteId]
    ) as any[];

    for (const photo of photos) {
      await query(
        `INSERT INTO photo_memories (id, website_id, url, caption, memory_date, memory_note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          `photo-${newId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          newId,
          photo.url,
          photo.caption,
          photo.memory_date,
          photo.memory_note
        ]
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: newId,
        slug: newSlug,
        message: 'Website duplicated successfully'
      }
    });
  } catch (error) {
    console.error('Website duplication error:', error);
    return NextResponse.json({ error: 'Failed to duplicate website' }, { status: 500 });
  }
}
