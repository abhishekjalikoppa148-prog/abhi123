import { createClient } from '@supabase/supabase-js';

// Admin Supabase client using service role key
// SERVER-SIDE ONLY - Never expose to browser
// Bypasses RLS for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper function to verify admin role
export async function verifyAdminRole(userId: string): Promise<boolean> {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !user) return false;
  return (user as any).role === 'admin';
}

// Helper function to get all users (admin only)
export async function getAllUsers() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Helper function to get all websites (admin only)
export async function getAllWebsites() {
  const { data, error } = await supabaseAdmin
    .from('birthday_websites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Helper function to get all orders (admin only)
export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Helper function to get admin stats
export async function getAdminStats() {
  const [users, websites, orders] = await Promise.all([
    supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('birthday_websites').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }),
  ]);

  const totalViews = await supabaseAdmin
    .from('birthday_websites')
    .select('views');

  const totalRevenue = await supabaseAdmin
    .from('orders')
    .select('amount')
    .eq('status', 'completed');

  return {
    totalUsers: users.count || 0,
    totalWebsites: websites.count || 0,
    totalOrders: orders.count || 0,
    totalViews: totalViews.data?.reduce((sum: number, w: any) => sum + (w.views || 0), 0) || 0,
    totalRevenue: totalRevenue.data?.reduce((sum: number, o: any) => sum + (o.amount || 0), 0) || 0,
  };
}
