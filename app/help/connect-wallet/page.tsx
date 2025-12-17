import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ConnectWalletGuide from '@/components/public/Help/ConnectWalletGuide';
import { siteConfig } from '@/lib/seo/config';
import { WebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'How to Connect Your Wallet - Wallet Connection Guide | Inventagious',
  description: 'Learn how to connect your wallet to Inventagious using Google, Apple, browser extension, or mobile app. Step-by-step guide with security tips.',
  openGraph: {
    title: 'How to Connect Your Wallet - Wallet Connection Guide | Inventagious',
    description: 'Learn how to connect your wallet to Inventagious using Google, Apple, browser extension, or mobile app. Step-by-step guide with security tips.',
    url: `${siteConfig.url}/help/connect-wallet`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'How to Connect Your Wallet - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Connect Your Wallet - Wallet Connection Guide | Inventagious',
    description: 'Learn how to connect your wallet to Inventagious using multiple methods.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function ConnectWalletPage() {
  return (
    <>
      <WebPageSchema
        title="How to Connect Your Wallet - Wallet Connection Guide | Inventagious"
        description="Learn how to connect your wallet to Inventagious using Google, Apple, browser extension, or mobile app. Step-by-step guide with security tips."
        url={`${siteConfig.url}/help/connect-wallet`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1 halftone-gray py-12 md:py-16">
          <ConnectWalletGuide />
        </main>
        <Footer />
      </div>
    </>
  );
}

