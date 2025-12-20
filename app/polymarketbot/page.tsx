import type { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import BotHero from '@/components/public/BotLanding/BotHero';
import BotStats from '@/components/public/BotLanding/BotStats';
import BotVisual from '@/components/public/BotLanding/BotVisual';
import BotFeatures from '@/components/public/BotLanding/BotFeatures';
import BotGettingStarted from '@/components/public/BotLanding/BotGettingStarted';
import BotCommands from '@/components/public/BotLanding/BotCommands';
import BotPricing from '@/components/public/BotLanding/BotPricing';
import BotAbout from '@/components/public/BotLanding/BotAbout';
import ScrollIndicator from '@/components/public/BotLanding/ScrollIndicator';
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
        url="/polymarketbot"
      />
      <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
        <Header />
        <main id="main-content" className="flex-1">
          <BotHero />
          <BotStats />
          <BotVisual />
          <BotFeatures />
          <BotGettingStarted />
          <BotCommands />
          <BotPricing />
          <BotAbout />
        </main>
        <Footer />
        <ScrollIndicator />
      </div>
    </>
  );
}

