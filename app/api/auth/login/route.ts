import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import { validateEmail, checkRateLimit } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`login:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sign in with Supabase Auth
    const data = await createSession(email.toLowerCase().trim(), password);
    
    if (!data.session) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get user profile from our users table
    const { supabaseAdmin } = await import('@/lib/supabase/admin');
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, avatar, plan')
      .eq('auth_id', data.session.user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: (userProfile as any).id,
        name: (userProfile as any).name,
        email: (userProfile as any).email,
        role: (userProfile as any).role,
        avatar: (userProfile as any).avatar,
        plan: (userProfile as any).plan,
      },
    });
  } catch (error: any) {
    console.error('[/api/auth/login] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
