'use client';

import { OnboardingStep, STEP_DESCRIPTIONS } from '@/lib/wallet/onboarding-config';

interface LoadingIndicatorProps {
  step: OnboardingStep;
  message?: string;
  progress?: number;
}

export default function LoadingIndicator({ step, message, progress }: LoadingIndicatorProps) {
  const displayMessage = message || STEP_DESCRIPTIONS[step];

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-yellow-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Message */}
      <p className="hand-drawn text-lg font-bold text-black text-center mb-2">
        {displayMessage}
      </p>

      {/* Progress percentage if provided */}
      {progress !== undefined && (
        <div className="w-full max-w-xs mt-4">
          <div className="w-full h-2 bg-gray-200 rounded-full border border-black overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="hand-drawn text-sm font-bold text-gray-600 text-center mt-2">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}

