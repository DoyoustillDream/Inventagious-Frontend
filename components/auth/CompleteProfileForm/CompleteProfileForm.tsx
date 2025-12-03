'use client';

import { useState, FormEvent } from 'react';
import { authApi } from '@/lib/api/auth';
import { useAuth } from '@/components/auth/AuthProvider';

interface CompleteProfileFormProps {
  walletAddress: string;
  onComplete: () => void;
  onCancel?: () => void;
}

export default function CompleteProfileForm({
  walletAddress,
  onComplete,
  onCancel,
}: CompleteProfileFormProps) {
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.completeWalletProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
      });

      if (response.user) {
        setUser(response.user);
        // Call onComplete which will handle redirect
        onComplete();
      } else {
        setError('Failed to complete profile. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      const errorMessage =
        err?.message || err?.response?.data?.message || 'Failed to complete profile. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="browser-window max-w-md w-full mx-4">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <h2 className="hand-drawn text-lg font-bold text-black">Complete Your Profile</h2>
          <div className="flex-1" />
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-black text-xl font-bold"
              disabled={isLoading}
            >
              ×
            </button>
          )}
        </div>

        <div className="p-6">
          <p className="hand-drawn text-base font-semibold text-gray-700 mb-6">
            Please provide your full name and email to continue using Inventagious.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-lg text-sm text-red-700">
              <p className="hand-drawn font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-bold text-black mb-2"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border-2 border-black rounded-lg hand-drawn text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-black mb-2"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border-2 border-black rounded-lg hand-drawn text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="john@example.com"
              />
            </div>

            <div className="text-xs text-gray-700">
              <p className="font-semibold">Wallet Address: <span className="hand-drawn font-bold text-black">{walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}</span></p>
            </div>

            <div className="flex gap-3 pt-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 hand-drawn rounded-lg border-4 border-black bg-white px-6 py-3 text-base font-bold text-black transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !fullName.trim() || !email.trim()}
                className="flex-1 hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Completing...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

