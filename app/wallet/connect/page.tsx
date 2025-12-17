'use client';

import { Suspense } from 'react';
import PhantomProviderWrapper from '@/components/auth/PhantomProviderWrapper';
import WalletOnboardingFlow from '@/components/wallet/onboarding/WalletOnboardingFlow';
import LoadingIndicator from '@/components/wallet/status/LoadingIndicator';
import { ONBOARDING_STEPS } from '@/lib/wallet/onboarding-config';

export default function WalletConnectPage() {
  return (
    <PhantomProviderWrapper>
      <Suspense fallback={<LoadingIndicator step={ONBOARDING_STEPS.DETECTION} />}>
        <WalletOnboardingFlow />
      </Suspense>
    </PhantomProviderWrapper>
  );
}

