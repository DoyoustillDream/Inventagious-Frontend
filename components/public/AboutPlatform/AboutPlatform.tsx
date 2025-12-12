'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Visual Icons - 100% Ownership
const IconOwnership = () => (
  <svg className="h-16 w-16 text-black" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Crown */}
    <path
      d="M30 50L40 35L50 45L60 30L70 45L80 35L90 50L90 70H30V50Z"
      fill="currentColor"
      opacity="0.9"
    />
    {/* Crown jewels */}
    <circle cx="40" cy="40" r="4" fill="white" opacity="0.9" />
    <circle cx="60" cy="35" r="5" fill="white" opacity="0.9" />
    <circle cx="80" cy="40" r="4" fill="white" opacity="0.9" />
    {/* Crown base */}
    <rect x="30" y="50" width="60" height="8" fill="currentColor" opacity="0.9" />
    {/* Document/Contract */}
    <path
      d="M25 75H55V105H25C23 105 21 103 21 101V79C21 77 23 75 25 75Z"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Document lines */}
    <line x1="28" y1="85" x2="52" y2="85" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="28" y1="92" x2="52" y2="92" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="28" y1="99" x2="45" y2="99" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    {/* Key */}
    <circle cx="75" cy="85" r="8" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.9" />
    <rect x="75" y="85" width="12" height="8" rx="2" fill="currentColor" opacity="0.9" />
    <rect x="83" y="89" width="6" height="2" rx="1" fill="white" />
    {/* Key teeth */}
    <rect x="79" y="83" width="2" height="4" rx="1" fill="white" />
    <rect x="82" y="80" width="2" height="3" rx="1" fill="white" />
    {/* 100% badge */}
    <circle cx="95" cy="25" r="18" fill="currentColor" opacity="0.9" />
    <circle cx="95" cy="25" r="14" fill="white" />
    {/* Checkmark in badge */}
    <path d="M88 25L91 28L102 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
    {/* Star decoration */}
    <path d="M95 15L96 18L99 18L97 20L98 23L95 21L92 23L93 20L91 18L94 18Z" fill="currentColor" opacity="0.8" />
  </svg>
);

// Visual Icons - Instant Funds
const IconSpeed = () => (
  <svg className="h-16 w-16 text-black" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lightning bolt */}
    <path
      d="M50 15L40 50L55 50L45 105L75 40L60 40L70 15H50Z"
      fill="currentColor"
      opacity="0.9"
    />
    {/* Lightning highlight */}
    <path
      d="M55 25L48 48L58 48L52 95L70 45L62 45L68 25H55Z"
      fill="white"
      opacity="0.6"
    />
    {/* Wallet */}
    <rect x="20" y="65" width="80" height="50" rx="4" fill="currentColor" opacity="0.8" />
    <rect x="20" y="65" width="80" height="25" rx="4" fill="white" opacity="0.3" />
    {/* Wallet card */}
    <rect x="30" y="72" width="60" height="12" rx="2" fill="white" opacity="0.5" />
    {/* Solana S on card */}
    <path
      d="M50 76C52 76 53.5 76.5 53.5 77.5C53.5 78.5 52 79 50 79C48 79 46.5 78.5 46.5 77.5M50 79C48 79 46.5 79.5 46.5 80.5C46.5 81.5 48 82 50 82C52 82 53.5 81.5 53.5 80.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.7"
    />
    {/* Coins flying out */}
    <circle cx="85" cy="50" r="10" fill="white" opacity="0.9" />
    <circle cx="85" cy="50" r="6" fill="currentColor" opacity="0.7" />
    <path d="M85 46L83 48L85 50L87 48Z" fill="white" opacity="0.9" />
    <line x1="85" y1="44" x2="85" y2="56" stroke="white" strokeWidth="1.5" opacity="0.9" />
    
    <circle cx="105" cy="70" r="8" fill="white" opacity="0.9" />
    <circle cx="105" cy="70" r="5" fill="currentColor" opacity="0.7" />
    <path d="M105 67L103.5 69L105 71L106.5 69Z" fill="white" opacity="0.9" />
    <line x1="105" y1="65" x2="105" y2="75" stroke="white" strokeWidth="1.5" opacity="0.9" />
    
    <circle cx="35" cy="45" r="7" fill="white" opacity="0.9" />
    <circle cx="35" cy="45" r="4" fill="currentColor" opacity="0.7" />
    <path d="M35 43L34 44.5L35 46L36 44.5Z" fill="white" opacity="0.9" />
    <line x1="35" y1="41" x2="35" y2="49" stroke="white" strokeWidth="1.5" opacity="0.9" />
    {/* Speed lines */}
    <line x1="25" y1="30" x2="35" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
    <line x1="25" y1="35" x2="30" y2="35" stroke="currentColor" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
  </svg>
);

// Visual Icons - Built on Solana
const IconSolana = () => (
  <svg className="h-16 w-16 text-black" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Blockchain blocks */}
    <rect x="15" y="20" width="25" height="25" rx="2" fill="currentColor" opacity="0.9" />
    <rect x="15" y="20" width="25" height="8" rx="2" fill="white" opacity="0.3" />
    <line x1="20" y1="28" x2="35" y2="28" stroke="white" strokeWidth="1" opacity="0.5" />
    <line x1="20" y1="32" x2="30" y2="32" stroke="white" strokeWidth="1" opacity="0.5" />
    
    <rect x="50" y="30" width="25" height="25" rx="2" fill="currentColor" opacity="0.9" />
    <rect x="50" y="30" width="25" height="8" rx="2" fill="white" opacity="0.3" />
    <line x1="55" y1="38" x2="70" y2="38" stroke="white" strokeWidth="1" opacity="0.5" />
    <line x1="55" y1="42" x2="65" y2="42" stroke="white" strokeWidth="1" opacity="0.5" />
    
    <rect x="85" y="20" width="25" height="25" rx="2" fill="currentColor" opacity="0.9" />
    <rect x="85" y="20" width="25" height="8" rx="2" fill="white" opacity="0.3" />
    <line x1="90" y1="28" x2="105" y2="28" stroke="white" strokeWidth="1" opacity="0.5" />
    <line x1="90" y1="32" x2="100" y2="32" stroke="white" strokeWidth="1" opacity="0.5" />
    
    {/* Connection lines */}
    <line x1="40" y1="32.5" x2="50" y2="42.5" stroke="currentColor" strokeWidth="2" opacity="0.7" />
    <line x1="75" y1="42.5" x2="85" y2="32.5" stroke="currentColor" strokeWidth="2" opacity="0.7" />
    
    {/* Solana logo */}
    <circle cx="60" cy="75" r="20" fill="#14F195" opacity="0.9" />
    <circle cx="60" cy="75" r="14" fill="white" />
    {/* Solana S symbol */}
    <path
      d="M60 68C63 68 65 69 65 70.5C65 72 63 73 60 73C57 73 55 72 55 70.5M60 73C57 73 55 74 55 75.5C55 77 57 78 60 78C63 78 65 77 65 75.5"
      stroke="#14F195"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Network nodes */}
    <circle cx="30" cy="95" r="6" fill="currentColor" opacity="0.8" />
    <circle cx="60" cy="100" r="6" fill="currentColor" opacity="0.8" />
    <circle cx="90" cy="95" r="6" fill="currentColor" opacity="0.8" />
    {/* Network connections */}
    <line x1="36" y1="95" x2="54" y2="100" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    <line x1="66" y1="100" x2="84" y2="95" stroke="currentColor" strokeWidth="2" opacity="0.6" />
  </svg>
);

export default function AboutPlatform() {
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

  const features = [
    {
      icon: <IconOwnership />,
      title: '100% Ownership',
      description: 'No equity given up',
      color: 'from-yellow-400 to-yellow-300',
    },
    {
      icon: <IconSpeed />,
      title: 'Instant Funds',
      description: 'Lightning-fast Solana transactions',
      color: 'from-purple-400 to-purple-300',
    },
    {
      icon: <IconSolana />,
      title: 'Built on Solana',
      description: 'Web3 blockchain technology',
      color: 'from-green-400 to-green-300',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-yellow-400 halftone-bg py-20">
      <div
        ref={contentRef}
        className="container mx-auto px-4 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="hand-drawn mb-12 text-4xl md:text-5xl font-bold text-black text-center">
            Built for Inventors Who Refuse to Give Up Equity
          </h2>
          
          {/* Visual Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="browser-window">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
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

          {/* Visual CTA Section */}
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                READY TO LAUNCH?
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-8 text-center">
              <p className="hand-drawn mb-6 text-xl font-bold text-black">
                Launch hardware, software, and Web3 projects on Solana
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/about"
                  className="hand-drawn rounded-lg border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition hover:bg-yellow-400"
                >
                  See How It Works
                </Link>
                <Link
                  href="/explore"
                  className="hand-drawn rounded-lg border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition hover:bg-gray-800"
                >
                  Explore Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
