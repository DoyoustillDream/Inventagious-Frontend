import { apiClient } from './client';

export interface PageViewData {
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
  sessionId: string;
  userId?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
}

export interface EventData {
  eventType: 'click' | 'view' | 'scroll' | 'search' | 'filter' | 'share' | 'download';
  eventName: string;
  elementId?: string;
  elementType?: string;
  pagePath: string;
  metadata?: Record<string, any>;
  sessionId: string;
  userId?: string;
}

export interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  pageViews?: number;
  actions?: number;
  referrer?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface AnalyticsDashboard {
  pageViews: number;
  events: number;
  sessions: number;
  topPages: Array<{ path: string; count: number }>;
  eventsByType: Record<string, number>;
  browsers: Record<string, number>;
  topReferrers: Array<{ referrer: string; count: number }>;
  locations: Array<{
    latitude: number;
    longitude: number;
    country: string;
    city: string;
    sessions: number;
  }>;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface GeographicLocation {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  sessions: number;
  totalPageViews: number;
  totalDuration: number;
}

export const analyticsApi = {
  /**
   * Record a page view
   */
  recordPageView: async (data: PageViewData): Promise<void> => {
    try {
      await apiClient.post('/analytics/pageview', data);
    } catch (error) {
      console.error('Failed to record page view:', error);
      // Don't throw - analytics failures shouldn't break the app
    }
  },

  /**
   * Record a user event
   */
  recordEvent: async (data: EventData): Promise<void> => {
    try {
      await apiClient.post('/analytics/event', data);
    } catch (error) {
      console.error('Failed to record event:', error);
    }
  },

  /**
   * Record or update session
   */
  recordSession: async (data: SessionData): Promise<void> => {
    try {
      await apiClient.post('/analytics/session', data);
    } catch (error) {
      console.error('Failed to record session:', error);
    }
  },

  /**
   * Batch record multiple events
   */
  recordBatch: async (events: Array<PageViewData | EventData>): Promise<void> => {
    try {
      await apiClient.post('/analytics/batch', { events });
    } catch (error) {
      console.error('Failed to record batch:', error);
    }
  },

  /**
   * Get analytics dashboard data (admin only)
   */
  getDashboard: async (startDate?: string, endDate?: string): Promise<AnalyticsDashboard> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return apiClient.get<AnalyticsDashboard>(`/analytics/dashboard${query ? `?${query}` : ''}`);
  },

  /**
   * Get geographic distribution data (admin only)
   */
  getGeographic: async (startDate?: string, endDate?: string): Promise<GeographicLocation[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return apiClient.get<GeographicLocation[]>(`/analytics/geographic${query ? `?${query}` : ''}`);
  },

  /**
   * Get page analytics (admin only)
   */
  getPageAnalytics: async (
    pagePath?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<any[]> => {
    const params = new URLSearchParams();
    if (pagePath) params.append('pagePath', pagePath);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString();
    return apiClient.get<any[]>(`/analytics/pages${query ? `?${query}` : ''}`);
  },
};

