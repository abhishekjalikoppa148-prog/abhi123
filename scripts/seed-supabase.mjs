import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'mock-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSupabase() {
  console.log('========================================');
  console.log('  SEEDING SUPABASE POSTGRESQL DATABASE  ');
  console.log('========================================\n');

  try {
    // 1. Seed Admin User
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const { error: adminErr } = await supabase.from('users').upsert({
      id: 'user-admin-1',
      name: 'CelebrationCraft Admin',
      email: 'admin@celebrationcraft.com',
      password_hash: adminHash,
      role: 'admin',
      plan: 'ultimate',
      plan_id: 'ultimate',
      plan_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    if (adminErr) {
      console.warn('Admin user seed notice:', adminErr.message);
    } else {
      console.log('✅ Admin user verified: admin@celebrationcraft.com / Admin@123');
    }

    // 2. Seed Demo User
    const userHash = await bcrypt.hash('Password@123', 10);
    const { error: userErr } = await supabase.from('users').upsert({
      id: 'user-demo-1',
      name: 'Abhishek Sharma',
      email: 'test@example.com',
      password_hash: userHash,
      role: 'user',
      plan: 'ultimate',
      plan_id: 'ultimate',
      plan_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    if (userErr) {
      console.warn('Demo user seed notice:', userErr.message);
    } else {
      console.log('✅ Demo user seeded: test@example.com / Password@123');
    }

    // 3. Seed Sample Websites
    const sampleWebsites = [
      {
        id: 'site-rohan-9821',
        slug: 'rohan-special-24',
        user_id: 'user-demo-1',
        creator_name: 'Abhishek',
        person_name: 'Rohan Mehta',
        person_nickname: 'Brohan',
        person_age: 24,
        birthday_date: '2026-08-24',
        relationship: 'Best Friend',
        fav_color: '#3b82f6',
        fav_song: 'Night Changes by One Direction',
        fav_food: 'Wood-fired Pizza & Chai',
        fav_place: 'Goa Beaches',
        hobbies: '["Gaming", "Guitar", "Road Trips"]',
        personality: 'Adventurous & loyal bestie',
        birthday_message: 'Happy 24th Birthday Rohan! From late-night gaming sessions to spontaneous road trips, you have been the absolute best friend anyone could ask for.',
        template_id: 'bestfriend',
        accent_color: '#3b82f6',
        font_style: 'outfit',
        bg_animation: 'confetti',
        button_style: 'glow',
        photo_layout: 'polaroid',
        music_id: 'track-1',
        music_title: 'Happy Birthday Acoustic',
        music_artist: 'Celebration Studio',
        music_audio_url: 'https://assets.mixkit.co/music/preview/mixkit-happy-birthday-acoustic-guitar-478.mp3',
        plan_id: 'premium',
        payment_status: 'paid',
        payment_id: 'pay_Nz983210492',
        views: 142,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
      },
      {
        id: 'site-ananya-4412',
        slug: 'ananya-my-love',
        user_id: 'user-demo-1',
        creator_name: 'Abhishek',
        person_name: 'Ananya Roy',
        person_nickname: 'Anu',
        person_age: 22,
        birthday_date: '2026-08-20',
        relationship: 'Partner',
        fav_color: '#f43f5e',
        fav_song: 'Perfect by Ed Sheeran',
        fav_food: 'Red Velvet Cake & Pasta',
        fav_place: 'Manali Hills',
        hobbies: '["Painting", "Coffee Brewing", "Reading"]',
        personality: 'Sweet, artistic & kind',
        birthday_message: 'To my love Ananya ❤️\n\nHappy Birthday my darling. You fill my world with warmth, laughter, and endless sweetness. Today and every day is all about celebrating YOU!',
        template_id: 'romantic',
        accent_color: '#f43f5e',
        font_style: 'playfair',
        bg_animation: 'hearts',
        button_style: 'pill',
        photo_layout: 'gallery',
        music_id: 'track-2',
        music_title: 'Romantic Piano Glow',
        music_artist: 'Soul Melody',
        music_audio_url: 'https://assets.mixkit.co/music/preview/mixkit-romantic-dinner-piano-651.mp3',
        plan_id: 'ultimate',
        payment_status: 'paid',
        payment_id: 'pay_Kz719204912',
        views: 389,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3650 * 86400000).toISOString(),
      }
    ];

    for (const site of sampleWebsites) {
      const { error: siteErr } = await supabase.from('birthday_websites').upsert(site, { onConflict: 'id' });
      if (siteErr) {
        console.warn(`Website seed notice for ${site.slug}:`, siteErr.message);
      } else {
        console.log(`✅ Seeded website: /birthday/${site.slug}`);
      }
    }

    // 4. Seed Coupon
    const { error: cpnErr } = await supabase.from('coupons').upsert({
      id: 'coupon-welcome-50',
      code: 'WELCOME50',
      discount_type: 'percentage',
      discount_value: 50.00,
      max_uses: 1000,
      used_count: 0,
      min_order_value: 99.00,
      is_active: true,
      created_at: new Date().toISOString(),
    }, { onConflict: 'code' });

    if (cpnErr) {
      console.warn('Coupon seed notice:', cpnErr.message);
    } else {
      console.log('✅ Seeded active coupon: WELCOME50');
    }

    console.log('\nSupabase seeding script completed.');
  } catch (err) {
    console.error('Supabase seed error:', err);
  }
}

seedSupabase();
