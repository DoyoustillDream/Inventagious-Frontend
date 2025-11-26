'use client';

import { useEffect, useRef } from 'react';

// Shield Icon Component
const IconShield = () => (
  <svg
    aria-hidden="true"
    className="h-16 w-16 md:h-20 md:w-20 text-black"
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

export default function GuaranteeHero() {
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

  return (
    <section className="relative overflow-hidden bg-yellow-400 halftone-bg py-16 md:py-24">
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <IconShield />
          </div>
          <h1 className="hand-drawn mb-6 text-4xl md:text-6xl font-bold text-black">
            Platform Guarantee
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed mb-4">
            Your funds are protected. Your ownership stays yours.
          </p>
          <p className="text-lg font-semibold text-gray-700 max-w-3xl mx-auto">
            Built on Solana's blockchain for transparent, verifiable, and secure fundraising.
            Every transaction is on-chain. Every guarantee is real.
          </p>
        </div>
      </div>
    </section>
  );
}

