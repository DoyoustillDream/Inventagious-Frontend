import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import TrustSafetyContent from '@/components/public/TrustSafetyPage';
import { WebPageSchema, BreadcrumbSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Trust & Safety - Fraud Protection & Refund Guarantee | Inventagious',
  description:
    'Learn about Inventagious Trust & Safety guarantee: full refund protection for up to a year, fraud prevention, secure transactions on Solana blockchain, and comprehensive safety measures.',
  alternates: {
    canonical: `${siteConfig.url}/trust-safety`,
  },
  openGraph: {
    title: 'Trust & Safety - Fraud Protection & Refund Guarantee | Inventagious',
    description:
      'Learn about Inventagious Trust & Safety guarantee: full refund protection for up to a year, fraud prevention, secure transactions on Solana blockchain, and comprehensive safety measures.',
    url: `${siteConfig.url}/trust-safety`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Trust & Safety - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trust & Safety - Fraud Protection & Refund Guarantee | Inventagious',
    description:
      'Learn about Inventagious Trust & Safety guarantee: full refund protection for up to a year, fraud prevention, secure transactions on Solana blockchain.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function TrustSafetyPage() {
  return (
    <>
      <WebPageSchema
        title="Trust & Safety - Fraud Protection & Refund Guarantee | Inventagious"
        description="Learn about Inventagious Trust & Safety guarantee: full refund protection for up to a year, fraud prevention, secure transactions on Solana blockchain, and comprehensive safety measures."
        url={`${siteConfig.url}/trust-safety`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Trust & Safety', url: `${siteConfig.url}/trust-safety` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <TrustSafetyContent />
        </main>
        <Footer />
      </div>
    </>
  );
}

