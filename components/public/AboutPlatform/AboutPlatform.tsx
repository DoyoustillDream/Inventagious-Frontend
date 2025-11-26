'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AboutPlatform() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for fade-in animation
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

    if (backgroundRef.current) {
      observer.observe(backgroundRef.current);
    }
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-yellow-400 halftone-bg py-20">
      {/* Background Element */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-yellow-50 to-white opacity-0 transition-opacity duration-1000"
      />

      {/* Content Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <div
            ref={contentRef}
            className="container mx-auto px-4 opacity-0 translate-y-8 transition-all duration-700"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="hand-drawn mb-6 text-4xl md:text-5xl font-bold text-black">
                Built for Inventors Who Refuse to Give Up Equity
              </h2>
              <p className="mb-6 text-lg font-semibold text-gray-800 leading-relaxed">
                Inventagious is the only platform where{' '}
                <Link
                  href="/explore?category=hardware"
                  className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded"
                  rel="noreferrer"
                >
                  inventors
                </Link>{' '}
                and{' '}
                <Link
                  href="/explore?category=web3"
                  className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded"
                  rel="noreferrer"
                >
                  innovators
                </Link>{' '}
                can raise capital without sacrificing ownership. Launch{' '}
                <Link
                  href="/explore?category=hardware"
                  className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded"
                  rel="noreferrer"
                >
                  hardware inventions
                </Link>
                ,{' '}
                <Link
                  href="/explore?category=software"
                  className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded"
                  rel="noreferrer"
                >
                  software solutions
                </Link>
                , and{' '}
                <Link
                  href="/explore?category=web3"
                  className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded"
                  rel="noreferrer"
                >
                  Web3 projects
                </Link>{' '}
                through public{' '}
                <Link
                  href="/explore?type=crowdfunding"
                  className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded"
                  rel="noreferrer"
                >
                  crowdfunding campaigns
                </Link>{' '}
                or private investor deals—all powered by{' '}
                <span className="text-yellow-600 font-bold">Solana's lightning-fast blockchain</span>. 
                Your funds arrive instantly, and you can cash out, stake to earn, or build directly on Solana.
              </p>
              <p className="mb-6 text-lg font-semibold text-gray-800 leading-relaxed">
                Traditional platforms take forever and demand equity. We're built for speed, scalability, and{' '}
                <span className="text-yellow-600 font-bold">100% ownership</span>. 
                Join the{' '}
                <Link
                  href="/explore?category=solana"
                  className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded"
                  rel="noreferrer"
                >
                  Solana ecosystem
                </Link>{' '}
                of builders who are getting to market faster.
              </p>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                Ready to launch?{' '}
                <Link
                  href="/about"
                  className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded"
                  rel="noreferrer"
                >
                  See how it works
                </Link>
                {' '}or check out our{' '}
                <Link
                  href="/faq"
                  className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded"
                  rel="noreferrer"
                >
                  FAQ
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
