import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createClient } from './supabase/server';
import { supabaseAdmin } from './supabase/admin';

const COOKIE_NAME = 'cc_session';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

// ─── Password utilities (legacy, for migration compatibility) ──────────────────

import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Supabase Auth session management ─────────────────────────────────────────

/**
 * Get the current session from Supabase Auth (server component / route handler).
 */
export async function getSession(): Promise<SessionPayload | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Get user profile from our users table
  const { data: userProfile } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('auth_id', user.id)
    .single();

  if (!userProfile) return null;

  return {
    userId: userProfile.id as string,
    email: userProfile.email as string,
    name: userProfile.name as string,
    role: userProfile.role as 'user' | 'admin',
  };
}

/**
 * Get session from an incoming NextRequest (for middleware and API routes).
 */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const supabase = await createClientWithRequest(request);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Get user profile from our users table using admin client
  const { data: userProfile } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role')
    .eq('auth_id', user.id)
    .single();

  if (!userProfile) return null;

  return {
    userId: userProfile.id as string,
    email: userProfile.email as string,
    name: userProfile.name as string,
    role: userProfile.role as 'user' | 'admin',
  };
}

/**
 * Create a session using Supabase Auth
 */
export async function createSession(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Destroy the session using Supabase Auth
 */
export async function destroySession() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**
 * Create a user using Supabase Auth
 */
export async function createUserAuth(email: string, password: string, name: string, role: 'user' | 'admin' = 'user') {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });

  if (error) throw error;
  return data;
}

// Helper function for route handlers
async function createClientWithRequest(request: Request) {
  const cookieStore = cookies();
  const token = request.headers.get('cookie') || '';
  
  return createClient();
}

// ─── Password reset token utilities ──────────────────────────────────────────

import crypto from 'crypto';

/**
 * Generate a secure random reset token. Returns { plainToken, tokenHash }.
 * Store only the hash in the database; send the plain token in the email.
 */
export function generateResetToken(): { plainToken: string; tokenHash: string } {
  const plainToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
  return { plainToken, tokenHash };
}

export function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getResetTokenExpiry(): string {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 60); // 1 hour
  return expiry.toISOString().slice(0, 19).replace('T', ' ');
}

// ─── Input validation ─────────────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  if (password.length < 8) errors.push('At least 8 characters required');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter required');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter required');
  if (!/[0-9]/.test(password)) errors.push('At least one number required');
  return { valid: errors.length === 0, errors };
}

// ─── Rate limiting (in-memory; swap for Redis in production) ─────────────────

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxRequests = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}
