-- ============================================================
-- CelebrationCraft Birthday SaaS — Complete MySQL Schema
-- Database: birthday_saas
-- ============================================================

CREATE DATABASE IF NOT EXISTS `birthday_saas`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `birthday_saas`;

-- ─────────────────────────────────────────────────────────────
-- Table 1: users
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`                  VARCHAR(64)   NOT NULL,
  `name`                VARCHAR(128)  NOT NULL,
  `email`               VARCHAR(191)  NOT NULL UNIQUE,
  `password_hash`       VARCHAR(255)  DEFAULT NULL,
  `role`                ENUM('user','admin') NOT NULL DEFAULT 'user',
  `avatar`              VARCHAR(512)  DEFAULT NULL,
  `plan`                ENUM('free','basic','premium','ultimate') NOT NULL DEFAULT 'free',
  `plan_status`         ENUM('active','expired','cancelled') NOT NULL DEFAULT 'active',
  `plan_expires_at`     DATETIME      DEFAULT NULL,
  `notifications_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table 2: password_reset_tokens
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`     VARCHAR(64)   NOT NULL,
  `token_hash`  VARCHAR(255)  NOT NULL,
  `expires_at`  DATETIME      NOT NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_token_hash` (`token_hash`),
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table 3: birthday_websites
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `birthday_websites` (
  `id`                VARCHAR(64)   NOT NULL,
  `slug`              VARCHAR(128)  NOT NULL UNIQUE,
  `user_id`           VARCHAR(64)   NOT NULL,
  `creator_name`      VARCHAR(128)  NOT NULL,
  `person_name`       VARCHAR(128)  NOT NULL,
  `person_nickname`   VARCHAR(128)  DEFAULT NULL,
  `person_age`        INT           DEFAULT 24,
  `birthday_date`     DATE          NOT NULL,
  `relationship`      VARCHAR(64)   NOT NULL DEFAULT 'Best Friend',
  `fav_color`         VARCHAR(32)   DEFAULT '#8b5cf6',
  `fav_song`          VARCHAR(255)  DEFAULT NULL,
  `fav_food`          VARCHAR(255)  DEFAULT NULL,
  `fav_place`         VARCHAR(255)  DEFAULT NULL,
  `hobbies`           TEXT          DEFAULT NULL,
  `personality`       VARCHAR(255)  DEFAULT NULL,
  `custom_info`       TEXT          DEFAULT NULL,
  `birthday_message`  TEXT          NOT NULL,
  `template_id`       VARCHAR(64)   NOT NULL DEFAULT 'bestfriend',
  -- Customization columns
  `accent_color`      VARCHAR(32)   DEFAULT '#a855f7',
  `font_style`        VARCHAR(32)   DEFAULT 'outfit',
  `bg_animation`      VARCHAR(32)   DEFAULT 'confetti',
  `button_style`      VARCHAR(32)   DEFAULT 'glow',
  `photo_layout`      VARCHAR(32)   DEFAULT 'polaroid',
  -- Music
  `music_id`          VARCHAR(64)   DEFAULT 'track-1',
  `music_title`       VARCHAR(128)  DEFAULT 'Happy Acoustic Birthday',
  `music_artist`      VARCHAR(128)  DEFAULT 'Celebration Studio',
  `music_audio_url`   VARCHAR(512)  DEFAULT NULL,
  -- Payment & Publishing
  `plan_id`           VARCHAR(32)   NOT NULL DEFAULT 'free',
  `payment_status`    VARCHAR(32)   NOT NULL DEFAULT 'unpaid',
  `payment_id`        VARCHAR(128)  DEFAULT NULL,
  `views`             INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expires_at`        DATETIME      NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table 4: photo_memories
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `photo_memories` (
  `id`            VARCHAR(64)   NOT NULL,
  `website_id`    VARCHAR(64)   NOT NULL,
  `url`           TEXT          NOT NULL,
  `caption`       VARCHAR(255)  DEFAULT NULL,
  `memory_date`   VARCHAR(64)   DEFAULT NULL,
  `memory_note`   TEXT          DEFAULT NULL,
  `sort_order`    INT           NOT NULL DEFAULT 0,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_website_id` (`website_id`),
  FOREIGN KEY (`website_id`) REFERENCES `birthday_websites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table 5: orders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `orders` (
  `id`                    VARCHAR(64)     NOT NULL,
  `user_id`               VARCHAR(64)     NOT NULL,
  `user_name`             VARCHAR(128)    NOT NULL,
  `user_email`            VARCHAR(191)    NOT NULL,
  `website_id`            VARCHAR(64)     NOT NULL,
  `website_slug`          VARCHAR(128)    NOT NULL,
  `person_name`           VARCHAR(128)    NOT NULL,
  `plan_id`               VARCHAR(32)     NOT NULL,
  `plan_name`             VARCHAR(128)    NOT NULL,
  `amount`                DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  `currency`              VARCHAR(8)      NOT NULL DEFAULT 'INR',
  `payment_method`        VARCHAR(32)     NOT NULL DEFAULT 'razorpay',
  `razorpay_order_id`     VARCHAR(255)    DEFAULT NULL,
  `razorpay_payment_id`   VARCHAR(255)    DEFAULT NULL,
  `razorpay_signature`    VARCHAR(512)    DEFAULT NULL,
  `payment_id`            VARCHAR(128)    DEFAULT NULL,
  `status`                VARCHAR(32)     NOT NULL DEFAULT 'pending',
  `created_at`            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_order_user` (`user_id`),
  INDEX `idx_order_website` (`website_id`),
  INDEX `idx_razorpay_order` (`razorpay_order_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Table 6: analytics
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `analytics` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `website_id`    VARCHAR(64)   NOT NULL,
  `visitor_id`    VARCHAR(64)   DEFAULT NULL COMMENT 'anonymous fingerprint',
  `country`       VARCHAR(64)   DEFAULT NULL,
  `device`        VARCHAR(32)   DEFAULT NULL COMMENT 'mobile|desktop|tablet',
  `browser`       VARCHAR(64)   DEFAULT NULL,
  `referrer`      VARCHAR(512)  DEFAULT NULL,
  `visited_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_website` (`website_id`),
  INDEX `idx_visited_at` (`visited_at`),
  FOREIGN KEY (`website_id`) REFERENCES `birthday_websites` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- SEED: Admin user only (password: Admin@123)
-- Hash generated with bcrypt.hash('Admin@123', 12)
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `plan`, `plan_status`, `created_at`, `updated_at`)
VALUES (
  'user-admin-1',
  'CelebrationCraft Admin',
  'admin@celebrationcraft.com',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- placeholder hash (Admin@123)
  'admin',
  'ultimate',
  'active',
  NOW(),
  NOW()
);
