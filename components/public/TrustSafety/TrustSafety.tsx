'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

// Visual Icons
const IconShield = () => (
  <svg
    aria-hidden="true"
    className="h-20 w-20 text-black"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      d="M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3zm0 2.18L19 6.3v5.7c0 4.34-2.8 8.4-7 9.5-4.2-1.1-7-5.16-7-9.5V6.3l7-2.12z"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const IconBlockchain = () => (
  <svg className="h-20 w-20 text-black" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="8" height="8" rx="2" />
    <rect x="14" y="2" width="8" height="8" rx="2" />
    <rect x="2" y="14" width="8" height="8" rx="2" />
    <rect x="14" y="14" width="8" height="8" rx="2" />
    <path d="M6 6h4M18 6h4M6 18h4M18 18h4M6 6v4M18 6v4M6 18v4M18 18v4" stroke="white" strokeWidth="2" />
  </svg>
);

const IconTransparency = () => (
  <svg className="h-20 w-20 text-black" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" fill="white" />
  </svg>
);

export default function TrustSafety() {
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

  const trustFeatures = [
    {
      icon: <IconBlockchain />,
      title: 'On-Chain',
      description: 'Every transaction on Solana blockchain',
      color: 'from-purple-400 to-purple-300',
    },
    {
      icon: <IconTransparency />,
      title: 'Transparent',
      description: 'No hidden fees, verifiable fundraising',
      color: 'from-blue-400 to-blue-300',
    },
    {
      icon: <IconShield />,
      title: 'Protected',
      description: 'Milestone-based releases',
      color: 'from-green-400 to-green-300',
    },
  ];

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
        <div className="max-w-6xl mx-auto">
          <h2 className="hand-drawn mb-12 text-4xl md:text-5xl font-bold text-black text-center">
            Built on Solana. Built for Builders.
          </h2>

          {/* Visual Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="browser-window">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    SOLANA
                  </div>
                  <div className="flex-1" />
                </div>
                <div className={`relative aspect-square w-full overflow-hidden bg-gradient-to-br ${feature.color} p-8`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="hand-drawn text-xl font-bold text-black mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm font-bold text-black">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
            <div className="p-8">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="relative aspect-square w-32 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center border-4 border-black">
                  <IconShield />
                </div>
                <div>
                  <p className="hand-drawn text-xl font-bold text-black mb-3">
                    Your funds are protected. Your ownership stays yours.
                  </p>
                  <Link
                    href="/guarantee"
                    className="hand-drawn inline-block rounded-lg border-4 border-black bg-white px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-400"
                  >
                    Learn about our platform guarantee →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
