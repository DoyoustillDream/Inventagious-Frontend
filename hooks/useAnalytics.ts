'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analyticsApi, type PageViewData, type EventData, type SessionData } from '@/lib/api/analytics';
import {
  getDeviceType,
  getBrowser,
  getOS,
  getSessionId,
  getGeolocation,
  getReferrer,
} from '@/lib/analytics/utils';

let sessionStartTime: number | null = null;
let sessionStartTimeISO: string | null = null;
let pageViewCount = 0;
let actionCount = 0;
let currentPageStartTime: number | null = null;

/**
 * Hook for tracking analytics events
 */
export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const locationRef = useRef<{ latitude: number; longitude: number } | null>(null);

  // Initialize session
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sessionId = getSessionId();
    sessionIdRef.current = sessionId;
    sessionStartTime = Date.now();
    sessionStartTimeISO = new Date().toISOString();
    pageViewCount = 0;
    actionCount = 0;

    // Get user ID from auth token if available
    const token = localStorage.getItem('inventagious_auth_token');
    if (token) {
      try {
        // Decode JWT to get user ID (simple base64 decode)
        const payload = JSON.parse(atob(token.split('.')[1]));
        userIdRef.current = payload.sub || payload.id || null;
      } catch {
        // Ignore decode errors
      }
    }

    // Get geolocation and then record session
    getGeolocation().then((location) => {
      locationRef.current = location;
      
      // Record session start with location
      const sessionData: SessionData = {
        sessionId,
        userId: userIdRef.current || undefined,
        startTime: new Date().toISOString(),
        referrer: getReferrer(),
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        latitude: location?.latitude,
        longitude: location?.longitude,
      };

      analyticsApi.recordSession(sessionData);
    }).catch(() => {
      // If geolocation fails, record session without location
      const sessionData: SessionData = {
        sessionId,
        userId: userIdRef.current || undefined,
        startTime: new Date().toISOString(),
        referrer: getReferrer(),
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
      };

      analyticsApi.recordSession(sessionData);
    });

    // Record session end on page unload
    const handleBeforeUnload = () => {
      if (sessionIdRef.current && sessionStartTime && sessionStartTimeISO) {
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
        analyticsApi.recordSession({
          sessionId: sessionIdRef.current,
          userId: userIdRef.current || undefined,
          startTime: sessionStartTimeISO,
          endTime: new Date().toISOString(),
          duration,
          pageViews: pageViewCount,
          actions: actionCount,
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Track page views
  useEffect(() => {
    if (!sessionIdRef.current || !pathname) return;

    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    currentPageStartTime = Date.now();
    pageViewCount += 1;

    const pageViewData: PageViewData = {
      pagePath: fullPath,
      pageTitle: typeof document !== 'undefined' ? document.title : undefined,
      referrer: getReferrer(),
      sessionId: sessionIdRef.current,
      userId: userIdRef.current || undefined,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
    };

    analyticsApi.recordPageView(pageViewData);

    // Track time on page when leaving
    return () => {
      if (currentPageStartTime) {
        const timeOnPage = Math.floor((Date.now() - currentPageStartTime) / 1000);
        // Could send this as a separate event or update the page view
      }
    };
  }, [pathname, searchParams]);

  /**
   * Track a click event
   */
  const trackClick = useCallback(
    (eventName: string, elementId?: string, elementType?: string, metadata?: Record<string, any>) => {
      if (!sessionIdRef.current || !pathname) return;

      actionCount += 1;

      const eventData: EventData = {
        eventType: 'click',
        eventName,
        elementId,
        elementType,
        pagePath: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
        metadata,
        sessionId: sessionIdRef.current,
        userId: userIdRef.current || undefined,
      };

      analyticsApi.recordEvent(eventData);
    },
    [pathname, searchParams],
  );

  /**
   * Track a view event
   */
  const trackView = useCallback(
    (eventName: string, elementId?: string, elementType?: string, metadata?: Record<string, any>) => {
      if (!sessionIdRef.current || !pathname) return;

      const eventData: EventData = {
        eventType: 'view',
        eventName,
        elementId,
        elementType,
        pagePath: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
        metadata,
        sessionId: sessionIdRef.current,
        userId: userIdRef.current || undefined,
      };

      analyticsApi.recordEvent(eventData);
    },
    [pathname, searchParams],
  );

  /**
   * Track a custom event
   */
  const trackEvent = useCallback(
    (
      eventType: EventData['eventType'],
      eventName: string,
      elementId?: string,
      elementType?: string,
      metadata?: Record<string, any>,
    ) => {
      if (!sessionIdRef.current || !pathname) return;

      actionCount += 1;

      const eventData: EventData = {
        eventType,
        eventName,
        elementId,
        elementType,
        pagePath: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
        metadata,
        sessionId: sessionIdRef.current,
        userId: userIdRef.current || undefined,
      };

      analyticsApi.recordEvent(eventData);
    },
    [pathname, searchParams],
  );

  return {
    trackClick,
    trackView,
    trackEvent,
    sessionId: sessionIdRef.current,
    userId: userIdRef.current,
  };
}

