'use client';

import { OnboardingStep, STEP_ORDER, STEP_LABELS } from '@/lib/wallet/onboarding-config';

interface StepIndicatorProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
}

export default function StepIndicator({ currentStep, completedSteps }: StepIndicatorProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="flex items-center justify-between mb-8">
      {STEP_ORDER.map((step, index) => {
        const isCompleted = completedSteps.includes(step);
        const isCurrent = step === currentStep;
        const isPast = index < currentIndex;

        return (
          <div key={step} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted || isPast
                    ? 'bg-green-500 border-green-600 text-white'
                    : isCurrent
                    ? 'bg-yellow-400 border-yellow-600 text-black scale-110'
                    : 'bg-gray-200 border-gray-400 text-gray-500'
                }`}
              >
                {isCompleted || isPast ? (
                  <span className="text-sm font-bold">✓</span>
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-bold text-center hand-drawn ${
                  isCurrent ? 'text-black' : 'text-gray-500'
                }`}
              >
                {STEP_LABELS[step]}
              </span>
            </div>

            {/* Connector line */}
            {index < STEP_ORDER.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-all ${
                  isPast || isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

