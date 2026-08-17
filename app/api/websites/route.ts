import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { generateSlug, calculateExpirationDate } from '@/lib/utils';
import { getSession } from '@/lib/auth';
import { canAddPhoto, canAddVideo, hasFeatureAccess, PLAN_LIMITS } from '@/lib/limits';
import { isExpired } from '@/lib/expiration';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let sql = `SELECT * FROM birthday_websites ORDER BY created_at DESC`;
    const params: unknown[] = [];

    if (slug) {
      sql = `SELECT * FROM birthday_websites WHERE slug = ?`;
      params.push(slug);
    } else {
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      sql = `SELECT * FROM birthday_websites WHERE user_id = ? ORDER BY created_at DESC`;
      params.push(session.userId);
    }

    const websites = await query(sql, params) as any[];

    if (slug && websites.length > 0) {
      const website = websites[0];
      // Check if website is expired
      const expiresAt = new Date(website.expires_at);
      if (expiresAt < new Date()) {
        return NextResponse.json({ error: 'Website has expired' }, { status: 403 });
      }
      if (website.payment_status === 'unpaid' && (!session || session.userId !== website.user_id)) {
        return NextResponse.json({ error: 'Website not published' }, { status: 403 });
      }
    }

    // Fetch photos for each website
    for (const website of websites) {
      const photos = await query(
        'SELECT * FROM photo_memories WHERE website_id = ? ORDER BY created_at ASC',
        [website.id]
      );
      website.photos = photos;
    }
    
    return NextResponse.json({ 
      success: true, 
      data: websites, 
      websites: websites,
      website: slug && websites.length > 0 ? websites[0] : null 
    });
  } catch (err) {
    console.error('[/api/websites GET Error]:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      slug,
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
    
    // Authorization check: If updating an existing website, verify ownership
    let existingSite: any = null;
    if (id) {
      const existing = await query('SELECT * FROM birthday_websites WHERE id = ?', [id]) as any[];
      if (existing.length > 0) {
        if (existing[0].user_id !== session.userId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        existingSite = existing[0];
      }
    }

    // Plan limit enforcement - check photo count
    if (Array.isArray(photos)) {
      const currentPhotoCount = id 
        ? await query('SELECT COUNT(*) as count FROM photo_memories WHERE website_id = ?', [id]) as any[]
        : [{ count: 0 }];
      
      const planId = body.planId || existingSite?.plan_id || 'ultimate';
      const limits = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS];
      if (!canAddPhoto(planId as any, currentPhotoCount[0].count + photos.length)) {
        return NextResponse.json({ 
          error: 'Photo limit exceeded for your plan. Upgrade to add more photos.',
          currentPhotos: currentPhotoCount[0].count,
          requestedPhotos: photos.length,
          limit: limits?.maxPhotos
        }, { status: 403 });
      }
    }

    const websiteSlug = slug || existingSite?.slug || generateSlug(personName || existingSite?.person_name || 'Happy Birthday');
    const expiresAt = calculateExpirationDate(planId || existingSite?.plan_id || 'ultimate');
    
    const hobbiesStr = Array.isArray(hobbies) ? JSON.stringify(hobbies) : hobbies || existingSite?.hobbies || '';
    const initialPaymentStatus = planId === 'free' ? 'paid' : (existingSite?.payment_status || 'unpaid');

    const sql = `
      INSERT INTO birthday_websites 
      (id, slug, user_id, creator_name, person_name, person_nickname, person_age, birthday_date, relationship, 
       fav_color, fav_song, fav_food, fav_place, hobbies, personality, custom_info, birthday_message, template_id,
       accent_color, font_style, bg_animation, button_style, photo_layout,
       music_id, music_title, music_artist, music_audio_url, plan_id, payment_status, payment_id, views, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 0, NOW(), ?)
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
      session.userId,
      creatorName || existingSite?.creator_name || session.name,
      personName || existingSite?.person_name,
      personNickname || existingSite?.person_nickname || null,
      personAge || existingSite?.person_age || 24,
      birthdayDate || existingSite?.birthday_date || new Date().toISOString().split('T')[0],
      relationship || existingSite?.relationship || 'Best Friend',
      favColor || existingSite?.fav_color || '#8b5cf6',
      favSong || existingSite?.fav_song || null,
      favFood || existingSite?.fav_food || null,
      favPlace || existingSite?.fav_place || null,
      hobbiesStr,
      personality || existingSite?.personality || null,
      customInfo || existingSite?.custom_info || null,
      birthdayMessage || existingSite?.birthday_message || null,
      templateId || existingSite?.template_id || 'bestfriend',
      customizations?.accentColor || existingSite?.accent_color || '#a855f7',
      customizations?.fontStyle || existingSite?.font_style || 'outfit',
      customizations?.bgAnimation || existingSite?.bg_animation || 'confetti',
      customizations?.buttonStyle || existingSite?.button_style || 'glow',
      customizations?.photoLayout || existingSite?.photo_layout || 'polaroid',
      music?.id || existingSite?.music_id || 'track-1',
      music?.title || existingSite?.music_title || 'Happy Acoustic Birthday',
      music?.artist || existingSite?.music_artist || 'Celebration Studio',
      music?.audioUrl || existingSite?.music_audio_url || null,
      planId || existingSite?.plan_id || 'ultimate',
      initialPaymentStatus,
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

    return NextResponse.json({ 
      success: true, 
      message: 'Website saved successfully!', 
      slug: websiteSlug, 
      id: websiteId,
      website: {
        id: websiteId,
        slug: websiteSlug,
        person_name: personName || existingSite?.person_name,
        personName: personName || existingSite?.person_name
      }
    }, { status: existingSite ? 200 : 201 });
  } catch (err) {
    console.error('[/api/websites POST Error]:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to save website' },
      { status: 500 }
    );
  }
}

export { POST as PUT };
