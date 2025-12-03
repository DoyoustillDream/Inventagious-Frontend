/**
 * Proxy Validator Utility
 * 
 * SECURITY: Ensures all backend API calls go through the Next.js proxy
 * This prevents exposing the backend URL to clients
 */

/**
 * Validates that a URL is using the proxy path, not a direct backend URL
 * @param url - The URL to validate
 * @throws Error if the URL is a direct backend URL
 */
export function validateProxyUrl(url: string): void {
  const isServerSide = typeof window === 'undefined';
  const backendUrl = process.env.BACKEND_URL;
  const normalizedBackendUrl = backendUrl ? backendUrl.replace(/\/+$/, '') : null;
  
  // Allow BACKEND_URL for server-side calls only (secure - never exposed to client)
  if (isServerSide && normalizedBackendUrl && url.startsWith(normalizedBackendUrl)) {
    return; // Valid server-side direct backend URL
  }
  
  // Client-side: must use proxy, never allow direct backend URLs
  if (!isServerSide) {
    const backendPatterns = [
      /localhost:3001/,
      /127\.0\.0\.1:3001/,
      // Add other backend URL patterns here if needed
    ];

    for (const pattern of backendPatterns) {
      if (pattern.test(url)) {
        throw new Error(
          `SECURITY ERROR: Direct backend URL detected: ${url}. ` +
          `All client-side API calls must go through the Next.js proxy at '/api' to hide the backend identity.`
        );
      }
    }
  }

  // For relative URLs starting with /api, they're using the proxy - that's good
  if (url.startsWith('/api')) {
    return; // Valid proxy usage
  }

  // For absolute URLs (server-side), they must include '/api' in the path (unless using BACKEND_URL)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Check if it's a backend API call (not external services)
    const isExternalService = url.includes('google') || 
                              url.includes('vercel') || 
                              url.includes('cdn') ||
                              url.includes('fonts') ||
                              url.includes('analytics');
    
    if (!isExternalService && !url.includes('/api')) {
      // Server-side can use BACKEND_URL, client-side cannot
      if (!isServerSide) {
        throw new Error(
          `SECURITY ERROR: Client-side backend API URL must use '/api' proxy path. ` +
          `Received: ${url}. This exposes the backend identity.`
        );
      }
      // Server-side: if not using BACKEND_URL, must use /api
      if (isServerSide && (!normalizedBackendUrl || !url.startsWith(normalizedBackendUrl))) {
        throw new Error(
          `SECURITY ERROR: Server-side backend API URL must use '/api' proxy path or BACKEND_URL. ` +
          `Received: ${url}.`
        );
      }
    }
  }
}

/**
 * Gets a safe API URL that uses the proxy
 * @returns The proxy path '/api'
 */
export function getProxyApiUrl(): string {
  return '/api';
}

/**
 * Validates environment variables to ensure proxy is configured correctly
 * @throws Error if proxy configuration is invalid
 */
export function validateProxyConfig(): void {
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If NEXT_PUBLIC_API_URL is set, it must be '/api' (the proxy path)
  if (publicApiUrl && publicApiUrl !== '/api') {
    if (publicApiUrl.startsWith('http://') || publicApiUrl.startsWith('https://')) {
      throw new Error(
        'SECURITY ERROR: NEXT_PUBLIC_API_URL must be "/api" (proxy path), not a direct backend URL. ' +
        `Current value: ${publicApiUrl}. This exposes the backend identity to clients.`
      );
    }
  }
}

