import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getPhotoMemories } from '@/lib/db';
import { generateSlug, calculateExpirationDate } from '@/lib/utils';
import { getSession } from '@/lib/auth';
import { canAddPhoto, PLAN_LIMITS } from '@/lib/limits';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    let websites: any[] = [];

    if (slug) {
      const { data, error } = await supabaseAdmin
        .from('birthday_websites')
        .select('*')
        .eq('slug', slug);

      if (error) throw error;
      websites = data || [];
    } else {
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const { data, error } = await supabaseAdmin
        .from('birthday_websites')
        .select('*')
        .eq('user_id', session.userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      websites = data || [];
    }

    if (slug && websites.length > 0) {
      const website = websites[0];
      // Check if website is expired
      const expiresAt = new Date(website.expires_at);
      if (expiresAt < new Date()) {
        return NextResponse.json({ error: 'Website has expired' }, { status: 403 });
      }
      if (
        website.payment_status === 'unpaid' &&
        (!session || session.userId !== website.user_id)
      ) {
        return NextResponse.json({ error: 'Website not published' }, { status: 403 });
      }
    }

    // Fetch photos for each website
    for (const website of websites) {
      const photos = await getPhotoMemories(website.id);
      website.photos = photos;
    }

    return NextResponse.json({
      success: true,
      data: websites,
      websites: websites,
      website: slug && websites.length > 0 ? websites[0] : null,
    });
  } catch (err: any) {
    console.error('[/api/websites GET Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch websites' },
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
      customizations,
    } = body;

    const websiteId = id || `site-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Authorization check: If updating an existing website, verify ownership
    let existingSite: any = null;
    if (id) {
      const { data: existing } = await supabaseAdmin
        .from('birthday_websites')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (existing) {
        if (existing.user_id !== session.userId && session.role !== 'admin') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        existingSite = existing;
      }
    }

    // Plan limit enforcement - check photo count
    if (Array.isArray(photos)) {
      let currentCount = 0;
      if (id) {
        const { count } = await supabaseAdmin
          .from('photo_memories')
          .select('*', { count: 'exact', head: true })
          .eq('website_id', id);
        currentCount = count || 0;
      }

      const activePlanId = body.planId || existingSite?.plan_id || 'ultimate';
      const limits = PLAN_LIMITS[activePlanId as keyof typeof PLAN_LIMITS];
      if (!canAddPhoto(activePlanId as any, photos.length)) {
        return NextResponse.json(
          {
            error: 'Photo limit exceeded for your plan. Upgrade to add more photos.',
            currentPhotos: currentCount,
            requestedPhotos: photos.length,
            limit: limits?.maxPhotos,
          },
          { status: 403 }
        );
      }
    }

    const websiteSlug =
      slug ||
      existingSite?.slug ||
      generateSlug(personName || existingSite?.person_name || 'Happy Birthday');

    const expiresAt = calculateExpirationDate(
      planId || existingSite?.plan_id || 'ultimate'
    );

    const hobbiesStr = Array.isArray(hobbies)
      ? JSON.stringify(hobbies)
      : hobbies || existingSite?.hobbies || '';

    const initialPaymentStatus =
      planId === 'free' ? 'paid' : existingSite?.payment_status || 'unpaid';

    const websiteRecord = {
      id: websiteId,
      slug: websiteSlug,
      user_id: session.userId,
      creator_name: creatorName || existingSite?.creator_name || session.name,
      person_name: personName || existingSite?.person_name || 'Birthday Star',
      person_nickname: personNickname || existingSite?.person_nickname || null,
      person_age: personAge || existingSite?.person_age || 24,
      birthday_date:
        birthdayDate ||
        existingSite?.birthday_date ||
        new Date().toISOString().split('T')[0],
      relationship: relationship || existingSite?.relationship || 'Best Friend',
      fav_color: favColor || existingSite?.fav_color || '#8b5cf6',
      fav_song: favSong || existingSite?.fav_song || null,
      fav_food: favFood || existingSite?.fav_food || null,
      fav_place: favPlace || existingSite?.fav_place || null,
      hobbies: hobbiesStr,
      personality: personality || existingSite?.personality || null,
      custom_info: customInfo || existingSite?.custom_info || null,
      birthday_message: birthdayMessage || existingSite?.birthday_message || 'Happy Birthday!',
      template_id: templateId || existingSite?.template_id || 'bestfriend',
      accent_color: customizations?.accentColor || existingSite?.accent_color || '#a855f7',
      font_style: customizations?.fontStyle || existingSite?.font_style || 'outfit',
      bg_animation: customizations?.bgAnimation || existingSite?.bg_animation || 'confetti',
      button_style: customizations?.buttonStyle || existingSite?.button_style || 'glow',
      photo_layout: customizations?.photoLayout || existingSite?.photo_layout || 'polaroid',
      music_id: music?.id || existingSite?.music_id || 'track-1',
      music_title: music?.title || existingSite?.music_title || 'Happy Acoustic Birthday',
      music_artist: music?.artist || existingSite?.music_artist || 'Celebration Studio',
      music_audio_url: music?.audioUrl || existingSite?.music_audio_url || null,
      plan_id: planId || existingSite?.plan_id || 'ultimate',
      payment_status: initialPaymentStatus,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    };

    // Upsert birthday website in Supabase
    const { error: upsertError } = await supabaseAdmin
      .from('birthday_websites')
      .upsert(websiteRecord, { onConflict: 'id' });

    if (upsertError) throw upsertError;

    // Delete existing photos and insert new ones
    await supabaseAdmin
      .from('photo_memories')
      .delete()
      .eq('website_id', websiteId);

    if (Array.isArray(photos) && photos.length > 0) {
      const photosToInsert = photos.map((photo, index) => ({
        id: photo.id || `photo-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        website_id: websiteId,
        url: photo.url,
        caption: photo.caption || '',
        memory_date: photo.date || null,
        memory_note: photo.memoryNote || null,
        sort_order: index,
        created_at: new Date().toISOString(),
      }));

      const { error: photoInsertError } = await supabaseAdmin
        .from('photo_memories')
        .insert(photosToInsert);

      if (photoInsertError) {
        console.error('Photo memories insert warning:', photoInsertError.message);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Website saved successfully!',
        slug: websiteSlug,
        id: websiteId,
        website: {
          id: websiteId,
          slug: websiteSlug,
          person_name: websiteRecord.person_name,
          personName: websiteRecord.person_name,
        },
      },
      { status: existingSite ? 200 : 201 }
    );
  } catch (err: any) {
    console.error('[/api/websites POST Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save website' },
      { status: 500 }
    );
  }
}

export { POST as PUT };
