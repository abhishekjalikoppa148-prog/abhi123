import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await query<any[]>(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 100'
    );

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('[/api/admin/orders] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
