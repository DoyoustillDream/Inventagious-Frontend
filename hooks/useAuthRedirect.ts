'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  setRedirectPath,
  getAndClearRedirectPath,
  requiresAuth,
  getDefaultAuthRedirect,
} from '@/lib/utils/redirect';

/**
 * Hook to handle authentication redirects
 * - Stores redirect path when accessing protected routes
 * - Redirects to stored path or default after authentication
 */
export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Store redirect path when accessing protected route while not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname && requiresAuth(pathname)) {
      setRedirectPath(pathname);
    }
  }, [isAuthenticated, isLoading, pathname]);

  /**
   * Redirect to stored path or default after authentication
   * @param defaultPath - Optional default path to redirect to if no stored path exists
   */
  const redirectAfterAuth = useCallback(
    (defaultPath?: string) => {
      const redirectPath = getAndClearRedirectPath() || defaultPath || getDefaultAuthRedirect();
      // Always redirect if we have a path and it's different from current path
      // Special case: if on sign-in page, always redirect (unless redirect path is also sign-in)
      if (redirectPath) {
        if (pathname === '/sign-in' && redirectPath !== '/sign-in') {
          router.push(redirectPath);
        } else if (redirectPath !== pathname) {
          router.push(redirectPath);
        }
      }
    },
    [router, pathname]
  );

  /**
   * Set a custom redirect path
   */
  const setCustomRedirect = useCallback((path: string) => {
    setRedirectPath(path);
  }, []);

  return {
    redirectAfterAuth,
    setCustomRedirect,
  };
}

