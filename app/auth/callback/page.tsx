'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConnectBox, usePhantom, useAccounts } from "@phantom/react-sdk";
import PhantomProviderWrapper from "@/components/auth/PhantomProviderWrapper";
import WalletOnboardingFlow from "@/components/wallet/onboarding/WalletOnboardingFlow";
import LoadingIndicator from "@/components/wallet/status/LoadingIndicator";
import { ONBOARDING_STEPS } from "@/lib/wallet/onboarding-config";
import Header from "@/components/shared/Header/Header";
import Footer from "@/components/shared/Footer/Footer";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { analytics } from "@/lib/analytics/analytics.service";

// Inner component that uses Phantom SDK hooks (must be inside PhantomProvider)
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { redirectAfterAuth } = useAuthRedirect();
  const redirectAttemptedRef = useRef(false);
  const hasCheckedConnectionRef = useRef(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Use Phantom SDK hooks to detect connection state (works for both Google and Apple)
  const { isConnected } = usePhantom();
  const addresses = useAccounts();

  // Check if OAuth callback was successful via URL parameters (for Google)
  const responseType = searchParams.get('response_type');
  const urlSuccess = responseType === 'success';
  // Phantom SDK can send 'failure' or 'error' - handle both
  const urlError = responseType === 'error' || responseType === 'failure';
  
  // Check if we have a successful connection via SDK state (works for both Google and Apple)
  const hasAddresses = addresses && addresses.length > 0;
  const sdkSuccess = isConnected && hasAddresses;

  // Check if authentication is complete and redirect - only once
  // Only redirect if onboarding is not being shown (let onboarding flow handle its own redirect)
  useEffect(() => {
    if (!authLoading && isAuthenticated && !redirectAttemptedRef.current && !showOnboarding) {
      redirectAttemptedRef.current = true;
      // Authentication is complete, redirect after a brief delay
      const redirectTimer = setTimeout(() => {
        redirectAfterAuth();
      }, 500);
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, authLoading, showOnboarding, redirectAfterAuth]);

  // Initialize connection check and show onboarding if needed - only run once
  useEffect(() => {
    // Wait a bit for SDK to initialize and process the callback
    if (!hasCheckedConnectionRef.current) {
      const initTimeout = setTimeout(() => {
        hasCheckedConnectionRef.current = true;
      }, 500);
      return () => clearTimeout(initTimeout);
    }

    // Check for success via URL parameters (Google) or SDK state (both Google and Apple)
    const isSuccess = urlSuccess || sdkSuccess;
    const isError = urlError;

    // Only process once - show onboarding if not already authenticated and not already redirecting
    if (isSuccess && !isError && !redirectAttemptedRef.current && hasCheckedConnectionRef.current && !showOnboarding && !isAuthenticated) {
      // Show onboarding flow to continue with authentication
      setShowOnboarding(true);
    }
  }, [urlSuccess, sdkSuccess, urlError, showOnboarding, isAuthenticated]);

  // Show onboarding flow if connection successful
  if (showOnboarding && isConnected) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <WalletOnboardingFlow />
        </main>
        <Footer />
      </div>
    );
  }

  // Track auth failures when they occur
  useEffect(() => {
    if (urlError && responseType) {
      const sessionId = searchParams.get('session_id');
      const errorDetails = {
        responseType,
        sessionId: sessionId || undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
      };
      
      analytics.recordError({
        errorType: 'wallet',
        errorMessage: `Wallet authentication failed: ${responseType}`,
        pagePath: '/auth/callback',
        userAction: 'wallet_connect_callback',
      });
      
      // Also log to console for debugging
      console.error('[Auth Callback] Authentication failure detected:', errorDetails);
    }
  }, [urlError, responseType, searchParams]);

  // Handle error case - show error message
  if (urlError) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center bg-white/90 backdrop-blur-md rounded-lg p-8 shadow-xl border-4 border-black hand-drawn max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Connection Failed</h1>
            <p className="mb-4 text-gray-700">There was an error connecting your wallet.</p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/wallet/connect')}
                className="flex-1 hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-4 py-2.5 text-base font-bold text-black shadow-lg hover:shadow-xl transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 hand-drawn rounded-lg border-4 border-black bg-white px-4 py-2.5 text-base font-bold text-black shadow-lg hover:shadow-xl transition-all"
              >
                Go Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Use ConnectBox to handle the auth flow completion
  // This works for both Google and Apple OAuth redirects
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md">
          <ConnectBox />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <PhantomProviderWrapper>
      <Suspense fallback={<LoadingIndicator step={ONBOARDING_STEPS.CONNECTION} />}>
        <CallbackContent />
      </Suspense>
    </PhantomProviderWrapper>
  );
}

