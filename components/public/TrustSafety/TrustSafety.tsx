'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

// Shield Icon Component
const IconShield = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3zm0 2.18L19 6.3v5.7c0 4.34-2.8 8.4-7 9.5-4.2-1.1-7-5.16-7-9.5V6.3l7-2.12z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default function TrustSafety() {
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

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-yellow-400 halftone-bg py-20">
      <div className="absolute top-8 right-8">
        <span className="star-decoration" />
      </div>
      <div className="absolute bottom-12 left-12">
        <span className="swirl-decoration" />
      </div>

      <div
        ref={contentRef}
        className="container mx-auto relative z-10 px-4 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-4xl mx-auto">
          {/* Main Browser Window */}
          <div className="browser-window mb-8">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                BUILT ON SOLANA
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="hand-drawn mb-6 text-4xl md:text-5xl font-bold text-black text-center">
                Built on Solana. Built for Builders.
              </h2>

              <div className="space-y-4 mb-8">
                <p className="text-lg font-semibold text-black leading-relaxed">
                  Every transaction happens on-chain via{' '}
                  <span className="text-yellow-600 font-bold">Solana's blockchain</span>, giving you{' '}
                  <span className="text-yellow-600 font-bold">transparent, verifiable fundraising</span> from day one.
                </p>

                <p className="text-lg font-semibold text-black leading-relaxed">
                  No hidden fees, no equity dilution, no waiting weeks for funds. With{' '}
                  <Link
                    href="/about/pricing"
                    className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded underline"
                  >
                    transparent pricing
                  </Link>{' '}
                  and{' '}
                  <span className="text-yellow-600 font-bold">milestone-based releases</span>,{' '}
                  you maintain full control while backers have confidence their contributions are protected.
                </p>

                <p className="text-lg font-semibold text-black leading-relaxed">
                  Built for{' '}
                  <span className="text-yellow-600 font-bold">speed</span>,{' '}
                  <span className="text-yellow-600 font-bold">scalability</span>, and{' '}
                  <span className="text-yellow-600 font-bold">100% ownership</span>—the way Web3 fundraising should be.
                </p>
              </div>
            </div>
          </div>

          {/* Guarantee Card */}
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                PLATFORM GUARANTEE
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <div className="flex-shrink-0">
                  <IconShield />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-base font-semibold text-black mb-2">
                    Learn about our{' '}
                    <Link
                      href="/guarantee"
                      className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded underline"
                    >
                      platform guarantee
                    </Link>
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    Your funds are protected. Your ownership stays yours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
