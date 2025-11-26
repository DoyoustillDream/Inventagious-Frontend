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
    // Get the site URL from environment or use default
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      if (process.env.VERCEL_URL) {
        siteUrl = `https://${process.env.VERCEL_URL}`;
      } else {
        // Default to localhost for development
        siteUrl = 'http://localhost:3000';
      }
    }
    return `${siteUrl}${proxyPath}`;
  }
  
  // Client-side: use relative path (works with Next.js rewrites)
  return proxyPath;
}

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    // Validate that we're using the proxy, not a direct backend URL
    // Check for direct backend URLs (localhost:3001 or 127.0.0.1:3001)
    if (baseUrl.includes('localhost:3001') || baseUrl.includes('127.0.0.1:3001')) {
      throw new Error(
        'SECURITY ERROR: API client cannot use direct backend URLs. ' +
        'All calls must go through the Next.js proxy at "/api"'
      );
    }
    
    // For server-side full URLs, ensure they include '/api' proxy path
    if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
      if (!baseUrl.includes('/api')) {
        throw new Error(
          'SECURITY ERROR: API client URLs must use the "/api" proxy path. ' +
          `Received: ${baseUrl}`
        );
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
    
    // SECURITY: Validate that we're using the proxy, not a direct backend URL
    validateProxyUrl(url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

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

