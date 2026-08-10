-- ============================================================
-- Birthday Website SaaS Platform - Complete MySQL Database Schema
-- Database Name: birthday_saas
-- ============================================================

CREATE DATABASE IF NOT EXISTS `birthday_saas` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `birthday_saas`;

-- ------------------------------------------------------------
-- Table 1: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `avatar` VARCHAR(512) DEFAULT NULL,
  `notifications_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table 2: birthday_websites
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `birthday_websites` (
  `id` VARCHAR(64) NOT NULL,
  `slug` VARCHAR(128) NOT NULL UNIQUE,
  `user_id` VARCHAR(64) NOT NULL,
  `creator_name` VARCHAR(128) NOT NULL,
  `person_name` VARCHAR(128) NOT NULL,
  `person_nickname` VARCHAR(128) DEFAULT NULL,
  `person_age` INT DEFAULT 24,
  `birthday_date` DATE NOT NULL,
  `relationship` VARCHAR(64) NOT NULL DEFAULT 'Best Friend',
  `fav_color` VARCHAR(32) DEFAULT '#8b5cf6',
  `fav_song` VARCHAR(255) DEFAULT NULL,
  `fav_food` VARCHAR(255) DEFAULT NULL,
  `fav_place` VARCHAR(255) DEFAULT NULL,
  `hobbies` TEXT DEFAULT NULL,
  `personality` VARCHAR(255) DEFAULT NULL,
  `custom_info` TEXT DEFAULT NULL,
  `birthday_message` TEXT NOT NULL,
  `template_id` VARCHAR(64) NOT NULL DEFAULT 'bestfriend',
  
  -- Theme & Customization JSON / Columns
  `accent_color` VARCHAR(32) DEFAULT '#a855f7',
  `font_style` VARCHAR(32) DEFAULT 'outfit',
  `bg_animation` VARCHAR(32) DEFAULT 'confetti',
  `button_style` VARCHAR(32) DEFAULT 'glow',
  `photo_layout` VARCHAR(32) DEFAULT 'polaroid',
  
  -- Music details
  `music_id` VARCHAR(64) DEFAULT 'track-1',
  `music_title` VARCHAR(128) DEFAULT 'Happy Acoustic Birthday',
  `music_artist` VARCHAR(128) DEFAULT 'Celebration Studio',
  `music_audio_url` VARCHAR(512) DEFAULT NULL,
  
  -- Publishing & Stats
  `plan_id` VARCHAR(32) NOT NULL DEFAULT 'ultimate',
  `payment_status` VARCHAR(32) NOT NULL DEFAULT 'paid',
  `payment_id` VARCHAR(128) DEFAULT NULL,
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table 3: photo_memories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `photo_memories` (
  `id` VARCHAR(64) NOT NULL,
  `website_id` VARCHAR(64) NOT NULL,
  `url` TEXT NOT NULL,
  `caption` VARCHAR(255) DEFAULT NULL,
  `memory_date` VARCHAR(64) DEFAULT NULL,
  `memory_note` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_website_id` (`website_id`),
  FOREIGN KEY (`website_id`) REFERENCES `birthday_websites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table 4: orders
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(128) NOT NULL,
  `user_email` VARCHAR(191) NOT NULL,
  `website_id` VARCHAR(64) NOT NULL,
  `website_slug` VARCHAR(128) NOT NULL,
  `person_name` VARCHAR(128) NOT NULL,
  `plan_id` VARCHAR(32) NOT NULL,
  `plan_name` VARCHAR(128) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(8) NOT NULL DEFAULT 'INR',
  `payment_method` VARCHAR(32) NOT NULL DEFAULT 'free',
  `payment_id` VARCHAR(128) NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'completed',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_order_user` (`user_id`),
  INDEX `idx_order_website` (`website_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- SEED DATA INSERTIONS
-- ------------------------------------------------------------
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `role`, `avatar`, `created_at`) VALUES
('user-demo-1', 'Aarav Sharma', 'aarav@example.com', 'user', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop', NOW()),
('user-admin-1', 'SaaS Admin', 'admin@celebrationcraft.com', 'admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop', NOW());

INSERT IGNORE INTO `birthday_websites` 
(`id`, `slug`, `user_id`, `creator_name`, `person_name`, `person_nickname`, `person_age`, `birthday_date`, `relationship`, `fav_color`, `fav_song`, `fav_food`, `fav_place`, `hobbies`, `personality`, `birthday_message`, `template_id`, `plan_id`, `payment_status`, `payment_id`, `views`, `created_at`, `expires_at`) VALUES
('site-rohan-9821', 'rohan-special-24', 'user-demo-1', 'Aarav', 'Rohan Mehta', 'Rohu', 24, '2026-08-15', 'Best Friend', '#8b5cf6', 'Levitating by Dua Lipa', 'Pizza & Tacos', 'Goa Beaches', 'Guitar, Photography, Road Trips', 'Energetic, hilarious', 'Happy 24th Birthday Rohan! 🎉\n\nFrom late-night coding sessions to endless road trips to Goa, you have been the absolute best friend anyone could ever ask for. Keep shining bro! Blow out those candles and let us celebrate! 🥂✨', 'bestfriend', 'ultimate', 'paid', 'free_pub_9821', 142, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR)),
('site-ananya-4412', 'ananya-my-love', 'user-demo-1', 'Aarav', 'Ananya Roy', 'Anu', 22, '2026-08-20', 'Partner', '#f43f5e', 'Perfect by Ed Sheeran', 'Red Velvet Cake', 'Manali Hills', 'Painting, Coffee Brewing', 'Adorable, kind', 'To my love Ananya ❤️\n\nHappy Birthday my darling. You fill my world with warmth, laughter, and endless sweetness. Today is all about celebrating YOU! 🌹✨', 'romantic', 'ultimate', 'paid', 'free_pub_4412', 389, NOW(), DATE_ADD(NOW(), INTERVAL 10 YEAR));

INSERT IGNORE INTO `photo_memories` (`id`, `website_id`, `url`, `caption`, `memory_date`) VALUES
('p1', 'site-rohan-9821', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop', 'Our epic Goa trip memory! 🏖️', 'March 2025'),
('p2', 'site-rohan-9821', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop', 'Late night jam session 🎸', 'November 2025'),
('p3', 'site-ananya-4412', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop', 'Coffee date at the hill top ☕', 'January 2026');
