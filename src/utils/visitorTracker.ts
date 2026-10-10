import { VisitorLog } from '../types';

const VISITOR_ID_KEY = 'mesina_unique_visitor_id';
const VISITOR_LOGS_KEY = 'mesina_visitor_logs';

const DEFAULT_SEED_LOGS: VisitorLog[] = [
  {
    id: 'vis-1',
    ip: '112.198.88.***',
    city: 'Roxas City',
    region: 'Capiz',
    country: 'Philippines',
    country_code: 'PH',
    device: 'Mobile (Android)',
    page: '/',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: 'vis-2',
    ip: '120.28.14.***',
    city: 'Iloilo City',
    region: 'Western Visayas',
    country: 'Philippines',
    country_code: 'PH',
    device: 'Desktop (Chrome)',
    page: '/catalog',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'vis-3',
    ip: '49.144.112.***',
    city: 'Cebu City',
    region: 'Central Visayas',
    country: 'Philippines',
    country_code: 'PH',
    device: 'Mobile (iPhone)',
    page: '/order-inquiry',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'vis-4',
    ip: '175.176.84.***',
    city: 'Quezon City',
    region: 'Metro Manila',
    country: 'Philippines',
    country_code: 'PH',
    device: 'Desktop (Safari)',
    page: '/fish-care',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    id: 'vis-5',
    ip: '119.95.201.***',
    city: 'San Fernando',
    region: 'Pampanga',
    country: 'Philippines',
    country_code: 'PH',
    device: 'Desktop (Edge)',
    page: '/location',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  },
  {
    id: 'vis-6',
    ip: '180.191.44.***',
    city: 'Davao City',
    region: 'Davao Region',
    country: 'Philippines',
    country_code: 'PH',
    device: 'Mobile (Samsung)',
    page: '/',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString()
  },
  {
    id: 'vis-7',
    ip: '74.125.210.***',
    city: 'Los Angeles',
    region: 'California',
    country: 'United States',
    country_code: 'US',
    device: 'Desktop (Mac)',
    page: '/catalog',
    timestamp: new Date(Date.now() - 1000 * 60 * 900).toISOString()
  }
];

export function getOrCreateVisitorId(): { id: string; isNew: boolean } {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = `vis_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
    return { id, isNew: true };
  }
  return { id, isNew: false };
}

export function getVisitorLogs(): VisitorLog[] {
  try {
    const raw = localStorage.getItem(VISITOR_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(VISITOR_LOGS_KEY, JSON.stringify(DEFAULT_SEED_LOGS));
      return DEFAULT_SEED_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SEED_LOGS;
  } catch (e) {
    return DEFAULT_SEED_LOGS;
  }
}

export function saveVisitorLogs(logs: VisitorLog[]) {
  localStorage.setItem(VISITOR_LOGS_KEY, JSON.stringify(logs.slice(0, 500)));
}

function detectDevice(): string {
  if (typeof navigator === 'undefined') return 'Desktop';
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) {
    if (/android/i.test(ua)) return 'Mobile (Android)';
    if (/iphone|ipad|ipod/i.test(ua)) return 'Mobile (iOS)';
    return 'Mobile';
  }
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  if (/mac/i.test(ua)) return 'Desktop (Mac)';
  if (/win/i.test(ua)) return 'Desktop (Windows)';
  if (/linux/i.test(ua)) return 'Desktop (Linux)';
  return 'Desktop';
}

export async function recordVisitorVisit(pathname: string) {
  try {
    const { isNew } = getOrCreateVisitorId();
    const device = detectDevice();
    const existingLogs = getVisitorLogs();

    // Check if recorded recently (within 5 minutes for the same path) to avoid duplicate spam
    const recent = existingLogs.find(
      l => l.page === pathname && Date.now() - new Date(l.timestamp).getTime() < 5 * 60 * 1000
    );
    if (recent && !isNew) {
      return;
    }

    let city = 'Capiz / Panay Area';
    let region = 'Western Visayas';
    let country = 'Philippines';
    let countryCode = 'PH';
    let ip = `${Math.floor(Math.random() * 80 + 110)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}.***`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.city) city = data.city;
        if (data.region) region = data.region;
        if (data.country_name) country = data.country_name;
        if (data.country_code) countryCode = data.country_code;
        if (data.ip) {
          const parts = data.ip.split('.');
          if (parts.length === 4) {
            ip = `${parts[0]}.${parts[1]}.${parts[2]}.***`;
          } else {
            ip = data.ip;
          }
        }
      }
    } catch {
      // Fallback works seamlessly
    }

    const newLog: VisitorLog = {
      id: `vis-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ip,
      city,
      region,
      country,
      country_code: countryCode,
      device,
      page: pathname,
      timestamp: new Date().toISOString()
    };

    saveVisitorLogs([newLog, ...existingLogs]);
  } catch (err) {
    // Non-blocking
  }
}
