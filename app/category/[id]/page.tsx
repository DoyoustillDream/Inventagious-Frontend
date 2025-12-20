import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CategoryDetailHero from '@/components/public/Category/CategoryDetailHero';
import CategoryProjectsList from '@/components/public/Category/CategoryProjectsList';
import { siteConfig, WebPageSchema, BreadcrumbSchema, generatePageMetadata, ItemListSchema, InvestorIntentLink, CampaignStateLink } from '@/lib/seo';
import { getCategoryBySlug, getCategoryName, getCategoryDescription } from '@/lib/categories';
import { generateCategoryOGImageUrl } from '@/lib/seo/og-image';
import { normalizeUrl } from '@/lib/utils/url';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = getCategoryBySlug(id);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = `${category.name} Projects - Inventagious`;
  const description = `${category.description}. Discover innovative ${category.name.toLowerCase()} projects from inventors and innovators building on Solana blockchain.`;

  const ogImageUrl = generateCategoryOGImageUrl({
    name: category.name,
    description,
  });

  return generatePageMetadata({
    title,
    description,
    url: `/category/${id}`,
    type: 'website',
    image: ogImageUrl,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = getCategoryBySlug(id);

  if (!category) {
    notFound();
  }

  const categoryName = getCategoryName(id);
  const categoryDescription = getCategoryDescription(id);

  const categoryUrl = normalizeUrl(siteConfig.url, `/category/${id}`);

  return (
    <>
      <WebPageSchema 
        title={`${categoryName} Projects - Inventagious`}
        description={categoryDescription}
        url={categoryUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Categories', url: `${siteConfig.url}/category` },
          { name: categoryName, url: categoryUrl },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <CategoryDetailHero categorySlug={id} />
          <CategoryProjectsList categorySlug={id} />
          {/* Internal Links Section */}
          <section className="container mx-auto px-4 py-8">
            <div className="border-2 border-black rounded-lg bg-white p-6">
              <h2 className="hand-drawn text-2xl font-bold text-black mb-4">Explore More</h2>
              <div className="space-y-2">
                <Link
                  href="/campaigns"
                  className="text-blue-600 hover:text-yellow-600 hover:underline font-medium block"
                >
                  All blockchain crowdfunding campaigns →
                </Link>
                <CampaignStateLink state="active" className="text-blue-600 hover:text-yellow-600 hover:underline font-medium block">
                  Active blockchain campaigns →
                </CampaignStateLink>
                <InvestorIntentLink intent="fund-blockchain-startups" className="text-blue-600 hover:text-yellow-600 hover:underline font-medium block">
                  Fund blockchain startups →
                </InvestorIntentLink>
                <InvestorIntentLink intent="invest-in-solana-projects" className="text-blue-600 hover:text-yellow-600 hover:underline font-medium block">
                  Invest in Solana projects →
                </InvestorIntentLink>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

