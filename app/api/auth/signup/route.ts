import { NextRequest, NextResponse } from 'next/server';
import { createUserAuth, createSession } from '@/lib/auth';
import { validateEmail, validatePassword, checkRateLimit } from '@/lib/auth';
import { EmailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 signups per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`signup:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Create user with Supabase Auth
    const data = await createUserAuth(email.toLowerCase().trim(), password, name.trim(), 'user');
    
    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Get user profile from our users table (created by trigger)
    const { supabaseAdmin } = await import('@/lib/supabase/admin');
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, plan')
      .eq('auth_id', data.user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not created' },
        { status: 500 }
      );
    }

    // Sign in to create session
    await createSession(email.toLowerCase().trim(), password);

    // Send welcome email (non-blocking)
    EmailService.sendWelcomeEmail((userProfile as any).email, (userProfile as any).name).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        user: {
          id: (userProfile as any).id,
          name: (userProfile as any).name,
          email: (userProfile as any).email,
          role: (userProfile as any).role,
          plan: (userProfile as any).plan,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[/api/auth/signup] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
