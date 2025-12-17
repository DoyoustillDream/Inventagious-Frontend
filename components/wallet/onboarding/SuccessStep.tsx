'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SuccessAnimation from '../feedback/SuccessAnimation';
import { useAuth } from '@/components/auth/AuthProvider';
import { defaultOnboardingConfig } from '@/lib/wallet/onboarding-config';

interface SuccessStepProps {
  onRedirect?: () => void;
}

export default function SuccessStep({ onRedirect }: SuccessStepProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let redirectTimeout: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (interval) clearInterval(interval);
          // Use a separate timeout for redirect to prevent multiple redirects
          if (!redirectTimeout) {
            redirectTimeout = setTimeout(() => {
              if (onRedirect) {
                onRedirect();
              } else {
                router.push('/');
              }
            }, 100);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [router, onRedirect]);

  return (
    <div className="space-y-6">
      <SuccessAnimation />

      <div className="browser-window bg-white p-6">
        <h2 className="hand-drawn text-2xl font-bold text-black mb-4 text-center">
          Welcome to Inventagious!
        </h2>
        <p className="hand-drawn text-base font-bold text-gray-700 mb-6 text-center">
          {user?.fullName ? `Hi ${user.fullName}! ` : ''}Your wallet is connected and you're ready to start.
        </p>

        <div className="space-y-4">
          <div className="browser-window bg-green-50 border-2 border-green-500 rounded-lg p-4">
            <p className="hand-drawn text-sm font-bold text-green-800 text-center">
              ✓ Account created successfully
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (onRedirect) {
                  onRedirect();
                } else {
                  router.push('/');
                }
              }}
              className="flex-1 hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-6 py-3 text-base font-bold text-black hover:bg-yellow-500 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="flex-1 hand-drawn rounded-lg border-4 border-black bg-white px-6 py-3 text-base font-bold text-black hover:bg-gray-100 transition"
            >
              View Profile
            </button>
          </div>

          <p className="hand-drawn text-xs font-bold text-gray-600 text-center">
            Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    </div>
  );
}

