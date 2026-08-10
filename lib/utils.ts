export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}-${random}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getDaysUntil(date: string): number {
  const target = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isExpired(date: string): boolean {
  return new Date(date) < new Date();
}

export function calculateExpirationDate(planId: string): string {
  const now = new Date();
  switch (planId) {
    case 'basic':
      now.setDate(now.getDate() + 30);
      break;
    case 'premium':
      now.setFullYear(now.getFullYear() + 1);
      break;
    case 'ultimate':
      now.setFullYear(now.getFullYear() + 100); // Lifetime
      break;
    default:
      now.setFullYear(now.getFullYear() + 1);
  }
  return now.toISOString().split('T')[0];
}
