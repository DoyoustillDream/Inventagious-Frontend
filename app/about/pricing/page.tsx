import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import PricingGuide from '@/components/public/Pricing';
import { WebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Pricing - Transparent Fees | Inventagious',
  description:
    'Transparent pricing for Inventagious. 1.9% platform fee, zero equity required, no hidden fees. See exactly what you will pay when you fundraise.',
  openGraph: {
    title: 'Pricing - Transparent Fees | Inventagious',
    description:
      'Transparent pricing for Inventagious. 1.9% platform fee, zero equity required, no hidden fees. See exactly what you will pay when you fundraise.',
    url: `${siteConfig.url}/about/pricing`,
  },
};

export default function PricingPage() {
  return (
    <>
      <WebPageSchema
        title="Pricing - Transparent Fees | Inventagious"
        description="Transparent pricing for Inventagious. 1.9% platform fee, zero equity required, no hidden fees. See exactly what you will pay when you fundraise."
        url={`${siteConfig.url}/about/pricing`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <PricingGuide />
        </main>
        <Footer />
      </div>
    </>
  );
}

