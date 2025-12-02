import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import DealsList from '@/components/public/DealsList/DealsList';
import DealsListSkeleton from '@/components/public/DealsList/DealsListSkeleton';
import { siteConfig, WebPageSchema, BreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Private Funding Deals',
  description: 'Discover private funding opportunities on Inventagious. Connect inventors with investors for exclusive deals on Solana blockchain.',
  alternates: {
    canonical: `${siteConfig.url}/deals`,
  },
  openGraph: {
    title: 'Private Funding Deals - Inventagious',
    description: 'Discover private funding opportunities on Inventagious. Connect inventors with investors for exclusive deals on Solana blockchain.',
    url: `${siteConfig.url}/deals`,
    type: 'website',
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Private Funding Deals - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Funding Deals - Inventagious',
    description: 'Discover private funding opportunities on Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
  },
};

export default function DealsPage() {
  return (
    <>
      <WebPageSchema 
        title="Private Funding Deals - Inventagious"
        description="Discover private funding opportunities on Inventagious. Connect inventors with investors for exclusive deals on Solana blockchain."
        url={`${siteConfig.url}/deals`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Private Deals', url: `${siteConfig.url}/deals` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="halftone-gray py-12">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h1 className="hand-drawn mb-4 text-5xl font-bold text-black">
                  Private Funding Deals
                </h1>
                <p className="text-lg font-semibold text-gray-800">
                  Exclusive private funding opportunities for investors
                </p>
                <div className="squiggly-underline inline-block mt-4" />
              </div>
              <Suspense fallback={<DealsListSkeleton />}>
                <DealsList />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

