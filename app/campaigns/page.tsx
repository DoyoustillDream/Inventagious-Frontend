import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CampaignsList from '@/components/public/CampaignsList/CampaignsList';
import CampaignsListSkeleton from '@/components/public/CampaignsList/CampaignsListSkeleton';
import { siteConfig, WebPageSchema, BreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Crowdfunding Campaigns',
  description: 'Discover innovative crowdfunding campaigns on Inventagious. Support inventors and innovators building on Solana blockchain.',
  alternates: {
    canonical: `${siteConfig.url}/campaigns`,
  },
  openGraph: {
    title: 'Crowdfunding Campaigns - Inventagious',
    description: 'Discover innovative crowdfunding campaigns on Inventagious. Support inventors and innovators building on Solana blockchain.',
    url: `${siteConfig.url}/campaigns`,
    type: 'website',
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Crowdfunding Campaigns - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crowdfunding Campaigns - Inventagious',
    description: 'Discover innovative crowdfunding campaigns on Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
  },
};

export default function CampaignsPage() {
  return (
    <>
      <WebPageSchema 
        title="Crowdfunding Campaigns - Inventagious"
        description="Discover innovative crowdfunding campaigns on Inventagious. Support inventors and innovators building on Solana blockchain."
        url={`${siteConfig.url}/campaigns`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Campaigns', url: `${siteConfig.url}/campaigns` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="halftone-gray py-12">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h1 className="hand-drawn mb-4 text-5xl font-bold text-black">
                  Crowdfunding Campaigns
                </h1>
                <p className="text-lg font-semibold text-gray-800">
                  Discover innovative public campaigns from inventors and innovators
                </p>
                <div className="squiggly-underline inline-block mt-4" />
              </div>
              <Suspense fallback={<CampaignsListSkeleton />}>
                <CampaignsList />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

