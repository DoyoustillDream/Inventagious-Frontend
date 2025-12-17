'use client';

import { useState, useEffect, useCallback } from 'react';
import { OnboardingStep, STORAGE_KEYS, getStepProgress } from '@/lib/wallet/onboarding-config';

export interface OnboardingProgress {
  currentStep: OnboardingStep;
  progress: number;
  completedSteps: OnboardingStep[];
  startedAt: number | null;
  completedAt: number | null;
}

/**
 * Hook to track onboarding progress
 */
export function useOnboardingProgress(initialStep: OnboardingStep = 'detection') {
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: initialStep,
    progress: getStepProgress(initialStep),
    completedSteps: [],
    startedAt: null,
    completedAt: null,
  });

  // Load saved progress on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProgress((prev) => ({
            ...prev,
            currentStep: parsed.currentStep || initialStep,
            completedSteps: parsed.completedSteps || [],
            startedAt: parsed.startedAt || null,
            progress: getStepProgress(parsed.currentStep || initialStep),
          }));
        } catch (e) {
          // Invalid saved state, start fresh
        }
      } else {
        // First time - set startedAt
        setProgress((prev) => ({
          ...prev,
          startedAt: Date.now(),
        }));
      }
    }
  }, [initialStep]);

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && progress.startedAt) {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_PROGRESS, JSON.stringify({
        currentStep: progress.currentStep,
        completedSteps: progress.completedSteps,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
      }));
    }
  }, [progress]);

  const setStep = useCallback((step: OnboardingStep) => {
    setProgress((prev) => {
      const newCompletedSteps = [...prev.completedSteps];
      const currentIndex = newCompletedSteps.indexOf(prev.currentStep);
      if (currentIndex === -1 && prev.currentStep !== step) {
        newCompletedSteps.push(prev.currentStep);
      }

      return {
        ...prev,
        currentStep: step,
        progress: getStepProgress(step),
        completedSteps: newCompletedSteps,
      };
    });
  }, []);

  const markStepComplete = useCallback((step: OnboardingStep) => {
    setProgress((prev) => {
      const newCompletedSteps = [...prev.completedSteps];
      if (!newCompletedSteps.includes(step)) {
        newCompletedSteps.push(step);
      }

      return {
        ...prev,
        completedSteps: newCompletedSteps,
        progress: getStepProgress(prev.currentStep),
      };
    });
  }, []);

  const markComplete = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      completedAt: Date.now(),
    }));

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
    }
  }, []);

  const reset = useCallback(() => {
    setProgress({
      currentStep: initialStep,
      progress: getStepProgress(initialStep),
      completedSteps: [],
      startedAt: Date.now(),
      completedAt: null,
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    }
  }, [initialStep]);

  return {
    ...progress,
    setStep,
    markStepComplete,
    markComplete,
    reset,
  };
}

