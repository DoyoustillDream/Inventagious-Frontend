'use client';

import { OnboardingError, getErrorRecoveryAction } from '@/lib/wallet/error-handler';

interface ErrorRecoveryProps {
  error: OnboardingError;
  onRetry: () => void;
  onDismiss?: () => void;
}

export default function ErrorRecovery({ error, onRetry, onDismiss }: ErrorRecoveryProps) {
  if (!error) return null;

  const recoveryAction = getErrorRecoveryAction(error);

  return (
    <div className="browser-window bg-red-50 border-4 border-red-500 rounded-lg p-6 mb-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
          ✕
        </div>
        <div className="flex-1">
          <h3 className="hand-drawn text-lg font-bold text-red-800 mb-2">
            Error
          </h3>
          <p className="hand-drawn text-sm font-bold text-red-700 mb-4">
            {error.message}
          </p>
          
          {error.recoverable && (
            <div className="flex gap-3 flex-wrap">
              {error.retryable && (
                <button
                  onClick={onRetry}
                  className="hand-drawn rounded-lg border-2 border-red-600 bg-white px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100 transition"
                >
                  Try Again
                </button>
              )}
              {recoveryAction && (
                <button
                  onClick={recoveryAction.action}
                  className="hand-drawn rounded-lg border-2 border-red-600 bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 transition"
                >
                  {recoveryAction.label}
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="hand-drawn rounded-lg border-2 border-gray-400 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 transition"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

