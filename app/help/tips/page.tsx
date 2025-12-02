import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import FundraisingTipsGuide from '@/components/public/Help/FundraisingTipsGuide';
import { siteConfig } from '@/lib/seo/config';
import { WebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Fundraising Tips & Strategies - Successful Campaign Guide | Inventagious',
  description: 'Learn proven tips and strategies for successful fundraising on Inventagious. Expert advice on launching, marketing, and growing your crowdfunding or private funding campaign.',
  openGraph: {
    title: 'Fundraising Tips & Strategies - Successful Campaign Guide | Inventagious',
    description: 'Learn proven tips and strategies for successful fundraising on Inventagious. Expert advice on launching, marketing, and growing your crowdfunding or private funding campaign.',
    url: `${siteConfig.url}/help/tips`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Fundraising Tips - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fundraising Tips & Strategies - Successful Campaign Guide | Inventagious',
    description: 'Learn proven tips and strategies for successful fundraising on Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
  },
};

export default function TipsPage() {
  return (
    <>
      <WebPageSchema
        title="Fundraising Tips & Strategies - Successful Campaign Guide | Inventagious"
        description="Learn proven tips and strategies for successful fundraising on Inventagious. Expert advice on launching, marketing, and growing your crowdfunding or private funding campaign."
        url={`${siteConfig.url}/help/tips`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1 halftone-gray py-12 md:py-16">
          <FundraisingTipsGuide />
        </main>
        <Footer />
      </div>
    </>
  );
}

