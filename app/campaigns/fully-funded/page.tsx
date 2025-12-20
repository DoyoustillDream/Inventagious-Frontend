import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { siteConfig, generatePageMetadata, WebPageSchema, BreadcrumbSchema, ItemListSchema, FAQSchema } from '@/lib/seo';
import { normalizeUrl } from '@/lib/utils/url';
import { projectsApi, type Project } from '@/lib/api/projects';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Fully Funded Campaigns – Successful Blockchain Projects | Inventagious',
    description: 'Explore successfully funded blockchain crowdfunding campaigns on Solana. See innovative projects that reached their goals through transparent, decentralized funding on Inventagious.',
    url: '/campaigns/fully-funded',
    keywords: ['fully funded', 'successful campaigns', 'funded projects', 'blockchain crowdfunding', 'solana projects'],
  });
}

export default async function FullyFundedCampaignsPage() {
  let allCampaigns: Project[] = [];
  try {
    allCampaigns = await projectsApi.getAll('crowdfunding');
  } catch (error: any) {
    // During build time, if backend is not available, gracefully handle the error
    // The page will still render with empty campaign list
    if (typeof window === 'undefined') {
      console.warn('[FullyFundedCampaignsPage] Failed to fetch campaigns during build:', error?.message || 'Unknown error');
    }
  }
  
  // Filter campaigns that have reached or exceeded their funding goal
  const fullyFunded = allCampaigns.filter(campaign => {
    if (!campaign.fundingGoal || !campaign.amountRaised) return false;
    return campaign.amountRaised >= campaign.fundingGoal;
  }).sort((a, b) => {
    // Sort by amount raised (descending)
    return (b.amountRaised || 0) - (a.amountRaised || 0);
  });

  const pageUrl = normalizeUrl(siteConfig.url, '/campaigns/fully-funded');

  const faqQuestions = [
    {
      question: 'What are fully funded campaigns?',
      answer: 'Fully funded campaigns are blockchain crowdfunding projects that have successfully reached or exceeded their funding goals on Inventagious. These campaigns demonstrate successful community support and transparent funding on Solana.',
    },
    {
      question: 'Can I still contribute to fully funded campaigns?',
      answer: 'It depends on the campaign. Some campaigns accept additional contributions even after reaching their goal, while others close once funded. Check individual campaign pages for details.',
    },
    {
      question: 'How are funds used after a campaign is fully funded?',
      answer: 'Once a campaign reaches its funding goal, funds are released to the project creator according to the campaign terms. All transactions are recorded on the Solana blockchain for transparency.',
    },
  ];

  return (
    <>
      <WebPageSchema
        title="Fully Funded Campaigns – Successful Blockchain Projects | Inventagious"
        description="Explore successfully funded blockchain crowdfunding campaigns on Solana. See innovative projects that reached their goals."
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Campaigns', url: `${siteConfig.url}/campaigns` },
          { name: 'Fully Funded', url: pageUrl },
        ]}
      />
      <ItemListSchema
        name="Fully Funded Campaigns"
        description="Successfully funded blockchain crowdfunding campaigns"
        url={pageUrl}
        items={fullyFunded.slice(0, 20).map(campaign => ({
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
            <h1 className="text-4xl font-bold mb-4">Fully Funded Campaigns</h1>
            <p className="text-lg text-gray-600 mb-8">
              Explore blockchain crowdfunding campaigns that have successfully reached their funding goals on Solana. 
              These projects demonstrate the power of transparent, decentralized funding and community support. 
              See how innovative ideas become reality through blockchain crowdfunding on Inventagious.
            </p>

            {fullyFunded.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {fullyFunded.map((campaign) => {
                  const fundingPercentage = campaign.fundingGoal && campaign.amountRaised
                    ? Math.round((campaign.amountRaised / campaign.fundingGoal) * 100)
                    : 0;
                  
                  return (
                    <Link
                      key={campaign.id}
                      href={`/campaigns/${campaign.slug}`}
                      className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold">{campaign.title}</h2>
                        <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                          {fundingPercentage}% funded
                        </span>
                      </div>
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
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600">No fully funded campaigns yet. Be the first to reach your goal!</p>
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
                <Link href="/campaigns/active" className="text-blue-600 hover:underline">
                  Active Campaigns →
                </Link>
                <Link href="/campaigns/ending-soon" className="text-blue-600 hover:underline">
                  Ending Soon →
                </Link>
                <Link href="/projects/create" className="text-blue-600 hover:underline">
                  Start Your Campaign →
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

