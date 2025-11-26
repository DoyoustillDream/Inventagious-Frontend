'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics, usePageView, usePerformanceTracking, useErrorTracking } from '@/lib/analytics';

/**
 * Analytics Initializer Component
 * Initializes analytics and tracks page views, performance, and errors
 */
export default function AnalyticsInitializer() {
  const pathname = usePathname();

  // Initialize analytics on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      analytics.init();
    }
  }, []);

  // Track page views
  usePageView();

  // Track performance
  usePerformanceTracking();

  // Track errors
  useErrorTracking();

  return null; // This component doesn't render anything
}

