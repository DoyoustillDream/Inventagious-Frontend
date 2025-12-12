import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import SolanaEnhancements from '@/components/public/ModdioTechSection/SolanaEnhancements';

export const metadata: Metadata = {
  title: 'Solana Integration - Moddio Blockchain Enhancement | Inventagious',
  description: 'Discover how Solana\'s high-performance blockchain technology transforms Moddio games into true Web3 experiences.',
  alternates: {
    canonical: '/moddio/solana-integration',
  },
};

export default function SolanaIntegrationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden bg-[#1a1d24] py-20" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 168, 255, 0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}>
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                How <span className="bg-gradient-to-r from-[#00a8ff] to-[#00a8ff] bg-clip-text text-transparent">Solana</span> Enhances <span className="bg-gradient-to-r from-[#ff6b6b] to-[#ff6b6b] bg-clip-text text-transparent">Moddio</span>
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#00a8ff] via-[#ff6b6b] to-[#00a8ff] mx-auto mb-8 rounded-full" />
            </div>

            {/* Solana Enhancements Section */}
            <div className="mb-16 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#282c34] to-[#1a1d24] rounded-2xl blur-2xl opacity-50" />
              <div className="relative bg-gradient-to-br from-[#282c34] to-[#1f2329] py-12 px-4 md:px-8 rounded-2xl border border-gray-700/50 shadow-2xl">
                <SolanaEnhancements />
              </div>
            </div>

            {/* Navigation to other pages */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/moddio/game-engine"
                className="group inline-flex items-center justify-center bg-gradient-to-r from-[#00a8ff] to-[#0099e6] hover:from-[#0099e6] hover:to-[#00a8ff] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#00a8ff]/30 hover:scale-105 gap-2"
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                <span>Game Engine</span>
              </Link>
              <Link
                href="/moddio"
                className="inline-flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 gap-2"
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                <span>Back to Moddio</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

