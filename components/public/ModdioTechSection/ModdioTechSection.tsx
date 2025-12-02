'use client';

import ModdioHighlight from './ModdioHighlight';
import SolanaEnhancements from './SolanaEnhancements';

export default function ModdioTechSection() {
  return (
    <section className="relative overflow-hidden bg-[#1a1d24] py-20" style={{
      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 168, 255, 0.1) 1px, transparent 0)`,
      backgroundSize: '40px 40px'
    }}>
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Powering the <span className="bg-gradient-to-r from-[#00a8ff] to-[#00a8ff] bg-clip-text text-transparent">Future</span> of{' '}
            <span className="bg-gradient-to-r from-[#ff6b6b] to-[#ff6b6b] bg-clip-text text-transparent">Web3 Gaming</span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#00a8ff] via-[#ff6b6b] to-[#00a8ff] mx-auto mb-8 rounded-full" />
        </div>

        {/* Moddio Highlight Section */}
        <div className="mb-16">
          <ModdioHighlight />
        </div>

        {/* Solana Enhancements Section */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#282c34] to-[#1a1d24] rounded-2xl blur-2xl opacity-50" />
          <div className="relative bg-gradient-to-br from-[#282c34] to-[#1f2329] py-12 px-4 md:px-8 rounded-2xl border border-gray-700/50 shadow-2xl">
            <SolanaEnhancements />
          </div>
        </div>
      </div>
    </section>
  );
}

