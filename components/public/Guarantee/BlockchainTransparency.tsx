'use client';

import { useEffect, useRef } from 'react';

const IconBlockchain = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="14" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="2" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="14" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M6 6h12M6 18h12M6 10v4M18 10v4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const IconVerify = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const IconPublic = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill="currentColor"
    />
  </svg>
);

const transparencyFeatures = [
  {
    icon: <IconBlockchain />,
    title: 'On-Chain Transactions',
    description:
      "Every transaction is recorded on Solana's public blockchain. You can verify every contribution, fee, and fund release using any Solana explorer.",
  },
  {
    icon: <IconVerify />,
    title: 'Verifiable & Auditable',
    description:
      'All smart contracts are open-source and auditable. Campaign funds, escrow accounts, and fee collection are all transparent and verifiable.',
  },
  {
    icon: <IconPublic />,
    title: 'Public Ledger',
    description:
      "Solana's blockchain provides a permanent, immutable record of all transactions. Nothing can be hidden or altered—complete transparency.",
  },
];

export default function BlockchainTransparency() {
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
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                BLOCKCHAIN TRANSPARENCY
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="hand-drawn mb-8 text-3xl md:text-4xl font-bold text-black text-center">
                Complete Transparency on Solana's Blockchain
              </h2>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                Every transaction happens on-chain via Solana's blockchain, giving you transparent,
                verifiable fundraising from day one. No hidden processes, no opaque systems—just
                blockchain transparency.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {transparencyFeatures.map((feature, index) => (
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
                      <div className="flex justify-center mb-4">{feature.icon}</div>
                      <h3 className="hand-drawn mb-3 text-xl font-bold text-black text-center">
                        {feature.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-700 leading-relaxed text-center">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gray-50 border-2 border-gray-300 rounded-lg">
                <p className="text-sm font-semibold text-gray-800 text-center">
                  <span className="font-bold text-yellow-600">View on Explorer:</span> All
                  transactions can be viewed on Solana explorers like{' '}
                  <a
                    href="https://solscan.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-600 hover:underline font-bold"
                  >
                    Solscan
                  </a>{' '}
                  or{' '}
                  <a
                    href="https://explorer.solana.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-600 hover:underline font-bold"
                  >
                    Solana Explorer
                  </a>
                  . Search for any campaign or deal address to see all transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

