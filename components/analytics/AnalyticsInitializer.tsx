'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

/**
 * Analytics Initializer Component
 * Initializes comprehensive analytics tracking including page views, clicks, sessions, and geolocation
 */
export default function AnalyticsInitializer() {
  // Initialize analytics hook - this handles all tracking automatically
  useAnalytics();

  return null; // This component doesn't render anything
}

