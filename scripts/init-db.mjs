import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

async function initDB() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'abhi123',
      multipleStatements: true
    });

    console.log('Connected to MySQL server.');

    const schemaPath = path.resolve('schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Helper to safely add column if not exists
    async function addColumnIfNotExists(table, colDef, colName) {
      try {
        await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN ${colDef}`);
        console.log(`Added column ${colName} to ${table}`);
      } catch (e) {
        if (!e.message.includes('Duplicate column name')) {
          console.warn(`Column notice: ${e.message}`);
        }
      }
    }

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`birthday_saas\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.changeUser({ database: 'birthday_saas' });

    // Ensure all columns exist on users table
    await addColumnIfNotExists('users', '`plan_id` VARCHAR(32) DEFAULT "free"', 'plan_id');
    await addColumnIfNotExists('users', '`referral_code` VARCHAR(64) DEFAULT NULL', 'referral_code');
    await addColumnIfNotExists('users', '`referral_credits` INT NOT NULL DEFAULT 0', 'referral_credits');
    await addColumnIfNotExists('users', '`referred_by` VARCHAR(64) DEFAULT NULL', 'referred_by');

    console.log('Applying schema.sql...');
    await conn.query(sql);
    console.log('Schema applied successfully!');

    const [tables] = await conn.query('SHOW TABLES');
    console.log('Tables in birthday_saas:', tables);

    // Ensure valid admin hash
    const adminHash = await bcrypt.hash('Admin@123', 10);
    await conn.query(
      `INSERT INTO users (id, name, email, password_hash, role, plan, plan_status, created_at, updated_at)
       VALUES ('user-admin-1', 'CelebrationCraft Admin', 'admin@celebrationcraft.com', ?, 'admin', 'ultimate', 'active', NOW(), NOW())
       ON DUPLICATE KEY UPDATE password_hash = ?`,
      [adminHash, adminHash]
    );
    console.log('Admin user verified with password Admin@123');

    // Also seed a test user: test@example.com / Password@123
    const userHash = await bcrypt.hash('Password@123', 10);
    await conn.query(
      `INSERT INTO users (id, name, email, password_hash, role, plan, plan_status, created_at, updated_at)
       VALUES ('user-demo-1', 'Abhishek Sharma', 'test@example.com', ?, 'user', 'ultimate', 'active', NOW(), NOW())
       ON DUPLICATE KEY UPDATE password_hash = ?`,
      [userHash, userHash]
    );
    console.log('Demo user seeded: test@example.com / Password@123');

    // Seed sample birthday website for rohan-special-24
    await conn.query(
      `INSERT INTO birthday_websites 
       (id, slug, user_id, creator_name, person_name, person_nickname, person_age, birthday_date, relationship, fav_color, fav_song, fav_food, fav_place, hobbies, personality, birthday_message, template_id, accent_color, font_style, bg_animation, button_style, photo_layout, music_id, music_title, music_artist, music_audio_url, plan_id, payment_status, payment_id, views, created_at, updated_at, expires_at)
       VALUES 
       ('site-rohan-9821', 'rohan-special-24', 'user-demo-1', 'Abhishek', 'Rohan Mehta', 'Brohan', 24, '2026-08-24', 'Best Friend', '#3b82f6', 'Night Changes by One Direction', 'Wood-fired Pizza & Chai', 'Goa Beaches', '["Gaming", "Guitar", "Road Trips"]', 'Adventurous & loyal bestie', 'Happy 24th Birthday Rohan! From late-night gaming sessions to spontaneous road trips, you have been the absolute best friend anyone could ask for.', 'bestfriend', '#3b82f6', 'outfit', 'confetti', 'glow', 'polaroid', 'track-1', 'Happy Birthday Acoustic', 'Celebration Studio', 'https://assets.mixkit.co/music/preview/mixkit-happy-birthday-acoustic-guitar-478.mp3', 'premium', 'paid', 'pay_Nz983210492', 142, NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR))
       ON DUPLICATE KEY UPDATE updated_at = NOW()`
    );

    // Also seed ananya-my-love
    await conn.query(
      `INSERT INTO birthday_websites 
       (id, slug, user_id, creator_name, person_name, person_nickname, person_age, birthday_date, relationship, fav_color, fav_song, fav_food, fav_place, hobbies, personality, birthday_message, template_id, accent_color, font_style, bg_animation, button_style, photo_layout, music_id, music_title, music_artist, music_audio_url, plan_id, payment_status, payment_id, views, created_at, updated_at, expires_at)
       VALUES 
       ('site-ananya-4412', 'ananya-my-love', 'user-demo-1', 'Abhishek', 'Ananya Roy', 'Anu', 22, '2026-08-20', 'Partner', '#f43f5e', 'Perfect by Ed Sheeran', 'Red Velvet Cake & Pasta', 'Manali Hills', '["Painting", "Coffee Brewing", "Reading"]', 'Sweet, artistic & kind', 'To my love Ananya ❤️\\n\\nHappy Birthday my darling. You fill my world with warmth, laughter, and endless sweetness. Today and every day is all about celebrating YOU!', 'romantic', '#f43f5e', 'playfair', 'hearts', 'pill', 'gallery', 'track-2', 'Romantic Piano Glow', 'Soul Melody', 'https://assets.mixkit.co/music/preview/mixkit-romantic-dinner-piano-651.mp3', 'ultimate', 'paid', 'pay_Kz719204912', 389, NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 10 YEAR))
       ON DUPLICATE KEY UPDATE updated_at = NOW()`
    );

    console.log('Sample websites seeded successfully!');
    await conn.end();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initDB();
