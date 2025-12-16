/**
 * URL normalization utilities
 * Ensures proper URL construction without double slashes or missing slashes
 */

/**
 * Normalize URL by removing trailing slashes from baseUrl and ensuring endpoint starts with /
 * @param baseUrl - The base URL (e.g., '/api', 'https://example.com', 'http://localhost:3001')
 * @param endpoint - The endpoint path (e.g., '/users', 'users', '/users/123')
 * @returns Normalized URL string
 * 
 * @example
 * normalizeUrl('/api', '/users') // '/api/users'
 * normalizeUrl('/api/', '/users') // '/api/users'
 * normalizeUrl('/api', 'users') // '/api/users'
 * normalizeUrl('https://example.com', '/api/users') // 'https://example.com/api/users'
 * normalizeUrl('https://example.com/', '/api/users') // 'https://example.com/api/users'
 */
export function normalizeUrl(baseUrl: string, endpoint: string): string {
  // Remove trailing slashes from baseUrl
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Combine them
  return `${normalizedBase}${normalizedEndpoint}`;
}

/**
 * Normalize a base URL by removing trailing slashes
 * @param baseUrl - The base URL to normalize
 * @returns Normalized base URL
 * 
 * @example
 * normalizeBaseUrl('https://example.com/') // 'https://example.com'
 * normalizeBaseUrl('/api/') // '/api'
 */
export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

/**
 * Ensure a path starts with a slash
 * @param path - The path to normalize
 * @returns Path that starts with /
 * 
 * @example
 * ensureLeadingSlash('users') // '/users'
 * ensureLeadingSlash('/users') // '/users'
 */
export function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

