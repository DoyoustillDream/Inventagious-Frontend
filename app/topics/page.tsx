import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import TopicsList from '@/components/public/Topics/TopicsList';
import TopicsListSkeleton from '@/components/public/Topics/TopicsListSkeleton';
import { siteConfig, WebPageSchema, BreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Topics & Announcements',
  description: 'Stay updated with the latest topics, announcements, and news from Inventagious. Discover important updates, featured content, and platform highlights.',
  alternates: {
    canonical: `${siteConfig.url}/topics`,
  },
  openGraph: {
    title: 'Topics & Announcements - Inventagious',
    description: 'Stay updated with the latest topics, announcements, and news from Inventagious.',
    url: `${siteConfig.url}/topics`,
    type: 'website',
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Topics & Announcements - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Topics & Announcements - Inventagious',
    description: 'Stay updated with the latest topics, announcements, and news from Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function TopicsPage() {
  return (
    <>
      <WebPageSchema 
        title="Topics & Announcements - Inventagious"
        description="Stay updated with the latest topics, announcements, and news from Inventagious. Discover important updates, featured content, and platform highlights."
        url={`${siteConfig.url}/topics`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Topics', url: `${siteConfig.url}/topics` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="bg-white py-12">
            <div className="container mx-auto px-4">
              <header className="mb-12 text-center">
                <h1 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
                  Topics & Announcements
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Stay updated with the latest news, announcements, and featured topics from Inventagious.
                </p>
              </header>
            </div>
          </section>
          <section className="halftone-gray py-12">
            <div className="container mx-auto px-4">
              <Suspense fallback={<TopicsListSkeleton />}>
                <TopicsList />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

