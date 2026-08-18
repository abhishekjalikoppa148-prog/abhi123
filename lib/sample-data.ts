import { TemplateDefinition, MusicTrack, Plan, BirthdayWebsite, Order, User } from './types';

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    originalPrice: 199,
    description: 'Perfect for a simple, cute birthday surprise.',
    maxPhotos: 10,
    features: [
      'Personalized Birthday Website',
      'Basic Templates',
      'Up to 10 High-Res Photos',
      'Personal Birthday Message',
      'Shareable Unique Link',
      'Mobile Optimized Page',
      '30 Days Expiration'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199,
    originalPrice: 399,
    description: 'Most popular! Packed with music, animations & timeline memories.',
    popular: true,
    maxPhotos: 30,
    features: [
      'Everything in Basic',
      'All Premium Templates',
      'Up to 30 High-Res Photos',
      'Background Music Support',
      'Interactive Cake & Candle Blowing',
      'Particle Fireworks & Confetti',
      'Memory Photo Timeline & Polaroid Layout',
      '1 Year Access'
    ]
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 299,
    originalPrice: 599,
    description: 'The ultimate luxury birthday experience with lifetime access & AI.',
    maxPhotos: 100,
    features: [
      'Everything in Premium',
      'Unlimited Photos & Video Embeds',
      'AI Message Writer ✨',
      'Custom Colors & Fonts',
      'Downloadable QR Code',
      'Custom Opening Gift Box Reveal',
      'Lifetime Access & No Ads',
      'Priority Customer Support'
    ]
  }
];

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'romantic',
    name: 'Romantic Heart',
    description: 'Deep crimson & soft rose glow for romantic partners.',
    badge: '❤️ Popular for Couples',
    bgGradient: 'from-rose-950 via-purple-950 to-slate-950',
    cardStyle: 'bg-rose-900/20 border-rose-500/30 text-rose-100',
    accent: '#f43f5e',
    previewImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    iconName: 'Heart'
  },
  {
    id: 'bestfriend',
    name: 'Bestie Blast',
    description: 'Vibrant neon purple & golden yellow for best friends.',
    badge: '🎉 Best Friend Favorite',
    bgGradient: 'from-violet-950 via-fuchsia-950 to-slate-950',
    cardStyle: 'bg-purple-900/20 border-purple-500/30 text-purple-100',
    accent: '#a855f7',
    previewImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop',
    iconName: 'Sparkles'
  },
  {
    id: 'family',
    name: 'Family Warmth',
    description: 'Warm gold & emerald tones for family members.',
    badge: '🏡 Family & Parents',
    bgGradient: 'from-amber-950 via-stone-900 to-slate-950',
    cardStyle: 'bg-amber-900/20 border-amber-500/30 text-amber-100',
    accent: '#f59e0b',
    previewImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop',
    iconName: 'Home'
  },
  {
    id: 'cute',
    name: 'Cute Teddy',
    description: 'Soft pastel pinks & baby blue for cute surprises.',
    badge: '🧸 Cute & Sweet',
    bgGradient: 'from-pink-950 via-rose-950 to-indigo-950',
    cardStyle: 'bg-pink-900/20 border-pink-500/30 text-pink-100',
    accent: '#ec4899',
    previewImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop',
    iconName: 'Gift'
  },
  {
    id: 'elegant',
    name: 'Royal Elegance',
    description: 'Deep navy, obsidian & gold sparkles for sophisticated vibes.',
    badge: '✨ Luxury & Royal',
    bgGradient: 'from-slate-950 via-slate-900 to-blue-950',
    cardStyle: 'bg-slate-900/40 border-amber-400/30 text-amber-100',
    accent: '#fbbf24',
    previewImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop',
    iconName: 'Crown'
  },
  {
    id: 'modern',
    name: 'Modern Cyber',
    description: 'Futuristic cyan, violet neon grid for tech & modern lovers.',
    badge: '🌌 Sleek & Modern',
    bgGradient: 'from-cyan-950 via-indigo-950 to-slate-950',
    cardStyle: 'bg-cyan-900/20 border-cyan-500/30 text-cyan-100',
    accent: '#06b6d4',
    previewImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop',
    iconName: 'Zap'
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    description: 'Monochrome dark aesthetic with crisp typography.',
    badge: '🎂 Minimalist',
    bgGradient: 'from-zinc-950 via-neutral-900 to-zinc-950',
    cardStyle: 'bg-zinc-900/30 border-zinc-700 text-zinc-100',
    accent: '#e4e4e7',
    previewImage: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop',
    iconName: 'Feather'
  },
  {
    id: 'party',
    name: 'Carnival Party',
    description: 'Rainbow fiesta, confetti bombs & disco energy for wild birthdays.',
    badge: '🥳 Party & Festival',
    bgGradient: 'from-amber-950 via-rose-950 to-indigo-950',
    cardStyle: 'bg-amber-900/20 border-rose-500/30 text-amber-100',
    accent: '#f43f5e',
    previewImage: 'https://images.unsplash.com/photo-1496843916299-590983e7d9b6?w=600&auto=format&fit=crop',
    iconName: 'PartyPopper'
  },
  {
    id: 'pink-gold',
    name: 'Royal Pink & Gold',
    description: 'Soft cream, romantic pink, elegant royal purple & gold sparkles.',
    badge: '👑 Premium Flagship',
    bgGradient: 'from-[#FFF8F0] via-[#FFE4E8] to-[#F3E8FF]',
    cardStyle: 'bg-white/80 border-pink-300 shadow-xl text-[#2D1B36]',
    accent: '#F5C542',
    previewImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop',
    iconName: 'Sparkles'
  },
  // New templates from celebrationcraft
  {
    id: 'romantic-hearts',
    name: 'Romantic Hearts & Rose',
    description: 'Soft pinks, floating hearts, and elegant floral accents perfect for loved ones.',
    badge: '🌹 Popular',
    bgGradient: 'from-rose-50 via-pink-50 to-amber-50',
    cardStyle: 'bg-white/80 border-rose-300 shadow-xl text-rose-900',
    accent: '#e11d48',
    previewImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    iconName: 'Heart'
  },
  {
    id: 'royal-midnight',
    name: 'Royal Midnight Gold',
    description: 'Sophisticated deep navy paired with shimmering gold for milestones and galas.',
    badge: '👑 Milestone',
    bgGradient: 'from-slate-900 via-indigo-950 to-blue-900',
    cardStyle: 'bg-slate-900/40 border-amber-400/30 text-amber-100',
    accent: '#1e3a8a',
    previewImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    iconName: 'Crown'
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow Celebration',
    description: 'Vibrant neon gradients, energetic sparkles, and modern party vibes.',
    badge: '✨ Trending',
    bgGradient: 'from-purple-950 via-slate-900 to-cyan-950',
    cardStyle: 'bg-purple-900/20 border-cyan-500/30 text-cyan-100',
    accent: '#7c3aed',
    previewImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    iconName: 'Zap'
  },
  {
    id: 'magical-fairyland',
    name: 'Magical Fairyland',
    description: 'Playful confetti, bright cheerful tones, and whimsical animations for kids.',
    badge: '🧸 Kids Favorite',
    bgGradient: 'from-amber-50 via-orange-50 to-yellow-50',
    cardStyle: 'bg-white/80 border-orange-300 shadow-xl text-orange-900',
    accent: '#f97316',
    previewImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    iconName: 'Sparkles'
  },
  {
    id: 'minimalist-mono',
    name: 'Minimalist Monochrome',
    description: 'Ultra-clean editorial layouts, spacious typography, and modern aesthetics.',
    badge: '⚫ Minimal',
    bgGradient: 'from-neutral-50 via-stone-50 to-zinc-100',
    cardStyle: 'bg-white/80 border-zinc-300 shadow-xl text-zinc-900',
    accent: '#18181b',
    previewImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    iconName: 'Feather'
  },
  {
    id: 'golden-jubilee',
    name: 'Golden Jubilee Sparkle',
    description: 'Glittering champagne sparkles and rich warm tones for 30th, 40th, 50th birthdays.',
    badge: '🥂 Luxury',
    bgGradient: 'from-amber-950 via-stone-900 to-yellow-950',
    cardStyle: 'bg-amber-900/20 border-yellow-400/30 text-yellow-100',
    accent: '#d97706',
    previewImage: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=800&q=80',
    iconName: 'Sparkles'
  }
];

export const DEFAULT_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Happy Acoustic Birthday',
    artist: 'Celebration Studio',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c874df12.mp3?filename=happy-birthday-acoustic-10490.mp3',
    isDefault: true
  },
  {
    id: 'track-2',
    title: 'Romantic Piano Serenade',
    artist: 'Melody Hearts',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3'
  },
  {
    id: 'track-3',
    title: 'Celebration Pop Dance',
    artist: 'Party Beats',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=energetic-hip-hop-18342.mp3'
  },
  {
    id: 'track-4',
    title: 'Warm Sunset Lofi Chill',
    artist: 'Chillout Lounge',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f73a3e.mp3?filename=lofi-study-112191.mp3'
  }
];

export const INITIAL_USER: User = {
  id: 'user-demo-1',
  name: 'Abhishek',
  email: 'abhishek@example.com',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
  createdAt: '2026-07-15',
  notificationsEnabled: true
};

export const INITIAL_ADMIN: User = {
  id: 'user-admin-1',
  name: 'Abhishek Admin',
  email: 'admin@celebrationcraft.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  createdAt: '2026-01-01',
  notificationsEnabled: true
};

export const INITIAL_WEBSITES: BirthdayWebsite[] = [
  {
    id: 'site-rohan-9821',
    slug: 'rohan-special-24',
    userId: 'user-demo-1',
    creatorName: 'Abhishek',
    personName: 'Rohan Mehta',
    personNickname: 'Rohu',
    personAge: 24,
    birthdayDate: '2026-08-15',
    relationship: 'Best Friend',
    favColor: '#8b5cf6',
    favSong: 'Levitating by Dua Lipa',
    favFood: 'Pepperoni Pizza & Tacos',
    favPlace: 'Goa Beaches',
    hobbies: ['Guitar', 'Photography', 'Road Trips'],
    personality: 'Energetic, hilarious, loyal',
    birthdayMessage: `Happy 24th Birthday Rohan! 🎉\n\nFrom late-night coding sessions to endless road trips to Goa, you've been the absolute best friend anyone could ever ask for.\n\nKeep shining bro! Blow out those candles and let's celebrate! 🥂✨`,
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop',
        caption: 'Our epic Goa trip memory! 🏖️',
        date: 'March 2025',
        memoryNote: 'The sunset at Anjuna beach was unforgettable.'
      },
      {
        id: 'p2',
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop',
        caption: 'Late night jam session 🎸',
        date: 'November 2025',
        memoryNote: 'Playing acoustic guitar till 3 AM!'
      },
      {
        id: 'p3',
        url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop',
        caption: 'Graduation Day triumph 🎓',
        date: 'June 2024'
      }
    ],
    music: DEFAULT_MUSIC_TRACKS[0],
    templateId: 'bestfriend',
    customizations: {
      accentColor: '#a855f7',
      fontStyle: 'outfit',
      bgAnimation: 'confetti',
      buttonStyle: 'glow',
      photoLayout: 'polaroid',
      showAge: true,
      enableMusic: true,
      autostartMusic: false
    },
    planId: 'premium',
    paymentStatus: 'paid',
    paymentId: 'pay_Nz983210492',
    views: 142,
    createdAt: '2026-08-01',
    expiresAt: '2027-08-01'
  },
  {
    id: 'site-ananya-4412',
    slug: 'ananya-my-love',
    userId: 'user-demo-1',
    creatorName: 'Abhishek',
    personName: 'Ananya Roy',
    personNickname: 'Anu',
    personAge: 22,
    birthdayDate: '2026-08-20',
    relationship: 'Partner',
    favColor: '#f43f5e',
    favSong: 'Perfect by Ed Sheeran',
    favFood: 'Red Velvet Cake & Pasta',
    favPlace: 'Manali Hills',
    hobbies: ['Painting', 'Coffee Brewing', 'Reading'],
    birthdayMessage: `To my love Ananya ❤️\n\nHappy Birthday my darling. You fill my world with warmth, laughter, and endless sweetness. Thank you for being my constant happy place. Today and every day is all about celebrating YOU! 🌹✨`,
    photos: [
      {
        id: 'p4',
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop',
        caption: 'Coffee date at the hill top ☕',
        date: 'January 2026'
      },
      {
        id: 'p5',
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop',
        caption: 'Starry night laughs ✨',
        date: 'December 2025'
      }
    ],
    music: DEFAULT_MUSIC_TRACKS[1],
    templateId: 'romantic',
    customizations: {
      accentColor: '#f43f5e',
      fontStyle: 'playfair',
      bgAnimation: 'hearts',
      buttonStyle: 'pill',
      photoLayout: 'gallery',
      showAge: true,
      enableMusic: true,
      autostartMusic: false
    },
    planId: 'ultimate',
    paymentStatus: 'paid',
    paymentId: 'pay_Kz719204912',
    views: 389,
    createdAt: '2026-08-05',
    expiresAt: '2099-12-31'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    userId: 'user-demo-1',
    userName: 'Abhishek',
    userEmail: 'abhishek@example.com',
    websiteId: 'site-rohan-9821',
    websiteSlug: 'rohan-special-24',
    personName: 'Rohan Mehta',
    planId: 'premium',
    planName: 'Premium Plan',
    amount: 199,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentId: 'pay_Nz983210492',
    status: 'completed',
    createdAt: '2026-08-01 14:32:00'
  },
  {
    id: 'ORD-4412',
    userId: 'user-demo-1',
    userName: 'Abhishek',
    userEmail: 'abhishek@example.com',
    websiteId: 'site-ananya-4412',
    websiteSlug: 'ananya-my-love',
    personName: 'Ananya Roy',
    planId: 'ultimate',
    planName: 'Ultimate Lifetime Plan',
    amount: 299,
    currency: 'INR',
    paymentMethod: 'card',
    paymentId: 'pay_Kz719204912',
    status: 'completed',
    createdAt: '2026-08-05 18:10:00'
  }
];
