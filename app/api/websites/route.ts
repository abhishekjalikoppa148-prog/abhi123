import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { generateSlug, calculateExpirationDate } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const slug = searchParams.get('slug');

  try {
    let sql = `SELECT * FROM birthday_websites ORDER BY created_at DESC`;
    const params: unknown[] = [];

    if (userId) {
      sql = `SELECT * FROM birthday_websites WHERE user_id = ? ORDER BY created_at DESC`;
      params.push(userId);
    }

    if (slug) {
      sql = `SELECT * FROM birthday_websites WHERE slug = ?`;
      params.push(slug);
    }

    const websites = await query(sql, params);
    
    // Fetch photos for each website
    for (const website of websites as any[]) {
      const photos = await query(
        'SELECT * FROM photo_memories WHERE website_id = ? ORDER BY created_at ASC',
        [website.id]
      );
      website.photos = photos;
    }
    
    return NextResponse.json({ success: true, data: websites });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message, note: 'Ensure MySQL service is running or use client storage' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      slug,
      userId,
      creatorName,
      personName,
      personNickname,
      personAge,
      birthdayDate,
      relationship,
      favColor,
      favSong,
      favFood,
      favPlace,
      hobbies,
      personality,
      customInfo,
      birthdayMessage,
      templateId,
      photos,
      music,
      planId,
      customizations
    } = body;

    const websiteId = id || `site-${Date.now()}`;
    const websiteSlug = slug || generateSlug(personName);
    const expiresAt = calculateExpirationDate(planId || 'ultimate');
    
    const hobbiesStr = Array.isArray(hobbies) ? JSON.stringify(hobbies) : hobbies || '';

    const sql = `
      INSERT INTO birthday_websites 
      (id, slug, user_id, creator_name, person_name, person_nickname, person_age, birthday_date, relationship, 
       fav_color, fav_song, fav_food, fav_place, hobbies, personality, custom_info, birthday_message, template_id,
       accent_color, font_style, bg_animation, button_style, photo_layout,
       music_id, music_title, music_artist, music_audio_url, plan_id, payment_status, payment_id, views, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', NULL, 0, NOW(), ?)
      ON DUPLICATE KEY UPDATE 
      person_name = VALUES(person_name),
      birthday_message = VALUES(birthday_message),
      template_id = VALUES(template_id),
      plan_id = VALUES(plan_id),
      expires_at = VALUES(expires_at)
    `;

    await query(sql, [
      websiteId,
      websiteSlug,
      userId || 'user-demo-1',
      creatorName || 'Aarav',
      personName,
      personNickname || null,
      personAge || 24,
      birthdayDate,
      relationship || 'Best Friend',
      favColor || '#8b5cf6',
      favSong || null,
      favFood || null,
      favPlace || null,
      hobbiesStr,
      personality || null,
      customInfo || null,
      birthdayMessage,
      templateId || 'bestfriend',
      customizations?.accentColor || '#a855f7',
      customizations?.fontStyle || 'outfit',
      customizations?.bgAnimation || 'confetti',
      customizations?.buttonStyle || 'glow',
      customizations?.photoLayout || 'polaroid',
      music?.id || 'track-1',
      music?.title || 'Happy Acoustic Birthday',
      music?.artist || 'Celebration Studio',
      music?.audioUrl || null,
      planId || 'ultimate',
      expiresAt
    ]);

    // Delete existing photos and insert new ones
    await query('DELETE FROM photo_memories WHERE website_id = ?', [websiteId]);
    
    if (Array.isArray(photos)) {
      for (const photo of photos) {
        await query(
          `INSERT INTO photo_memories (id, website_id, url, caption, memory_date, memory_note, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [photo.id || `photo-${Date.now()}-${Math.random()}`, websiteId, photo.url, photo.caption || '', photo.date || null, photo.memoryNote || null]
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Website saved successfully!', slug: websiteSlug, id: websiteId });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
