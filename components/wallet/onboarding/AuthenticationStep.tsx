'use client';

import { useState, useEffect } from 'react';
import LoadingIndicator from '../status/LoadingIndicator';
import ErrorRecovery from '../feedback/ErrorRecovery';
import OnboardingTooltip from '../guidance/OnboardingTooltip';
import { ONBOARDING_STEPS } from '@/lib/wallet/onboarding-config';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';

interface AuthenticationStepProps {
  onAuthenticate: () => Promise<void>;
  isAuthenticating: boolean;
  error: any;
  onRetry: () => void;
  onDismissError: () => void;
}

export default function AuthenticationStep({
  onAuthenticate,
  isAuthenticating,
  error,
  onRetry,
  onDismissError,
}: AuthenticationStepProps) {
  const { connected, publicKey } = usePhantomWallet();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (connected && publicKey && !hasStarted && !isAuthenticating) {
      setHasStarted(true);
      // Auto-start authentication
      onAuthenticate();
    }
  }, [connected, publicKey, hasStarted, isAuthenticating, onAuthenticate]);

  if (!connected || !publicKey) {
    return (
      <div className="browser-window bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6">
        <p className="hand-drawn text-sm font-bold text-yellow-800 text-center">
          Please connect your wallet first
        </p>
      </div>
    );
  }

  if (isAuthenticating) {
    return (
      <div>
        <OnboardingTooltip step={ONBOARDING_STEPS.AUTHENTICATION} />
        <LoadingIndicator
          step={ONBOARDING_STEPS.AUTHENTICATION}
          message="Please approve the signature request in your wallet..."
        />
        <div className="mt-4 browser-window bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
          <p className="hand-drawn text-xs font-bold text-blue-800 text-center">
            Check your wallet extension or mobile app for the signature prompt
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OnboardingTooltip step={ONBOARDING_STEPS.AUTHENTICATION} />

      {error && (
        <ErrorRecovery
          error={error}
          onRetry={onRetry}
          onDismiss={onDismissError}
        />
      )}

      <div className="browser-window bg-white p-6">
        <h2 className="hand-drawn text-2xl font-bold text-black mb-4 text-center">
          Sign In
        </h2>
        <p className="hand-drawn text-sm font-bold text-gray-700 mb-6 text-center">
          Sign a message to authenticate your wallet. This proves you own the wallet and doesn't grant any permissions.
        </p>

        <div className="browser-window bg-gray-50 border-2 border-gray-400 rounded-lg p-4 mb-6">
          <p className="hand-drawn text-xs font-bold text-gray-700 mb-2">
            Wallet Address:
          </p>
          <p className="hand-drawn text-sm font-bold text-black font-mono">
            {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
          </p>
        </div>

        <button
          onClick={onAuthenticate}
          className="w-full hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-6 py-4 text-lg font-bold text-black hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAuthenticating}
        >
          {isAuthenticating ? 'Signing...' : 'Sign Message'}
        </button>
      </div>
    </div>
  );
}

