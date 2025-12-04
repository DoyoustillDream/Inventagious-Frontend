import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ExploreHero from '@/components/public/Explore/ExploreHero';
import ExploreProjectsList from '@/components/public/Explore/ExploreProjectsList';
import ExploreProjectsListSkeleton from '@/components/public/Explore/ExploreProjectsListSkeleton';
import { siteConfig, WebPageSchema, BreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Explore innovative crowdfunding and private funding projects on Inventagious. Discover groundbreaking ideas from inventors and innovators building on Solana blockchain.',
  alternates: {
    canonical: `${siteConfig.url}/explore`,
  },
  openGraph: {
    title: 'Explore - Inventagious',
    description: 'Explore innovative crowdfunding and private funding projects on Inventagious. Discover groundbreaking ideas from inventors and innovators building on Solana blockchain.',
    url: `${siteConfig.url}/explore`,
    type: 'website',
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Explore - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore - Inventagious',
    description: 'Explore innovative crowdfunding and private funding projects on Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function ExplorePage() {
  return (
    <>
      <WebPageSchema 
        title="Explore - Inventagious"
        description="Explore innovative crowdfunding and private funding projects on Inventagious. Discover groundbreaking ideas from inventors and innovators building on Solana blockchain."
        url={`${siteConfig.url}/explore`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Explore', url: `${siteConfig.url}/explore` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <ExploreHero />
          <section className="halftone-gray py-12">
            <div className="container mx-auto px-4">
              <Suspense fallback={<ExploreProjectsListSkeleton />}>
                <ExploreProjectsList />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

