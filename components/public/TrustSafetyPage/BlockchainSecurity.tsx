'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const IconBlockchain = () => (
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

const IconEye = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      fill="currentColor"
    />
  </svg>
);

const features = [
  {
    icon: <IconBlockchain />,
    title: 'Program Derived Addresses (PDAs)',
    description:
      'Campaign funds are held in secure Program Derived Addresses (PDAs) on Solana. Each campaign has its own escrow vault PDA that cannot be accessed without meeting predefined conditions.',
  },
  {
    icon: <IconLock />,
    title: 'Transaction Signature Verification',
    description:
      'Every contribution requires a verified Solana transaction signature. Our SignatureVerificationService verifies all SOL transfers on-chain before recording contributions, ensuring authenticity.',
  },
  {
    icon: <IconEye />,
    title: 'Full Blockchain Transparency',
    description:
      'All transactions are recorded on Solana\'s blockchain with transaction signatures stored in our database. You can verify every contribution and fund movement on Solana explorers like Solscan.',
  },
];

export default function BlockchainSecurity() {
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
              <div className="yellow-highlight hand-drawn text-xs font-bold">BLOCKCHAIN SECURITY</div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="hand-drawn mb-8 text-3xl md:text-4xl font-bold text-black text-center">
                Built on Solana's Secure Blockchain
              </h2>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                Our platform leverages Solana's blockchain technology with Program Derived Addresses (PDAs) for escrow,
                mandatory transaction signature verification, and encrypted wallet storage. Every transaction is cryptographically secured and publicly verifiable on-chain.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
                {features.map((feature, index) => (
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

              <div className="p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <p className="text-sm font-semibold text-gray-800 text-center mb-4">
                  <span className="font-bold text-yellow-600">Technical Details:</span> Campaigns can use either on-chain smart contracts (with PDAs and escrow vaults) or off-chain direct SOL transfers (with signature verification). Both methods provide secure fund protection. Learn more about our{' '}
                  <Link
                    href="/guarantee"
                    className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-1 rounded underline"
                  >
                    platform guarantee
                  </Link>{' '}
                  for complete details on fund protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

