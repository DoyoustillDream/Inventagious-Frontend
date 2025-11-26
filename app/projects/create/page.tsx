'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/components/auth/AuthProvider';

export default function CreateProjectPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 halftone-gray py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h1 className="hand-drawn mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-black">
              Create Your Project
            </h1>
            <p className="hand-drawn text-lg md:text-xl font-bold text-gray-800 mb-4">
              Choose the type of project you want to create
            </p>
            <div className="squiggly-underline inline-block mt-4" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Crowdfunding Campaign Option */}
              <Link
                href="/campaigns/create"
                className="browser-window transition-all hover:scale-105 active:scale-95"
              >
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    PUBLIC
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h2 className="hand-drawn text-2xl font-bold text-black mb-3">
                    Crowdfunding Campaign
                  </h2>
                  <p className="hand-drawn text-base font-semibold text-gray-700 mb-6">
                    Launch a public campaign where anyone can contribute. Perfect for reaching a wide audience and building community support.
                  </p>
                  <div className="hand-drawn border-4 border-black bg-black px-6 py-3 text-base font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black">
                    Create Campaign →
                  </div>
                </div>
              </Link>

              {/* Private Funding Option */}
              <Link
                href="/deals/create"
                className="browser-window transition-all hover:scale-105 active:scale-95"
              >
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    PRIVATE
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
                  <h2 className="hand-drawn text-2xl font-bold text-black mb-3">
                    Private Funding
                  </h2>
                  <p className="hand-drawn text-base font-semibold text-gray-700 mb-6">
                    Set up a private funding opportunity for select investors. Ideal for exclusive deals and targeted fundraising.
                  </p>
                  <div className="hand-drawn border-4 border-black bg-black px-6 py-3 text-base font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black">
                    Create Private Project →
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

