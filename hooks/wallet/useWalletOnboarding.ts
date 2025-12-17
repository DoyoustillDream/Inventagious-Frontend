'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { useConnectionState } from './useConnectionState';
import { useOnboardingProgress } from './useOnboardingProgress';
import { useWalletDetection } from './useWalletDetection';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWalletAuth } from '@/components/auth/WalletAuthProvider';
import { authApi } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { OnboardingStep, ONBOARDING_STEPS, getNextStep, defaultOnboardingConfig } from '@/lib/wallet/onboarding-config';
import { categorizeError, OnboardingError } from '@/lib/wallet/error-handler';
import { onboardingAnalytics } from '@/lib/wallet/analytics';

export interface OnboardingState {
  currentStep: OnboardingStep;
  connectionMethod: 'google' | 'apple' | 'injected' | null;
  walletAddress: string | null;
  isConnecting: boolean;
  isAuthenticating: boolean;
  isCompletingProfile: boolean;
  error: OnboardingError | null;
  progress: number;
  completedSteps: OnboardingStep[];
}

/**
 * Main hook for wallet onboarding flow management
 */
export function useWalletOnboarding() {
  const { publicKey, connected, connecting, connect, signMessage } = usePhantomWallet();
  const { user, isAuthenticated, setUser } = useAuth();
  const { authenticateWallet: originalAuthenticateWallet, showProfileForm, pendingWalletAddress } = useWalletAuth();
  const { redirectAfterAuth } = useAuthRedirect();
  const connectionState = useConnectionState();
  const progress = useOnboardingProgress();
  const walletDetection = useWalletDetection();

  const [state, setState] = useState<OnboardingState>({
    currentStep: ONBOARDING_STEPS.DETECTION,
    connectionMethod: null,
    walletAddress: null,
    isConnecting: false,
    isAuthenticating: false,
    isCompletingProfile: false,
    error: null,
    progress: 0,
    completedSteps: [],
  });

  const authAttemptRef = useRef<string | null>(null);

  // Update state from hooks
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      currentStep: progress.currentStep,
      progress: progress.progress,
      completedSteps: progress.completedSteps,
      walletAddress: publicKey?.toString() || null,
      isConnecting: connecting,
      connectionMethod: connectionState.connectionMethod,
    }));
  }, [progress.currentStep, progress.progress, progress.completedSteps, publicKey, connecting, connectionState.connectionMethod]);

  // Track if we've already triggered auto-advance for each step to prevent loops
  const autoAdvanceRef = useRef<{
    detection?: boolean;
    connection?: boolean;
    authentication?: boolean;
    profile?: boolean;
    success?: boolean;
  }>({});

  const handleConnection = useCallback(async (method: 'google' | 'apple' | 'injected' = 'injected') => {
    if (connecting || state.isConnecting) return;

    setState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    connectionState.setConnectionMethod(method);
    onboardingAnalytics.trackConnectionAttempted(method);

    try {
      await connect(method);
      progress.setStep(ONBOARDING_STEPS.AUTHENTICATION);
      progress.markStepComplete(ONBOARDING_STEPS.CONNECTION);
      onboardingAnalytics.trackConnectionSucceeded(method, publicKey?.toString() || undefined);
    } catch (error: any) {
      const onboardingError = categorizeError(error, ONBOARDING_STEPS.CONNECTION);
      setState((prev) => ({
        ...prev,
        error: onboardingError,
        isConnecting: false,
      }));
      connectionState.setError(error);
      onboardingAnalytics.trackConnectionFailed(method, onboardingError.type);
    } finally {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
      }));
    }
  }, [connect, connecting, state.isConnecting, connectionState, progress, publicKey]);

  const handleAuthentication = useCallback(async () => {
    if (!connected || !publicKey) {
      setState((prev) => ({
        ...prev,
        error: {
          type: 'CONNECTION_FAILED' as any,
          message: 'Wallet is not connected',
          recoverable: true,
          retryable: true,
          step: ONBOARDING_STEPS.AUTHENTICATION,
        },
      }));
      return;
    }

    const walletAddress = publicKey.toString();

    // Prevent duplicate attempts
    if (state.isAuthenticating || authAttemptRef.current === walletAddress) {
      return;
    }

    // Skip if already authenticated
    if (isAuthenticated && user?.walletAddress === walletAddress) {
      progress.setStep(ONBOARDING_STEPS.SUCCESS);
      return;
    }

    authAttemptRef.current = walletAddress;
    setState((prev) => ({
      ...prev,
      isAuthenticating: true,
      error: null,
    }));

    onboardingAnalytics.trackAuthenticationAttempted();

    try {
      await originalAuthenticateWallet(true);
      
      // Check if profile completion is needed
      if (showProfileForm && pendingWalletAddress) {
        progress.setStep(ONBOARDING_STEPS.PROFILE);
        onboardingAnalytics.trackProfileFormShown();
      } else {
        progress.setStep(ONBOARDING_STEPS.SUCCESS);
        progress.markStepComplete(ONBOARDING_STEPS.AUTHENTICATION);
        onboardingAnalytics.trackAuthenticationSucceeded(walletAddress);
      }
    } catch (error: any) {
      const onboardingError = categorizeError(error, ONBOARDING_STEPS.AUTHENTICATION);
      setState((prev) => ({
        ...prev,
        error: onboardingError,
        isAuthenticating: false,
      }));
      authAttemptRef.current = null;
      onboardingAnalytics.trackAuthenticationFailed(onboardingError.type);
    } finally {
      setState((prev) => ({
        ...prev,
        isAuthenticating: false,
      }));
    }
  }, [
    connected,
    publicKey,
    state.isAuthenticating,
    isAuthenticated,
    user,
    originalAuthenticateWallet,
    showProfileForm,
    pendingWalletAddress,
    progress,
  ]);

  const handleProfileComplete = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isCompletingProfile: true,
      error: null,
    }));

    try {
      // The profile form component will handle the actual submission
      // This just tracks the completion
      progress.markStepComplete(ONBOARDING_STEPS.PROFILE);
      onboardingAnalytics.trackProfileCompleted();
    } catch (error: any) {
      const onboardingError = categorizeError(error, ONBOARDING_STEPS.PROFILE);
      setState((prev) => ({
        ...prev,
        error: onboardingError,
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        isCompletingProfile: false,
      }));
    }
  }, [progress]);

  const retry = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));

    if (state.currentStep === ONBOARDING_STEPS.CONNECTION) {
      handleConnection(state.connectionMethod || 'injected');
    } else if (state.currentStep === ONBOARDING_STEPS.AUTHENTICATION) {
      handleAuthentication();
    }
  }, [state.currentStep, state.connectionMethod, handleConnection, handleAuthentication]);

  const goToStep = useCallback((step: OnboardingStep) => {
    progress.setStep(step);
  }, [progress]);

  // Auto-advance logic - moved after function definitions
  useEffect(() => {
    if (!defaultOnboardingConfig.autoAdvance) return;

    // Auto-advance from detection to connection
    if (state.currentStep === ONBOARDING_STEPS.DETECTION && !walletDetection.isDetecting && !autoAdvanceRef.current.detection) {
      if (walletDetection.isAvailable) {
        autoAdvanceRef.current.detection = true;
        const timer = setTimeout(() => {
          progress.setStep(ONBOARDING_STEPS.CONNECTION);
        }, defaultOnboardingConfig.autoAdvanceDelay);
        return () => clearTimeout(timer);
      }
    }

    // Auto-advance from connection to authentication
    if (
      state.currentStep === ONBOARDING_STEPS.CONNECTION &&
      connected &&
      publicKey &&
      !state.isAuthenticating &&
      !state.isConnecting &&
      !autoAdvanceRef.current.connection
    ) {
      autoAdvanceRef.current.connection = true;
      const timer = setTimeout(() => {
        handleAuthentication();
      }, defaultOnboardingConfig.autoAdvanceDelay);
      return () => clearTimeout(timer);
    }

    // Auto-advance to profile if needed
    if (
      state.currentStep === ONBOARDING_STEPS.AUTHENTICATION &&
      showProfileForm &&
      pendingWalletAddress &&
      !state.isCompletingProfile &&
      !autoAdvanceRef.current.authentication
    ) {
      autoAdvanceRef.current.authentication = true;
      const timer = setTimeout(() => {
        progress.setStep(ONBOARDING_STEPS.PROFILE);
      }, defaultOnboardingConfig.autoAdvanceDelay);
      return () => clearTimeout(timer);
    }

    // Auto-advance to success
    if (
      state.currentStep === ONBOARDING_STEPS.PROFILE &&
      isAuthenticated &&
      user &&
      !showProfileForm &&
      !autoAdvanceRef.current.profile
    ) {
      autoAdvanceRef.current.profile = true;
      const timer = setTimeout(() => {
        progress.setStep(ONBOARDING_STEPS.SUCCESS);
        progress.markComplete();
        onboardingAnalytics.trackOnboardingCompleted(state.walletAddress || undefined);
      }, defaultOnboardingConfig.autoAdvanceDelay);
      return () => clearTimeout(timer);
    }

    // Auto-redirect from success - only once
    if (state.currentStep === ONBOARDING_STEPS.SUCCESS && isAuthenticated && !autoAdvanceRef.current.success) {
      autoAdvanceRef.current.success = true;
      const timer = setTimeout(() => {
        redirectAfterAuth();
      }, defaultOnboardingConfig.redirectDelay);
      return () => clearTimeout(timer);
    }
  }, [
    state.currentStep,
    connected,
    publicKey?.toString(),
    state.isAuthenticating,
    state.isConnecting,
    showProfileForm,
    pendingWalletAddress,
    isAuthenticated,
    user?.id,
    walletDetection.isDetecting,
    walletDetection.isAvailable,
    state.walletAddress,
    handleAuthentication,
    redirectAfterAuth,
    progress.setStep,
    progress.markComplete,
  ]);

  // Reset auto-advance ref when step changes to allow re-triggering
  useEffect(() => {
    // Reset when step changes
    autoAdvanceRef.current = {};
  }, [state.currentStep]);

  // Initialize onboarding
  useEffect(() => {
    onboardingAnalytics.trackOnboardingStarted();
  }, []);

  return {
    ...state,
    walletDetection,
    connectionState,
    progress,
    handleConnection,
    handleAuthentication,
    handleProfileComplete,
    retry,
    goToStep,
  };
}

