'use client';

import ModdioHighlight from './ModdioHighlight';

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
      </div>
    </section>
  );
}