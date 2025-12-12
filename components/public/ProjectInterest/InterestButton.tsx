'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { projectInterestsApi } from '@/lib/api/project-interests';
import { useToast } from '@/components/shared/Toast/ToastProvider';

interface InterestButtonProps {
  projectId: string;
  interestCount?: number;
  className?: string;
  showCount?: boolean;
  onInterestChange?: (isInterested: boolean, newCount: number) => void;
}

export default function InterestButton({
  projectId,
  interestCount: initialCount,
  className = '',
  showCount = true,
  onInterestChange,
}: InterestButtonProps) {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isInterested, setIsInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(initialCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Load interest status
  useEffect(() => {
    if (!isAuthenticated || !projectId) return;

    const loadInterestStatus = async () => {
      try {
        const [status, count] = await Promise.all([
          projectInterestsApi.isInterested(projectId),
          projectInterestsApi.getInterestCount(projectId),
        ]);
        setIsInterested(status.isInterested);
        setInterestCount(count.count);
      } catch (err) {
        console.error('Error loading interest status:', err);
      }
    };

    loadInterestStatus();
  }, [isAuthenticated, projectId]);

  const handleToggleInterest = useCallback(async () => {
    if (!isAuthenticated) {
      showError('Please sign in to express interest');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isInterested) {
        await projectInterestsApi.removeInterest(projectId);
        setIsInterested(false);
        setInterestCount((prev) => Math.max(0, prev - 1));
        showSuccess('Removed from your interests');
        onInterestChange?.(false, interestCount - 1);
      } else {
        await projectInterestsApi.addInterest(projectId);
        setIsInterested(true);
        setInterestCount((prev) => prev + 1);
        showSuccess('Added to your interests');
        onInterestChange?.(true, interestCount + 1);
      }
    } catch (err: any) {
      console.error('Error toggling interest:', err);
      showError(err?.message || 'Failed to update interest');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isInterested, projectId, interestCount, isLoading, showSuccess, showError, onInterestChange]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleToggleInterest}
      disabled={isLoading}
      className={`hand-drawn flex items-center gap-2 px-4 py-2 border-4 border-black rounded-lg font-bold transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        isInterested
          ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
          : 'bg-white hover:bg-yellow-100 text-black'
      } ${className}`}
    >
      <svg
        className={`w-5 h-5 ${isInterested ? 'fill-current' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isInterested ? "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" : "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"}
        />
      </svg>
      <span>{isInterested ? 'Interested' : 'Show Interest'}</span>
      {showCount && interestCount > 0 && (
        <span className="px-2 py-1 bg-black text-white rounded text-sm">
          {interestCount}
        </span>
      )}
    </button>
  );
}

