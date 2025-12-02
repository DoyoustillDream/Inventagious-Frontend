'use client';

import { useEffect, useRef } from 'react';

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
  </svg>
);

const IconVerified = () => (
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

const IconMonitor = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="3"
      width="20"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const protections = [
  {
    icon: <IconShield />,
    title: 'Admin Approval System',
    description:
      'All campaigns start as drafts and require admin approval before going live. Our admin team reviews each project to ensure legitimacy before it can accept contributions.',
  },
  {
    icon: <IconVerified />,
    title: 'Transaction Signature Verification',
    description:
      'Every contribution requires a verified Solana transaction signature. We verify all SOL transfers on-chain before recording contributions, preventing fake or manipulated transactions.',
  },
  {
    icon: <IconMonitor />,
    title: 'Admin Monitoring & Controls',
    description:
      'Admins can pause campaigns, flag suspicious transactions, ban users, and process refunds. All actions are logged in our audit system for complete transparency and accountability.',
  },
];

export default function FraudProtection() {
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
              <div className="yellow-highlight hand-drawn text-xs font-bold">FRAUD PROTECTION</div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="hand-drawn mb-8 text-3xl md:text-4xl font-bold text-black text-center">
                Comprehensive Fraud Prevention
              </h2>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                We take fraud prevention seriously. Our multi-layered approach includes admin approval for all campaigns,
                mandatory transaction signature verification, and comprehensive admin controls to protect contributors.
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

