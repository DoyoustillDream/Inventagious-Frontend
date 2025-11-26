'use client';

import { useEffect } from 'react';
import { analytics, usePerformanceTracking, useErrorTracking } from '@/lib/analytics';

/**
 * Analytics Initializer Component
 * Initializes analytics and tracks page views, performance, and errors
 * 
 * Note: usePageView is called conditionally to avoid usePathname issues during build
 */
export default function AnalyticsInitializer() {
  // Initialize analytics on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      analytics.init();
      
      // Track initial page view manually to avoid usePathname during build
      const pathname = window.location.pathname;
      if (pathname) {
        analytics.recordPageView({
          pagePath: pathname,
          pageTitle: document.title || '',
          referrer: document.referrer || undefined,
        });
      }
    }
  }, []);

  // Track page navigation changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname) {
        analytics.recordPageView({
          pagePath: pathname,
          pageTitle: document.title || '',
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track performance
  usePerformanceTracking();

  // Track errors
  useErrorTracking();

  return null; // This component doesn't render anything
}

