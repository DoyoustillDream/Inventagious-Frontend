/**
 * Configuration for wallet onboarding experience
 */

export interface OnboardingConfig {
  autoAdvance: boolean;
  autoAdvanceDelay: number; // milliseconds
  progressPersistence: boolean;
  showTooltips: boolean;
  enableAnalytics: boolean;
  redirectDelay: number; // milliseconds for success screen
}

export const defaultOnboardingConfig: OnboardingConfig = {
  autoAdvance: true,
  autoAdvanceDelay: 500,
  progressPersistence: true,
  showTooltips: true,
  enableAnalytics: true,
  redirectDelay: 3000,
};

export const STORAGE_KEYS = {
  ONBOARDING_PROGRESS: 'wallet-onboarding-progress',
  ONBOARDING_COMPLETED: 'wallet-onboarding-completed',
  TOOLTIPS_DISMISSED: 'wallet-onboarding-tooltips-dismissed',
} as const;

export const ONBOARDING_STEPS = {
  DETECTION: 'detection',
  CONNECTION: 'connection',
  AUTHENTICATION: 'authentication',
  PROFILE: 'profile',
  SUCCESS: 'success',
} as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[keyof typeof ONBOARDING_STEPS];

export const STEP_ORDER: OnboardingStep[] = [
  ONBOARDING_STEPS.DETECTION,
  ONBOARDING_STEPS.CONNECTION,
  ONBOARDING_STEPS.AUTHENTICATION,
  ONBOARDING_STEPS.PROFILE,
  ONBOARDING_STEPS.SUCCESS,
];

export const STEP_LABELS: Record<OnboardingStep, string> = {
  [ONBOARDING_STEPS.DETECTION]: 'Detecting Wallet',
  [ONBOARDING_STEPS.CONNECTION]: 'Connect Wallet',
  [ONBOARDING_STEPS.AUTHENTICATION]: 'Sign In',
  [ONBOARDING_STEPS.PROFILE]: 'Complete Profile',
  [ONBOARDING_STEPS.SUCCESS]: 'Welcome!',
};

export const STEP_DESCRIPTIONS: Record<OnboardingStep, string> = {
  [ONBOARDING_STEPS.DETECTION]: 'Checking for available wallets...',
  [ONBOARDING_STEPS.CONNECTION]: 'Connect your wallet to get started',
  [ONBOARDING_STEPS.AUTHENTICATION]: 'Sign a message to authenticate',
  [ONBOARDING_STEPS.PROFILE]: 'Tell us a bit about yourself',
  [ONBOARDING_STEPS.SUCCESS]: 'You\'re all set! Welcome to Inventagious',
};

export function getStepProgress(step: OnboardingStep): number {
  const stepIndex = STEP_ORDER.indexOf(step);
  if (stepIndex === -1) return 0;
  return ((stepIndex + 1) / STEP_ORDER.length) * 100;
}

export function getNextStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === STEP_ORDER.length - 1) {
    return null;
  }
  return STEP_ORDER[currentIndex + 1];
}

export function getPreviousStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return STEP_ORDER[currentIndex - 1];
}

