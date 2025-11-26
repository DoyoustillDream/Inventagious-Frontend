import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function CampaignNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center halftone-gray py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="hand-drawn text-5xl font-bold text-black mb-4">
            Campaign Not Found
          </h1>
          <p className="text-lg font-semibold text-gray-800 mb-8">
            The crowdfunding campaign you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/campaigns"
            className="hand-drawn inline-block border-4 border-black bg-yellow-400 px-8 py-4 text-lg font-bold text-black transition-all hover:bg-yellow-600 hover:scale-105 active:scale-95"
          >
            Browse All Campaigns
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

