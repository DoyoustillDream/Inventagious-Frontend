# SEO Module

This directory contains all SEO-related configurations and utilities for the Inventagious platform.

## Structure

- `config.ts` - Centralized SEO configuration (site metadata, keywords, URLs)
- `structured-data.tsx` - JSON-LD schema components for rich snippets
- `metadata-utils.ts` - Helper functions for generating page-specific metadata
- `analytics.tsx` - Google Analytics and Tag Manager components
- `head-components.tsx` - Additional head elements for SEO optimization
- `index.ts` - Module exports

## Usage

### Basic Page Metadata

```typescript
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Projects',
  description: 'Discover innovative projects on Inventagious',
  url: '/projects',
});
```

### Article/Project Metadata

```typescript
import { generateArticleMetadata } from '@/lib/seo';

export const metadata = generateArticleMetadata({
  title: 'My Amazing Project',
  description: 'A revolutionary invention...',
  publishedTime: '2024-01-01T00:00:00Z',
  url: '/projects/my-project',
  tags: ['innovation', 'web3'],
});
```

### Structured Data

```typescript
import { WebPageSchema, BreadcrumbSchema } from '@/lib/seo';

export default function Page() {
  return (
    <>
      <WebPageSchema title="Page Title" url="/page" />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Page', url: '/page' }
      ]} />
      {/* Page content */}
    </>
  );
}
```

### Analytics

```typescript
import { GoogleAnalytics } from '@/lib/seo';

export default function Layout({ children }) {
  return (
    <>
      <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
      {children}
    </>
  );
}
```

## Configuration

Update `config.ts` to customize:
- Site name, description, and keywords
- Social media handles
- Verification codes (Google, Bing, Yandex)
- Default images and URLs

## SEO Checklist

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD)
- ✅ Sitemap generation
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Mobile optimization
- ✅ Performance optimization
- ✅ Image alt text
- ✅ Semantic HTML

