// SECURITY: All backend calls MUST go through the Next.js proxy at '/api'
// This hides the backend URL from the client and prevents direct backend access
import { validateProxyUrl } from './proxy-validator';

const TOKEN_STORAGE_KEY = 'inventagious_auth_token';

/**
 * Gets the API base URL, ensuring all calls go through the proxy
 * - Client-side: Uses relative '/api' path (proxied by Next.js)
 * - Server-side: Constructs full URL using the site URL, still through '/api' proxy
 */
function getApiBaseUrl(): string {
  // Check if NEXT_PUBLIC_API_URL is set and validate it's using the proxy
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // SECURITY: Prevent direct backend URL usage
  if (envApiUrl && (envApiUrl.startsWith('http://') || envApiUrl.startsWith('https://'))) {
    throw new Error(
      'SECURITY ERROR: NEXT_PUBLIC_API_URL must use the proxy path "/api", not a direct backend URL. ' +
      'Direct backend URLs expose the backend identity and are not allowed.'
    );
  }

  // Use '/api' proxy path (default or from env if set to '/api')
  const proxyPath = envApiUrl || '/api';
  
  // On server-side, we need to construct the full URL
  if (typeof window === 'undefined') {
    // For server-side calls on Vercel, rewrites might not work reliably
    // So we use BACKEND_URL directly if available (it's server-side only, so secure)
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl) {
      // Normalize: remove trailing slash if present (endpoints start with /)
      const normalizedUrl = backendUrl.replace(/\/+$/, '');
      console.log(`[ApiClient] Using BACKEND_URL for server-side calls: ${normalizedUrl}`);
      return normalizedUrl;
    }
    
    // Fallback: construct URL from site URL (for local development or when BACKEND_URL not set)
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      if (process.env.VERCEL_URL) {
        // On Vercel, use the deployment URL
        siteUrl = `https://${process.env.VERCEL_URL}`;
      } else {
        // Default to localhost for development
        siteUrl = 'http://localhost:3000';
      }
    }
    const fullUrl = `${siteUrl}${proxyPath}`;
    console.log(`[ApiClient] Constructed server-side URL (no BACKEND_URL): ${fullUrl}`);
    return fullUrl;
  }
  
  // Client-side: use relative path (works with Next.js rewrites)
  return proxyPath;
}

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    const isServerSide = typeof window === 'undefined';
    const isBackendUrl = process.env.BACKEND_URL && baseUrl === process.env.BACKEND_URL.replace(/\/+$/, '');
    
    // Allow BACKEND_URL for server-side calls only (secure - never exposed to client)
    if (isServerSide && isBackendUrl) {
      this.baseUrl = baseUrl;
      return;
    }
    
    // Client-side: must use proxy, never allow direct backend URLs
    if (!isServerSide) {
      if (baseUrl.includes('localhost:3001') || baseUrl.includes('127.0.0.1:3001') || 
          (baseUrl.startsWith('http://') && !baseUrl.includes('/api')) ||
          (baseUrl.startsWith('https://') && !baseUrl.includes('/api'))) {
        throw new Error(
          'SECURITY ERROR: Client-side API calls cannot use direct backend URLs. ' +
          'All calls must go through the Next.js proxy at "/api"'
        );
      }
    }
    
    // Server-side validation: if not using BACKEND_URL, must use /api proxy
    if (isServerSide && !isBackendUrl) {
      if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
        if (!baseUrl.includes('/api')) {
          throw new Error(
            'SECURITY ERROR: Server-side API URLs must use the "/api" proxy path or BACKEND_URL. ' +
            `Received: ${baseUrl}`
          );
        }
      }
    }
    
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        this.token = storedToken;
      }
    }
  }

  setToken(token: string) {
    this.token = token;
    // Persist token to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }

  clearToken() {
    this.token = null;
    // Remove token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Log request details (server-side only for debugging)
    if (typeof window === 'undefined') {
      console.log(`[ApiClient] Making request to: ${url}`);
      console.log(`[ApiClient] Base URL: ${this.baseUrl}`);
      console.log(`[ApiClient] Endpoint: ${endpoint}`);
    }
    
    // SECURITY: Validate that we're using the proxy, not a direct backend URL
    validateProxyUrl(url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    let response: Response;
    try {
      // Create abort controller for timeout (server-side only)
      let abortController: AbortController | undefined;
      let timeoutId: NodeJS.Timeout | undefined;
      
      if (typeof window === 'undefined') {
        abortController = new AbortController();
        timeoutId = setTimeout(() => {
          abortController?.abort();
        }, 30000); // 30 second timeout
      }
      
      try {
        if (typeof window === 'undefined') {
          console.log(`[ApiClient] Fetching URL: ${url}`);
        }
        response = await fetch(url, {
          ...options,
          headers,
          signal: abortController?.signal,
        });
        if (typeof window === 'undefined') {
          console.log(`[ApiClient] Response status: ${response.status} ${response.statusText}`);
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    } catch (fetchError: any) {
      if (typeof window === 'undefined') {
        console.error(`[ApiClient] Fetch error for ${url}:`, {
          name: fetchError?.name,
          message: fetchError?.message,
          stack: fetchError?.stack,
        });
      }
      // Handle network errors, timeouts, etc.
      const isTimeout = fetchError.name === 'AbortError' && typeof window === 'undefined';
      const error = new Error(
        isTimeout
          ? `API request timeout: ${url}`
          : `API request failed: ${fetchError.message || 'Network error'}`
      );
      (error as any).status = 0;
      (error as any).statusText = isTimeout ? 'Timeout' : (fetchError.name || 'Network Error');
      (error as any).originalError = fetchError;
      throw error;
    }

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If response is not JSON, use statusText
      }
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).statusText = response.statusText;
      throw error;
    }

    return response.json();
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

