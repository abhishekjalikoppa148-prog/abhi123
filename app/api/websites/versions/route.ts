import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';
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

    // Get current website data from Supabase
    const { data: website, error: fetchError } = await supabaseAdmin
      .from('birthday_websites')
      .select('*')
      .eq('id', websiteId)
      .maybeSingle();

    if (fetchError || !website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Verify ownership
    if (website.user_id !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get next version number
    const { data: versions } = await supabaseAdmin
      .from('website_versions')
      .select('version_number')
      .eq('website_id', websiteId)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersionNumber = (versions?.[0]?.version_number || 0) + 1;
    const versionId = `version-${websiteId}-${Date.now()}`;

    const { data: versionRecord, error: insertError } = await supabaseAdmin
      .from('website_versions')
      .insert({
        id: versionId,
        website_id: websiteId,
        version_number: nextVersionNumber,
        person_name: website.person_name,
        relationship: website.relationship,
        birthday_date: website.birthday_date,
        birthday_message: website.birthday_message,
        template_id: website.template_id,
        music_id: website.music_id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      data: {
        versionId: versionRecord.id,
        versionNumber: versionRecord.version_number,
        message: 'Version saved successfully',
      },
    });
  } catch (error: any) {
    console.error('Version creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create version' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'Website ID required' }, { status: 400 });
    }

    // Verify ownership before returning versions
    const { data: website, error: findError } = await supabaseAdmin
      .from('birthday_websites')
      .select('user_id')
      .eq('id', websiteId)
      .maybeSingle();

    if (findError || !website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    if (website.user_id !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get versions for website
    const { data: versions, error: versionsError } = await supabaseAdmin
      .from('website_versions')
      .select('*')
      .eq('website_id', websiteId)
      .order('version_number', { ascending: false });

    if (versionsError) throw versionsError;

    return NextResponse.json({
      success: true,
      data: versions || [],
    });
  } catch (error: any) {
    console.error('Version fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}
