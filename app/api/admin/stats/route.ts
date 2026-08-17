import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAdminStats } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getAdminStats();

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('[/api/admin/stats] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
