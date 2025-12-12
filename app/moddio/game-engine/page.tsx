import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ModdioHighlight from '@/components/public/ModdioTechSection/ModdioHighlight';

export const metadata: Metadata = {
  title: 'Moddio Game Engine - Web3 Native Game Engine | Inventagious',
  description: 'Moddio is an open-source, no-code game engine that empowers creators to build and deploy multiplayer games without writing a single line of code.',
  alternates: {
    canonical: '/moddio/game-engine',
  },
};

export default function GameEnginePage() {
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
                Web 3 Native <span className="bg-gradient-to-r from-[#00a8ff] to-[#ff6b6b] bg-clip-text text-transparent">Game Engine</span>
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#00a8ff] via-[#ff6b6b] to-[#00a8ff] mx-auto mb-8 rounded-full" />
            </div>

            {/* Moddio Highlight Section */}
            <div className="mb-16">
              <ModdioHighlight />
            </div>

            {/* Navigation to other pages */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
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
              <Link
                href="/moddio/solana-integration"
                className="group inline-flex items-center justify-center bg-gradient-to-r from-[#ff6b6b] to-[#ff5252] hover:from-[#ff5252] hover:to-[#ff6b6b] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#ff6b6b]/30 hover:scale-105 gap-2"
              >
                <span>Solana Integration</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

