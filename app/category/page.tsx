import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { CategoryHero, CategoryButtons, CategorySection, FeaturedProjectsByCategory } from '@/components/public/Category';
import { siteConfig, WebPageSchema, BreadcrumbSchema, generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Categories - Inventagious',
  description: 'Browse innovative projects by category on Inventagious. Discover Web3, Solana, hardware, software, and more groundbreaking projects from inventors and innovators worldwide.',
  url: '/category',
  type: 'website',
});

export default function CategoryPage() {
  return (
    <>
      <WebPageSchema 
        title="Categories - Inventagious"
        description="Browse innovative projects by category on Inventagious. Discover Web3, Solana, hardware, software, and more groundbreaking projects from inventors and innovators worldwide."
        url={`${siteConfig.url}/category`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Categories', url: `${siteConfig.url}/category` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <CategoryHero />
          <CategoryButtons />
          <FeaturedProjectsByCategory />
          <section className="halftone-gray py-12">
            <div className="container mx-auto px-4">
              <CategorySection categoryName="Web3" categorySlug="web3" />
              <CategorySection categoryName="Solana" categorySlug="solana" />
              <CategorySection categoryName="Hardware" categorySlug="hardware" />
              <CategorySection categoryName="Software" categorySlug="software" />
              <CategorySection categoryName="Blockchain" categorySlug="blockchain" />
              <CategorySection categoryName="Innovation" categorySlug="innovation" />
              <div className="flex justify-center mt-8">
                <a
                  href="/explore"
                  className="hand-drawn inline-block rounded-lg border-2 border-black bg-white px-8 py-4 text-lg font-bold text-black transition hover:bg-yellow-400 hover:scale-105 active:scale-95"
                >
                  Explore All Projects
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

