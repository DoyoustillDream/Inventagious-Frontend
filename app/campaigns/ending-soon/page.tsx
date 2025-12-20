import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { siteConfig, generatePageMetadata, WebPageSchema, BreadcrumbSchema, ItemListSchema, FAQSchema } from '@/lib/seo';
import { normalizeUrl } from '@/lib/utils/url';
import { projectsApi } from '@/lib/api/projects';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Ending Soon Campaigns – Final Days to Fund | Inventagious',
    description: 'Blockchain crowdfunding campaigns ending soon on Solana. Don\'t miss your chance to support innovative projects before they close. Transparent funding on Inventagious.',
    url: '/campaigns/ending-soon',
    keywords: ['ending soon', 'campaigns ending', 'last chance funding', 'blockchain crowdfunding', 'solana projects'],
  });
}

export default async function EndingSoonCampaignsPage() {
  const allCampaigns = await projectsApi.getAll('crowdfunding', 'active');
  
  // Filter campaigns ending in the next 7 days
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const endingSoon = allCampaigns.filter(campaign => {
    if (!campaign.deadline) return false;
    const deadline = new Date(campaign.deadline);
    return deadline <= sevenDaysFromNow && deadline > now;
  }).sort((a, b) => {
    if (!a.deadline || !b.deadline) return 0;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const pageUrl = normalizeUrl(siteConfig.url, '/campaigns/ending-soon');

  const faqQuestions = [
    {
      question: 'What does "ending soon" mean?',
      answer: 'Campaigns ending soon are active blockchain crowdfunding projects that will close within the next 7 days. These campaigns have approaching deadlines, so it\'s your last chance to contribute.',
    },
    {
      question: 'Can I still contribute to ending soon campaigns?',
      answer: 'Yes! You can contribute to any active campaign until its deadline. Connect your Solana wallet and make your contribution before the campaign closes.',
    },
    {
      question: 'What happens if a campaign doesn\'t reach its goal?',
      answer: 'If a campaign doesn\'t reach its funding goal by the deadline, the campaign closes. Depending on the campaign terms, funds may be returned to contributors or released to the project creator.',
    },
  ];

  return (
    <>
      <WebPageSchema
        title="Ending Soon Campaigns – Final Days to Fund | Inventagious"
        description="Blockchain crowdfunding campaigns ending soon on Solana. Don't miss your chance to support innovative projects."
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Campaigns', url: `${siteConfig.url}/campaigns` },
          { name: 'Ending Soon', url: pageUrl },
        ]}
      />
      <ItemListSchema
        name="Ending Soon Campaigns"
        description="Blockchain crowdfunding campaigns ending within 7 days"
        url={pageUrl}
        items={endingSoon.slice(0, 20).map(campaign => ({
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
            <h1 className="text-4xl font-bold mb-4">Ending Soon Campaigns</h1>
            <p className="text-lg text-gray-600 mb-8">
              These blockchain crowdfunding campaigns are closing within the next 7 days. 
              Don't miss your final opportunity to support innovative projects on Solana. 
              All contributions are recorded on-chain for full transparency.
            </p>

            {endingSoon.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {endingSoon.map((campaign) => {
                  const daysLeft = campaign.deadline 
                    ? Math.ceil((new Date(campaign.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    : null;
                  
                  return (
                    <Link
                      key={campaign.id}
                      href={`/campaigns/${campaign.slug}`}
                      className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold">{campaign.title}</h2>
                        {daysLeft !== null && (
                          <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                            {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                          </span>
                        )}
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
              <p className="text-gray-600">No campaigns ending soon at the moment.</p>
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
                <Link href="/campaigns/fully-funded" className="text-blue-600 hover:underline">
                  Fully Funded →
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

