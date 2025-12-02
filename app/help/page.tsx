import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import HelpCenter from '@/components/public/Help/HelpCenter';
import { WebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Help Center - Get Support & Answers | Inventagious',
  description:
    'Get support and find answers to common questions about Inventagious. Browse help guides, FAQs, and learn how to use our crowdfunding and private funding platform.',
  openGraph: {
    title: 'Help Center - Get Support & Answers | Inventagious',
    description:
      'Get support and find answers to common questions about Inventagious. Browse help guides, FAQs, and learn how to use our crowdfunding and private funding platform.',
    url: `${siteConfig.url}/help`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Help Center - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Center - Get Support & Answers | Inventagious',
    description:
      'Get support and find answers to common questions about Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
  },
};

export default function HelpPage() {
  return (
    <>
      <WebPageSchema
        title="Help Center - Get Support & Answers | Inventagious"
        description="Get support and find answers to common questions about Inventagious. Browse help guides, FAQs, and learn how to use our crowdfunding and private funding platform."
        url={`${siteConfig.url}/help`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <HelpCenter />
        </main>
        <Footer />
      </div>
    </>
  );
}

