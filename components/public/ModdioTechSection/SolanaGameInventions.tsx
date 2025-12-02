'use client';

import { useEffect, useRef } from 'react';

export default function SolanaGameInventions() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 },
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const inventionTypes = [
    {
      title: 'NFT Game Assets',
      description: 'Create unique, tradeable in-game items, characters, and collectibles as Solana NFTs that players truly own.',
    },
    {
      title: 'Play-to-Earn Mechanics',
      description: 'Develop games with integrated token rewards, staking mechanisms, and earning opportunities powered by Solana.',
    },
    {
      title: 'GameFi Protocols',
      description: 'Build decentralized gaming finance platforms that combine DeFi with game mechanics on Solana\'s fast blockchain.',
    },
    {
      title: 'Cross-Game Economies',
      description: 'Design interoperable game universes where assets and currencies work across multiple Moddio games on Solana.',
    },
    {
      title: 'Tournament Platforms',
      description: 'Create automated tournament systems with smart contract-based prize pools, rankings, and rewards.',
    },
    {
      title: 'Game Development Tools',
      description: 'Build tools, SDKs, and plugins that enhance Moddio with Solana integration capabilities for other developers.',
    },
  ];

  return (
    <div
      ref={contentRef}
      className="opacity-0 translate-y-8 transition-all duration-700"
    >
      <div className="bg-[#282c34] rounded-xl p-8 md:p-10 lg:p-12 border border-gray-700">
        <div className="text-center mb-12">
          <h3 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Solana Game <span className="bg-gradient-to-r from-[#00a8ff] to-[#00a8ff] bg-clip-text text-transparent">Inventions</span> Space
          </h3>
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00a8ff] to-[#ff6b6b] rounded-xl blur-lg opacity-50" />
            <div className="relative bg-gradient-to-r from-[#00a8ff] to-[#ff6b6b] text-white text-xl md:text-2xl font-bold px-8 py-3 rounded-xl shadow-lg">
              Built for Moddio + Solana
            </div>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-[#00a8ff] via-[#ff6b6b] to-[#00a8ff] mx-auto mb-6 rounded-full" />
          <p className="text-lg md:text-xl font-medium text-gray-300 leading-relaxed max-w-3xl mx-auto">
            A dedicated space for inventors and innovators building the next generation of 
            Web3 games that combine Moddio's ease of use with Solana's blockchain power.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {inventionTypes.map((invention, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-[#1a1d24] to-[#0f1115] rounded-xl border border-gray-700/50 hover:border-[#00a8ff]/50 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00a8ff]/20 hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00a8ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              
              {/* Number badge */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#ff6b6b]/20 flex items-center justify-center border border-[#00a8ff]/30 group-hover:border-[#00a8ff]/50 transition-all duration-500">
                <span className="text-xs font-bold text-[#00a8ff]">{index + 1}</span>
              </div>
              
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-[#00a8ff] transition-colors duration-300 pr-10">
                  {invention.title}
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {invention.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00a8ff]/20 to-[#ff6b6b]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative bg-gradient-to-br from-[#1a1d24] to-[#0f1115] border border-gray-700/50 rounded-2xl px-8 py-6 group-hover:border-[#00a8ff]/50 transition-all duration-500">
              <p className="text-xl font-bold text-white mb-2">
                Have an Idea for <span className="text-[#00a8ff]">Solana</span> + <span className="text-[#ff6b6b]">Moddio</span>?
              </p>
              <p className="text-sm font-medium text-gray-300">
                Explore the endless possibilities of Web3 game development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

