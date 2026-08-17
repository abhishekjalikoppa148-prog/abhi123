// Database access layer using Supabase
// This provides a migration-friendly interface that mirrors the old MySQL API

import { supabase } from './client';
import { supabaseAdmin } from './admin';

// Generic query function for compatibility
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T> {
  // This is a compatibility layer - actual queries should use Supabase client directly
  throw new Error('Direct SQL queries not supported with Supabase. Use Supabase client methods instead.');
}

// ─── User helpers ────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role, avatar, plan, plan_status, plan_expires_at, created_at')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function createUser(user: {
  id?: string;
  name: string;
  email: string;
  password_hash?: string;
  role?: string;
  avatar?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      avatar: user.avatar || null,
      plan: 'free',
      plan_status: 'active',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  // Password is managed by Supabase Auth, this is for legacy compatibility
  // In Supabase Auth, use supabase.auth.updateUser({ password: newPassword })
  throw new Error('Password updates should use Supabase Auth API');
}

// ─── Password reset tokens ────────────────────────────────────────────────────

export async function createPasswordResetToken(userId: string, tokenHash: string, expiresAt: string) {
  await supabaseAdmin
    .from('password_reset_tokens')
    .delete()
    .eq('user_id', userId);

  const { error } = await supabaseAdmin
    .from('password_reset_tokens')
    .insert({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

  if (error) throw error;
}

export async function getPasswordResetToken(tokenHash: string) {
  const { data, error } = await supabaseAdmin
    .from('password_reset_tokens')
    .select('*')
    .eq('token_hash', tokenHash)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error) return null;
  return data;
}

export async function deletePasswordResetToken(tokenHash: string) {
  const { error } = await supabaseAdmin
    .from('password_reset_tokens')
    .delete()
    .eq('token_hash', tokenHash);

  if (error) throw error;
}

// ─── Website helpers ──────────────────────────────────────────────────────────

export async function getWebsitesByUserId(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('birthday_websites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getWebsiteBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('birthday_websites')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

export async function getWebsiteById(id: string, userId?: string) {
  let query = supabaseAdmin.from('birthday_websites').select('*').eq('id', id);
  
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error) return null;
  return data;
}

export async function incrementWebsiteViews(websiteId: string) {
  const { data: website } = await supabaseAdmin
    .from('birthday_websites')
    .select('views')
    .eq('id', websiteId)
    .single();

  if (!website) return;

  await supabaseAdmin
    .from('birthday_websites')
    .update({ views: ((website as any).views || 0) + 1 } as any)
    .eq('id', websiteId);
}

export async function getPhotoMemories(websiteId: string) {
  const { data, error } = await supabaseAdmin
    .from('photo_memories')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// ─── Order helpers ────────────────────────────────────────────────────────────

export async function getOrdersByUserId(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ─── Admin helpers ────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const { count: userCount } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: websiteCount } = await supabaseAdmin
    .from('birthday_websites')
    .select('*', { count: 'exact', head: true });

  const { count: orderCount } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const { data: totalViewsData } = await supabaseAdmin
    .from('birthday_websites')
    .select('views');

  const { data: totalRevenueData } = await supabaseAdmin
    .from('orders')
    .select('amount')
    .eq('status', 'completed');

  return {
    totalUsers: userCount || 0,
    totalWebsites: websiteCount || 0,
    totalOrders: orderCount || 0,
    totalViews: totalViewsData?.reduce((sum: number, w: any) => sum + (w.views || 0), 0) || 0,
    totalRevenue: totalRevenueData?.reduce((sum: number, o: any) => sum + (o.amount || 0), 0) || 0,
  };
}

export default supabaseAdmin;
