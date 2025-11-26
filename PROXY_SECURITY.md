# Backend Proxy Security Implementation

## Overview

All backend API calls in the frontend are now **required** to go through the Next.js proxy at `/api`. This hides the backend URL from clients, preventing exposure of the backend identity and infrastructure details.

## Security Benefits

1. **Backend Identity Protection**: The actual backend URL (e.g., `http://localhost:3001`) is never exposed to the client
2. **Infrastructure Hiding**: Clients cannot discover backend server details
3. **CORS Simplification**: All requests appear to come from the same origin
4. **Centralized Control**: All API traffic goes through Next.js, enabling easier monitoring and rate limiting

## Implementation Details

### 1. API Client (`lib/api/client.ts`)

- **Client-side**: Uses relative path `/api` (automatically proxied by Next.js)
- **Server-side**: Constructs full URL with `/api` path (e.g., `http://localhost:3000/api`)
- **Validation**: All URLs are validated to ensure they use the proxy, not direct backend URLs

### 2. Next.js Proxy Configuration (`next.config.ts`)

- Rewrites all `/api/*` requests to the backend URL
- Uses server-side only `BACKEND_URL` environment variable
- Validates that `NEXT_PUBLIC_API_URL` is not a direct backend URL

### 3. Environment Variables (`.env`)

- `BACKEND_URL`: Server-side only, contains the actual backend URL (e.g., `http://localhost:3001`)
- `NEXT_PUBLIC_API_URL`: Must be set to `/api` (the proxy path), never a direct backend URL

### 4. Proxy Validator (`lib/api/proxy-validator.ts`)

- Validates URLs before making API calls
- Prevents direct backend URL usage
- Provides helpful error messages for misconfiguration

## Usage

All API calls automatically use the proxy. No changes needed in your code:

```typescript
import { projectsApi } from '@/lib/api/projects';

// This automatically goes through /api proxy
const projects = await projectsApi.getAll();
```

## Security Checks

The system includes multiple layers of validation:

1. **Environment Variable Validation**: Checks `NEXT_PUBLIC_API_URL` at build time
2. **Constructor Validation**: Validates API client initialization
3. **Runtime Validation**: Validates each request URL before making the call
4. **Next.js Config Validation**: Validates proxy configuration at build time

## Error Messages

If you see security errors, they indicate a misconfiguration:

- `SECURITY ERROR: NEXT_PUBLIC_API_URL must use the proxy path "/api"`: 
  - Fix: Set `NEXT_PUBLIC_API_URL=/api` in `.env`
  
- `SECURITY ERROR: Direct backend URL detected`:
  - Fix: Ensure all API calls use `/api` path, not direct backend URLs

## Development vs Production

- **Development**: Proxy rewrites `/api/*` to `http://localhost:3001/*`
- **Production**: Proxy rewrites `/api/*` to your production backend URL (set via `BACKEND_URL`)

## Important Notes

⚠️ **NEVER** set `NEXT_PUBLIC_API_URL` to a direct backend URL (e.g., `http://localhost:3001`)
⚠️ **NEVER** use direct backend URLs in API calls
⚠️ **ALWAYS** use the `/api` proxy path for all backend communication

## Testing

To verify the proxy is working:

1. Check browser DevTools Network tab - all API calls should go to `/api/*`
2. No backend URLs should appear in client-side code
3. Server-side calls should use full URLs with `/api` path

