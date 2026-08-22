-- ============================================================
-- CelebrationCraft — Content Library Migration
-- Migration: 002_content_library
-- Description: Admin-controlled content library for music, photos, and themes
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Table 1: content_library_music
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.content_library_music (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  genre TEXT,
  mood TEXT,
  category TEXT CHECK (category IN ('birthday', 'celebration', 'romantic', 'fun', 'chill', 'energetic', 'classical')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for music library
CREATE INDEX IF NOT EXISTS idx_content_music_active ON public.content_library_music(is_active);
CREATE INDEX IF NOT EXISTS idx_content_music_category ON public.content_library_music(category);
CREATE INDEX IF NOT EXISTS idx_content_music_sort ON public.content_library_music(sort_order);

-- Trigger for updated_at
CREATE TRIGGER update_content_library_music_updated_at BEFORE UPDATE ON public.content_library_music
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Table 2: content_library_photos
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.content_library_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT CHECK (category IN ('background', 'decoration', 'overlay', 'frame', 'sticker')),
  tags TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for photo library
CREATE INDEX IF NOT EXISTS idx_content_photos_active ON public.content_library_photos(is_active);
CREATE INDEX IF NOT EXISTS idx_content_photos_category ON public.content_library_photos(category);
CREATE INDEX IF NOT EXISTS idx_content_photos_tags ON public.content_library_photos USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_photos_sort ON public.content_library_photos(sort_order);

-- Trigger for updated_at
CREATE TRIGGER update_content_library_photos_updated_at BEFORE UPDATE ON public.content_library_photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Table 3: content_library_themes
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.content_library_themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  bg_gradient TEXT NOT NULL,
  card_style TEXT NOT NULL,
  accent TEXT NOT NULL,
  preview_image TEXT NOT NULL,
  icon_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for theme library
CREATE INDEX IF NOT EXISTS idx_content_themes_active ON public.content_library_themes(is_active);
CREATE INDEX IF NOT EXISTS idx_content_themes_sort ON public.content_library_themes(sort_order);

-- Trigger for updated_at
CREATE TRIGGER update_content_library_themes_updated_at BEFORE UPDATE ON public.content_library_themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- Row Level Security (RLS) Policies for Content Library
-- ─────────────────────────────────────────────────────────────

-- Enable RLS on content library tables
ALTER TABLE public.content_library_music ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_library_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_library_themes ENABLE ROW LEVEL SECURITY;

-- Music library policies (admin only)
CREATE POLICY "Admin can manage music library" ON public.content_library_music
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Public can read active music" ON public.content_library_music
  FOR SELECT USING (is_active = true);

-- Photo library policies (admin only)
CREATE POLICY "Admin can manage photo library" ON public.content_library_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Public can read active photos" ON public.content_library_photos
  FOR SELECT USING (is_active = true);

-- Theme library policies (admin only)
CREATE POLICY "Admin can manage theme library" ON public.content_library_themes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = (SELECT id::text FROM public.users WHERE auth_id = auth.uid()) 
      AND role = 'admin'
    )
  );

CREATE POLICY "Public can read active themes" ON public.content_library_themes
  FOR SELECT USING (is_active = true);

-- ─────────────────────────────────────────────────────────────
-- SEED: Existing Content from sample-data.ts
-- ─────────────────────────────────────────────────────────────

-- Seed music tracks
INSERT INTO public.content_library_music (id, title, artist, audio_url, duration_seconds, genre, mood, category, is_active, is_default, sort_order) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Happy Acoustic Birthday',
    'Celebration Studio',
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c874df12.mp3?filename=happy-birthday-acoustic-10490.mp3',
    180,
    'acoustic',
    'happy',
    'birthday',
    true,
    true,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'Romantic Piano Serenade',
    'Melody Hearts',
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
    210,
    'piano',
    'romantic',
    'romantic',
    true,
    false,
    2
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'Celebration Pop Dance',
    'Party Beats',
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=energetic-hip-hop-18342.mp3',
    195,
    'pop',
    'energetic',
    'celebration',
    true,
    false,
    3
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'Warm Sunset Lofi Chill',
    'Chillout Lounge',
    'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f73a3e.mp3?filename=lofi-study-112191.mp3',
    240,
    'lofi',
    'chill',
    'chill',
    true,
    false,
    4
  )
ON CONFLICT DO NOTHING;

-- Seed themes
INSERT INTO public.content_library_themes (id, name, description, badge, bg_gradient, card_style, accent, preview_image, icon_name, is_active, is_premium, sort_order) VALUES
  (
    'pearl-sunset',
    'Pearl Sunset',
    'Elegant pearl ivory with soft champagne gold accents.',
    '✨ Premium Choice',
    'from-[#F8FAFC] via-[#EFF6FF] to-[#FFFFFF]',
    'bg-white/80 border-[#2563EB]/30 shadow-xl text-[#0F172A]',
    '#2563EB',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    'Sparkles',
    true,
    false,
    1
  ),
  (
    'royal-blue',
    'Royal Blue',
    'Modern blue gradient with clean white typography.',
    '🔵 Modern SaaS',
    'from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]',
    'bg-white/80 border-[#2563EB]/30 shadow-xl text-[#0F172A]',
    '#2563EB',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop',
    'Star',
    true,
    false,
    2
  ),
  (
    'rose-garden',
    'Rose Garden',
    'Soft dusty rose with warm ivory elegance.',
    '❤️ Popular for Couples',
    'from-[#FFF9F3] via-[#F7EFE6] to-[#F1D8DC]',
    'bg-white/80 border-[#D98C9A]/30 shadow-xl text-[#43283A]',
    '#D98C9A',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    'Heart',
    true,
    false,
    3
  ),
  (
    'midnight-celebration',
    'Midnight Celebration',
    'Deep blue with champagne gold highlights.',
    '🌙 Elegant Night',
    'from-[#0F172A] via-[#1E293B] to-[#334155]',
    'bg-white/80 border-[#D0A75F]/30 shadow-xl text-[#0F172A]',
    '#D0A75F',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop',
    'Moon',
    true,
    false,
    4
  ),
  (
    'golden-memories',
    'Golden Memories',
    'Warm champagne gold and soft ivory.',
    '🏡 Family & Parents',
    'from-[#FFF9F3] via-[#F5E6C8] to-[#F7EFE6]',
    'bg-white/80 border-[#C9A45C]/30 shadow-xl text-[#43283A]',
    '#C9A45C',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop',
    'Gift',
    true,
    false,
    5
  ),
  (
    'dreamy-pastel',
    'Dreamy Pastel',
    'Soft pastel tones with gentle gradients.',
    '🧸 Cute & Sweet',
    'from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]',
    'bg-white/80 border-[#94A3B8]/30 shadow-xl text-[#0F172A]',
    '#94A3B8',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    'Sparkles',
    true,
    false,
    6
  ),
  (
    'black-gold',
    'Elegant Black & Gold',
    'Luxurious black with champagne gold accents.',
    '✨ Premium Luxury',
    'from-[#0F172A] via-[#1E293B] to-[#0F172A]',
    'bg-white/80 border-[#D0A75F]/30 shadow-xl text-[#0F172A]',
    '#D0A75F',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop',
    'Crown',
    true,
    false,
    7
  ),
  (
    'minimal-love',
    'Minimal Love',
    'Clean minimal design with subtle blue accents.',
    '💙 Minimalist',
    'from-[#FFFFFF] via-[#F8FAFC] to-[#EFF6FF]',
    'bg-white/80 border-[#2563EB]/30 shadow-xl text-[#0F172A]',
    '#2563EB',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    'Heart',
    true,
    false,
    8
  )
ON CONFLICT (id) DO NOTHING;
