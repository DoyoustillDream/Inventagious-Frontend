import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/dashboard/',
          '/auth/',
          '/profile/edit/',
          '/profile/settings/',
          '/profile/notifications/',
          '/wallet/',
          '/email/unsubscribe/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/dashboard/',
          '/auth/',
          '/profile/edit/',
          '/profile/settings/',
          '/profile/notifications/',
          '/wallet/',
          '/email/unsubscribe/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/dashboard/',
          '/auth/',
          '/profile/edit/',
          '/profile/settings/',
          '/profile/notifications/',
          '/wallet/',
          '/email/unsubscribe/',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

