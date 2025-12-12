import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { UpcomingProjectsList, UpcomingProjectsSkeleton } from '@/components/public/UpcomingProjects';
import { siteConfig, WebPageSchema, BreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Upcoming Projects',
  description: 'Discover upcoming projects launching soon on Inventagious. Express your interest and be notified when they go live.',
  alternates: {
    canonical: `${siteConfig.url}/upcoming`,
  },
  openGraph: {
    title: 'Upcoming Projects - Inventagious',
    description: 'Discover upcoming projects launching soon on Inventagious.',
    url: `${siteConfig.url}/upcoming`,
    type: 'website',
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Upcoming Projects - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upcoming Projects - Inventagious',
    description: 'Discover upcoming projects launching soon on Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function UpcomingProjectsPage() {
  return (
    <>
      <WebPageSchema
        title="Upcoming Projects - Inventagious"
        description="Discover upcoming projects launching soon on Inventagious. Express your interest and be notified when they go live."
        url={`${siteConfig.url}/upcoming`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Upcoming Projects', url: `${siteConfig.url}/upcoming` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="bg-white py-12">
            <div className="container mx-auto px-4">
              <header className="mb-12 text-center">
                <h1 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
                  Upcoming Projects
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover projects launching soon. Express your interest to get notified when they go live!
                </p>
              </header>
            </div>
          </section>
          <section className="halftone-gray py-12">
            <div className="container mx-auto px-4">
              <Suspense fallback={<UpcomingProjectsSkeleton />}>
                <UpcomingProjectsList />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

