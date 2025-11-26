'use client';

import { useEffect, useRef } from 'react';

const IconCrown = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L8 8l-4-2v12h16V6l-4 2-4-6zm0 18c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
      fill="currentColor"
    />
    <circle cx="12" cy="16" r="2" fill="white" />
  </svg>
);

const IconNoEquity = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M8 12h8M12 8v8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconFullControl = () => (
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

const ownershipFeatures = [
  {
    icon: <IconCrown />,
    title: '100% Ownership',
    description:
      'You keep complete ownership of your project, invention, and intellectual property. We never take equity, regardless of how much funding you raise.',
  },
  {
    icon: <IconNoEquity />,
    title: 'Zero Equity Required',
    description:
      'Unlike traditional platforms, Inventagious is designed so founders never give up equity. Your success is your success—we just facilitate the funding.',
  },
  {
    icon: <IconFullControl />,
    title: 'Full Control',
    description:
      'You decide how to use your funds, when to release milestones, and how to run your project. We provide the platform—you maintain complete autonomy.',
  },
];

export default function OwnershipProtection() {
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
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                OWNERSHIP PROTECTION
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="hand-drawn mb-8 text-3xl md:text-4xl font-bold text-black text-center">
                Your Ownership Stays Yours. Always.
              </h2>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                Built specifically for inventors who refuse to give up equity. Your project, your
                invention, your IP—all yours. We just provide the platform to help you raise funds
                without sacrificing ownership.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {ownershipFeatures.map((feature, index) => (
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

              <div className="mt-8 p-6 bg-white border-4 border-black rounded-lg">
                <p className="text-base font-bold text-black text-center">
                  <span className="text-yellow-600">Our Promise:</span> We will never ask for
                  equity, ownership stake, or intellectual property rights. Your project remains 100%
                  yours, forever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

