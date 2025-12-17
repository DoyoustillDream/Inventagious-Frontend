'use client';

import { useState } from 'react';
import { useModal } from '@phantom/react-sdk';
import WalletDetector from '../detection/WalletDetector';
import WalletRecommendation from '../detection/WalletRecommendation';
import ConnectionStatus from '../status/ConnectionStatus';
import LoadingIndicator from '../status/LoadingIndicator';
import ErrorRecovery from '../feedback/ErrorRecovery';
import OnboardingTooltip from '../guidance/OnboardingTooltip';
import { ONBOARDING_STEPS } from '@/lib/wallet/onboarding-config';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';

interface ConnectionStepProps {
  onConnect: (method: 'google' | 'apple' | 'injected') => Promise<void>;
  isConnecting: boolean;
  error: any;
  onRetry: () => void;
  onDismissError: () => void;
}

export default function ConnectionStep({
  onConnect,
  isConnecting,
  error,
  onRetry,
  onDismissError,
}: ConnectionStepProps) {
  const { connected } = usePhantomWallet();
  const { open: openModal } = useModal();
  const [selectedMethod, setSelectedMethod] = useState<'google' | 'apple' | 'injected' | null>(null);

  const handleConnectClick = async (method: 'google' | 'apple' | 'injected') => {
    setSelectedMethod(method);
    
    if (method === 'injected') {
      // For injected, try direct connection
      await onConnect(method);
    } else {
      // For OAuth methods, open Phantom modal
      openModal();
      // The modal will handle the connection, but we'll also call onConnect
      // to track the attempt
      await onConnect(method);
    }
  };

  if (isConnecting) {
    return (
      <div>
        <OnboardingTooltip step={ONBOARDING_STEPS.CONNECTION} />
        <LoadingIndicator
          step={ONBOARDING_STEPS.CONNECTION}
          message={
            selectedMethod === 'google' ? 'Connecting via Google...' :
            selectedMethod === 'apple' ? 'Connecting via Apple...' :
            'Connecting wallet...'
          }
        />
      </div>
    );
  }

  if (connected) {
    return (
      <div>
        <ConnectionStatus showDetails={true} />
        <p className="hand-drawn text-sm font-bold text-green-700 text-center mt-4">
          Wallet connected successfully! Proceeding to authentication...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OnboardingTooltip step={ONBOARDING_STEPS.CONNECTION} />
      
      <WalletDetector />

      {error && (
        <ErrorRecovery
          error={error}
          onRetry={onRetry}
          onDismiss={onDismissError}
        />
      )}

      <div className="browser-window bg-white p-6">
        <h2 className="hand-drawn text-2xl font-bold text-black mb-4 text-center">
          Connect Your Wallet
        </h2>
        <p className="hand-drawn text-sm font-bold text-gray-700 mb-6 text-center">
          Choose how you'd like to connect your wallet to get started
        </p>

        <WalletRecommendation onSelectMethod={handleConnectClick} />

        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <button
            onClick={() => openModal()}
            className="w-full hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-6 py-4 text-lg font-bold text-black hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Open Connection Options
          </button>
        </div>
      </div>
    </div>
  );
}

