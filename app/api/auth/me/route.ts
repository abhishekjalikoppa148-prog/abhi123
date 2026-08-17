import { NextRequest, NextResponse } from 'next/server';
import {
  getSession,
  destroySession,
  verifyPassword,
  hashPassword,
  validatePassword,
} from '@/lib/auth';
import {
  getUserById,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
  supabaseAdmin,
} from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        plan: user.plan,
        planStatus: user.plan_status,
        planExpiresAt: user.plan_expires_at,
        notificationsEnabled: user.notifications_enabled !== false,
        createdAt: user.created_at,
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
    const { name, avatar, notificationsEnabled, currentPassword, newPassword } =
      body;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password' },
          { status: 400 }
        );
      }

      const pwValidation = validatePassword(newPassword);
      if (!pwValidation.valid) {
        return NextResponse.json(
          { error: pwValidation.errors[0] },
          { status: 400 }
        );
      }

      // Fetch user with password_hash from Supabase
      const { data: userRecord, error: userFetchError } = await supabaseAdmin
        .from('users')
        .select('password_hash')
        .eq('id', session.userId)
        .maybeSingle();

      if (userFetchError || !userRecord) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (userRecord.password_hash) {
        const isMatch = await verifyPassword(
          currentPassword,
          userRecord.password_hash
        );
        if (!isMatch) {
          return NextResponse.json(
            { error: 'Current password is incorrect' },
            { status: 400 }
          );
        }
      }

      const newHash = await hashPassword(newPassword);
      await updateUserPassword(session.userId, newHash);
    }

    // Update profile metadata in Supabase
    const updatedUser = await updateUserProfile(session.userId, {
      name: name?.trim(),
      avatar,
      notificationsEnabled,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        plan: updatedUser.plan,
        planStatus: updatedUser.plan_status,
        planExpiresAt: updatedUser.plan_expires_at,
        notificationsEnabled: updatedUser.notifications_enabled !== false,
        createdAt: updatedUser.created_at,
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

    await deleteUserAccount(session.userId);
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
