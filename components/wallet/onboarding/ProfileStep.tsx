'use client';

import CompleteProfileForm from '@/components/auth/CompleteProfileForm/CompleteProfileForm';
import { useWalletAuth } from '@/components/auth/WalletAuthProvider';
import OnboardingTooltip from '../guidance/OnboardingTooltip';
import { ONBOARDING_STEPS } from '@/lib/wallet/onboarding-config';

interface ProfileStepProps {
  walletAddress: string;
  onComplete: () => void;
}

export default function ProfileStep({ walletAddress, onComplete }: ProfileStepProps) {
  const { oauthUser, handleProfileComplete } = useWalletAuth();

  const handleComplete = async () => {
    await handleProfileComplete();
    onComplete();
  };

  return (
    <div className="space-y-6">
      <OnboardingTooltip step={ONBOARDING_STEPS.PROFILE} />

      <div className="browser-window bg-white p-6">
        <h2 className="hand-drawn text-2xl font-bold text-black mb-4 text-center">
          Complete Your Profile
        </h2>
        <p className="hand-drawn text-sm font-bold text-gray-700 mb-6 text-center">
          We need a few details to set up your account
        </p>

        <CompleteProfileForm
          walletAddress={walletAddress}
          onComplete={handleComplete}
          oauthUser={oauthUser}
        />
      </div>
    </div>
  );
}

