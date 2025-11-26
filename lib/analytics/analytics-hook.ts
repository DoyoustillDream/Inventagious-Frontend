import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from './analytics.service';

/**
 * Hook to automatically track page views
 */
export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      analytics.recordPageView({
        pagePath: pathname,
        pageTitle: typeof document !== 'undefined' ? document.title : '',
      });
    }
  }, [pathname]);
}

/**
 * Hook to track performance metrics
 */
export function usePerformanceTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Wait for page load
    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
      return () => window.removeEventListener('load', trackPerformance);
    }
  }, []);

  function trackPerformance() {
    if (typeof window === 'undefined' || !window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;

    // Get Web Vitals if available
    let fcp: number | undefined;
    let lcp: number | undefined;
    let cls: number | undefined;
    let fid: number | undefined;

    // Try to get from performance observer if available
    if ('PerformanceObserver' in window) {
      try {
        // First Contentful Paint
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          fcp = fcpEntry.startTime;
        }

        // Largest Contentful Paint
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          lcp = (lcpEntries[lcpEntries.length - 1] as any).renderTime;
        }

        // Cumulative Layout Shift
        const clsEntries = performance.getEntriesByType('layout-shift') as any[];
        if (clsEntries.length > 0) {
          cls = clsEntries.reduce((sum, entry) => sum + (entry.value || 0), 0);
        }
      } catch (e) {
        // Performance observer might not be available
      }
    }

    analytics.recordPerformance({
      loadTime: Math.round(loadTime),
      firstContentfulPaint: fcp ? Math.round(fcp) : undefined,
      largestContentfulPaint: lcp ? Math.round(lcp) : undefined,
      timeToInteractive: domContentLoaded ? Math.round(domContentLoaded) : undefined,
      cumulativeLayoutShift: cls,
      firstInputDelay: fid ? Math.round(fid) : undefined,
    });
  }
}

/**
 * Hook to track errors
 */
export function useErrorTracking() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      analytics.recordError({
        errorType: 'javascript',
        errorMessage: event.message || 'Unknown error',
        errorStack: event.error?.stack,
        userAction: 'page_interaction',
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.recordError({
        errorType: 'javascript',
        errorMessage: event.reason?.message || 'Unhandled promise rejection',
        errorStack: event.reason?.stack,
        userAction: 'async_operation',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

