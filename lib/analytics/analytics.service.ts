import { apiClient } from '../api/client';

// Session management
let sessionId: string | null = null;
let sessionStartTime: Date | null = null;

/**
 * Generate or retrieve session ID
 */
function getSessionId(): string {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStartTime = new Date();
    
    // Store in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('analytics_session_id', sessionId);
      sessionStorage.setItem('analytics_session_start', sessionStartTime.toISOString());
    }
  }
  return sessionId;
}

/**
 * Get device type
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Get browser info
 */
function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'unknown';
}

/**
 * Get OS info
 */
function getOS(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS')) return 'iOS';
  return 'unknown';
}

/**
 * Get user ID from auth token (if available)
 */
function getUserId(): string | undefined {
  // This would need to be integrated with your auth system
  // For now, return undefined - the backend will extract it from the token
  return undefined;
}

// Event queue for batching
let eventQueue: any[] = [];
let flushTimer: NodeJS.Timeout | null = null;
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds

/**
 * Flush queued events
 */
async function flushQueue() {
  if (eventQueue.length === 0) return;
  
  const eventsToSend = [...eventQueue];
  eventQueue = [];
  
  try {
    await apiClient.post('/analytics/batch', { events: eventsToSend });
  } catch (error) {
    console.error('Failed to send analytics batch:', error);
    // Re-queue events on failure (optional - might want to limit retries)
  }
}

/**
 * Queue an event for batching
 */
function queueEvent(event: any) {
  eventQueue.push(event);
  
  // Flush if batch size reached
  if (eventQueue.length >= BATCH_SIZE) {
    flushQueue();
  } else if (!flushTimer) {
    // Set timer to flush after interval
    flushTimer = setTimeout(() => {
      flushQueue();
      flushTimer = null;
    }, FLUSH_INTERVAL);
  }
}

/**
 * Send event immediately (for critical events)
 */
async function sendImmediate(event: any) {
  try {
    await apiClient.post('/analytics/event', event);
  } catch (error) {
    console.error('Failed to send analytics event:', error);
  }
}

export const analytics = {
  /**
   * Initialize analytics (call on app start)
   */
  init() {
    // Restore session from sessionStorage if available
    if (typeof window !== 'undefined') {
      const storedSessionId = sessionStorage.getItem('analytics_session_id');
      const storedStartTime = sessionStorage.getItem('analytics_session_start');
      
      if (storedSessionId && storedStartTime) {
        sessionId = storedSessionId;
        sessionStartTime = new Date(storedStartTime);
      }
    }
    
    // Record session start
    this.recordSession({
      startTime: sessionStartTime?.toISOString() || new Date().toISOString(),
    });
    
    // Record page view for initial load
    this.recordPageView({
      pagePath: typeof window !== 'undefined' ? window.location.pathname : '/',
      pageTitle: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    });
    
    // Flush queue on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        flushQueue();
      });
    }
  },

  /**
   * Record page view
   */
  recordPageView(data: {
    pagePath: string;
    pageTitle?: string;
    referrer?: string;
  }) {
    const event = {
      pagePath: data.pagePath,
      pageTitle: data.pageTitle || (typeof document !== 'undefined' ? document.title : ''),
      referrer: data.referrer || (typeof document !== 'undefined' ? document.referrer : undefined),
      sessionId: getSessionId(),
      userId: getUserId(),
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
    };
    
    queueEvent(event);
  },

  /**
   * Record user event
   */
  recordEvent(data: {
    eventType: 'click' | 'view' | 'scroll' | 'search' | 'filter' | 'share' | 'download';
    eventName: string;
    elementId?: string;
    elementType?: string;
    pagePath?: string;
    metadata?: Record<string, any>;
  }) {
    const event = {
      eventType: data.eventType,
      eventName: data.eventName,
      elementId: data.elementId,
      elementType: data.elementType,
      pagePath: data.pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      metadata: data.metadata || {},
      sessionId: getSessionId(),
      userId: getUserId(),
    };
    
    queueEvent(event);
  },

  /**
   * Record search query
   */
  recordSearch(data: {
    query: string;
    filters?: Record<string, any>;
    resultsCount?: number;
    clickedResult?: string;
  }) {
    const event = {
      query: data.query,
      filters: data.filters || {},
      resultsCount: data.resultsCount,
      clickedResult: data.clickedResult,
      sessionId: getSessionId(),
      userId: getUserId(),
    };
    
    queueEvent(event);
  },

  /**
   * Record form interaction
   */
  recordFormInteraction(data: {
    formType: string;
    formId: string;
    action: 'started' | 'abandoned' | 'completed' | 'error';
    fieldsCompleted?: number;
    timeSpent?: number;
    errorType?: string;
  }) {
    const event = {
      formType: data.formType,
      formId: data.formId,
      action: data.action,
      fieldsCompleted: data.fieldsCompleted,
      timeSpent: data.timeSpent,
      errorType: data.errorType,
      sessionId: getSessionId(),
      userId: getUserId(),
    };
    
    queueEvent(event);
  },

  /**
   * Record performance metrics
   */
  recordPerformance(data: {
    pagePath?: string;
    loadTime: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    cumulativeLayoutShift?: number;
    firstInputDelay?: number;
    networkType?: string;
  }) {
    const event = {
      pagePath: data.pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      loadTime: data.loadTime,
      firstContentfulPaint: data.firstContentfulPaint,
      largestContentfulPaint: data.largestContentfulPaint,
      timeToInteractive: data.timeToInteractive,
      cumulativeLayoutShift: data.cumulativeLayoutShift,
      firstInputDelay: data.firstInputDelay,
      networkType: data.networkType || (typeof navigator !== 'undefined' && (navigator as any).connection?.effectiveType),
      deviceType: getDeviceType(),
      sessionId: getSessionId(),
    };
    
    queueEvent(event);
  },

  /**
   * Record error
   */
  recordError(data: {
    errorType: 'javascript' | 'api' | 'wallet' | 'transaction' | 'validation';
    errorMessage: string;
    errorStack?: string;
    pagePath?: string;
    userAction?: string;
  }) {
    const event = {
      errorType: data.errorType,
      errorMessage: data.errorMessage,
      errorStack: data.errorStack,
      pagePath: data.pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      userAction: data.userAction,
      userId: getUserId(),
      sessionId: getSessionId(),
      browser: getBrowser(),
      os: getOS(),
    };
    
    // Send errors immediately (critical)
    sendImmediate(event);
  },

  /**
   * Record or update session
   */
  recordSession(data: {
    startTime?: string;
    endTime?: string;
    duration?: number;
    pageViews?: number;
    actions?: number;
    referrer?: string;
  }) {
    const event = {
      sessionId: getSessionId(),
      userId: getUserId(),
      startTime: data.startTime || (sessionStartTime?.toISOString() || new Date().toISOString()),
      endTime: data.endTime,
      duration: data.duration,
      pageViews: data.pageViews,
      actions: data.actions,
      referrer: data.referrer || (typeof document !== 'undefined' ? document.referrer : undefined),
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
    };
    
    queueEvent(event);
  },

  /**
   * Record user journey step
   */
  recordUserJourney(data: {
    journeyStep: string;
    previousStep?: string;
    timeOnStep?: number;
    metadata?: Record<string, any>;
  }) {
    const event = {
      userId: getUserId(),
      journeyStep: data.journeyStep,
      previousStep: data.previousStep,
      timeOnStep: data.timeOnStep,
      metadata: data.metadata || {},
      sessionId: getSessionId(),
    };
    
    queueEvent(event);
  },

  /**
   * Record transaction intent
   */
  recordTransactionIntent(data: {
    transactionType: 'contribution' | 'donation' | 'deal_funding' | 'milestone_payout';
    projectId?: string;
    dealId?: string;
    intendedAmount: number;
    actualAmount?: number;
    status: 'initiated' | 'completed' | 'failed' | 'cancelled';
    failureReason?: string;
    walletAddress?: string;
  }) {
    const event = {
      transactionType: data.transactionType,
      projectId: data.projectId,
      dealId: data.dealId,
      intendedAmount: data.intendedAmount,
      actualAmount: data.actualAmount,
      status: data.status,
      failureReason: data.failureReason,
      walletAddress: data.walletAddress,
      userId: getUserId(),
      sessionId: getSessionId(),
    };
    
    queueEvent(event);
  },

  /**
   * Record wallet event
   */
  recordWalletEvent(data: {
    eventType: 'connect_attempt' | 'connect_success' | 'connect_failed' | 'disconnect' | 'switch_wallet';
    walletType?: string;
    walletAddress?: string;
    network?: string;
    failureReason?: string;
  }) {
    const event = {
      eventType: data.eventType,
      walletType: data.walletType,
      walletAddress: data.walletAddress,
      network: data.network,
      failureReason: data.failureReason,
      userId: getUserId(),
      sessionId: getSessionId(),
    };
    
    queueEvent(event);
  },

  /**
   * Record transaction status
   */
  recordTransactionStatus(data: {
    transactionSignature: string;
    status: 'pending' | 'confirmed' | 'failed' | 'expired';
    confirmationTime?: number;
    blockTime?: number;
    slot?: number;
    error?: string;
  }) {
    const event = {
      transactionSignature: data.transactionSignature,
      status: data.status,
      confirmationTime: data.confirmationTime,
      blockTime: data.blockTime,
      slot: data.slot,
      error: data.error,
      userId: getUserId(),
    };
    
    queueEvent(event);
  },

  /**
   * Flush all queued events immediately
   */
  flush() {
    flushQueue();
  },
};

