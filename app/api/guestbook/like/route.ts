import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/guestbook/like
// Body: { entryId: string }
export async function POST(request: NextRequest) {
  try {
    const { entryId } = await request.json();

    if (!entryId) {
      return NextResponse.json({ error: 'entryId is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Increment likes using RPC for atomicity
    const { error } = await supabase.rpc('increment_guestbook_likes', { entry_id: entryId });

    if (error) {
      // Fallback: manual increment
      const { data: current, error: fetchError } = await supabase
        .from('guestbook_entries')
        .select('likes')
        .eq('id', entryId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('guestbook_entries')
        .update({ likes: (current?.likes || 0) + 1 })
        .eq('id', entryId);

      if (updateError) throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/guestbook/like] Error:', error);
    // Return 200 anyway — client already did optimistic update
    return NextResponse.json({ success: false });
  }
}
