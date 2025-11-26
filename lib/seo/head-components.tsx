/**
 * Additional Head Components for SEO
 * Preconnect, DNS prefetch, and other performance optimizations
 */

export function SEOHeadComponents() {
  return (
    <>
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for common external resources */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Additional meta tags */}
      <meta name="application-name" content="Inventagious" />
      <meta name="msapplication-TileColor" content="#facc15" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Language and region */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="language" content="English" />
      
      {/* Content rating */}
      <meta name="rating" content="General" />
      
      {/* Distribution */}
      <meta name="distribution" content="Global" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Mobile optimization */}
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="320" />
    </>
  );
}

