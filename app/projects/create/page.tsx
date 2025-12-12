'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { setRedirectPath } from '@/lib/utils/redirect';

export default function CreateProjectPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect to campaigns/create instead of showing selection page
    if (!isLoading) {
      if (!isAuthenticated) {
        // Store the current path so we can redirect back after sign in
        if (pathname) {
          setRedirectPath(pathname);
        }
        router.push('/sign-in');
      } else {
        // Redirect authenticated users directly to campaign creation
        router.push('/campaigns/create');
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // COMMENTED OUT: Private Funding Option - Previously showed a selection page with both Crowdfunding and Private Funding options
  // Now redirects directly to campaigns/create

  // Show loading state while redirecting
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-bold text-black">Redirecting...</div>
      </div>
    </div>
  );
}

