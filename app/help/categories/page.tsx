import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CategoriesGuide from '@/components/public/Help/CategoriesGuide';
import { siteConfig } from '@/lib/seo/config';
import { WebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Project Categories Guide - Find the Right Category | Inventagious',
  description: 'Learn about all project categories on Inventagious. Find the perfect category for your Web3, Solana, hardware, software, or innovation project.',
  openGraph: {
    title: 'Project Categories Guide - Find the Right Category | Inventagious',
    description: 'Learn about all project categories on Inventagious. Find the perfect category for your Web3, Solana, hardware, software, or innovation project.',
    url: `${siteConfig.url}/help/categories`,
  },
};

export default function CategoriesPage() {
  return (
    <>
      <WebPageSchema
        title="Project Categories Guide - Find the Right Category | Inventagious"
        description="Learn about all project categories on Inventagious. Find the perfect category for your Web3, Solana, hardware, software, or innovation project."
        url={`${siteConfig.url}/help/categories`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1 halftone-gray py-12 md:py-16">
          <CategoriesGuide />
        </main>
        <Footer />
      </div>
    </>
  );
}

