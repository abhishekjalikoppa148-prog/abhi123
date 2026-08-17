import mysql from 'mysql2/promise';

// Single, consolidated MySQL connection pool
// Supports both DB_* and MYSQL_* env vars consistently across the whole app
const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306'),
  user: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || 'birthday_saas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params as any);
    return rows as T;
  } catch (error) {
    console.error('MySQL Query Error:', (error as Error).message);
    throw error;
  }
}

// ─── User helpers ────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  const results = await query<any[]>(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return results[0] || null;
}

export async function getUserById(id: string) {
  const results = await query<any[]>(
    'SELECT id, name, email, role, avatar, plan, plan_status, plan_expires_at, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return results[0] || null;
}

export async function createUser(user: {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role: string;
  avatar?: string;
}) {
  await query(
    `INSERT INTO users (id, name, email, password_hash, role, avatar, plan, plan_status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'free', 'active', NOW(), NOW())`,
    [user.id, user.name, user.email, user.password_hash || null, user.role, user.avatar || null]
  );
  return getUserById(user.id);
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  await query(
    'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
    [passwordHash, userId]
  );
}

// ─── Password reset tokens ────────────────────────────────────────────────────

export async function createPasswordResetToken(userId: string, tokenHash: string, expiresAt: string) {
  // Invalidate any existing tokens for this user
  await query('DELETE FROM password_reset_tokens WHERE user_id = ?', [userId]);
  await query(
    'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, NOW())',
    [userId, tokenHash, expiresAt]
  );
}

export async function getPasswordResetToken(tokenHash: string) {
  const results = await query<any[]>(
    'SELECT * FROM password_reset_tokens WHERE token_hash = ? AND expires_at > NOW() LIMIT 1',
    [tokenHash]
  );
  return results[0] || null;
}

export async function deletePasswordResetToken(tokenHash: string) {
  await query('DELETE FROM password_reset_tokens WHERE token_hash = ?', [tokenHash]);
}

// ─── Website helpers ──────────────────────────────────────────────────────────

export async function getWebsitesByUserId(userId: string) {
  return query<any[]>(
    'SELECT * FROM birthday_websites WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
}

export async function getWebsiteBySlug(slug: string) {
  const results = await query<any[]>(
    'SELECT * FROM birthday_websites WHERE slug = ? LIMIT 1',
    [slug]
  );
  return results[0] || null;
}

export async function getWebsiteById(id: string, userId?: string) {
  const sql = userId
    ? 'SELECT * FROM birthday_websites WHERE id = ? AND user_id = ? LIMIT 1'
    : 'SELECT * FROM birthday_websites WHERE id = ? LIMIT 1';
  const params = userId ? [id, userId] : [id];
  const results = await query<any[]>(sql, params);
  return results[0] || null;
}

export async function incrementWebsiteViews(slug: string) {
  await query(
    'UPDATE birthday_websites SET views = views + 1 WHERE slug = ?',
    [slug]
  );
}

export async function getPhotoMemories(websiteId: string) {
  return query<any[]>(
    'SELECT * FROM photo_memories WHERE website_id = ? ORDER BY created_at ASC',
    [websiteId]
  );
}

// ─── Order helpers ────────────────────────────────────────────────────────────

export async function getOrdersByUserId(userId: string) {
  return query<any[]>(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
}

export async function createOrder(order: any) {
  await query(
    `INSERT INTO orders 
     (id, user_id, user_name, user_email, website_id, website_slug, person_name, plan_id, plan_name,
      amount, currency, payment_method, payment_id, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      order.id, order.userId, order.userName, order.userEmail, order.websiteId,
      order.websiteSlug, order.personName, order.planId, order.planName,
      order.amount, order.currency, order.paymentMethod, order.paymentId, order.status
    ]
  );
  return order;
}

// ─── Admin helpers ────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [userCount] = await query<any[]>('SELECT COUNT(*) as count FROM users');
  const [websiteCount] = await query<any[]>('SELECT COUNT(*) as count FROM birthday_websites');
  const [orderCount] = await query<any[]>('SELECT COUNT(*) as count FROM orders WHERE status = "completed"');
  const [totalViews] = await query<any[]>('SELECT COALESCE(SUM(views), 0) as total FROM birthday_websites');
  const [totalRevenue] = await query<any[]>('SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE status = "completed"');

  return {
    totalUsers: userCount.count,
    totalWebsites: websiteCount.count,
    totalOrders: orderCount.count,
    totalViews: totalViews.total,
    totalRevenue: totalRevenue.total,
  };
}

export default pool;
