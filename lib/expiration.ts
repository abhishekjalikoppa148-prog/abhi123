import { query } from '@/lib/mysql';

export async function checkWebsiteExpiry(websiteId: string): Promise<boolean> {
  const website = await query<any[]>(
    'SELECT expires_at, payment_status FROM birthday_websites WHERE id = ?',
    [websiteId]
  );

  if (website.length === 0) return false;

  const expiresAt = new Date(website[0].expires_at);
  const now = new Date();

  if (expiresAt < now && website[0].payment_status === 'paid') {
    await query(
      'UPDATE birthday_websites SET payment_status = "expired" WHERE id = ?',
      [websiteId]
    );
    return true;
  }

  return false;
}

export async function checkUserPlanExpiry(userId: string): Promise<boolean> {
  const user = await query<any[]>(
    'SELECT plan_expires_at, plan_status, plan FROM users WHERE id = ?',
    [userId]
  );

  if (user.length === 0) return false;

  const expiresAt = new Date(user[0].plan_expires_at);
  const now = new Date();

  if (expiresAt < now && user[0].plan_status === 'active' && user[0].plan !== 'free') {
    await query(
      'UPDATE users SET plan_status = "expired", plan = "free" WHERE id = ?',
      [userId]
    );
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
