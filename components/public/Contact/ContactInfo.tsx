'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const IconEmail = () => (
  <svg
    aria-hidden="true"
    className="h-12 w-12 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const IconHelp = () => (
  <svg
    aria-hidden="true"
    className="h-12 w-12 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconBook = () => (
  <svg
    aria-hidden="true"
    className="h-12 w-12 text-black"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const contactOptions = [
  {
    title: 'Email Support',
    description: "Send us an email and we'll get back to you within 24 hours",
    email: 'support@inventagious.com',
    icon: <IconEmail />,
  },
  {
    title: 'Help Center',
    description: 'Browse our help guides, FAQs, and step-by-step tutorials',
    href: '/help',
    icon: <IconHelp />,
  },
  {
    title: 'Getting Started Guide',
    description: 'Learn how to start your first project or campaign',
    href: '/help/start-project',
    icon: <IconBook />,
  },
];

export default function ContactInfo() {
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
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {contactOptions.map((option, index) => (
              <div key={index} className="browser-window h-full">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">CONTACT</div>
                  <div className="flex-1" />
                </div>
                <div className="p-6 text-center">
                  <div className="flex justify-center mb-4">{option.icon}</div>
                  <h3 className="hand-drawn text-lg font-bold text-black mb-2">{option.title}</h3>
                  <p className="text-sm font-semibold text-gray-700 mb-4">{option.description}</p>
                  {option.email ? (
                    <a
                      href={`mailto:${option.email}`}
                      className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-2 py-1 rounded underline"
                    >
                      {option.email}
                    </a>
                  ) : (
                    <Link
                      href={option.href!}
                      className="text-yellow-600 hover:bg-yellow-200 hover:text-black font-bold transition-colors px-2 py-1 rounded underline inline-block"
                    >
                      Visit Page
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="browser-window max-w-4xl mx-auto">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">SUPPORT</div>
              <div className="flex-1" />
            </div>
            <div className="p-8 text-center">
              <h2 className="hand-drawn text-2xl font-bold text-black mb-4">
                Need Immediate Assistance?
              </h2>
              <p className="text-base font-semibold text-gray-800 mb-6">
                Our support team is here to help you with any questions about using Inventagious,
                starting a project, or technical issues.
              </p>
              <div className="border-4 border-black bg-yellow-50 p-6">
                <p className="hand-drawn text-lg font-bold text-black mb-2">
                  Email: support@inventagious.com
                </p>
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  We typically respond within 24 hours during business days.
                </p>
                <div className="pt-4 border-t-2 border-black">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Follow us on social media:</p>
                  <a
                    href="https://x.com/Inventagiousapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-black hover:text-yellow-600 transition-colors font-bold"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Follow on X (Twitter)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

