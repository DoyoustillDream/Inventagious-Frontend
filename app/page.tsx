import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Hero from '@/components/public/Hero';
import HowItWorks from '@/components/public/HowItWorks';
import FeaturedProjects from '@/components/public/FeaturedProjects';
import FeaturedTopics from '@/components/public/FeaturedTopics';
import AboutPlatform from '@/components/public/AboutPlatform';
import VideoSection from '@/components/public/VideoSection';
import TrustSafety from '@/components/public/TrustSafety';
import FundraisingTips from '@/components/public/FundraisingTips';
import { WebPageSchema } from '@/lib/seo';
import { siteConfig, getHomePageTitle } from '@/lib/seo';

export const metadata: Metadata = {
  title: getHomePageTitle(),
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: getHomePageTitle(),
    description: siteConfig.description,
    url: siteConfig.url,
    type: 'website',
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: getHomePageTitle(),
    description: siteConfig.description,
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};

export default function Home() {
  return (
    <>
      <WebPageSchema 
        title={siteConfig.title}
        description={siteConfig.description}
        url={siteConfig.url}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <Hero />
          <HowItWorks />
          <FeaturedProjects />
          <FeaturedTopics />
          <AboutPlatform />
          <VideoSection />
          <TrustSafety />
          <FundraisingTips />
        </main>
        <Footer />
      </div>
    </>
  );
}
