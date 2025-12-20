import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { siteConfig, generatePageMetadata, WebPageSchema, BreadcrumbSchema, ItemListSchema, FAQSchema } from '@/lib/seo';
import { normalizeUrl } from '@/lib/utils/url';
import { projectsApi } from '@/lib/api/projects';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Fund Blockchain Startups – Invest in Web3 Innovation | Inventagious',
    description: 'Fund blockchain startups and Web3 innovation on Solana. Discover early-stage projects, invest in decentralized technologies, and support the future of blockchain. Transparent crowdfunding on Inventagious.',
    url: '/fund-blockchain-startups',
    keywords: ['fund blockchain startups', 'blockchain investment', 'web3 startups', 'crypto startups', 'blockchain crowdfunding', 'solana projects'],
  });
}

export default async function FundBlockchainStartupsPage() {
  const allProjects = await projectsApi.getAll();
  const blockchainProjects = allProjects.filter(project => 
    project.category?.toLowerCase().includes('blockchain') ||
    project.category?.toLowerCase().includes('web3') ||
    project.category?.toLowerCase().includes('crypto') ||
    project.title.toLowerCase().includes('blockchain') ||
    project.description?.toLowerCase().includes('blockchain')
  );

  const pageUrl = normalizeUrl(siteConfig.url, '/fund-blockchain-startups');

  const faqQuestions = [
    {
      question: 'How do I fund blockchain startups on Inventagious?',
      answer: 'Connect your Solana wallet (like Phantom), browse blockchain startup projects, and click "Contribute" to fund projects you believe in. All transactions are recorded on-chain for transparency.',
    },
    {
      question: 'What types of blockchain startups can I fund?',
      answer: 'You can fund various blockchain startups including DeFi projects, NFT platforms, Web3 applications, blockchain infrastructure, and more. All projects are built on or integrated with Solana blockchain.',
    },
    {
      question: 'Is funding blockchain startups safe?',
      answer: 'All funding on Inventagious uses blockchain technology for transparent, on-chain transactions. However, as with any investment, research projects thoroughly and only invest what you can afford to lose.',
    },
    {
      question: 'What are the benefits of funding blockchain startups?',
      answer: 'Funding blockchain startups allows you to support innovation in Web3, potentially benefit from project success, and participate in the decentralized economy. All contributions are transparent and verifiable on-chain.',
    },
  ];

  return (
    <>
      <WebPageSchema
        title="Fund Blockchain Startups – Invest in Web3 Innovation | Inventagious"
        description="Fund blockchain startups and Web3 innovation on Solana. Discover early-stage projects and support the future of blockchain."
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Fund Blockchain Startups', url: pageUrl },
        ]}
      />
      <ItemListSchema
        name="Blockchain Startup Projects"
        description="Blockchain and Web3 startup projects available for funding"
        url={pageUrl}
        items={blockchainProjects.slice(0, 20).map(project => ({
          name: project.title,
          url: normalizeUrl(siteConfig.url, project.type === 'crowdfunding' ? `/campaigns/${project.slug}` : `/projects/${project.id}`),
          description: project.description || `Fund ${project.title} on Inventagious`,
          image: project.imageUrl,
        }))}
      />
      <FAQSchema questions={faqQuestions} />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-4">Fund Blockchain Startups</h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover and fund innovative blockchain startups on Solana. Our platform connects investors with 
              early-stage Web3 projects, DeFi applications, NFT platforms, and blockchain infrastructure. 
              All funding is transparent, secure, and recorded on-chain. Support the future of decentralized technology 
              and participate in the blockchain revolution through transparent crowdfunding on Inventagious.
            </p>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Why Fund Blockchain Startups?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Transparent Funding</h3>
                  <p className="text-gray-600">All transactions are recorded on the Solana blockchain, providing full transparency and verifiability.</p>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Early Access</h3>
                  <p className="text-gray-600">Get early access to innovative Web3 projects and blockchain technologies before they launch.</p>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Support Innovation</h3>
                  <p className="text-gray-600">Help build the decentralized future by supporting blockchain startups and Web3 innovation.</p>
                </div>
              </div>
            </div>

            {blockchainProjects.length > 0 ? (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Blockchain Startup Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blockchainProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={project.type === 'crowdfunding' ? `/campaigns/${project.slug}` : `/projects/${project.id}`}
                      className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {project.amountRaised?.toLocaleString() || 0} SOL raised
                        </span>
                        <span className="text-sm font-medium text-blue-600">View Project →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-12">No blockchain startup projects available at the moment. Check back soon!</p>
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
                <Link href="/invest-in-solana-projects" className="text-blue-600 hover:underline">
                  Invest in Solana Projects →
                </Link>
                <Link href="/crowdfund-inventions" className="text-blue-600 hover:underline">
                  Crowdfund Inventions →
                </Link>
                <Link href="/projects/create" className="text-blue-600 hover:underline">
                  Start Your Project →
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

