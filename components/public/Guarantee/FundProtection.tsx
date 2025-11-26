'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const IconLock = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1C9.24 1 7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-1V6c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3z"
      fill="currentColor"
    />
  </svg>
);

const IconEscrow = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const IconMilestone = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

const protections = [
  {
    icon: <IconLock />,
    title: 'Escrow Protection',
    description:
      'All funds are held in secure Program Derived Address (PDA) escrow accounts on Solana. Funds cannot be accessed until milestones are met or campaign goals are reached.',
  },
  {
    icon: <IconEscrow />,
    title: 'Smart Contract Security',
    description:
      'Every transaction is executed through audited Solana smart contracts. Funds are automatically protected by blockchain security—no manual intervention required.',
  },
  {
    icon: <IconMilestone />,
    title: 'Milestone-Based Releases',
    description:
      'For private funding deals, funds are released only when agreed-upon milestones are completed and verified. You maintain control over when funds are accessed.',
  },
];

export default function FundProtection() {
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
    <section className="bg-white py-16 md:py-20">
      <div
        ref={contentRef}
        className="container mx-auto px-4 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-6xl mx-auto">
          <div className="browser-window mb-12">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">FUND PROTECTION</div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="hand-drawn mb-8 text-3xl md:text-4xl font-bold text-black text-center">
                Your Funds Are Protected by Blockchain Security
              </h2>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                Every contribution is secured on Solana's blockchain using Program Derived
                Addresses (PDAs). Funds are held in escrow until conditions are met, ensuring
                transparency and security for both creators and backers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {protections.map((protection, index) => (
                  <div
                    key={index}
                    className="browser-window border-2 border-gray-200 hover:border-yellow-400 transition-colors"
                  >
                    <div className="browser-header">
                      <div className="browser-controls">
                        <div className="browser-dot red" />
                        <div className="browser-dot yellow" />
                        <div className="browser-dot green" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-center mb-4">{protection.icon}</div>
                      <h3 className="hand-drawn mb-3 text-xl font-bold text-black text-center">
                        {protection.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-700 leading-relaxed text-center">
                        {protection.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <p className="text-sm font-semibold text-gray-800 text-center">
                  <span className="font-bold text-yellow-600">Refund Protection:</span> If a
                  crowdfunding campaign doesn't reach its goal, contributors can request refunds
                  through the smart contract. All refunds are processed automatically on-chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

