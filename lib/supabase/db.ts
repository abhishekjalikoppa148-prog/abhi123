import { supabaseAdmin } from './admin';

/**
 * Database helpers powered by Supabase PostgreSQL (via Supabase Admin Client).
 * Replaces MySQL connection pool and raw SQL queries with clean Supabase SDK operations.
 */

// ─── User helpers ────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .ilike('email', email.trim())
    .maybeSingle();

  if (error) {
    console.error('Supabase getUserByEmail Error:', error.message);
    throw error;
  }
  return data;
}

export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role, avatar, plan, plan_id, plan_status, plan_expires_at, notifications_enabled, created_at, updated_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Supabase getUserById Error:', error.message);
    throw error;
  }
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
  const userId = user.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      id: userId,
      name: user.name,
      email: user.email.toLowerCase().trim(),
      password_hash: user.password_hash || null,
      role: user.role || 'user',
      avatar: user.avatar || null,
      plan: 'free',
      plan_id: 'free',
      plan_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase createUser Error:', error.message);
    throw error;
  }
  return data;
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Supabase updateUserPassword Error:', error.message);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: { name?: string; avatar?: string; notificationsEnabled?: boolean }
) {
  const updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) updatePayload.name = updates.name;
  if (updates.avatar !== undefined) updatePayload.avatar = updates.avatar;
  if (updates.notificationsEnabled !== undefined) {
    updatePayload.notifications_enabled = updates.notificationsEnabled;
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updatePayload)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Supabase updateUserProfile Error:', error.message);
    throw error;
  }
  return data;
}

export async function deleteUserAccount(userId: string) {
  // Cascading deletes handled by foreign keys in Supabase PostgreSQL,
  // but explicit deletion ensures full cleanup across related tables
  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Supabase deleteUserAccount Error:', error.message);
    throw error;
  }
}

// ─── Password reset tokens ────────────────────────────────────────────────────

export async function createPasswordResetToken(userId: string, tokenHash: string, expiresAt: string) {
  // Invalidate any existing tokens for this user
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
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Supabase createPasswordResetToken Error:', error.message);
    throw error;
  }
}

export async function getPasswordResetToken(tokenHash: string) {
  const { data, error } = await supabaseAdmin
    .from('password_reset_tokens')
    .select('*')
    .eq('token_hash', tokenHash)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error('Supabase getPasswordResetToken Error:', error.message);
    throw error;
  }
  return data;
}

export async function deletePasswordResetToken(tokenHash: string) {
  const { error } = await supabaseAdmin
    .from('password_reset_tokens')
    .delete()
    .eq('token_hash', tokenHash);

  if (error) {
    console.error('Supabase deletePasswordResetToken Error:', error.message);
    throw error;
  }
}

// ─── Website helpers ──────────────────────────────────────────────────────────

export async function getWebsitesByUserId(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('birthday_websites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase getWebsitesByUserId Error:', error.message);
    throw error;
  }
  return data || [];
}

export async function getWebsiteBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('birthday_websites')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Supabase getWebsiteBySlug Error:', error.message);
    throw error;
  }
  return data;
}

export async function getWebsiteById(id: string, userId?: string) {
  let query = supabaseAdmin
    .from('birthday_websites')
    .select('*')
    .eq('id', id);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error('Supabase getWebsiteById Error:', error.message);
    throw error;
  }
  return data;
}

export async function incrementWebsiteViews(slug: string) {
  const { data: website } = await supabaseAdmin
    .from('birthday_websites')
    .select('id, views')
    .eq('slug', slug)
    .maybeSingle();

  if (website) {
    await supabaseAdmin
      .from('birthday_websites')
      .update({ views: (website.views || 0) + 1 })
      .eq('id', website.id);
  }
}

export async function getPhotoMemories(websiteId: string) {
  const { data, error } = await supabaseAdmin
    .from('photo_memories')
    .select('*')
    .eq('website_id', websiteId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase getPhotoMemories Error:', error.message);
    throw error;
  }
  return data || [];
}

// ─── Order helpers ────────────────────────────────────────────────────────────

export async function getOrdersByUserId(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase getOrdersByUserId Error:', error.message);
    throw error;
  }
  return data || [];
}

export async function createOrder(order: any) {
  const orderId = order.id || `ORD-${Date.now()}`;
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      id: orderId,
      user_id: order.userId || order.user_id,
      user_name: order.userName || order.user_name,
      user_email: order.userEmail || order.user_email,
      website_id: order.websiteId || order.website_id,
      website_slug: order.websiteSlug || order.website_slug,
      person_name: order.personName || order.person_name,
      plan_id: order.planId || order.plan_id,
      plan_name: order.planName || order.plan_name,
      amount: order.amount || 0,
      currency: order.currency || 'INR',
      payment_method: order.paymentMethod || order.payment_method || 'razorpay',
      razorpay_order_id: order.razorpayOrderId || order.razorpay_order_id || null,
      razorpay_payment_id: order.razorpayPaymentId || order.razorpay_payment_id || null,
      razorpay_signature: order.razorpaySignature || order.razorpay_signature || null,
      payment_id: order.paymentId || order.payment_id || null,
      status: order.status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase createOrder Error:', error.message);
    throw error;
  }
  return data;
}

// ─── Admin helpers ────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [usersRes, websitesRes, ordersRes, revenueRes] = await Promise.all([
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('birthday_websites').select('views'),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabaseAdmin.from('orders').select('amount').eq('status', 'completed'),
  ]);

  const totalUsers = usersRes.count || 0;
  const websitesData = websitesRes.data || [];
  const totalWebsites = websitesData.length;
  const totalViews = websitesData.reduce((acc, site) => acc + (site.views || 0), 0);
  const totalOrders = ordersRes.count || 0;
  const revenueData = revenueRes.data || [];
  const totalRevenue = revenueData.reduce((acc, o) => acc + Number(o.amount || 0), 0);

  return {
    totalUsers,
    totalWebsites,
    totalOrders,
    totalViews,
    totalRevenue,
  };
}

export { supabaseAdmin };
