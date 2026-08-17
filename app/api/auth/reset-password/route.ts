import { NextRequest, NextResponse } from 'next/server';
import {
  getPasswordResetToken,
  deletePasswordResetToken,
  updateUserPassword,
} from '@/lib/db';
import { hashPassword, hashResetToken, validatePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const pwValidation = validatePassword(password);
    if (!pwValidation.valid) {
      return NextResponse.json(
        { error: pwValidation.errors[0] },
        { status: 400 }
      );
    }

    // Hash the provided token and look it up in Supabase
    const tokenHash = hashResetToken(token);
    const resetRecord = await getPasswordResetToken(tokenHash);

    if (!resetRecord) {
      return NextResponse.json(
        {
          error:
            'Invalid or expired reset link. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Update password in Supabase
    const newHash = await hashPassword(password);
    await updateUserPassword(resetRecord.user_id, newHash);

    // Invalidate used token
    await deletePasswordResetToken(tokenHash);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. You can now log in.',
    });
  } catch (error) {
    console.error('[/api/auth/reset-password] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
