import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'birthday_saas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  const results = await query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  ) as any[];
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
    `INSERT INTO users (id, name, email, password_hash, role, avatar, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [user.id, user.name, user.email, user.password_hash || null, user.role, user.avatar || null]
  );
  return user;
}

export async function createWebsite(website: any) {
  await query(
    `INSERT INTO birthday_websites 
     (id, slug, user_id, creator_name, person_name, person_nickname, person_age, birthday_date, 
      relationship, fav_color, fav_song, fav_food, fav_place, hobbies, personality, custom_info,
      birthday_message, template_id, accent_color, font_style, bg_animation, button_style, photo_layout,
      music_id, music_title, music_artist, music_audio_url, plan_id, payment_status, payment_id,
      views, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
    [
      website.id, website.slug, website.userId, website.creatorName, website.personName,
      website.personNickname || null, website.personAge || 24, website.birthdayDate,
      website.relationship, website.favColor || null, website.favSong || null,
      website.favFood || null, website.favPlace || null,
      website.hobbies ? JSON.stringify(website.hobbies) : null,
      website.personality || null, website.customInfo || null,
      website.birthdayMessage, website.templateId, website.customizations.accentColor,
      website.customizations.fontStyle, website.customizations.bgAnimation,
      website.customizations.buttonStyle, website.customizations.photoLayout,
      website.music.id, website.music.title, website.music.artist, website.music.audioUrl || null,
      website.planId, website.paymentStatus, website.paymentId || null,
      0, website.expiresAt
    ]
  );
  return website;
}

export async function getWebsitesByUserId(userId: string) {
  const results = await query(
    'SELECT * FROM birthday_websites WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  ) as any[];
  return results;
}

export async function getWebsiteBySlug(slug: string) {
  const results = await query(
    'SELECT * FROM birthday_websites WHERE slug = ?',
    [slug]
  ) as any[];
  return results[0] || null;
}

export async function incrementWebsiteViews(slug: string) {
  await query(
    'UPDATE birthday_websites SET views = views + 1 WHERE slug = ?',
    [slug]
  );
}

export async function createPhotoMemory(photo: {
  id: string;
  website_id: string;
  url: string;
  caption?: string;
  memory_date?: string;
  memory_note?: string;
}) {
  await query(
    `INSERT INTO photo_memories (id, website_id, url, caption, memory_date, memory_note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [photo.id, photo.website_id, photo.url, photo.caption || null, photo.memory_date || null, photo.memory_note || null]
  );
  return photo;
}

export async function getPhotoMemories(websiteId: string) {
  const results = await query(
    'SELECT * FROM photo_memories WHERE website_id = ? ORDER BY created_at ASC',
    [websiteId]
  ) as any[];
  return results;
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

export async function getOrdersByUserId(userId: string) {
  const results = await query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  ) as any[];
  return results;
}

export async function getAdminStats() {
  const [userCount] = await query('SELECT COUNT(*) as count FROM users') as any[];
  const [websiteCount] = await query('SELECT COUNT(*) as count FROM birthday_websites') as any[];
  const [orderCount] = await query('SELECT COUNT(*) as count FROM orders WHERE status = "completed"') as any[];
  const [totalViews] = await query('SELECT SUM(views) as total FROM birthday_websites') as any[];
  const [totalRevenue] = await query('SELECT SUM(amount) as total FROM orders WHERE status = "completed"') as any[];

  return {
    totalUsers: userCount.count,
    totalWebsites: websiteCount.count,
    totalOrders: orderCount.count,
    totalViews: totalViews.total || 0,
    totalRevenue: totalRevenue.total || 0
  };
}

export default pool;
