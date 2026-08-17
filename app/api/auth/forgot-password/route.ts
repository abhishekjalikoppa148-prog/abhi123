import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createPasswordResetToken } from '@/lib/db';
import {
  generateResetToken,
  getResetTokenExpiry,
  validateEmail,
  checkRateLimit,
} from '@/lib/auth';
import { EmailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 reset requests per 15 minutes per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`forgot-pwd:${ip}`, 3, 15 * 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Always return success to prevent email enumeration
    const user = await getUserByEmail(email.toLowerCase().trim());
    if (user) {
      const { plainToken, tokenHash } = generateResetToken();
      const expiresAt = getResetTokenExpiry();

      await createPasswordResetToken(user.id, tokenHash, expiresAt);

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${plainToken}`;
      await EmailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetUrl
      ).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message:
        'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('[/api/auth/forgot-password] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
