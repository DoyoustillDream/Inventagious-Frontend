import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import PrivateFundingGuide from '@/components/public/PrivateFunding/PrivateFundingGuide';
import { siteConfig } from '@/lib/seo/config';
import { WebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Private Funding - Exclusive Investment Opportunities | Inventagious',
  description: 'Explore private funding options on Inventagious. Connect with accredited investors, secure exclusive deals, and access milestone-based funding with escrow protection.',
  openGraph: {
    title: 'Private Funding - Exclusive Investment Opportunities | Inventagious',
    description: 'Explore private funding options on Inventagious. Connect with accredited investors, secure exclusive deals, and access milestone-based funding with escrow protection.',
    url: `${siteConfig.url}/private`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Private Funding - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Funding - Exclusive Investment Opportunities | Inventagious',
    description: 'Explore private funding options on Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function PrivateFundingPage() {
  // COMMENTED OUT: Private Funding Page Content
  return (
    <>
      {/* COMMENTED OUT: Private Funding Page */}
      {/* <WebPageSchema
        title="Private Funding - Exclusive Investment Opportunities | Inventagious"
        description="Explore private funding options on Inventagious. Connect with accredited investors, secure exclusive deals, and access milestone-based funding with escrow protection."
        url={`${siteConfig.url}/private`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1 halftone-gray py-12 md:py-16">
          <PrivateFundingGuide />
        </main>
        <Footer />
      </div> */}
      
      {/* Placeholder: Page disabled */}
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1 halftone-gray py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="hand-drawn mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-black">
              Page Unavailable
            </h1>
            <p className="hand-drawn text-lg md:text-xl font-bold text-gray-800 mb-4">
              This page is currently unavailable.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

