/**
 * Redirect utility functions for handling navigation after authentication
 */

const REDIRECT_KEY = 'auth_redirect_path';

/**
 * Store the intended redirect path before authentication
 */
export function setRedirectPath(path: string): void {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(REDIRECT_KEY, path);
    } catch (error) {
      console.warn('Failed to store redirect path:', error);
    }
  }
}

/**
 * Get and clear the stored redirect path
 */
export function getAndClearRedirectPath(): string | null {
  if (typeof window !== 'undefined') {
    try {
      const path = sessionStorage.getItem(REDIRECT_KEY);
      if (path) {
        sessionStorage.removeItem(REDIRECT_KEY);
        return path;
      }
    } catch (error) {
      console.warn('Failed to retrieve redirect path:', error);
    }
  }
  return null;
}

/**
 * Get the stored redirect path without clearing it
 */
export function getRedirectPath(): string | null {
  if (typeof window !== 'undefined') {
    try {
      return sessionStorage.getItem(REDIRECT_KEY);
    } catch (error) {
      console.warn('Failed to retrieve redirect path:', error);
    }
  }
  return null;
}

/**
 * Clear the stored redirect path
 */
export function clearRedirectPath(): void {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(REDIRECT_KEY);
    } catch (error) {
      console.warn('Failed to clear redirect path:', error);
    }
  }
}

/**
 * Check if a path requires authentication
 */
export function requiresAuth(path: string): boolean {
  const protectedPaths = ['/profile', '/private', '/projects/create', '/campaigns/create', '/deals/create'];
  return protectedPaths.some(protectedPath => path.startsWith(protectedPath));
}

/**
 * Get default redirect path after authentication
 */
export function getDefaultAuthRedirect(): string {
  return '/profile';
}

