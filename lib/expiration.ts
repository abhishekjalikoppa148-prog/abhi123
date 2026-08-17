import { supabaseAdmin } from './supabase/admin';

export async function checkWebsiteExpiry(websiteId: string): Promise<boolean> {
  const { data: website } = await supabaseAdmin
    .from('birthday_websites')
    .select('expires_at, payment_status')
    .eq('id', websiteId)
    .maybeSingle();

  if (!website) return false;

  const expiresAt = new Date(website.expires_at);
  const now = new Date();

  if (expiresAt < now && website.payment_status === 'paid') {
    await supabaseAdmin
      .from('birthday_websites')
      .update({ payment_status: 'expired' })
      .eq('id', websiteId);
    return true;
  }

  return false;
}

export async function checkUserPlanExpiry(userId: string): Promise<boolean> {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('plan_expires_at, plan_status, plan')
    .eq('id', userId)
    .maybeSingle();

  if (!user || !user.plan_expires_at) return false;

  const expiresAt = new Date(user.plan_expires_at);
  const now = new Date();

  if (
    expiresAt < now &&
    user.plan_status === 'active' &&
    user.plan !== 'free'
  ) {
    await supabaseAdmin
      .from('users')
      .update({ plan_status: 'expired', plan: 'free' })
      .eq('id', userId);
    return true;
  }

  return false;
}

export async function getDaysUntilExpiry(expiresAt: string): Promise<number> {
  const expiration = new Date(expiresAt);
  const now = new Date();
  const diff = expiration.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}
