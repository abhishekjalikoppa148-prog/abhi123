import { NextRequest, NextResponse } from 'next/server';
import {
  getPasswordResetToken,
  deletePasswordResetToken,
} from '@/lib/supabase/db';
import { hashPassword, hashResetToken, validatePassword } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

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

    // Get user auth_id from our users table
    const { data: userRecord } = await supabaseAdmin
      .from('users')
      .select('auth_id')
      .eq('id', (resetRecord as any).user_id)
      .single();
    
    if (userRecord?.auth_id) {
      // Update password using Supabase Auth admin API
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      await supabase.auth.admin.updateUserById((userRecord as any).auth_id, { password: password });
    }

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
