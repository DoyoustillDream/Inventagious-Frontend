'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const IconFlag = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 2v20l5-3 5 3V2H5zm2 2h6v13.5l-3-1.8-3 1.8V4z"
      fill="currentColor"
    />
  </svg>
);

const IconMessage = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

const IconSupport = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 text-black"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
      fill="currentColor"
    />
  </svg>
);

const steps = [
  {
    icon: <IconFlag />,
    title: 'Report Suspicious Activity',
    description:
      'If you notice anything suspicious or fraudulent, report it immediately through our contact form or help center. Include transaction signatures and campaign details for faster investigation.',
  },
  {
    icon: <IconMessage />,
    title: 'Admin Investigation',
    description:
      'Our admin team reviews all reports using our comprehensive admin dashboard. We examine transaction signatures, on-chain records, campaign details, and audit logs stored in our secure database.',
  },
  {
    icon: <IconSupport />,
    title: 'Immediate Action',
    description:
      'If fraud is confirmed, admins can immediately pause campaigns, flag transactions, ban users, and process refunds. All actions are logged in our audit system for complete transparency.',
  },
];

export default function ReportingProcess() {
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
              <div className="yellow-highlight hand-drawn text-xs font-bold">REPORTING PROCESS</div>
              <div className="flex-1" />
            </div>
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="hand-drawn mb-8 text-3xl md:text-4xl font-bold text-black text-center">
                How to Report Fraud or Issues
              </h2>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                We take every report seriously. Our admin team has comprehensive tools to investigate reports, review transaction signatures and on-chain records, and take immediate action including campaign suspension and refund processing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
                {steps.map((step, index) => (
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
                      <div className="flex justify-center mb-4">{step.icon}</div>
                      <h3 className="hand-drawn mb-3 text-xl font-bold text-black text-center">
                        {step.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-700 leading-relaxed text-center">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                <h3 className="hand-drawn mb-4 text-xl font-bold text-black text-center">
                  Need Help?
                </h3>
                <p className="text-sm font-semibold text-gray-800 text-center mb-4">
                  If you have questions or need assistance, our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors text-center border-2 border-black"
                  >
                    Contact Support
                  </Link>
                  <Link
                    href="/help"
                    className="px-6 py-3 bg-white hover:bg-gray-100 text-black font-bold rounded-lg transition-colors text-center border-2 border-black"
                  >
                    Visit Help Center
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

