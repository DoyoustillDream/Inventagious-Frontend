'use client';

import { useEffect, useRef } from 'react';
import SolanaLogo from './SolanaLogo';
import {
  BlockchainIcon,
  LightningIcon,
  DiamondIcon,
  MoneyIcon,
  LinkIcon,
  GlobeIcon,
} from './icons';

export default function SolanaEnhancements() {
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

  const enhancements = [
    {
      title: 'Blockchain-Powered Assets',
      description: 'Integrate Solana NFTs and tokens directly into Moddio games, enabling true ownership of in-game items, characters, and collectibles.',
      Icon: BlockchainIcon,
    },
    {
      title: 'Instant Transactions',
      description: 'Leverage Solana\'s lightning-fast transaction speeds (65,000+ TPS) for real-time in-game purchases, rewards, and microtransactions.',
      Icon: LightningIcon,
    },
    {
      title: 'Decentralized Economy',
      description: 'Create player-driven economies where gamers can trade, sell, and monetize their creations on Solana\'s decentralized marketplace.',
      Icon: DiamondIcon,
    },
    {
      title: 'Low-Cost Operations',
      description: 'Benefit from Solana\'s minimal transaction fees, making it economically viable for small in-game transactions and rewards.',
      Icon: MoneyIcon,
    },
    {
      title: 'Smart Contract Integration',
      description: 'Deploy custom Solana programs to automate game mechanics, tournaments, leaderboards, and reward distributions.',
      Icon: LinkIcon,
    },
    {
      title: 'Cross-Chain Compatibility',
      description: 'Build games that interact with the broader Solana ecosystem, including DeFi protocols, wallets, and other Web3 applications.',
      Icon: GlobeIcon,
    },
  ];

  return (
    <div
      ref={contentRef}
      className="opacity-0 translate-y-8 transition-all duration-700"
    >
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00a8ff]/30 to-[#ff6b6b]/30 rounded-full blur-3xl" />
            <div className="relative bg-[#1a1d24] p-6 rounded-2xl border-2 border-gray-700/50 shadow-2xl">
              <SolanaLogo className="h-16 md:h-20 w-auto max-w-[280px]" />
            </div>
          </div>
        </div>
        <h3 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          How <span className="bg-gradient-to-r from-[#00a8ff] to-[#00a8ff] bg-clip-text text-transparent">Solana</span> Enhances <span className="bg-gradient-to-r from-[#ff6b6b] to-[#ff6b6b] bg-clip-text text-transparent">Moddio</span>
        </h3>
        <div className="w-32 h-1 bg-gradient-to-r from-[#00a8ff] via-[#ff6b6b] to-[#00a8ff] mx-auto mb-6 rounded-full" />
        <p className="text-lg md:text-xl font-medium text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Solana's high-performance blockchain technology transforms Moddio games into 
          true Web3 experiences, enabling new possibilities for game developers and players.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enhancements.map((enhancement, index) => {
          const IconComponent = enhancement.Icon;
          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-[#1a1d24] to-[#0f1115] rounded-xl p-8 border border-gray-700/50 hover:border-[#00a8ff]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#00a8ff]/20 hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00a8ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  {/* Icon with gradient background */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                      <div className="relative bg-gradient-to-br from-[#00a8ff]/10 to-[#00a8ff]/5 p-4 rounded-2xl border border-[#00a8ff]/20 group-hover:border-[#00a8ff]/40 transition-all duration-500">
                        <IconComponent className="w-8 h-8 text-[#00a8ff] group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4 group-hover:text-[#00a8ff] transition-colors duration-300">
                    {enhancement.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed text-center group-hover:text-gray-200 transition-colors duration-300">
                  {enhancement.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

