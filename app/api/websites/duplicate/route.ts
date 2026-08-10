import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    const { websiteId, userId } = await request.json();

    if (!websiteId || !userId) {
      return NextResponse.json({ error: 'Website ID and user ID required' }, { status: 400 });
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
    if (original.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create duplicate
    const newId = `website-${userId}-${Date.now()}`;
    const newSlug = `${original.slug}-copy-${Date.now()}`;

    await query(
      `INSERT INTO birthday_websites (id, user_id, slug, person_name, relationship, birthday_date, 
       birthday_message, template_id, music_id, payment_status, plan_id, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        newId,
        userId,
        newSlug,
        original.person_name,
        original.relationship,
        original.birthday_date,
        original.birthday_message,
        original.template_id,
        original.music_id,
        'unpaid',
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
        `INSERT INTO photo_memories (id, website_id, photo_url, caption, memory_date, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          `photo-${newId}-${Date.now()}-${Math.random()}`,
          newId,
          photo.photo_url,
          photo.caption,
          photo.memory_date
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
