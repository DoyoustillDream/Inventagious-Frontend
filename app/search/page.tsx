import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import SearchPageContent from '@/components/public/Search/SearchPageContent';
import { WebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Search Projects - Inventagious',
  description:
    'Find projects by name, location, title, or keyword. Discover innovative crowdfunding and private funding projects on Inventagious.',
  alternates: {
    canonical: `${siteConfig.url}/search`,
  },
  openGraph: {
    title: 'Search Projects - Inventagious',
    description:
      'Find projects by name, location, title, or keyword. Discover innovative crowdfunding and private funding projects.',
    url: `${siteConfig.url}/search`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Projects - Inventagious',
    description:
      'Find projects by name, location, title, or keyword. Discover innovative crowdfunding and private funding projects.',
  },
};

export default function SearchPage() {
  return (
    <>
      <WebPageSchema
        title="Search Projects - Inventagious"
        description="Find projects by name, location, title, or keyword. Discover innovative crowdfunding and private funding projects on Inventagious."
        url={`${siteConfig.url}/search`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <SearchPageContent />
        </main>
        <Footer />
      </div>
    </>
  );
}

