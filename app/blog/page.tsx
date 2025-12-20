import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { siteConfig, generatePageMetadata, WebPageSchema, BreadcrumbSchema, ItemListSchema } from '@/lib/seo';
import { normalizeUrl } from '@/lib/utils/url';
import Link from 'next/link';

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog – Blockchain Crowdfunding & Web3 Innovation | Inventagious',
  description: 'Learn about blockchain crowdfunding, Solana, Web3 innovation, and how to fund inventions. Expert guides and insights on decentralized funding.',
  url: '/blog',
  keywords: ['blockchain crowdfunding', 'web3', 'solana', 'crypto funding', 'startup funding', 'innovation'],
});

const blogPosts = [
  {
    slug: 'how-blockchain-crowdfunding-works',
    title: 'How Blockchain Crowdfunding Works',
    description: 'Learn how blockchain technology is revolutionizing crowdfunding with transparent, secure, and decentralized funding on Solana.',
    date: '2024-01-15',
  },
  {
    slug: 'solana-vs-ethereum-for-crowdfunding',
    title: 'Solana vs Ethereum for Crowdfunding',
    description: 'Compare Solana and Ethereum for blockchain crowdfunding. Discover which blockchain offers better speed, fees, and scalability for funding projects.',
    date: '2024-01-20',
  },
  {
    slug: 'how-to-fund-an-invention-without-vcs',
    title: 'How to Fund an Invention Without VCs',
    description: 'Discover alternative funding methods for inventors. Learn how blockchain crowdfunding can help you fund your invention without traditional venture capital.',
    date: '2024-01-25',
  },
  {
    slug: 'legal-considerations-for-web3-crowdfunding',
    title: 'Legal Considerations for Web3 Crowdfunding',
    description: 'Understand the legal landscape of Web3 crowdfunding. Learn about regulations, compliance, and best practices for blockchain-based fundraising.',
    date: '2024-02-01',
  },
];

export default function BlogPage() {
  const pageUrl = normalizeUrl(siteConfig.url, '/blog');

  return (
    <>
      <WebPageSchema
        title="Blog – Blockchain Crowdfunding & Web3 Innovation | Inventagious"
        description="Learn about blockchain crowdfunding, Solana, Web3 innovation, and how to fund inventions."
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Blog', url: pageUrl },
        ]}
      />
      <ItemListSchema
        name="Blog Posts"
        description="Blog posts about blockchain crowdfunding and Web3 innovation"
        url={pageUrl}
        items={blogPosts.map(post => ({
          name: post.title,
          url: normalizeUrl(siteConfig.url, `/blog/${post.slug}`),
          description: post.description,
        }))}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-gray-600 mb-12">
              Learn about blockchain crowdfunding, Web3 innovation, Solana, and how to fund inventions. 
              Expert guides, insights, and best practices for decentralized funding.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="text-sm font-medium text-blue-600">Read More →</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Explore Projects</h2>
              <p className="text-gray-600 mb-4">
                Ready to support innovation? Browse live campaigns and fund projects you believe in.
              </p>
              <Link href="/campaigns" className="inline-block text-blue-600 hover:underline font-medium">
                Explore Campaigns →
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

