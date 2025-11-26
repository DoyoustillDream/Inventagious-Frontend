import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import {
  AboutHero,
  ProblemSolutionSection,
  PlatformFunctions,
  WhySolanaSection,
} from '@/components/public/AboutPage';
import AboutPlatform from '@/components/public/AboutPlatform';
import { WebPageSchema, BreadcrumbSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'About Inventagious - Crowdfunding & Private Funding on Solana',
  description:
    'Learn about Inventagious - a crowdfunding and private fundraising platform for inventors and innovators. Built on Solana for instant payments and zero equity requirements.',
  openGraph: {
    title: 'About Inventagious - Crowdfunding & Private Funding on Solana',
    description:
      'Learn about Inventagious - a crowdfunding and private fundraising platform for inventors and innovators. Built on Solana for instant payments and zero equity requirements.',
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <WebPageSchema
        title="About Inventagious - Crowdfunding & Private Funding on Solana"
        description="Learn about Inventagious - a crowdfunding and private fundraising platform for inventors and innovators. Built on Solana for instant payments and zero equity requirements."
        url={`${siteConfig.url}/about`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'About', url: `${siteConfig.url}/about` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1 bg-gray-100">
          <AboutHero />
          <ProblemSolutionSection />
          <PlatformFunctions />
          <WhySolanaSection />
          <AboutPlatform />
        </main>
        <Footer />
      </div>
    </>
  );
}


