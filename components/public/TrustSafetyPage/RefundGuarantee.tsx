'use client';

import { useEffect, useRef } from 'react';

const IconRefund = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      fill="currentColor"
    />
    <path
      d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
      fill="currentColor"
    />
  </svg>
);

const IconClock = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconCheck = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      fill="currentColor"
    />
  </svg>
);

const guarantees = [
  {
    icon: <IconRefund />,
    title: 'Full Refund Protection',
    description:
      'If fraud occurs, you are guaranteed a full refund of your contribution. Admins can process refunds for entire campaigns or individual payments through our secure system.',
  },
  {
    icon: <IconClock />,
    title: 'Up to One Year Coverage',
    description:
      'Our refund guarantee covers contributions for up to one year after your donation. You have peace of mind long-term protection against fraud.',
  },
  {
    icon: <IconCheck />,
    title: 'On-Chain Refund Processing',
    description:
      'For campaigns using smart contracts, refunds are processed directly through Solana smart contracts. For off-chain campaigns, admins can process refunds securely through our platform.',
  },
];

export default function RefundGuarantee() {
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
    <section className="bg-gray-50 py-16 md:py-20">
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
              <div className="yellow-highlight hand-drawn text-xs font-bold">REFUND GUARANTEE</div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="hand-drawn mb-8 text-3xl md:text-4xl font-bold text-black text-center">
                Your Money-Back Guarantee
              </h2>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                We stand behind every contribution on our platform. If fraud occurs, we guarantee you
                a full refund for up to a year after your donation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
                {guarantees.map((guarantee, index) => (
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
                      <div className="flex justify-center mb-4">{guarantee.icon}</div>
                      <h3 className="hand-drawn mb-3 text-xl font-bold text-black text-center">
                        {guarantee.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-700 leading-relaxed text-center">
                        {guarantee.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <h3 className="hand-drawn mb-4 text-2xl font-bold text-black text-center">
                  How It Works
                </h3>
                <div className="space-y-3 text-sm font-semibold text-gray-800">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold">1.</span>
                    <p>
                      If you suspect fraud or encounter issues with a campaign, report it to our Trust & Safety team.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold">2.</span>
                    <p>
                      Our team investigates the claim thoroughly, reviewing all transaction records and campaign details.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold">3.</span>
                    <p>
                      If fraud is verified, admins process your full refund. For on-chain campaigns, refunds are executed through Solana smart contracts. All refunds are tracked in our audit system.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-600 font-bold">4.</span>
                    <p>
                      Refunds are returned to your original Solana wallet address. On-chain refunds are processed immediately via smart contract, while admin-processed refunds are handled securely through our platform.
                    </p>
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

