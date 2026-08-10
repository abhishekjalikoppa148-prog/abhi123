import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: NextRequest) {
  try {
    const { websiteId, userId } = await request.json();

    if (!websiteId || !userId) {
      return NextResponse.json({ error: 'Website ID and user ID required' }, { status: 400 });
    }

    // Get current website data
    const websites = await query(
      'SELECT * FROM birthday_websites WHERE id = ?',
      [websiteId]
    ) as any[];

    if (websites.length === 0) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    const website = websites[0];

    // Verify ownership
    if (website.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create version snapshot
    const versionId = `version-${websiteId}-${Date.now()}`;
    const versionNumber = await getNextVersionNumber(websiteId);

    await query(
      `INSERT INTO website_versions (id, website_id, version_number, person_name, relationship, 
       birthday_date, birthday_message, template_id, music_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        versionId,
        websiteId,
        versionNumber,
        website.person_name,
        website.relationship,
        website.birthday_date,
        website.birthday_message,
        website.template_id,
        website.music_id
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        versionId,
        versionNumber,
        message: 'Version saved successfully'
      }
    });
  } catch (error) {
    console.error('Version creation error:', error);
    return NextResponse.json({ error: 'Failed to create version' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'Website ID required' }, { status: 400 });
    }

    // Get versions for website
    const versions = await query(
      'SELECT * FROM website_versions WHERE website_id = ? ORDER BY version_number DESC',
      [websiteId]
    );

    return NextResponse.json({
      success: true,
      data: versions
    });
  } catch (error) {
    console.error('Version fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}

async function getNextVersionNumber(websiteId: string): Promise<number> {
  const result = await query(
    'SELECT MAX(version_number) as max_version FROM website_versions WHERE website_id = ?',
    [websiteId]
  ) as any[];
  
  return (result[0]?.max_version || 0) + 1;
}
