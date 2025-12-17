'use client';

import { useWalletOnboarding } from '@/hooks/wallet/useWalletOnboarding';
import { ONBOARDING_STEPS } from '@/lib/wallet/onboarding-config';
import ProgressBar from '../status/ProgressBar';
import StepIndicator from '../guidance/StepIndicator';
import ConnectionStep from './ConnectionStep';
import AuthenticationStep from './AuthenticationStep';
import ProfileStep from './ProfileStep';
import SuccessStep from './SuccessStep';
import HelpResources from '../guidance/HelpResources';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface WalletOnboardingFlowProps {
  initialStep?: string;
  onComplete?: () => void;
}

export default function WalletOnboardingFlow({
  initialStep,
  onComplete,
}: WalletOnboardingFlowProps) {
  const onboarding = useWalletOnboarding();
  const { redirectAfterAuth } = useAuthRedirect();

  const handleDismissError = () => {
    // Error recovery component will handle this
  };

  const handleRedirect = () => {
    if (onComplete) {
      onComplete();
    } else {
      redirectAfterAuth();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar
          currentStep={onboarding.currentStep}
          completedSteps={onboarding.completedSteps}
        />

        {/* Step Indicator */}
        <StepIndicator
          currentStep={onboarding.currentStep}
          completedSteps={onboarding.completedSteps}
        />

        {/* Main Content */}
        <div className="browser-window bg-white p-6 md:p-8 mb-6">
          {onboarding.currentStep === ONBOARDING_STEPS.DETECTION && (
            <div className="text-center">
              <p className="hand-drawn text-lg font-bold text-black">
                Detecting available wallets...
              </p>
            </div>
          )}

          {onboarding.currentStep === ONBOARDING_STEPS.CONNECTION && (
            <ConnectionStep
              onConnect={onboarding.handleConnection}
              isConnecting={onboarding.isConnecting}
              error={onboarding.error}
              onRetry={onboarding.retry}
              onDismissError={handleDismissError}
            />
          )}

          {onboarding.currentStep === ONBOARDING_STEPS.AUTHENTICATION && (
            <AuthenticationStep
              onAuthenticate={onboarding.handleAuthentication}
              isAuthenticating={onboarding.isAuthenticating}
              error={onboarding.error}
              onRetry={onboarding.retry}
              onDismissError={handleDismissError}
            />
          )}

          {onboarding.currentStep === ONBOARDING_STEPS.PROFILE && onboarding.walletAddress && (
            <ProfileStep
              walletAddress={onboarding.walletAddress}
              onComplete={onboarding.handleProfileComplete}
            />
          )}

          {onboarding.currentStep === ONBOARDING_STEPS.SUCCESS && (
            <SuccessStep onRedirect={handleRedirect} />
          )}
        </div>

        {/* Help Resources */}
        <HelpResources compact={false} />
      </div>
    </div>
  );
}

