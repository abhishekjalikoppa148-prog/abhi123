import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/rsvp?websiteId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');

    if (!websiteId) {
      return NextResponse.json({ error: 'websiteId is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('rsvp_entries')
      .select('*')
      .eq('website_id', websiteId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Map snake_case → camelCase
    const entries = (data || []).map((row: any) => ({
      id: row.id,
      guestName: row.guest_name,
      email: row.email,
      status: row.status,
      partySize: row.party_size,
      dietaryRestrictions: row.dietary_restrictions,
      wishesNote: row.wishes_note,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('[GET /api/rsvp] Error:', error);
    return NextResponse.json({ entries: [] });
  }
}

// POST /api/rsvp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { websiteId, guestName, email, status, partySize, dietaryRestrictions, wishesNote } = body;

    if (!websiteId || !guestName?.trim()) {
      return NextResponse.json({ error: 'websiteId and guestName are required' }, { status: 400 });
    }

    const validStatuses = ['attending', 'declined', 'maybe'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('rsvp_entries')
      .insert({
        website_id: websiteId,
        guest_name: String(guestName).slice(0, 100),
        email: email ? String(email).slice(0, 200) : null,
        status,
        party_size: Math.min(Math.max(1, Number(partySize) || 1), 50),
        dietary_restrictions: dietaryRestrictions ? String(dietaryRestrictions).slice(0, 500) : null,
        wishes_note: wishesNote ? String(wishesNote).slice(0, 500) : null,
      })
      .select('*')
      .single();

    if (error) throw error;

    const entry = {
      id: data.id,
      guestName: data.guest_name,
      email: data.email,
      status: data.status,
      partySize: data.party_size,
      dietaryRestrictions: data.dietary_restrictions,
      wishesNote: data.wishes_note,
      createdAt: data.created_at,
    };

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/rsvp] Error:', error);
    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
  }
}
