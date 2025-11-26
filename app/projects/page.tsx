import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProjectsList from '@/components/public/ProjectsList/ProjectsList';
import ProjectsListSkeleton from '@/components/public/ProjectsList/ProjectsListSkeleton';
import { siteConfig, WebPageSchema, BreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Discover innovative crowdfunding and private funding projects on Inventagious. Support inventors and innovators building on Solana blockchain.',
  alternates: {
    canonical: `${siteConfig.url}/projects`,
  },
  openGraph: {
    title: 'Projects - Inventagious',
    description: 'Discover innovative crowdfunding and private funding projects on Inventagious. Support inventors and innovators building on Solana blockchain.',
    url: `${siteConfig.url}/projects`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Inventagious',
    description: 'Discover innovative crowdfunding and private funding projects on Inventagious.',
  },
};

export default function ProjectsPage() {
  return (
    <>
      <WebPageSchema 
        title="Projects - Inventagious"
        description="Discover innovative crowdfunding and private funding projects on Inventagious. Support inventors and innovators building on Solana blockchain."
        url={`${siteConfig.url}/projects`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Projects', url: `${siteConfig.url}/projects` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="halftone-gray py-12">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h1 className="hand-drawn mb-4 text-5xl font-bold text-black">
                  All Projects
                </h1>
                <p className="text-lg font-semibold text-gray-800">
                  Discover innovative projects from inventors and innovators
                </p>
                <div className="squiggly-underline inline-block mt-4" />
              </div>
              <Suspense fallback={<ProjectsListSkeleton />}>
                <ProjectsList />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

