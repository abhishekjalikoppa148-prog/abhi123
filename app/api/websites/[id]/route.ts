import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { getSession } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await query('SELECT user_id FROM birthday_websites WHERE id = ?', [id]) as any[];
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }
    if (existing[0].user_id !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete photos first
    await query('DELETE FROM photo_memories WHERE website_id = ?', [id]);
    
    // Delete website
    await query('DELETE FROM birthday_websites WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Website deleted successfully' });
  } catch (err) {
    console.error('[/api/websites/[id] DELETE Error]:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete website' },
      { status: 500 }
    );
  }
}
