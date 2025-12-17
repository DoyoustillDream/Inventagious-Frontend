/**
 * Analytics tracking for wallet onboarding
 */

export interface OnboardingAnalyticsEvent {
  event: string;
  step?: string;
  walletAddress?: string;
  connectionMethod?: string;
  errorType?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

const ANALYTICS_EVENTS = {
  ONBOARDING_STARTED: 'wallet_onboarding_started',
  CONNECTION_ATTEMPTED: 'wallet_connection_attempted',
  CONNECTION_SUCCEEDED: 'wallet_connection_succeeded',
  CONNECTION_FAILED: 'wallet_connection_failed',
  AUTHENTICATION_ATTEMPTED: 'authentication_attempted',
  AUTHENTICATION_SUCCEEDED: 'authentication_succeeded',
  AUTHENTICATION_FAILED: 'authentication_failed',
  PROFILE_FORM_SHOWN: 'profile_form_shown',
  PROFILE_COMPLETED: 'profile_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',
  STEP_COMPLETED: 'step_completed',
  ERROR_OCCURRED: 'error_occurred',
} as const;

export type AnalyticsEventType = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

class OnboardingAnalytics {
  private enabled: boolean = true;
  private events: OnboardingAnalyticsEvent[] = [];

  constructor() {
    // Check if analytics should be enabled
    if (typeof window !== 'undefined') {
      const config = localStorage.getItem('wallet-onboarding-analytics');
      this.enabled = config !== 'disabled';
    }
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  track(event: AnalyticsEventType, data?: {
    step?: string;
    walletAddress?: string;
    connectionMethod?: string;
    errorType?: string;
    metadata?: Record<string, any>;
  }) {
    if (!this.enabled) return;

    const analyticsEvent: OnboardingAnalyticsEvent = {
      event,
      timestamp: Date.now(),
      ...data,
    };

    this.events.push(analyticsEvent);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Onboarding Analytics]', analyticsEvent);
    }

    // Here you can integrate with your analytics service
    // For example: Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        step: data?.step,
        connection_method: data?.connectionMethod,
        error_type: data?.errorType,
        ...data?.metadata,
      });
    }
  }

  getEvents(): OnboardingAnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
  }

  // Convenience methods
  trackOnboardingStarted() {
    this.track(ANALYTICS_EVENTS.ONBOARDING_STARTED);
  }

  trackConnectionAttempted(method?: string) {
    this.track(ANALYTICS_EVENTS.CONNECTION_ATTEMPTED, {
      connectionMethod: method,
    });
  }

  trackConnectionSucceeded(method?: string, walletAddress?: string) {
    this.track(ANALYTICS_EVENTS.CONNECTION_SUCCEEDED, {
      connectionMethod: method,
      walletAddress,
    });
  }

  trackConnectionFailed(method?: string, errorType?: string) {
    this.track(ANALYTICS_EVENTS.CONNECTION_FAILED, {
      connectionMethod: method,
      errorType,
    });
  }

  trackAuthenticationAttempted() {
    this.track(ANALYTICS_EVENTS.AUTHENTICATION_ATTEMPTED);
  }

  trackAuthenticationSucceeded(walletAddress?: string) {
    this.track(ANALYTICS_EVENTS.AUTHENTICATION_SUCCEEDED, {
      walletAddress,
    });
  }

  trackAuthenticationFailed(errorType?: string) {
    this.track(ANALYTICS_EVENTS.AUTHENTICATION_FAILED, {
      errorType,
    });
  }

  trackProfileFormShown() {
    this.track(ANALYTICS_EVENTS.PROFILE_FORM_SHOWN);
  }

  trackProfileCompleted() {
    this.track(ANALYTICS_EVENTS.PROFILE_COMPLETED);
  }

  trackOnboardingCompleted(walletAddress?: string) {
    this.track(ANALYTICS_EVENTS.ONBOARDING_COMPLETED, {
      walletAddress,
    });
  }

  trackOnboardingAbandoned(step?: string) {
    this.track(ANALYTICS_EVENTS.ONBOARDING_ABANDONED, {
      step,
    });
  }

  trackStepCompleted(step: string) {
    this.track(ANALYTICS_EVENTS.STEP_COMPLETED, {
      step,
    });
  }

  trackError(errorType: string, step?: string) {
    this.track(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      errorType,
      step,
    });
  }
}

export const onboardingAnalytics = new OnboardingAnalytics();

