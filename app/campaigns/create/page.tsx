'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CreateCampaignForm from '@/components/private/CreateCampaignForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { setRedirectPath } from '@/lib/utils/redirect';

export default function CreateCampaignPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Add a delay to avoid race condition with auth state updates after redirect
    // Also check if we're coming back from sign-in (token might be in storage but state not updated yet)
    const timer = setTimeout(() => {
      if (!isLoading && !isAuthenticated) {
        // Store the current path so we can redirect back after sign in
        if (pathname) {
          setRedirectPath(pathname);
        }
        router.push('/sign-in');
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router, pathname]);

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
              Create Your Campaign
            </h1>
            <p className="hand-drawn text-lg md:text-xl font-bold text-gray-800 mb-4">
              Launch a public crowdfunding campaign
            </p>
            <div className="squiggly-underline inline-block mt-4" />
          </div>
          <div className="max-w-7xl mx-auto">
            <CreateCampaignForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

