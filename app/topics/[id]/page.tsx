import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { projectsApi } from '@/lib/api/projects';
import { siteConfig, WebPageSchema, BreadcrumbSchema, ArticleSchema } from '@/lib/seo';
import { normalizeUrl } from '@/lib/utils/url';
import Link from 'next/link';
import Image from 'next/image';

interface TopicPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const topic = await projectsApi.getTopicById(id);
    
    if (!topic) {
      return {
        title: 'Topic Not Found - Inventagious',
      };
    }

    const topicUrl = normalizeUrl(siteConfig.url, `/topics/${id}`);
    
    return {
      title: `${topic.title} - Topics & Announcements - Inventagious`,
      description: topic.description || `Learn more about ${topic.title} on Inventagious`,
      alternates: {
        canonical: topicUrl,
      },
      openGraph: {
        title: `${topic.title} - Inventagious`,
        description: topic.description || `Learn more about ${topic.title} on Inventagious`,
        url: topicUrl,
        type: 'article',
        siteName: siteConfig.siteName,
        images: topic.imageUrl ? [
          {
            url: topic.imageUrl,
            width: 1200,
            height: 630,
            alt: topic.title,
          },
        ] : undefined,
        locale: siteConfig.locale,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${topic.title} - Inventagious`,
        description: topic.description || `Learn more about ${topic.title} on Inventagious`,
        images: topic.imageUrl ? [topic.imageUrl] : undefined,
        creator: siteConfig.twitterHandle,
        site: siteConfig.twitterHandle,
      },
    };
  } catch (error) {
    return {
      title: 'Topic Not Found - Inventagious',
    };
  }
}

// Helper function to get background gradient based on topic
const getTopicBackground = (topicId: string): string => {
  const backgrounds: Record<string, string> = {
    solana: 'linear-gradient(135deg, #14F195 0%, #9945FF 100%)',
    inventors: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    hardware: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
    web3: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 100%)',
  };
  return backgrounds[topicId] || 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E0 100%)';
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { id } = await params;
  
  let topic;
  try {
    topic = await projectsApi.getTopicById(id);
    
    if (!topic) {
      notFound();
    }
  } catch (error: any) {
    if (error?.status === 404) {
      notFound();
    }
    notFound();
  }

  const topicUrl = normalizeUrl(siteConfig.url, `/topics/${id}`);
  const tags = [
    ...(topic.keywords || []),
    'inventagious',
    'announcement',
  ];

  return (
    <>
      <WebPageSchema 
        title={`${topic.title} - Topics & Announcements - Inventagious`}
        description={topic.description || `Learn more about ${topic.title} on Inventagious`}
        url={topicUrl}
      />
      <ArticleSchema
        title={topic.title}
        description={topic.description || `Learn more about ${topic.title} on Inventagious`}
        url={topicUrl}
        image={topic.imageUrl}
        tags={tags}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Topics', url: `${siteConfig.url}/topics` },
          { name: topic.title, url: topicUrl },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-white">
          <article className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Back Link */}
            <Link 
              href="/topics" 
              className="text-blue-600 hover:underline mb-6 inline-block hand-drawn font-bold"
            >
              ← Back to Topics
            </Link>

            {/* Header Image */}
            <div
              className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8"
              style={{
                backgroundImage: topic.imageUrl
                  ? `url(${topic.imageUrl})`
                  : getTopicBackground(topic.id),
              }}
            >
              {topic.imageUrl && (
                <Image
                  src={topic.imageUrl}
                  alt={topic.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {topic.tag && (
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-4 py-2 text-sm font-bold rounded-full bg-purple-100 text-purple-800 border-2 border-purple-300">
                    <strong>{topic.tag}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <header className="mb-8">
              <h1 className="hand-drawn text-4xl md:text-5xl font-bold text-black mb-4">
                {topic.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                {topic.projectCount !== undefined && topic.projectCount > 0 && (
                  <>
                    <span className="font-semibold">
                      {topic.projectCount} {topic.projectCount === 1 ? 'project' : 'projects'} available
                    </span>
                    <span>•</span>
                  </>
                )}
                {topic.keywords && topic.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {topic.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Description/Content */}
            <div className="prose prose-lg max-w-none mb-8">
              {topic.description && (
                <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                  {topic.description}
                </div>
              )}
            </div>

            {/* Call to Action */}
            {topic.href && !topic.href.startsWith('/topics/') && (
              <div className="mt-8 p-6 bg-yellow-50 border-4 border-black rounded-lg">
                <h2 className="hand-drawn text-2xl font-bold text-black mb-4">
                  Explore Related Content
                </h2>
                <Link
                  href={topic.href}
                  className="hand-drawn inline-block px-6 py-3 border-4 border-black bg-yellow-400 hover:bg-yellow-500 rounded-lg font-bold text-black transition-all hover:scale-105 active:scale-95"
                >
                  Learn More →
                </Link>
              </div>
            )}

            {/* Related Projects Section */}
            {topic.projectCount !== undefined && topic.projectCount > 0 && (
              <div className="mt-12 p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <h2 className="hand-drawn text-2xl font-bold text-black mb-4">
                  Related Projects
                </h2>
                <p className="text-gray-600 mb-4">
                  Discover {topic.projectCount} {topic.projectCount === 1 ? 'project' : 'projects'} related to this topic.
                </p>
                {topic.keywords && topic.keywords.length > 0 && (
                  <Link
                    href={`/explore?category=${encodeURIComponent(topic.keywords[0])}`}
                    className="hand-drawn inline-block px-6 py-3 border-4 border-black bg-white hover:bg-yellow-100 rounded-lg font-bold text-black transition-all hover:scale-105 active:scale-95"
                  >
                    Browse Projects →
                  </Link>
                )}
              </div>
            )}
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
