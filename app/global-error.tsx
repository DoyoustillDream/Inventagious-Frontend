'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary component
 * This component is rendered when an error occurs in the root layout
 * It must be a client component and cannot use any contexts from the root layout
 * 
 * IMPORTANT: This component must not use any React hooks during SSR/prerendering
 * to avoid context-related errors during build time. All client-side logic is handled
 * via inline event handlers to ensure no context dependencies.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // All client-side logic is handled via inline functions to avoid hooks
  // This ensures no context lookups during build/prerendering

  return (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error - Something went wrong</title>
      </head>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#dc2626' }}>
            Something went wrong!
          </h1>
          <p style={{ marginBottom: '2rem', color: '#6b7280', textAlign: 'center', maxWidth: '600px' }}>
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          {error?.digest && (
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
              Error ID: {error.digest}
            </p>
          )}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  reset();
                }
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Try again
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Go home
            </button>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof console !== 'undefined' && console.error) {
                  console.error('Global error:', ${JSON.stringify({
                    message: error?.message || 'Unknown error',
                    digest: error?.digest,
                    name: error?.name || 'Error',
                  })});
                }
              `,
            }}
          />
        </div>
      </body>
    </html>
  );
}

