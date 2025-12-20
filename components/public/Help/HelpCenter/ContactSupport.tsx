import Link from 'next/link';

// Icon Components
const IconBook = () => (
  <svg className="h-12 w-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const IconDollar = () => (
  <svg className="h-12 w-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconInfo = () => (
  <svg className="h-12 w-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const supportOptions = [
  {
    title: 'Browse Help Guides',
    description: 'Step-by-step guides for starting projects, choosing categories, and fundraising tips',
    href: '/help/start-project',
    icon: <IconBook />,
  },
  {
    title: 'Check Pricing',
    description: 'Transparent pricing information and fee structure',
    href: '/about/pricing',
    icon: <IconDollar />,
  },
  {
    title: 'Learn About Platform',
    description: 'Understand how Inventagious works and what makes us different',
    href: '/about',
    icon: <IconInfo />,
  },
];

export default function ContactSupport() {
  return (
    <section className="halftone-gray py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            Need More Help?
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">
            Additional resources and support
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto mb-12">
          {supportOptions.map((option, index) => (
            <Link key={index} href={option.href}>
              <div className="browser-window h-full transition hover:scale-105">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    RESOURCE
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {option.icon}
                  </div>
                  <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                    {option.title}
                  </h3>
                  <p className="hand-drawn text-sm font-bold text-black">
                    {option.description}
                  </p>
                </div>
              </div>
            </Link>
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
            <div className="yellow-highlight hand-drawn text-xs font-bold">
              CONTACT SUPPORT
            </div>
            <div className="flex-1" />
          </div>
          <div className="p-8 text-center">
            <h3 className="hand-drawn text-xl font-bold text-black mb-4">
              Still have questions?
            </h3>
            <p className="hand-drawn text-base font-bold text-black mb-6">
              If you can't find what you're looking for, we're here to help. Reach out to our support team for assistance.
            </p>
            <div className="border-2 border-black bg-yellow-50 p-6">
              <p className="hand-drawn text-sm font-bold text-black mb-2">
                Email us at: help@inventagious.com
              </p>
              <p className="hand-drawn text-sm font-bold text-black">
                We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

