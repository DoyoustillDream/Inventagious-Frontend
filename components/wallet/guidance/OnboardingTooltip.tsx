'use client';

import { useState, useEffect } from 'react';
import { OnboardingStep, STEP_DESCRIPTIONS, STORAGE_KEYS } from '@/lib/wallet/onboarding-config';

interface OnboardingTooltipProps {
  step: OnboardingStep;
  message?: string;
}

const TOOLTIP_MESSAGES: Partial<Record<OnboardingStep, string>> = {
  connection: 'Connect your wallet to get started. You can use Google, Apple, or your browser extension.',
  authentication: 'Signing this message proves you own the wallet. It doesn\'t grant any permissions.',
  profile: 'We need your name and email to create your account. This information is kept private.',
};

export default function OnboardingTooltip({ step, message }: OnboardingTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(STORAGE_KEYS.TOOLTIPS_DISMISSED);
      if (dismissed) {
        const dismissedSteps = JSON.parse(dismissed);
        if (dismissedSteps.includes(step)) {
          setIsDismissed(true);
          return;
        }
      }
    }

    // Show tooltip after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [step]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);

    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(STORAGE_KEYS.TOOLTIPS_DISMISSED);
      const dismissedSteps = dismissed ? JSON.parse(dismissed) : [];
      if (!dismissedSteps.includes(step)) {
        dismissedSteps.push(step);
        localStorage.setItem(STORAGE_KEYS.TOOLTIPS_DISMISSED, JSON.stringify(dismissedSteps));
      }
    }
  };

  const displayMessage = message || TOOLTIP_MESSAGES[step] || STEP_DESCRIPTIONS[step];

  if (isDismissed || !isVisible || !displayMessage) {
    return null;
  }

  return (
    <div className="browser-window bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mb-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-xl">💡</div>
        <div className="flex-1">
          <p className="hand-drawn text-sm font-bold text-blue-800">
            {displayMessage}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-blue-600 hover:text-blue-800 text-lg font-bold"
          aria-label="Dismiss tooltip"
        >
          ×
        </button>
      </div>
    </div>
  );
}

