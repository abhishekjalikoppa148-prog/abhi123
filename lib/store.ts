import { User, BirthdayWebsite, Order, PlanId } from './types';
import { INITIAL_USER, INITIAL_ADMIN, INITIAL_WEBSITES, INITIAL_ORDERS, PLANS } from './sample-data';

const STORAGE_KEYS = {
  CURRENT_USER: 'bday_saas_current_user',
  USERS: 'bday_saas_users',
  WEBSITES: 'bday_saas_websites',
  ORDERS: 'bday_saas_orders',
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function initStorage() {
  if (!isClient()) return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([INITIAL_USER, INITIAL_ADMIN]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WEBSITES)) {
    localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(INITIAL_WEBSITES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USER));
  }
}

// User & Auth
export function getCurrentUser(): User | null {
  if (!isClient()) return INITIAL_USER;
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user: User | null) {
  if (!isClient()) return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function loginUser(email: string): User {
  initStorage();
  const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  const users: User[] = rawUsers ? JSON.parse(rawUsers) : [INITIAL_USER, INITIAL_ADMIN];
  
  let existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!existing) {
    const isNextAdmin = email.toLowerCase().includes('admin');
    existing = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email: email,
      role: isNextAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString().split('T')[0],
      notificationsEnabled: true
    };
    users.push(existing);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  setCurrentUser(existing);
  return existing;
}

export function signupUser(name: string, email: string): User {
  initStorage();
  const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  const users: User[] = rawUsers ? JSON.parse(rawUsers) : [INITIAL_USER, INITIAL_ADMIN];
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: 'user',
    createdAt: new Date().toISOString().split('T')[0],
    notificationsEnabled: true
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  setCurrentUser(newUser);
  return newUser;
}

export function logoutUser() {
  setCurrentUser(null);
}

// Birthday Websites
export function getWebsites(userId?: string): BirthdayWebsite[] {
  if (!isClient()) return INITIAL_WEBSITES;
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.WEBSITES);
  const websites: BirthdayWebsite[] = raw ? JSON.parse(raw) : INITIAL_WEBSITES;
  
  if (userId) {
    return websites.filter(w => w.userId === userId);
  }
  return websites;
}

export function getWebsiteByIdOrSlug(identifier: string): BirthdayWebsite | null {
  if (!isClient()) {
    return INITIAL_WEBSITES.find(w => w.id === identifier || w.slug === identifier) || INITIAL_WEBSITES[0];
  }
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.WEBSITES);
  const websites: BirthdayWebsite[] = raw ? JSON.parse(raw) : INITIAL_WEBSITES;
  return websites.find(w => w.id === identifier || w.slug === identifier) || null;
}

export function saveWebsite(website: BirthdayWebsite): BirthdayWebsite {
  if (!isClient()) return website;
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.WEBSITES);
  const websites: BirthdayWebsite[] = raw ? JSON.parse(raw) : INITIAL_WEBSITES;
  
  // Set default active status (no payment required)
  website.paymentStatus = 'paid';
  
  const index = websites.findIndex(w => w.id === website.id);
  if (index >= 0) {
    websites[index] = website;
  } else {
    websites.unshift(website);
  }
  
  localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(websites));
  return website;
}

export function deleteWebsite(id: string) {
  if (!isClient()) return;
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.WEBSITES);
  const websites: BirthdayWebsite[] = raw ? JSON.parse(raw) : INITIAL_WEBSITES;
  const filtered = websites.filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(filtered));
}

export function incrementViews(identifier: string) {
  if (!isClient()) return;
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.WEBSITES);
  const websites: BirthdayWebsite[] = raw ? JSON.parse(raw) : INITIAL_WEBSITES;
  const target = websites.find(w => w.id === identifier || w.slug === identifier);
  if (target) {
    target.views = (target.views || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(websites));
  }
}

// Daily Free Usage Limit (3 websites per day)
export const DAILY_FREE_LIMIT = 3;
const DAILY_USAGE_KEY = 'bday_saas_daily_usage';

export interface DailyUsageInfo {
  date: string;
  count: number;
  max: number;
  remaining: number;
  isLimitReached: boolean;
}

export function getDailyUsageInfo(): DailyUsageInfo {
  if (!isClient()) {
    return { date: '', count: 0, max: DAILY_FREE_LIMIT, remaining: DAILY_FREE_LIMIT, isLimitReached: false };
  }
  const todayStr = new Date().toISOString().split('T')[0];
  const raw = localStorage.getItem(DAILY_USAGE_KEY);
  if (!raw) {
    return { date: todayStr, count: 0, max: DAILY_FREE_LIMIT, remaining: DAILY_FREE_LIMIT, isLimitReached: false };
  }
  try {
    const data = JSON.parse(raw);
    if (data.date !== todayStr) {
      return { date: todayStr, count: 0, max: DAILY_FREE_LIMIT, remaining: DAILY_FREE_LIMIT, isLimitReached: false };
    }
    const count = typeof data.count === 'number' ? data.count : 0;
    const remaining = Math.max(0, DAILY_FREE_LIMIT - count);
    return {
      date: todayStr,
      count,
      max: DAILY_FREE_LIMIT,
      remaining,
      isLimitReached: count >= DAILY_FREE_LIMIT,
    };
  } catch {
    return { date: todayStr, count: 0, max: DAILY_FREE_LIMIT, remaining: DAILY_FREE_LIMIT, isLimitReached: false };
  }
}

export function incrementDailyUsage(): DailyUsageInfo {
  if (!isClient()) {
    return { date: '', count: 0, max: DAILY_FREE_LIMIT, remaining: DAILY_FREE_LIMIT, isLimitReached: false };
  }
  const current = getDailyUsageInfo();
  const todayStr = new Date().toISOString().split('T')[0];
  const newCount = current.count + 1;
  const newData = { date: todayStr, count: newCount };
  localStorage.setItem(DAILY_USAGE_KEY, JSON.stringify(newData));
  return {
    date: todayStr,
    count: newCount,
    max: DAILY_FREE_LIMIT,
    remaining: Math.max(0, DAILY_FREE_LIMIT - newCount),
    isLimitReached: newCount >= DAILY_FREE_LIMIT,
  };
}

export function publishWebsiteDirectly(website: BirthdayWebsite): BirthdayWebsite {
  const dailyInfo = getDailyUsageInfo();
  if (dailyInfo.isLimitReached) {
    website.paymentStatus = 'unpaid';
    return saveWebsite(website);
  }
  incrementDailyUsage();
  website.paymentStatus = 'paid';
  website.paymentId = `free_pub_${Math.random().toString(36).substring(2, 9)}`;
  return saveWebsite(website);
}

// Orders & Receipts
export function getOrders(userId?: string): Order[] {
  if (!isClient()) return INITIAL_ORDERS;
  initStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const orders: Order[] = raw ? JSON.parse(raw) : INITIAL_ORDERS;
  if (userId) {
    return orders.filter(o => o.userId === userId);
  }
  return orders;
}

export function createAndVerifyOrder(
  websiteId: string,
  planId: PlanId,
  paymentMethod: 'upi' | 'card' | 'netbanking'
): { order: Order; website: BirthdayWebsite } {
  initStorage();
  const user = getCurrentUser() || INITIAL_USER;
  const websites = getWebsites();
  const targetWebsite = websites.find(w => w.id === websiteId);
  
  if (!targetWebsite) {
    throw new Error('Website not found');
  }

  const selectedPlan = PLANS.find(p => p.id === planId) || PLANS[1];
  const paymentId = `free_pub_${Math.random().toString(36).substring(2, 11)}`;
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    id: orderId,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    websiteId: targetWebsite.id,
    websiteSlug: targetWebsite.slug,
    personName: targetWebsite.personName,
    planId: planId,
    planName: selectedPlan.name,
    amount: 0,
    currency: 'INR',
    paymentMethod,
    paymentId,
    status: 'completed',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    receiptUrl: `/orders/receipt/${orderId}`
  };

  const rawOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const orders: Order[] = rawOrders ? JSON.parse(rawOrders) : INITIAL_ORDERS;
  orders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  targetWebsite.paymentStatus = 'paid';
  targetWebsite.paymentId = paymentId;
  targetWebsite.planId = planId;
  saveWebsite(targetWebsite);

  return { order: newOrder, website: targetWebsite };
}

// Admin Stats
export function getAdminStats() {
  if (!isClient()) {
    return {
      totalUsers: 142,
      totalWebsites: 289,
      totalRevenue: 0,
      todaysSales: 0,
      activeWebsites: 289,
      failedPayments: 0,
      totalViews: 14820
    };
  }
  initStorage();
  const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  const users: User[] = rawUsers ? JSON.parse(rawUsers) : [INITIAL_USER, INITIAL_ADMIN];
  
  const rawWebsites = localStorage.getItem(STORAGE_KEYS.WEBSITES);
  const websites: BirthdayWebsite[] = rawWebsites ? JSON.parse(rawWebsites) : INITIAL_WEBSITES;
  
  const totalViews = websites.reduce((sum, w) => sum + (w.views || 0), 0);

  return {
    totalUsers: users.length,
    totalWebsites: websites.length,
    totalRevenue: 0,
    todaysSales: 0,
    activeWebsites: websites.length,
    failedPayments: 0,
    totalViews
  };
}
