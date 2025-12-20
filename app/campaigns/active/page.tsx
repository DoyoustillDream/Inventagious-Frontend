import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { siteConfig, generatePageMetadata, WebPageSchema, BreadcrumbSchema, ItemListSchema, FAQSchema } from '@/lib/seo';
import { normalizeUrl } from '@/lib/utils/url';
import { projectsApi, type Project } from '@/lib/api/projects';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Active Campaigns – Live Blockchain Crowdfunding Projects | Inventagious',
    description: 'Discover active blockchain crowdfunding campaigns on Solana. Fund innovative projects from inventors and innovators. Transparent, secure, and decentralized funding on Inventagious.',
    url: '/campaigns/active',
    keywords: ['active campaigns', 'live crowdfunding', 'blockchain projects', 'solana crowdfunding', 'funding campaigns'],
  });
}

export default async function ActiveCampaignsPage() {
  let campaigns: Project[] = [];
  try {
    campaigns = await projectsApi.getAll('crowdfunding', 'active');
  } catch (error: any) {
    // During build time, if backend is not available, gracefully handle the error
    // The page will still render with empty campaign list
    if (typeof window === 'undefined') {
      console.warn('[ActiveCampaignsPage] Failed to fetch campaigns during build:', error?.message || 'Unknown error');
    }
  }
  
  const pageUrl = normalizeUrl(siteConfig.url, '/campaigns/active');

  const faqQuestions = [
    {
      question: 'What are active campaigns?',
      answer: 'Active campaigns are live blockchain crowdfunding projects currently accepting contributions on Inventagious. These campaigns are actively raising funds on the Solana blockchain with transparent, on-chain transactions.',
    },
    {
      question: 'How do I contribute to an active campaign?',
      answer: 'To contribute, connect your Solana wallet (like Phantom), browse active campaigns, and click "Contribute" on any project. Your contribution is recorded on-chain for full transparency.',
    },
    {
      question: 'Are active campaigns safe to invest in?',
      answer: 'All campaigns on Inventagious use blockchain technology for transparent fund tracking. However, as with any investment, please research projects thoroughly and only invest what you can afford to lose.',
    },
    {
      question: 'What happens after a campaign ends?',
      answer: 'When a campaign reaches its funding goal or deadline, funds are released to the project creator according to the campaign terms. You can track all transactions on the Solana blockchain.',
    },
  ];

  return (
    <>
      <WebPageSchema
        title="Active Campaigns – Live Blockchain Crowdfunding Projects | Inventagious"
        description="Discover active blockchain crowdfunding campaigns on Solana. Fund innovative projects from inventors and innovators."
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Campaigns', url: `${siteConfig.url}/campaigns` },
          { name: 'Active Campaigns', url: pageUrl },
        ]}
      />
      <ItemListSchema
        name="Active Campaigns"
        description="Live blockchain crowdfunding campaigns on Inventagious"
        url={pageUrl}
        items={campaigns.slice(0, 20).map(campaign => ({
          name: campaign.title,
          url: normalizeUrl(siteConfig.url, `/campaigns/${campaign.slug}`),
          description: campaign.description || `Support ${campaign.title} on Inventagious`,
          image: campaign.imageUrl,
        }))}
      />
      <FAQSchema questions={faqQuestions} />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-4">Active Campaigns</h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover live blockchain crowdfunding campaigns currently accepting contributions on Solana. 
              These innovative projects are actively raising funds with transparent, on-chain transactions. 
              Browse active campaigns and support inventors building the future of Web3.
            </p>

            {campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {campaigns.map((campaign) => (
                  <Link
                    key={campaign.id}
                    href={`/campaigns/${campaign.slug}`}
                    className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
                    {campaign.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {campaign.amountRaised?.toLocaleString() || 0} SOL raised
                      </span>
                      <span className="text-sm font-medium text-blue-600">View Campaign →</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No active campaigns at the moment. Check back soon!</p>
            )}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqQuestions.map((faq, index) => (
                  <div key={index} className="border-b pb-4">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Explore More</h2>
              <div className="flex flex-wrap gap-4">
                <Link href="/campaigns" className="text-blue-600 hover:underline">
                  All Campaigns →
                </Link>
                <Link href="/campaigns/ending-soon" className="text-blue-600 hover:underline">
                  Ending Soon →
                </Link>
                <Link href="/campaigns/fully-funded" className="text-blue-600 hover:underline">
                  Fully Funded →
                </Link>
                <Link href="/projects" className="text-blue-600 hover:underline">
                  All Projects →
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

