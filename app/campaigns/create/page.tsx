'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CreateCampaignForm from '@/components/private/CreateCampaignForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWallet } from '@/hooks/useWallet';

export default function CreateCampaignPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { connected, publicKey, isLoading: walletLoading } = useWallet();
  const router = useRouter();

  // Allow access if either authenticated OR wallet connected
  const hasAccess = isAuthenticated || (connected && publicKey);
  const stillLoading = authLoading || walletLoading;

  useEffect(() => {
    // Only redirect if both auth and wallet are loaded and user has no access
    if (!stillLoading && !hasAccess) {
      router.push('/');
    }
  }, [hasAccess, stillLoading, router]);

  if (stillLoading) {
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

  if (!hasAccess) {
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

