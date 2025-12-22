'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { authApi } from '@/lib/api/auth';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing. Please check your email for the verification link.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        
        if (response.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully! You can now use all features of Inventagious.');
          
          // Redirect to home after 3 seconds
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response.message || 'Failed to verify email. Please try again.');
        }
      } catch (error: any) {
        setStatus('error');
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to verify email. The link may have expired.';
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 halftone-gray py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="browser-window">
              <div className="browser-header">
                <div className="browser-controls">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
                <div className="flex-1" />
                <div className="yellow-highlight hand-drawn text-xs font-bold">
                  VERIFY EMAIL
                </div>
                <div className="flex-1" />
              </div>
              <div className="p-8 text-center">
                {status === 'loading' && (
                  <>
                    <div className="mb-6">
                      <div className="mx-auto h-16 w-16 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h1 className="hand-drawn mb-4 text-3xl md:text-4xl font-bold text-black">
                      Verifying Email...
                    </h1>
                    <p className="hand-drawn text-base font-semibold text-gray-700">
                      Please wait while we verify your email address.
                    </p>
                  </>
                )}

                {status === 'success' && (
                  <>
                    <div className="mb-6">
                      <svg
                        className="mx-auto h-16 w-16 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h1 className="hand-drawn mb-4 text-3xl md:text-4xl font-bold text-black">
                      Email Verified! 🎉
                    </h1>
                    <p className="hand-drawn text-base font-semibold text-gray-700 mb-6">
                      {message}
                    </p>
                    <p className="hand-drawn text-sm font-medium text-gray-600">
                      Redirecting you to the home page...
                    </p>
                  </>
                )}

                {status === 'error' && (
                  <>
                    <div className="mb-6">
                      <svg
                        className="mx-auto h-16 w-16 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h1 className="hand-drawn mb-4 text-3xl md:text-4xl font-bold text-black">
                      Verification Failed
                    </h1>
                    <p className="hand-drawn text-base font-semibold text-gray-700 mb-6">
                      {message}
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={() => router.push('/sign-in')}
                        className="w-full hand-drawn px-6 py-3 border-2 border-black rounded-lg bg-white text-black font-bold hover:bg-yellow-400 transition-colors"
                      >
                        Go to Sign In
                      </button>
                      <p className="hand-drawn text-sm font-medium text-gray-600">
                        Need help?{' '}
                        <a
                          href="/contact"
                          className="text-black underline hover:text-gray-700"
                        >
                          Contact Support
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 halftone-gray py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-md mx-auto">
                <div className="browser-window">
                  <div className="browser-header">
                    <div className="browser-controls">
                      <div className="browser-dot red" />
                      <div className="browser-dot yellow" />
                      <div className="browser-dot green" />
                    </div>
                    <div className="flex-1" />
                    <div className="yellow-highlight hand-drawn text-xs font-bold">
                      VERIFY EMAIL
                    </div>
                    <div className="flex-1" />
                  </div>
                  <div className="p-8 text-center">
                    <div className="mb-6">
                      <div className="mx-auto h-16 w-16 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h1 className="hand-drawn mb-4 text-3xl md:text-4xl font-bold text-black">
                      Loading...
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

