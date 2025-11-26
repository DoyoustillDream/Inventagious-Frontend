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

