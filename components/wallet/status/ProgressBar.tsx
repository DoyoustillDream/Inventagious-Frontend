'use client';

import { OnboardingStep, STEP_ORDER, STEP_LABELS, getStepProgress } from '@/lib/wallet/onboarding-config';

interface ProgressBarProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
}

export default function ProgressBar({ currentStep, completedSteps }: ProgressBarProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const progress = getStepProgress(currentStep);

  return (
    <div className="w-full mb-8">
      {/* Progress percentage */}
      <div className="flex justify-between items-center mb-2">
        <span className="hand-drawn text-sm font-bold text-black">
          {Math.round(progress)}% Complete
        </span>
        <span className="hand-drawn text-xs font-bold text-gray-600">
          Step {currentIndex + 1} of {STEP_ORDER.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

