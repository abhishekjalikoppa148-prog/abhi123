export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  notificationsEnabled?: boolean;
}

export interface PhotoMemory {
  id: string;
  url: string;
  caption: string;
  date?: string;
  memoryNote?: string;
  uploadedBy?: string;
  likes?: number;
}

// New types from celebrationcraft
export interface GuestbookEntry {
  id: string;
  authorName: string;
  relationship: string;
  message: string;
  timestamp: string;
  avatarUrl?: string;
  sticker?: string;
  likes: number;
}

export interface RsvpEntry {
  id: string;
  guestName: string;
  email: string;
  status: 'attending' | 'declined' | 'maybe';
  partySize: number;
  dietaryRestrictions?: string;
  timestamp: string;
  wishesNote?: string;
}

export interface GiftLink {
  title: string;
  url: string;
  icon?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  isDefault?: boolean;
}

export type TemplateId = 
  | 'romantic' 
  | 'bestfriend' 
  | 'family' 
  | 'cute' 
  | 'elegant' 
  | 'modern' 
  | 'minimal' 
  | 'party'
  | 'pink-gold'
  | 'romantic-hearts'
  | 'royal-midnight'
  | 'neon-glow'
  | 'magical-fairyland'
  | 'minimalist-mono'
  | 'golden-jubilee';

export interface Customizations {
  accentColor: string;
  fontStyle: string; // 'outfit' | 'playfair' | 'inter' | 'caveat' | 'dancing'
  bgAnimation: 'confetti' | 'fireworks' | 'balloons' | 'sparkles' | 'hearts' | 'floating';
  buttonStyle: 'rounded' | 'pill' | 'glow' | 'gradient';
  photoLayout: 'polaroid' | 'gallery' | 'timeline' | 'slideshow';
  showAge: boolean;
  enableMusic: boolean;
  autostartMusic: boolean;
}

export type PlanId = 'basic' | 'premium' | 'ultimate';

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // in INR
  originalPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  maxPhotos: number;
}

export interface BirthdayWebsite {
  id: string;
  slug: string;
  userId: string;
  creatorName: string;
  personName: string;
  personNickname?: string;
  personAge?: number;
  birthdayDate: string; // YYYY-MM-DD
  relationship: string; // Partner, Best Friend, Sister, Mom, Brother, Friend, etc.
  favColor?: string;
  favSong?: string;
  favFood?: string;
  favPlace?: string;
  hobbies?: string[];
  personality?: string;
  customInfo?: string;
  
  birthdayMessage: string;
  photos: PhotoMemory[];
  music: MusicTrack;
  templateId: TemplateId;
  customizations: Customizations;
  
  // New fields from celebrationcraft merge
  guestbookEntries?: GuestbookEntry[];
  rsvpList?: RsvpEntry[];
  giftLinks?: GiftLink[];
  
  /** Feature visibility flags — controls which sections render on the public page */
  features?: {
    countdown: boolean;
    guestbook: boolean;
    rsvp: boolean;
    photoGallery: boolean;
    music: boolean;
    giftRegistry: boolean;
  };
  
  planId: PlanId;
  paymentStatus: 'unpaid' | 'paid' | 'verified';
  paymentId?: string;
  views: number;
  createdAt: string;
  expiresAt: string;
}

export interface Order {
  id: string; // e.g. ORD-9821
  userId: string;
  userName: string;
  userEmail: string;
  websiteId: string;
  websiteSlug: string;
  personName: string;
  planId: PlanId;
  planName: string;
  amount: number;
  currency: string;
  paymentMethod: 'upi' | 'card' | 'netbanking';
  paymentId: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
  receiptUrl?: string;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  badge: string;
  bgGradient: string;
  cardStyle: string;
  accent: string;
  previewImage: string;
  iconName: string;
}
