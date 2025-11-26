'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CreateDealForm from '@/components/private/CreateDealForm';
import { useAuth } from '@/components/auth/AuthProvider';

export default function CreateDealPage() {
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
              Create Private Funding Project
            </h1>
            <p className="hand-drawn text-lg md:text-xl font-bold text-gray-800 mb-4">
              Set up a private funding opportunity for investors
            </p>
            <div className="squiggly-underline inline-block mt-4" />
          </div>
          <div className="max-w-7xl mx-auto">
            <CreateDealForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

