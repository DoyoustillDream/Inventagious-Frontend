import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import GuaranteeContent from '@/components/public/Guarantee';
import { WebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Platform Guarantee - Fund & Ownership Protection | Inventagious',
  description:
    'Learn about Inventagious platform guarantee: fund protection through Solana escrow, 100% ownership protection, blockchain transparency, and enterprise-grade security.',
  openGraph: {
    title: 'Platform Guarantee - Fund & Ownership Protection | Inventagious',
    description:
      'Learn about Inventagious platform guarantee: fund protection through Solana escrow, 100% ownership protection, blockchain transparency, and enterprise-grade security.',
    url: `${siteConfig.url}/guarantee`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Platform Guarantee - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Platform Guarantee - Fund & Ownership Protection | Inventagious',
    description:
      'Learn about Inventagious platform guarantee: fund protection through Solana escrow, 100% ownership protection, blockchain transparency, and enterprise-grade security.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function GuaranteePage() {
  return (
    <>
      <WebPageSchema
        title="Platform Guarantee - Fund & Ownership Protection | Inventagious"
        description="Learn about Inventagious platform guarantee: fund protection through Solana escrow, 100% ownership protection, blockchain transparency, and enterprise-grade security."
        url={`${siteConfig.url}/guarantee`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <GuaranteeContent />
        </main>
        <Footer />
      </div>
    </>
  );
}

