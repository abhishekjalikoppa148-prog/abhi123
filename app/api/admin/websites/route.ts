import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: websites, error } = await supabaseAdmin
      .from('birthday_websites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ success: true, data: websites || [] });
  } catch (error: any) {
    console.error('[/api/admin/websites] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch websites' },
      { status: 500 }
    );
  }
}
