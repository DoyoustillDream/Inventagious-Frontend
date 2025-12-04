'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';

function NewsletterUnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    email: string;
    status: string;
    subscribed_at: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid unsubscribe link. Token is missing.');
      setLoading(false);
      return;
    }

    // Fetch subscription info
    apiClient
      .get(`/email/newsletter/subscription?token=${token}`)
      .then((data: any) => {
        setSubscription(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError('Invalid or expired unsubscribe link.');
        setLoading(false);
      });
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;

    setUnsubscribing(true);
    setError(null);

    try {
      await apiClient.post(`/email/newsletter/unsubscribe?token=${token}`);
      setSuccess(true);
      if (subscription) {
        setSubscription({ ...subscription, status: 'unsubscribed' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to unsubscribe. Please try again.');
    } finally {
      setUnsubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-4 border-black rounded-lg p-8 text-center">
          <p className="hand-drawn text-lg font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-4 border-black rounded-lg p-8 text-center">
          <h1 className="hand-drawn text-2xl font-bold text-black mb-4">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/"
            className="hand-drawn inline-block px-6 py-2 border-2 border-black rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-4 border-black rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="hand-drawn text-2xl font-bold text-black mb-4">
              Successfully Unsubscribed
            </h1>
            <p className="text-gray-700 mb-2">
              You have been unsubscribed from the Inventagious newsletter.
            </p>
            {subscription && (
              <p className="text-sm text-gray-600 mb-6">
                Email: <strong>{subscription.email}</strong>
              </p>
            )}
            <p className="text-sm text-gray-600 mb-6">
              You will no longer receive newsletter emails from us. If you change your mind, you can subscribe again from our website.
            </p>
          </div>
          <Link
            href="/"
            className="hand-drawn inline-block px-6 py-2 border-2 border-black rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-lg p-8">
        <h1 className="hand-drawn text-2xl font-bold text-black mb-4 text-center">
          Unsubscribe from Newsletter
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {subscription && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-2">
              You are subscribed to the Inventagious newsletter with:
            </p>
            <p className="text-base font-semibold text-black mb-4">
              {subscription.email}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to unsubscribe? You will no longer receive updates about new projects, platform features, and community highlights.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleUnsubscribe}
            disabled={unsubscribing || subscription?.status === 'unsubscribed'}
            className="w-full hand-drawn px-6 py-3 border-2 border-black rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {unsubscribing ? 'Unsubscribing...' : 'Yes, Unsubscribe Me'}
          </button>
          <Link
            href="/"
            className="block w-full text-center hand-drawn px-6 py-3 border-2 border-black rounded-lg bg-white text-black font-bold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-4 border-black rounded-lg p-8 text-center">
        <p className="hand-drawn text-lg font-bold">Loading...</p>
      </div>
    </div>
  );
}

export default function NewsletterUnsubscribePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewsletterUnsubscribeContent />
    </Suspense>
  );
}

