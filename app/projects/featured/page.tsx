import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { FeaturedProjectsList, FeaturedProjectsListSkeleton } from '@/components/public/FeaturedProjectsList';
import { siteConfig } from '@/lib/seo';
import { WebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Featured Projects',
  description: 'Discover trending and featured projects on Inventagious. Explore the most innovative crowdfunding and private funding projects from inventors and innovators worldwide.',
  alternates: {
    canonical: `${siteConfig.url}/projects/featured`,
  },
  openGraph: {
    title: 'Featured Projects - Inventagious',
    description: 'Discover trending and featured projects on Inventagious. Explore the most innovative crowdfunding and private funding projects from inventors and innovators worldwide.',
    url: `${siteConfig.url}/projects/featured`,
    type: 'website',
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Featured Projects - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Featured Projects - Inventagious',
    description: 'Discover trending and featured projects on Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function FeaturedProjectsPage() {
  return (
    <>
      <WebPageSchema 
        title="Featured Projects - Inventagious"
        description="Discover trending and featured projects on Inventagious. Explore the most innovative crowdfunding and private funding projects from inventors and innovators worldwide."
        url={`${siteConfig.url}/projects/featured`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1" id="main-content">
          <section className="halftone-gray py-12">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <div className="flex justify-center mb-4">
                  <svg
                    className="h-12 w-12 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h1 className="hand-drawn mb-4 text-5xl font-bold text-black">
                  Featured Projects
                </h1>
                <p className="text-lg font-semibold text-gray-800">
                  Discover trending projects from inventors and innovators
                </p>
                <div className="squiggly-underline inline-block mt-4" />
              </div>
              <Suspense fallback={<FeaturedProjectsListSkeleton />}>
                <FeaturedProjectsList />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

