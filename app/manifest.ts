import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'Inventagious',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#facc15',
    theme_color: '#facc15',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/logos/logo-bulb.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any maskable' as 'any' | 'maskable' | 'monochrome',
      },
      {
        src: '/logos/logo-bulb.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logos/logo-bulb.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['finance', 'business', 'productivity', 'technology'],
    lang: siteConfig.language,
    dir: 'ltr',
    screenshots: [],
    shortcuts: [
      {
        name: 'Explore Projects',
        short_name: 'Explore',
        description: 'Discover innovative projects',
        url: '/explore',
        icons: [{ src: '/logos/logo-bulb.png', sizes: '96x96' }],
      },
      {
        name: 'Create Project',
        short_name: 'Create',
        description: 'Start your own project',
        url: '/projects/create',
        icons: [{ src: '/logos/logo-bulb.png', sizes: '96x96' }],
      },
    ],
  };
}

