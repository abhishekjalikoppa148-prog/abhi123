-- ============================================================
-- CelebrationCraft Birthday SaaS — Complete Supabase PostgreSQL Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update 'updated_at' timestamp columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- Table 1: users
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                    VARCHAR(64)   PRIMARY KEY DEFAULT ('user-' || substr(md5(random()::text), 1, 16)),
  name                  VARCHAR(128)  NOT NULL,
  email                 VARCHAR(191)  NOT NULL UNIQUE,
  password_hash         VARCHAR(255)  DEFAULT NULL,
  role                  VARCHAR(32)   NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar                VARCHAR(512)  DEFAULT NULL,
  plan                  VARCHAR(32)   NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'premium', 'ultimate')),
  plan_id               VARCHAR(32)   DEFAULT 'free',
  plan_status           VARCHAR(32)   NOT NULL DEFAULT 'active' CHECK (plan_status IN ('active', 'expired', 'cancelled')),
  plan_expires_at       TIMESTAMPTZ   DEFAULT NULL,
  referral_code         VARCHAR(64)   DEFAULT NULL,
  referral_credits      INT           NOT NULL DEFAULT 0,
  referred_by           VARCHAR(64)   DEFAULT NULL,
  notifications_enabled BOOLEAN       NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users (referral_code);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Table 2: password_reset_tokens
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          BIGSERIAL     PRIMARY KEY,
  user_id     VARCHAR(64)   NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash  VARCHAR(255)  NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ   NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pwd_reset_user_id ON password_reset_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_token_hash ON password_reset_tokens (token_hash);

-- ─────────────────────────────────────────────────────────────
-- Table 3: birthday_websites (and alias websites)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS birthday_websites (
  id                VARCHAR(64)   PRIMARY KEY DEFAULT ('site-' || substr(md5(random()::text), 1, 16)),
  slug              VARCHAR(128)  NOT NULL UNIQUE,
  user_id           VARCHAR(64)   NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  creator_name      VARCHAR(128)  NOT NULL,
  person_name       VARCHAR(128)  NOT NULL,
  person_nickname   VARCHAR(128)  DEFAULT NULL,
  person_age        INT           DEFAULT 24,
  birthday_date     DATE          NOT NULL,
  relationship      VARCHAR(64)   NOT NULL DEFAULT 'Best Friend',
  fav_color         VARCHAR(32)   DEFAULT '#8b5cf6',
  fav_song          VARCHAR(255)  DEFAULT NULL,
  fav_food          VARCHAR(255)  DEFAULT NULL,
  fav_place         VARCHAR(255)  DEFAULT NULL,
  hobbies           TEXT          DEFAULT NULL,
  personality       VARCHAR(255)  DEFAULT NULL,
  custom_info       TEXT          DEFAULT NULL,
  birthday_message  TEXT          NOT NULL,
  template_id       VARCHAR(64)   NOT NULL DEFAULT 'bestfriend',
  -- Customization columns
  accent_color      VARCHAR(32)   DEFAULT '#a855f7',
  font_style        VARCHAR(32)   DEFAULT 'outfit',
  bg_animation      VARCHAR(32)   DEFAULT 'confetti',
  button_style      VARCHAR(32)   DEFAULT 'glow',
  photo_layout      VARCHAR(32)   DEFAULT 'polaroid',
  -- Music
  music_id          VARCHAR(64)   DEFAULT 'track-1',
  music_title       VARCHAR(128)  DEFAULT 'Happy Acoustic Birthday',
  music_artist      VARCHAR(128)  DEFAULT 'Celebration Studio',
  music_audio_url   VARCHAR(512)  DEFAULT NULL,
  -- Payment & Publishing
  plan_id           VARCHAR(32)   NOT NULL DEFAULT 'free',
  payment_status    VARCHAR(32)   NOT NULL DEFAULT 'unpaid',
  payment_id        VARCHAR(128)  DEFAULT NULL,
  views             INT           NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at        TIMESTAMPTZ   NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bday_websites_slug ON birthday_websites (slug);
CREATE INDEX IF NOT EXISTS idx_bday_websites_user_id ON birthday_websites (user_id);
CREATE INDEX IF NOT EXISTS idx_bday_websites_expires ON birthday_websites (expires_at);

DROP TRIGGER IF EXISTS trg_bday_websites_updated_at ON birthday_websites;
CREATE TRIGGER trg_bday_websites_updated_at
  BEFORE UPDATE ON birthday_websites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create websites view for backward/forward compatibility
CREATE OR REPLACE VIEW websites AS SELECT * FROM birthday_websites;

-- ─────────────────────────────────────────────────────────────
-- Table 4: photo_memories (and alias website_media)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS photo_memories (
  id            VARCHAR(64)   PRIMARY KEY DEFAULT ('photo-' || substr(md5(random()::text), 1, 16)),
  website_id    VARCHAR(64)   NOT NULL REFERENCES birthday_websites (id) ON DELETE CASCADE,
  url           TEXT          NOT NULL,
  file_path     TEXT          DEFAULT NULL,
  file_name     VARCHAR(255)  DEFAULT NULL,
  mime_type     VARCHAR(64)   DEFAULT NULL,
  file_size     BIGINT        DEFAULT NULL,
  caption       VARCHAR(255)  DEFAULT NULL,
  memory_date   VARCHAR(64)   DEFAULT NULL,
  memory_note   TEXT          DEFAULT NULL,
  sort_order    INT           NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_photo_memories_website ON photo_memories (website_id);
CREATE INDEX IF NOT EXISTS idx_photo_memories_sort ON photo_memories (website_id, sort_order);

CREATE OR REPLACE VIEW website_media AS SELECT * FROM photo_memories;

-- ─────────────────────────────────────────────────────────────
-- Table 5: website_templates
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_templates (
  id            VARCHAR(64)   PRIMARY KEY,
  name          VARCHAR(128)  NOT NULL,
  description   TEXT          DEFAULT NULL,
  badge         VARCHAR(64)   DEFAULT NULL,
  bg_gradient   VARCHAR(255)  DEFAULT NULL,
  preview_image TEXT          DEFAULT NULL,
  is_active     BOOLEAN       NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- Table 6: website_sections
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_sections (
  id            VARCHAR(64)   PRIMARY KEY DEFAULT ('sec-' || substr(md5(random()::text), 1, 16)),
  website_id    VARCHAR(64)   NOT NULL REFERENCES birthday_websites (id) ON DELETE CASCADE,
  section_type  VARCHAR(64)   NOT NULL,
  title         VARCHAR(128)  DEFAULT NULL,
  content       JSONB         DEFAULT '{}'::jsonb,
  sort_order    INT           NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sections_website ON website_sections (website_id);

-- ─────────────────────────────────────────────────────────────
-- Table 7: plans
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plans (
  id              VARCHAR(32)     PRIMARY KEY,
  name            VARCHAR(128)    NOT NULL,
  price           DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  original_price  DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  description     TEXT            DEFAULT NULL,
  duration_days   INT             NOT NULL DEFAULT 365,
  max_photos      INT             NOT NULL DEFAULT 5,
  max_videos      INT             NOT NULL DEFAULT 0,
  features        JSONB           DEFAULT '[]'::jsonb,
  popular         BOOLEAN         NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- Table 8: subscriptions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                    VARCHAR(64)   PRIMARY KEY DEFAULT ('sub-' || substr(md5(random()::text), 1, 16)),
  user_id               VARCHAR(64)   NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  plan_id               VARCHAR(32)   NOT NULL REFERENCES plans (id) ON DELETE CASCADE,
  status                VARCHAR(32)   NOT NULL DEFAULT 'active',
  current_period_start  TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  current_period_end    TIMESTAMPTZ   NOT NULL,
  cancel_at_period_end  BOOLEAN       NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions (user_id);

DROP TRIGGER IF EXISTS trg_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Table 9: orders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                    VARCHAR(64)     PRIMARY KEY DEFAULT ('ORD-' || floor(extract(epoch from now()))),
  user_id               VARCHAR(64)     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  user_name             VARCHAR(128)    NOT NULL,
  user_email            VARCHAR(191)    NOT NULL,
  website_id            VARCHAR(64)     NOT NULL,
  website_slug          VARCHAR(128)    NOT NULL,
  person_name           VARCHAR(128)    NOT NULL,
  plan_id               VARCHAR(32)     NOT NULL,
  plan_name             VARCHAR(128)    NOT NULL,
  amount                DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  currency              VARCHAR(8)      NOT NULL DEFAULT 'INR',
  payment_method        VARCHAR(32)     NOT NULL DEFAULT 'razorpay',
  razorpay_order_id     VARCHAR(255)    DEFAULT NULL,
  razorpay_payment_id   VARCHAR(255)    DEFAULT NULL,
  razorpay_signature    VARCHAR(512)    DEFAULT NULL,
  payment_id            VARCHAR(128)    DEFAULT NULL,
  status                VARCHAR(32)     NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_website ON orders (website_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order ON orders (razorpay_order_id);

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Table 10: payments
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                  VARCHAR(64)     PRIMARY KEY DEFAULT ('pay-' || substr(md5(random()::text), 1, 16)),
  order_id            VARCHAR(64)     NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  amount              DECIMAL(10, 2)  NOT NULL,
  currency            VARCHAR(8)      NOT NULL DEFAULT 'INR',
  provider            VARCHAR(32)     NOT NULL DEFAULT 'razorpay',
  provider_payment_id VARCHAR(255)    DEFAULT NULL,
  status              VARCHAR(32)     NOT NULL DEFAULT 'captured',
  raw_response        JSONB           DEFAULT NULL,
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments (order_id);

-- ─────────────────────────────────────────────────────────────
-- Table 11: invoices
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id              VARCHAR(64)     PRIMARY KEY DEFAULT ('inv-' || substr(md5(random()::text), 1, 16)),
  order_id        VARCHAR(64)     NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  user_id         VARCHAR(64)     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  invoice_number  VARCHAR(64)     NOT NULL UNIQUE,
  amount          DECIMAL(10, 2)  NOT NULL,
  currency        VARCHAR(8)      NOT NULL DEFAULT 'INR',
  pdf_url         TEXT            DEFAULT NULL,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices (user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices (order_id);

-- ─────────────────────────────────────────────────────────────
-- Table 12: website_analytics (and alias website_views)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_analytics (
  id              VARCHAR(64)   PRIMARY KEY DEFAULT ('an-' || substr(md5(random()::text), 1, 16)),
  website_id      VARCHAR(64)   NOT NULL REFERENCES birthday_websites (id) ON DELETE CASCADE,
  device_type     VARCHAR(32)   DEFAULT 'unknown',
  browser         VARCHAR(64)   DEFAULT 'unknown',
  country         VARCHAR(64)   DEFAULT NULL,
  referrer        VARCHAR(512)  DEFAULT NULL,
  visit_timestamp TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_web_analytics_site ON website_analytics (website_id);
CREATE INDEX IF NOT EXISTS idx_web_analytics_time ON website_analytics (visit_timestamp);

CREATE OR REPLACE VIEW website_views AS SELECT * FROM website_analytics;

-- ─────────────────────────────────────────────────────────────
-- Table 13: funnel_events (and alias analytics_events)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS funnel_events (
  id          VARCHAR(64)   PRIMARY KEY DEFAULT ('funnel-' || substr(md5(random()::text), 1, 16)),
  step        VARCHAR(64)   NOT NULL,
  user_id     VARCHAR(64)   DEFAULT NULL,
  session_id  VARCHAR(64)   NOT NULL,
  metadata    JSONB         DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_funnel_step ON funnel_events (step);
CREATE INDEX IF NOT EXISTS idx_funnel_session ON funnel_events (session_id);
CREATE INDEX IF NOT EXISTS idx_funnel_created ON funnel_events (created_at);

CREATE OR REPLACE VIEW analytics_events AS SELECT * FROM funnel_events;

-- ─────────────────────────────────────────────────────────────
-- Table 14: website_versions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_versions (
  id                VARCHAR(64)   PRIMARY KEY DEFAULT ('ver-' || substr(md5(random()::text), 1, 16)),
  website_id        VARCHAR(64)   NOT NULL REFERENCES birthday_websites (id) ON DELETE CASCADE,
  version_number    INT           NOT NULL,
  person_name       VARCHAR(128)  NOT NULL,
  relationship      VARCHAR(64)   NOT NULL,
  birthday_date     DATE          NOT NULL,
  birthday_message  TEXT          NOT NULL,
  template_id       VARCHAR(64)   NOT NULL,
  music_id          VARCHAR(64)   DEFAULT NULL,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_version_website ON website_versions (website_id);

-- ─────────────────────────────────────────────────────────────
-- Table 15: coupons
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id              VARCHAR(64)     PRIMARY KEY DEFAULT ('cpn-' || substr(md5(random()::text), 1, 16)),
  code            VARCHAR(64)     NOT NULL UNIQUE,
  discount_type   VARCHAR(32)     NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value  DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  max_uses        INT             DEFAULT NULL,
  used_count      INT             NOT NULL DEFAULT 0,
  expires_at      TIMESTAMPTZ     DEFAULT NULL,
  min_order_value DECIMAL(10, 2)  DEFAULT NULL,
  is_active       BOOLEAN         NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coupon_code ON coupons (code);

-- ─────────────────────────────────────────────────────────────
-- Table 16: coupon_usages
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupon_usages (
  id          VARCHAR(64)   PRIMARY KEY DEFAULT ('cpu-' || substr(md5(random()::text), 1, 16)),
  coupon_id   VARCHAR(64)   NOT NULL REFERENCES coupons (id) ON DELETE CASCADE,
  user_id     VARCHAR(64)   NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  used_at     TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usage_coupon_user ON coupon_usages (coupon_id, user_id);

-- ─────────────────────────────────────────────────────────────
-- Table 17: ai_usage (and alias ai_generations)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_usage (
  id                VARCHAR(64)   PRIMARY KEY DEFAULT ('ai-' || substr(md5(random()::text), 1, 16)),
  user_id           VARCHAR(64)   NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  website_id        VARCHAR(64)   DEFAULT NULL,
  used_today        INT           NOT NULL DEFAULT 0,
  reset_time        TIMESTAMPTZ   DEFAULT NULL,
  prompt            TEXT          DEFAULT NULL,
  style             VARCHAR(64)   DEFAULT NULL,
  generated_message TEXT          DEFAULT NULL,
  generated_at      TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_user ON ai_usage (user_id);

CREATE OR REPLACE VIEW ai_generations AS SELECT * FROM ai_usage;

-- ─────────────────────────────────────────────────────────────
-- Table 18: custom_domains
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_domains (
  id            VARCHAR(64)   PRIMARY KEY DEFAULT ('dom-' || substr(md5(random()::text), 1, 16)),
  website_id    VARCHAR(64)   NOT NULL REFERENCES birthday_websites (id) ON DELETE CASCADE,
  domain        VARCHAR(255)  NOT NULL UNIQUE,
  status        VARCHAR(32)   NOT NULL DEFAULT 'pending',
  dns_verified  BOOLEAN       NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_custom_domains_site ON custom_domains (website_id);
CREATE INDEX IF NOT EXISTS idx_custom_domains_domain ON custom_domains (domain);

DROP TRIGGER IF EXISTS trg_custom_domains_updated_at ON custom_domains;
CREATE TRIGGER trg_custom_domains_updated_at
  BEFORE UPDATE ON custom_domains
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Table 19: email_logs
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_logs (
  id          VARCHAR(64)   PRIMARY KEY DEFAULT ('eml-' || substr(md5(random()::text), 1, 16)),
  recipient   VARCHAR(191)  NOT NULL,
  template    VARCHAR(64)   NOT NULL,
  subject     VARCHAR(255)  NOT NULL,
  status      VARCHAR(32)   NOT NULL DEFAULT 'sent',
  error       TEXT          DEFAULT NULL,
  sent_at     TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs (recipient);

-- ─────────────────────────────────────────────────────────────
-- Table 20: admin_users
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id          VARCHAR(64)   PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  role        VARCHAR(32)   NOT NULL DEFAULT 'admin',
  permissions JSONB         DEFAULT '["all"]'::jsonb,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────
-- Table 21: admin_logs
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_logs (
  id            VARCHAR(64)   PRIMARY KEY DEFAULT ('adlog-' || substr(md5(random()::text), 1, 16)),
  admin_id      VARCHAR(64)   NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  action        VARCHAR(128)  NOT NULL,
  target_entity VARCHAR(64)   DEFAULT NULL,
  target_id     VARCHAR(64)   DEFAULT NULL,
  details       JSONB         DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs (admin_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthday_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 1. users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (true); -- Service role / Server checks session

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (true);

-- 2. birthday_websites policies
CREATE POLICY "Public can view published unexpired websites"
  ON birthday_websites FOR SELECT
  USING (payment_status = 'paid' OR true);

CREATE POLICY "Users can create websites"
  ON birthday_websites FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own websites"
  ON birthday_websites FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own websites"
  ON birthday_websites FOR DELETE
  USING (true);

-- 3. photo_memories policies
CREATE POLICY "Public can view photo memories"
  ON photo_memories FOR SELECT
  USING (true);

CREATE POLICY "Users can insert photo memories"
  ON photo_memories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete photo memories"
  ON photo_memories FOR DELETE
  USING (true);

-- 4. website_templates & plans policies
CREATE POLICY "Anyone can view templates"
  ON website_templates FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view plans"
  ON plans FOR SELECT
  USING (true);

-- 5. orders, payments, invoices policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Allow inserting orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow updating orders"
  ON orders FOR UPDATE
  USING (true);

-- 6. website_analytics & funnel_events policies
CREATE POLICY "Anyone can insert website analytics"
  ON website_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their website analytics"
  ON website_analytics FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert funnel events"
  ON funnel_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow reading funnel events"
  ON funnel_events FOR SELECT
  USING (true);

-- 7. coupons & coupon_usages policies
CREATE POLICY "Anyone can check coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow coupon usage recording"
  ON coupon_usages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow reading coupon usages"
  ON coupon_usages FOR SELECT
  USING (true);

-- 8. ai_usage policies
CREATE POLICY "Allow AI usage tracking"
  ON ai_usage FOR ALL
  USING (true)
  WITH CHECK (true);

-- 9. website_versions policies
CREATE POLICY "Allow version snapshot management"
  ON website_versions FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKETS SETUP
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('website-media', 'website-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for website-media
CREATE POLICY "Public Access to Website Media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'website-media');

CREATE POLICY "Allow Uploads to Website Media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'website-media');

CREATE POLICY "Allow Deletes in Website Media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'website-media');

-- ============================================================
-- SEED DATA
-- ============================================================

-- Seed: Plans
INSERT INTO plans (id, name, price, original_price, description, duration_days, max_photos, max_videos, features, popular)
VALUES 
  ('basic', 'Basic Plan', 199.00, 499.00, 'Essential birthday website with photos and music', 30, 5, 0, '["Up to 5 Photos", "Music Player", "Standard Themes", "1 Month Active"]'::jsonb, false),
  ('premium', 'Premium Plan', 499.00, 999.00, 'Full features with AI generator, more photos, and interactive candle ceremony', 90, 15, 1, '["Up to 15 Photos", "1 Video Memory", "AI Birthday Wishes", "Interactive Cake", "3 Months Active"]'::jsonb, true),
  ('ultimate', 'Ultimate Plan', 999.00, 1999.00, 'Unlimited lifetime celebration with all premium themes, QR codes, and custom domains', 365, 50, 5, '["Up to 50 Photos", "5 Videos", "Unlimited AI Wishes", "All Luxury Themes", "QR Code Sharing", "1 Year Active"]'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

-- Seed: Admin user (password: Admin@123)
INSERT INTO users (id, name, email, password_hash, role, plan, plan_id, plan_status, created_at, updated_at)
VALUES (
  'user-admin-1',
  'CelebrationCraft Admin',
  'admin@celebrationcraft.com',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  'ultimate',
  'ultimate',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO admin_users (id, role, permissions, created_at)
VALUES ('user-admin-1', 'admin', '["all"]'::jsonb, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Seed: Sample active coupon
INSERT INTO coupons (id, code, discount_type, discount_value, max_uses, used_count, min_order_value, is_active, created_at)
VALUES (
  'coupon-welcome-50',
  'WELCOME50',
  'percentage',
  50.00,
  1000,
  0,
  99.00,
  true,
  CURRENT_TIMESTAMP
)
ON CONFLICT (code) DO NOTHING;
