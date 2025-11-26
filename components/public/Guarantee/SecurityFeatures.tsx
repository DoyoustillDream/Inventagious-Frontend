'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const IconPDA = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconAudit = () => (
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

const IconPause = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="4" width="4" height="16" fill="currentColor" />
    <rect x="14" y="4" width="4" height="16" fill="currentColor" />
  </svg>
);

const securityFeatures = [
  {
    icon: <IconPDA />,
    title: 'Program Derived Addresses (PDAs)',
    description:
      'All campaign and deal funds are stored in secure PDAs that can only be accessed by the smart contract programs. This prevents unauthorized access and ensures funds are only released according to contract logic.',
  },
  {
    icon: <IconAudit />,
    title: 'Smart Contract Validation',
    description:
      'All transactions are validated by Anchor framework constraints. Account validation, access control, and math safety checks ensure no invalid operations can occur.',
  },
  {
    icon: <IconPause />,
    title: 'Emergency Pause Mechanism',
    description:
      'The platform includes an emergency pause function that can temporarily halt operations if critical issues are detected. This provides an additional layer of protection for all users.',
  },
];

export default function SecurityFeatures() {
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
    <section className="bg-yellow-400 halftone-bg py-16 md:py-20">
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
              <div className="yellow-highlight hand-drawn text-xs font-bold">SECURITY FEATURES</div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="hand-drawn mb-8 text-3xl md:text-4xl font-bold text-black text-center">
                Enterprise-Grade Security on Solana
              </h2>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                Built with security-first principles using Anchor framework and Solana's proven
                blockchain infrastructure. Every feature is designed to protect your funds and
                maintain platform integrity.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {securityFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="browser-window border-2 border-gray-300 hover:border-yellow-600 transition-colors bg-white"
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

              <div className="mt-8 space-y-4">
                <div className="browser-window bg-white">
                  <div className="browser-header">
                    <div className="browser-controls">
                      <div className="browser-dot red" />
                      <div className="browser-dot yellow" />
                      <div className="browser-dot green" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="hand-drawn mb-4 text-2xl font-bold text-black text-center">
                      Additional Security Measures
                    </h3>
                    <ul className="space-y-3 text-sm font-semibold text-gray-700">
                      <li className="flex items-start">
                        <span className="text-yellow-600 font-bold mr-2">✓</span>
                        <span>
                          <strong>Math Safety:</strong> All arithmetic operations use checked math to
                          prevent overflows and underflows
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 font-bold mr-2">✓</span>
                        <span>
                          <strong>Input Validation:</strong> All user inputs are validated before
                          processing to prevent invalid operations
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 font-bold mr-2">✓</span>
                        <span>
                          <strong>CPI Security:</strong> Cross-program invocations are validated to
                          ensure only authorized programs can interact
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 font-bold mr-2">✓</span>
                        <span>
                          <strong>Access Control:</strong> Signer checks and custom validations
                          ensure only authorized users can execute sensitive operations
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

