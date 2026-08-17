import { NextRequest, NextResponse } from 'next/server';
import { getSession, destroySession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, avatar, plan, plan_status, plan_expires_at, notifications_enabled, created_at')
      .eq('id', session.userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: (user as any).id,
        name: (user as any).name,
        email: (user as any).email,
        role: (user as any).role,
        avatar: (user as any).avatar,
        plan: (user as any).plan,
        planStatus: (user as any).plan_status,
        planExpiresAt: (user as any).plan_expires_at,
        notificationsEnabled: (user as any).notifications_enabled !== false,
        createdAt: (user as any).created_at,
      },
    });
  } catch (error) {
    console.error('[/api/auth/me GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { name, avatar, notificationsEnabled } = body;

    // Update profile in Supabase
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({
        name: name?.trim(),
        avatar,
        notifications_enabled: notificationsEnabled,
      })
      .eq('id', session.userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: (updatedUser as any).id,
        name: (updatedUser as any).name,
        email: (updatedUser as any).email,
        role: (updatedUser as any).role,
        avatar: (updatedUser as any).avatar,
        plan: (updatedUser as any).plan,
        planStatus: (updatedUser as any).plan_status,
        planExpiresAt: (updatedUser as any).plan_expires_at,
        notificationsEnabled: (updatedUser as any).notifications_enabled !== false,
        createdAt: (updatedUser as any).created_at,
      },
    });
  } catch (error) {
    console.error('[/api/auth/me PUT] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Delete user profile
    await supabaseAdmin.from('users').delete().eq('id', session.userId);
    
    // Delete auth user
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    await supabase.auth.admin.deleteUser(session.userId);

    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('[/api/auth/me DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
