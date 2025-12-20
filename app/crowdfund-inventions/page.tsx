import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { siteConfig, generatePageMetadata, WebPageSchema, BreadcrumbSchema, ItemListSchema, FAQSchema } from '@/lib/seo';
import { normalizeUrl } from '@/lib/utils/url';
import { projectsApi } from '@/lib/api/projects';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Crowdfund Inventions – Fund Innovative Products & Ideas | Inventagious',
    description: 'Crowdfund inventions and innovative products on Solana blockchain. Support inventors and innovators bringing groundbreaking ideas to life. Transparent, decentralized crowdfunding on Inventagious.',
    url: '/crowdfund-inventions',
    keywords: ['crowdfund inventions', 'fund inventions', 'innovative products', 'inventor funding', 'product crowdfunding', 'innovation platform'],
  });
}

export default async function CrowdfundInventionsPage() {
  const allProjects = await projectsApi.getAll();
  // All projects on Inventagious are inventions/innovations
  const inventionProjects = allProjects;

  const pageUrl = normalizeUrl(siteConfig.url, '/crowdfund-inventions');

  const faqQuestions = [
    {
      question: 'What types of inventions can I crowdfund?',
      answer: 'You can crowdfund various types of inventions including hardware products, software applications, blockchain innovations, green technology, health tech, and more. All projects leverage blockchain for transparent funding.',
    },
    {
      question: 'How does crowdfunding inventions work on Inventagious?',
      answer: 'Inventors create campaigns for their inventions, set funding goals, and share their vision. Supporters contribute SOL (Solana) to projects they believe in. All contributions are recorded on-chain for transparency.',
    },
    {
      question: 'What makes Inventagious different for crowdfunding inventions?',
      answer: 'Inventagious uses Solana blockchain for transparent, on-chain transactions. This ensures all funding is verifiable, secure, and transparent. Plus, our platform is specifically designed for inventors and innovators.',
    },
    {
      question: 'Can I start a crowdfunding campaign for my invention?',
      answer: 'Yes! If you have an innovative idea or invention, you can create a campaign on Inventagious. Connect your wallet, create your project, and start raising funds from the community.',
    },
  ];

  return (
    <>
      <WebPageSchema
        title="Crowdfund Inventions – Fund Innovative Products & Ideas | Inventagious"
        description="Crowdfund inventions and innovative products on Solana blockchain. Support inventors and innovators bringing groundbreaking ideas to life."
        url={pageUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Crowdfund Inventions', url: pageUrl },
        ]}
      />
      <ItemListSchema
        name="Invention Projects"
        description="Innovative inventions and products available for crowdfunding"
        url={pageUrl}
        items={inventionProjects.slice(0, 20).map(project => ({
          name: project.title,
          url: normalizeUrl(siteConfig.url, project.type === 'crowdfunding' ? `/campaigns/${project.slug}` : `/projects/${project.id}`),
          description: project.description || `Crowdfund ${project.title} on Inventagious`,
          image: project.imageUrl,
        }))}
      />
      <FAQSchema questions={faqQuestions} />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-4">Crowdfund Inventions</h1>
            <p className="text-lg text-gray-600 mb-8">
              Support inventors and innovators bringing groundbreaking ideas to life through blockchain crowdfunding. 
              Inventagious connects inventors with supporters who believe in innovation. All funding is transparent, 
              secure, and recorded on the Solana blockchain. Whether you're an inventor looking to fund your next 
              breakthrough or a supporter passionate about innovation, discover how blockchain technology is revolutionizing 
              how inventions get funded and brought to market.
            </p>

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Why Crowdfund Inventions on Inventagious?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Blockchain Transparency</h3>
                  <p className="text-gray-600">All funding is recorded on Solana blockchain, providing complete transparency and verifiability for both inventors and supporters.</p>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Global Access</h3>
                  <p className="text-gray-600">Reach a global audience of supporters interested in innovation. No geographic barriers, just great ideas connecting with supporters worldwide.</p>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Low Fees</h3>
                  <p className="text-gray-600">Solana's low transaction fees mean more of your funding goes directly to your invention, not to platform fees.</p>
                </div>
              </div>
            </div>

            {inventionProjects.length > 0 ? (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Invention Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inventionProjects.map((project) => (
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
              <p className="text-gray-600 mb-12">No invention projects available at the moment. <Link href="/projects/create" className="text-blue-600 hover:underline">Start your campaign</Link> to be the first!</p>
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
                <Link href="/invest-in-solana-projects" className="text-blue-600 hover:underline">
                  Invest in Solana Projects →
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

