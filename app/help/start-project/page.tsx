import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import StartProjectGuide from '@/components/public/Help/StartProjectGuide';
import { siteConfig } from '@/lib/seo/config';
import { WebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'How to Start a Project - Step-by-Step Guide | Inventagious',
  description: 'Learn how to launch your project on Inventagious. Complete step-by-step guide covering everything from account setup to project launch and fundraising.',
  openGraph: {
    title: 'How to Start a Project - Step-by-Step Guide | Inventagious',
    description: 'Learn how to launch your project on Inventagious. Complete step-by-step guide covering everything from account setup to project launch and fundraising.',
    url: `${siteConfig.url}/help/start-project`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'How to Start a Project - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Start a Project - Step-by-Step Guide | Inventagious',
    description: 'Learn how to launch your project on Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
  },
};

export default function StartProjectPage() {
  return (
    <>
      <WebPageSchema
        title="How to Start a Project - Step-by-Step Guide | Inventagious"
        description="Learn how to launch your project on Inventagious. Complete step-by-step guide covering everything from account setup to project launch and fundraising."
        url={`${siteConfig.url}/help/start-project`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1 halftone-gray py-12 md:py-16">
          <StartProjectGuide />
        </main>
        <Footer />
      </div>
    </>
  );
}

