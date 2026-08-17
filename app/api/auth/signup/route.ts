import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/mysql';
import {
  hashPassword, createSession,
  validateEmail, validatePassword, checkRateLimit
} from '@/lib/auth';
import { EmailService } from '@/lib/email';

function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 signups per minute per IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`signup:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }
    if (name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const pwValidation = validatePassword(password);
    if (!pwValidation.valid) {
      return NextResponse.json({ error: pwValidation.errors[0] }, { status: 400 });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    // Check for duplicate email
    const existing = await getUserByEmail(email.toLowerCase().trim());
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const userId = generateId();
    const user = await createUser({
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      role: 'user',
    });

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Send welcome email (non-blocking)
    EmailService.sendWelcomeEmail(user.email, user.name).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[/api/auth/signup] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
