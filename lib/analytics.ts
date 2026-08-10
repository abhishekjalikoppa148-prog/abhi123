export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  countryBreakdown: Record<string, number>;
  recentVisits: Array<{
    deviceType: string;
    browser: string;
    country: string | null;
    visitTimestamp: string;
  }>;
}

export async function trackVisit(slug: string, deviceType?: string, browser?: string, country?: string, referrer?: string) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, deviceType, browser, country, referrer })
    });
  } catch (error) {
    console.error('Failed to track visit:', error);
  }
}

export function getDeviceInfo() {
  const ua = navigator.userAgent;
  let deviceType = 'desktop';
  let browser = 'unknown';

  // Detect device type
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/Tablet/i.test(ua)) {
    deviceType = 'tablet';
  }

  // Detect browser
  if (ua.includes('Chrome')) browser = 'chrome';
  else if (ua.includes('Firefox')) browser = 'firefox';
  else if (ua.includes('Safari')) browser = 'safari';
  else if (ua.includes('Edge')) browser = 'edge';

  return { deviceType, browser };
}

export function getCountryFromIP(): Promise<string | null> {
  // In production, use a geolocation API
  return Promise.resolve(null);
}
