import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CategoryDetailHero from '@/components/public/Category/CategoryDetailHero';
import CategoryProjectsList from '@/components/public/Category/CategoryProjectsList';
import { siteConfig, WebPageSchema, BreadcrumbSchema, generatePageMetadata } from '@/lib/seo';
import { getCategoryBySlug, getCategoryName, getCategoryDescription } from '@/lib/categories';
import { generateCategoryOGImageUrl } from '@/lib/seo/og-image';
import { normalizeUrl } from '@/lib/utils/url';

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
        </main>
        <Footer />
      </div>
    </>
  );
}

