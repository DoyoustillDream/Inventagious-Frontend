// Icon Components
const IconCheck = () => (
  <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const IconLightning = () => (
  <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
  </svg>
);

const IconGift = () => (
  <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const IconRocket = () => (
  <svg className="h-8 w-8 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L8 4v6c0 4.5 2.5 8.5 6 9.5 3.5-1 6-5 6-9.5V4l-4-2z" />
    <circle cx="12" cy="8" r="1.5" fill="white" />
    <path d="M7 20l3-2 1 2M17 20l-3-2-1 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const IconCreditCard = () => (
  <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const IconBook = () => (
  <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const included = [
  {
    title: 'Zero Equity Required',
    description: 'Keep 100% ownership of your project. We never take equity.',
    icon: <IconCheck />,
  },
  {
    title: 'Instant Payments',
    description: 'Receive funds instantly via Solana. No waiting periods or holds.',
    icon: <IconLightning />,
  },
  {
    title: 'No Setup Fees',
    description: 'Create and launch your project completely free. Only pay when you receive funding.',
    icon: <IconGift />,
  },
  {
    title: 'Full Platform Access',
    description: 'Access to all features: public crowdfunding, private funding, investor tools, and more.',
    icon: <IconRocket />,
  },
  {
    title: 'Payment Processing',
    description: 'Helio Payments integration included. Accept SOL and USDC seamlessly.',
    icon: <IconCreditCard />,
  },
  {
    title: 'Support & Resources',
    description: 'Access to guides, tips, and support to help you succeed.',
    icon: <IconBook />,
  },
];

export default function WhatIncluded() {
  return (
    <section className="bg-yellow-400 halftone-bg py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            What's Included
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">
            Everything you need, nothing you don't
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {included.map((item, index) => (
            <div key={index} className="browser-window">
              <div className="browser-header">
                <div className="browser-controls">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
                <div className="flex-1" />
                <div className="yellow-highlight hand-drawn text-xs font-bold">
                  INCLUDED
                </div>
                <div className="flex-1" />
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                      {item.title}
                    </h3>
                    <p className="hand-drawn text-sm font-bold text-black">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

