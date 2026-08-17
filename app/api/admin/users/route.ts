import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await query<any[]>(
      'SELECT id, name, email, role, plan, plan_status, created_at FROM users ORDER BY created_at DESC LIMIT 100'
    );

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('[/api/admin/users] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
