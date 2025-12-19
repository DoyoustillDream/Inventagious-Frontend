import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import BotHero from '@/components/public/BotLanding/BotHero';
import BotFeatures from '@/components/public/BotLanding/BotFeatures';
import BotAbout from '@/components/public/BotLanding/BotAbout';
import BotVisual from '@/components/public/BotLanding/BotVisual';
import { WebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Polymarket Bot | Inventagious',
  description: 'Trade on Polymarket faster and smarter with our Telegram bot. Get real-time alerts, multi-wallet support, and zero lag trading.',
  openGraph: {
    title: 'Polymarket Bot | Inventagious',
    description: 'Trade on Polymarket faster and smarter with our Telegram bot.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polymarket Bot | Inventagious',
    description: 'Trade on Polymarket faster and smarter with our Telegram bot.',
  },
};

export default function BotPage() {
  return (
    <>
      <WebPageSchema 
        title="Polymarket Bot | Inventagious"
        description="Trade on Polymarket faster and smarter with our Telegram bot."
        url="/bot"
      />
      <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
        <Header />
        <main id="main-content" className="flex-1">
          <BotHero />
          <BotVisual />
          <BotFeatures />
          <BotAbout />
        </main>
        <Footer />
      </div>
    </>
  );
}

