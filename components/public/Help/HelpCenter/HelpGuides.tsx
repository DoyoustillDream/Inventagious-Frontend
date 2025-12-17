import Link from 'next/link';

// Icon Components
const IconRocket = () => (
  <svg className="h-12 w-12 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L8 4v6c0 4.5 2.5 8.5 6 9.5 3.5-1 6-5 6-9.5V4l-4-2z" />
    <circle cx="12" cy="8" r="1.5" fill="white" />
    <path d="M7 20l3-2 1 2M17 20l-3-2-1 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const IconFolder = () => (
  <svg className="h-12 w-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const IconLightbulb = () => (
  <svg className="h-12 w-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconLock = () => (
  <svg className="h-12 w-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconWallet = () => (
  <svg className="h-12 w-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const guides = [
  {
    title: 'How to Connect a Wallet',
    description: 'Learn how to connect your wallet using Google, Apple, or browser extension',
    href: '/help/connect-wallet',
    icon: <IconWallet />,
  },
  {
    title: 'How to Start a Project',
    description: 'Complete step-by-step guide to launching your project on Inventagious',
    href: '/help/start-project',
    icon: <IconRocket />,
  },
  {
    title: 'Project Categories',
    description: 'Learn about different project categories and choose the right one',
    href: '/help/categories',
    icon: <IconFolder />,
  },
  {
    title: 'Fundraising Tips',
    description: 'Tips and strategies for successful fundraising campaigns',
    href: '/help/tips',
    icon: <IconLightbulb />,
  },
  // COMMENTED OUT: Private Funding
  // {
  //   title: 'Private Funding',
  //   description: 'Explore private funding options and investor tools',
  //   href: '/private',
  //   icon: <IconLock />,
  // },
];

export default function HelpGuides() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            Help Guides
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">
            Popular guides and resources
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {guides.map((guide, index) => (
            <Link key={index} href={guide.href}>
              <div className="browser-window h-full transition hover:scale-105">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    GUIDE
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {guide.icon}
                  </div>
                  <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                    {guide.title}
                  </h3>
                  <p className="hand-drawn text-sm font-bold text-black">
                    {guide.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

