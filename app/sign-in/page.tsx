'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import WalletConnect from '@/components/auth/WalletConnect';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { getDefaultAuthRedirect } from '@/lib/utils/redirect';

export default function SignInPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { redirectAfterAuth } = useAuthRedirect();

  // Only redirect if user is already authenticated when page loads
  // Don't redirect during the authentication process - let useWalletAuth handle that
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Small delay to let useWalletAuth complete its redirect first
      const timer = setTimeout(() => {
        // Only redirect if still on sign-in page (useWalletAuth didn't redirect)
        if (window.location.pathname === '/sign-in') {
          redirectAfterAuth();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, redirectAfterAuth]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-black">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

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
                  SIGN IN
                </div>
                <div className="flex-1" />
              </div>
              <div className="p-8 text-center">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-16 w-16 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h1 className="hand-drawn mb-4 text-3xl md:text-4xl font-bold text-black">
                  Sign In Required
                </h1>
                <p className="hand-drawn text-base font-semibold text-gray-700 mb-8">
                  Please connect your Solana wallet to continue. You'll need to sign a message to verify your identity.
                </p>
                <div className="flex justify-center">
                  <WalletConnect />
                </div>
                <p className="hand-drawn text-sm font-medium text-gray-600 mt-6">
                  Don't have a wallet?{' '}
                  <a
                    href="https://phantom.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black underline hover:text-gray-700"
                  >
                    Install Phantom
                  </a>
                  {' '}or{' '}
                  <a
                    href="https://solflare.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black underline hover:text-gray-700"
                  >
                    Solflare
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

