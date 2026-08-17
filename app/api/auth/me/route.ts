import { NextRequest, NextResponse } from 'next/server';
import { getSession, destroySession, verifyPassword, hashPassword, validatePassword } from '@/lib/auth';
import { getUserById, getUserByEmail, updateUserProfile, updateUserPassword, deleteUserAccount, query } from '@/lib/mysql';

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
        notificationsEnabled: user.notifications_enabled !== 0,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('[/api/auth/me GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { name, avatar, notificationsEnabled, currentPassword, newPassword } = body;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }

      const pwValidation = validatePassword(newPassword);
      if (!pwValidation.valid) {
        return NextResponse.json({ error: pwValidation.errors[0] }, { status: 400 });
      }

      // Fetch user with password_hash
      const rows = await query<any[]>('SELECT password_hash FROM users WHERE id = ?', [session.userId]);
      if (rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const userRecord = rows[0];
      if (userRecord.password_hash) {
        const isMatch = await verifyPassword(currentPassword, userRecord.password_hash);
        if (!isMatch) {
          return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }
      }

      const newHash = await hashPassword(newPassword);
      await updateUserPassword(session.userId, newHash);
    }

    // Update profile metadata
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
        notificationsEnabled: updatedUser.notifications_enabled !== 0,
        createdAt: updatedUser.created_at,
      },
    });
  } catch (error) {
    console.error('[/api/auth/me PUT] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
