/**
 * Analytics utility functions for device detection and session management
 */

/**
 * Get device type from user agent
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Get browser name from user agent
 */
export function getBrowser(): string {
  if (typeof window === 'undefined') return 'Unknown';

  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Unknown';
}

/**
 * Get OS from user agent
 */
export function getOS(): string {
  if (typeof window === 'undefined') return 'Unknown';

  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
}

/**
 * Generate or retrieve session ID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  const storageKey = 'analytics_session_id';
  const sessionExpiry = 30 * 60 * 1000; // 30 minutes

  const stored = sessionStorage.getItem(storageKey);
  if (stored) {
    try {
      // Validate that the stored value is valid JSON
      const parsed = JSON.parse(stored);
      
      // Validate the structure of the parsed data
      if (parsed && typeof parsed === 'object' && parsed.sessionId && typeof parsed.timestamp === 'number') {
        if (Date.now() - parsed.timestamp < sessionExpiry) {
          return parsed.sessionId;
        }
      }
    } catch (error) {
      // If JSON parsing fails or data structure is invalid, clear the corrupted data
      sessionStorage.removeItem(storageKey);
    }
  }

  // Generate new session ID
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem(
    storageKey,
    JSON.stringify({
      sessionId,
      timestamp: Date.now(),
    }),
  );
  return sessionId;
}

/**
 * Get user's geolocation (with permission)
 */
export function getGeolocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // User denied or error occurred
        resolve(null);
      },
      {
        timeout: 5000,
        maximumAge: 60000, // Cache for 1 minute
      },
    );
  });
}

/**
 * Get referrer URL
 */
export function getReferrer(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return document.referrer || undefined;
}

