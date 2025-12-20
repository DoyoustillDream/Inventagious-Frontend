import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { siteConfig, generatePageMetadata, WebPageSchema, BreadcrumbSchema, ItemListSchema, FAQSchema } from '@/lib/seo';
import { normalizeUrl } from '@/lib/utils/url';
import { projectsApi } from '@/lib/api/projects';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Invest in Solana Projects – Solana Blockchain Crowdfunding | Inventagious',
    description: 'Invest in Solana blockchain projects and support innovation on the fastest, most scalable blockchain. Discover DeFi, NFT, and Web3 projects built on Solana. Transparent investment on Inventagious.',
    url: '/invest-in-solana-projects',
    keywords: ['invest solana', 'solana projects', 'solana blockchain', 'solana crowdfunding', 'solana investment', 'solana defi'],
  });
}

export default async function InvestInSolanaProjectsPage() {
  const allProjects = await projectsApi.getAll();
  // All projects on Inventagious are Solana-based, but we can highlight Solana-specific projects
  const solanaProjects = allProjects.filter(project => 
    project.category?.toLowerCase().includes('solana') ||
    project.title.toLowerCase().includes('solana') ||
    project.description?.toLowerCase().includes('solana')
  );

  const pageUrl = normalizeUrl(siteConfig.url, '/invest-in-solana-projects');

  const faqQuestions = [
    {
      question: 'Why invest in Solana projects?',
      answer: 'Solana is one of the fastest and most scalable blockchains, with low transaction fees and high throughput. Investing in Solana projects gives you access to cutting-edge DeFi, NFT, and Web3 innovations.',
    },
    {
      question: 'How do I invest in Solana projects?',
      answer: 'Connect your Solana wallet (like Phantom), browse Solana projects on Inventagious, and click "Contribute" to invest. All investments are recorded on the Solana blockchain.',
    },
    {
      question: 'What types of Solana projects can I invest in?',
      answer: 'You can invest in various Solana projects including DeFi protocols, NFT marketplaces, Web3 applications, gaming projects, and blockchain infrastructure built on Solana.',
    },
    {
      question: 'Are Solana project investments safe?',
      answer: 'All investments on Inventagious use Solana blockchain for transparent, on-chain transactions. However, as with any investment, research projects thoroughly and only invest what you can afford to lose.',
    },
  ];

  return (
    <>
      <WebPageSchema
        title="Invest in Solana Projects – Solana Blockchain Crowdfunding | Inventagious"
        description="Invest in Solana blockchain projects and support innovation on the fastest, most scalable blockchain."
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Invest in Solana Projects', url: pageUrl },
        ]}
      />
      <ItemListSchema
        name="Solana Projects"
        description="Solana blockchain projects available for investment"
        url={pageUrl}
        items={solanaProjects.slice(0, 20).map(project => ({
          name: project.title,
          url: normalizeUrl(siteConfig.url, project.type === 'crowdfunding' ? `/campaigns/${project.slug}` : `/projects/${project.id}`),
          description: project.description || `Invest in ${project.title} on Inventagious`,
          image: project.imageUrl,
        }))}
      />
      <FAQSchema questions={faqQuestions} />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-4">Invest in Solana Projects</h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover and invest in innovative projects built on Solana, the world's fastest blockchain. 
              Solana offers high throughput, low fees, and fast finality, making it ideal for DeFi, NFTs, gaming, 
              and Web3 applications. All projects on Inventagious leverage Solana's blockchain technology for 
              transparent, secure, and efficient crowdfunding. Support the Solana ecosystem and invest in the 
              future of decentralized technology.
            </p>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Why Solana?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Fast & Scalable</h3>
                  <p className="text-gray-600">Solana can process 65,000+ transactions per second with sub-second finality, making it ideal for high-performance applications.</p>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Low Fees</h3>
                  <p className="text-gray-600">Transaction fees on Solana are typically less than $0.001, making micro-transactions and frequent interactions feasible.</p>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Growing Ecosystem</h3>
                  <p className="text-gray-600">Solana has a rapidly growing ecosystem of DeFi, NFT, gaming, and Web3 projects with strong developer support.</p>
                </div>
              </div>
            </div>

            {solanaProjects.length > 0 ? (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Solana Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {solanaProjects.map((project) => (
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
              <p className="text-gray-600 mb-12">All projects on Inventagious are built on Solana. Browse our <Link href="/campaigns" className="text-blue-600 hover:underline">campaigns</Link> to find projects to invest in.</p>
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
                <Link href="/fund-blockchain-startups" className="text-blue-600 hover:underline">
                  Fund Blockchain Startups →
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

