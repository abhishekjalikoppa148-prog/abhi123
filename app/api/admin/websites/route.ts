import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const websites = await query<any[]>(
      'SELECT * FROM birthday_websites ORDER BY created_at DESC LIMIT 100'
    );

    return NextResponse.json({ success: true, data: websites });
  } catch (error) {
    console.error('[/api/admin/websites] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 });
  }
}
