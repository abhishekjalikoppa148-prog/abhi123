-- ============================================================
-- CelebrationCraft Birthday SaaS — Supabase PostgreSQL Schema
-- Migration: 001_initial_schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- Table 1: users (extends Supabase auth.users)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'premium', 'ultimate')),
  plan_id TEXT DEFAULT 'free',
  plan_status TEXT NOT NULL DEFAULT 'active' CHECK (plan_status IN ('active', 'expired', 'cancelled')),
  plan_expires_at TIMESTAMPTZ,
  referral_code TEXT UNIQUE,
  referral_credits INTEGER NOT NULL DEFAULT 0,
  referred_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Table 2: password_reset_tokens (legacy, for migration compatibility)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);

-- ─────────────────────────────────────────────────────────────
-- Table 3: birthday_websites
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.birthday_websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  person_name TEXT NOT NULL,
  person_nickname TEXT,
  person_age INTEGER DEFAULT 24,
  birthday_date DATE NOT NULL,
  relationship TEXT NOT NULL DEFAULT 'Best Friend',
  fav_color TEXT DEFAULT '#8b5cf6',
  fav_song TEXT,
  fav_food TEXT,
  fav_place TEXT,
  hobbies TEXT,
  personality TEXT,
  custom_info TEXT,
  birthday_message TEXT NOT NULL,
  template_id TEXT NOT NULL DEFAULT 'bestfriend',
  -- Customization columns
  accent_color TEXT DEFAULT '#a855f7',
  font_style TEXT DEFAULT 'outfit',
  bg_animation TEXT DEFAULT 'confetti',
  button_style TEXT DEFAULT 'glow',
  photo_layout TEXT DEFAULT 'polaroid',
  -- Music
  music_id TEXT DEFAULT 'track-1',
  music_title TEXT DEFAULT 'Happy Acoustic Birthday',
  music_artist TEXT DEFAULT 'Celebration Studio',
  music_audio_url TEXT,
  -- Payment & Publishing
  plan_id TEXT NOT NULL DEFAULT 'free',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  payment_id TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_birthday_websites_slug ON public.birthday_websites(slug);
CREATE INDEX IF NOT EXISTS idx_birthday_websites_user_id ON public.birthday_websites(user_id);

CREATE TRIGGER update_birthday_websites_updated_at BEFORE UPDATE ON public.birthday_websites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Table 4: photo_memories
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.photo_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.birthday_websites(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  memory_date TEXT,
  memory_note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photo_memories_website_id ON public.photo_memories(website_id);

-- ─────────────────────────────────────────────────────────────
-- Table 5: orders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  website_id UUID NOT NULL REFERENCES public.birthday_websites(id) ON DELETE CASCADE,
  website_slug TEXT NOT NULL,
  person_name TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL DEFAULT 'razorpay',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_website_id ON public.orders(website_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order ON public.orders(razorpay_order_id);

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Table 6: website_analytics
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.website_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.birthday_websites(id) ON DELETE CASCADE,
  device_type TEXT DEFAULT 'unknown',
  browser TEXT DEFAULT 'unknown',
  country TEXT,
  referrer TEXT,
  visit_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_website_analytics_site ON public.website_analytics(website_id);
CREATE INDEX IF NOT EXISTS idx_website_analytics_time ON public.website_analytics(visit_timestamp);

-- ─────────────────────────────────────────────────────────────
-- Table 7: funnel_events
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.funnel_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_step ON public.funnel_events(step);
CREATE INDEX IF NOT EXISTS idx_funnel_events_session ON public.funnel_events(session_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_created ON public.funnel_events(created_at);

-- ─────────────────────────────────────────────────────────────
-- Table 8: website_versions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.website_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES public.birthday_websites(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  person_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  birthday_date DATE NOT NULL,
  birthday_message TEXT NOT NULL,
  template_id TEXT NOT NULL,
  music_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_website_versions_website ON public.website_versions(website_id);

-- ─────────────────────────────────────────────────────────────
-- Table 9: coupons
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  min_order_value DECIMAL(10, 2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- ─────────────────────────────────────────────────────────────
-- Table 10: coupon_usages
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_user ON public.coupon_usages(coupon_id, user_id);

-- ─────────────────────────────────────────────────────────────
-- Table 11: ai_usage
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  website_id UUID REFERENCES public.birthday_websites(id) ON DELETE SET NULL,
  used_today INTEGER NOT NULL DEFAULT 0,
  reset_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage(user_id);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security (RLS) Policies
-- ─────────────────────────────────────────────────────────────

-- Enable RLS on all user-owned tables
ALTER TABLE public.birthday_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own websites" ON public.birthday_websites
  FOR SELECT USING (auth.uid()::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own websites" ON public.birthday_websites
  FOR INSERT WITH CHECK (auth.uid()::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update own websites" ON public.birthday_websites
  FOR UPDATE USING (auth.uid()::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete own websites" ON public.birthday_websites
  FOR DELETE USING (auth.uid()::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()));

-- Photo memories inherit from websites
CREATE POLICY "Users can view own photo memories" ON public.photo_memories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.birthday_websites 
      WHERE birthday_websites.id = photo_memories.website_id
      AND birthday_websites.user_id::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own photo memories" ON public.photo_memories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.birthday_websites 
      WHERE birthday_websites.id = photo_memories.website_id
      AND birthday_websites.user_id::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid())
    )
  );

-- Orders are user-specific
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid()::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid()::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()));

-- AI usage is user-specific
CREATE POLICY "Users can view own ai usage" ON public.ai_usage
  FOR SELECT USING (auth.uid()::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert own ai usage" ON public.ai_usage
  FOR INSERT WITH CHECK (auth.uid()::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()));

-- Admin bypass policies (use service role key)
CREATE POLICY "Admin bypass websites" ON public.birthday_websites
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()) AND role = 'admin'));

CREATE POLICY "Admin bypass orders" ON public.orders
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()) AND role = 'admin'));

CREATE POLICY "Admin bypass ai_usage" ON public.ai_usage
  FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()) AND role = 'admin'));

-- ─────────────────────────────────────────────────────────────
-- Functions for user profile sync with Supabase Auth
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, name, role, plan, plan_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    'free',
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
