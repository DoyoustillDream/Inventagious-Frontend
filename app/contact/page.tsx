import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ContactContent from '@/components/public/Contact';
import { WebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Contact Us - Get Support | Inventagious',
  description:
    'Contact Inventagious support team. Get help with your projects, campaigns, or questions. Email inventagioushelp@gmail.com or visit our help center.',
  openGraph: {
    title: 'Contact Us - Get Support | Inventagious',
    description:
      'Contact Inventagious support team. Get help with your projects, campaigns, or questions. Email inventagioushelp@gmail.com or visit our help center.',
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Contact Us - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Get Support | Inventagious',
    description:
      'Contact Inventagious support team. Get help with your projects, campaigns, or questions.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function ContactPage() {
  return (
    <>
      <WebPageSchema
        title="Contact Us - Get Support | Inventagious"
        description="Contact Inventagious support team. Get help with your projects, campaigns, or questions. Email inventagioushelp@gmail.com or visit our help center."
        url={`${siteConfig.url}/contact`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1">
          <ContactContent />
        </main>
        <Footer />
      </div>
    </>
  );
}

