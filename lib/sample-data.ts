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
    id: 'pearl-sunset',
    name: 'Pearl Sunset',
    description: 'Elegant pearl ivory with soft champagne gold accents.',
    badge: '✨ Premium Choice',
    bgGradient: 'from-[#F8FAFC] via-[#EFF6FF] to-[#FFFFFF]',
    cardStyle: 'bg-white/80 border-[#2563EB]/30 shadow-xl text-[#0F172A]',
    accent: '#2563EB',
    previewImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    iconName: 'Sparkles'
  },
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    description: 'Modern blue gradient with clean white typography.',
    badge: '🔵 Modern SaaS',
    bgGradient: 'from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]',
    cardStyle: 'bg-white/80 border-[#2563EB]/30 shadow-xl text-[#0F172A]',
    accent: '#2563EB',
    previewImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop',
    iconName: 'Star'
  },
  {
    id: 'rose-garden',
    name: 'Rose Garden',
    description: 'Soft dusty rose with warm ivory elegance.',
    badge: '❤️ Popular for Couples',
    bgGradient: 'from-[#FFF9F3] via-[#F7EFE6] to-[#F1D8DC]',
    cardStyle: 'bg-white/80 border-[#D98C9A]/30 shadow-xl text-[#43283A]',
    accent: '#D98C9A',
    previewImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    iconName: 'Heart'
  },
  {
    id: 'midnight-celebration',
    name: 'Midnight Celebration',
    description: 'Deep blue with champagne gold highlights.',
    badge: '� Elegant Night',
    bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#334155]',
    cardStyle: 'bg-white/80 border-[#D0A75F]/30 shadow-xl text-[#0F172A]',
    accent: '#D0A75F',
    previewImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop',
    iconName: 'Moon'
  },
  {
    id: 'golden-memories',
    name: 'Golden Memories',
    description: 'Warm champagne gold and soft ivory.',
    badge: '🏡 Family & Parents',
    bgGradient: 'from-[#FFF9F3] via-[#F5E6C8] to-[#F7EFE6]',
    cardStyle: 'bg-white/80 border-[#C9A45C]/30 shadow-xl text-[#43283A]',
    accent: '#C9A45C',
    previewImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop',
    iconName: 'Gift'
  },
  {
    id: 'dreamy-pastel',
    name: 'Dreamy Pastel',
    description: 'Soft pastel tones with gentle gradients.',
    badge: '🧸 Cute & Sweet',
    bgGradient: 'from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]',
    cardStyle: 'bg-white/80 border-[#94A3B8]/30 shadow-xl text-[#0F172A]',
    accent: '#94A3B8',
    previewImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    iconName: 'Sparkles'
  },
  {
    id: 'black-gold',
    name: 'Elegant Black & Gold',
    description: 'Luxurious black with champagne gold accents.',
    badge: '✨ Premium Luxury',
    bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#0F172A]',
    cardStyle: 'bg-white/80 border-[#D0A75F]/30 shadow-xl text-[#0F172A]',
    accent: '#D0A75F',
    previewImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop',
    iconName: 'Crown'
  },
  {
    id: 'minimal-love',
    name: 'Minimal Love',
    description: 'Clean minimal design with subtle blue accents.',
    badge: '💙 Minimalist',
    bgGradient: 'from-[#FFFFFF] via-[#F8FAFC] to-[#EFF6FF]',
    cardStyle: 'bg-white/80 border-[#2563EB]/30 shadow-xl text-[#0F172A]',
    accent: '#2563EB',
    previewImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
    iconName: 'Heart'
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
    templateId: 'golden-memories',
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
    templateId: 'rose-garden',
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
