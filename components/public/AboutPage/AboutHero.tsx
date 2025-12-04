import Link from 'next/link';

const stats = [
  {
    label: 'Platform focus',
    value: 'Crowdfunding + Private Funding',
  },
  {
    label: 'Payments stack',
    value: 'Solana + Helio',
  },
  {
    label: 'Equity required',
    value: '0% — keep full ownership',
  },
];

export default function AboutHero() {
  return (
    <section className="bg-yellow-400 halftone-bg py-16">
      <div className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="hand-drawn text-sm uppercase tracking-[0.4em] text-black font-bold">
            Inventagious
          </p>
          <h1 className="hand-drawn text-4xl font-bold leading-tight md:text-5xl lg:text-6xl text-black">
            Where Ideas &amp; Innovation meet
          </h1>
          <p className="hand-drawn text-lg font-bold text-black leading-relaxed">
            Inventagious is a crowdfunding &amp; private fundraising platform built for inventors
            and innovators worldwide. We help you bring breakthrough hardware, software, and Web3
            experiences to market faster without sacrificing ownership, using the speed and global
            reach of Solana.
          </p>
          <div className="flex flex-col gap-4 text-base font-semibold sm:flex-row">
            <Link
              href="/projects/create"
              className="hand-drawn rounded-lg border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition hover:bg-gray-800"
            >
              Start a Project
            </Link>
            <Link
              href="/explore"
              className="hand-drawn rounded-lg border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition hover:bg-gray-100"
            >
              Browse Innovators
            </Link>
          </div>
          <div className="pt-2">
            <a
              href="https://x.com/Inventagiousapp"
              target="_blank"
              rel="noopener noreferrer"
              className="hand-drawn inline-flex items-center gap-2 rounded-lg border-4 border-black bg-black px-6 py-3 text-base font-bold text-white transition hover:bg-gray-800"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow us on X
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                WHY WE EXIST
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-6">
              <p className="hand-drawn text-base font-bold text-black leading-relaxed">
                Founders are forced to wait months for funding decisions, dilute their equity on day
                one, and rely on slow Web2 rails. We fix those bottlenecks with instant payments,
                built-in investor workflows, and a community obsessed with shipping new tech.
              </p>
              <dl className="mt-8 grid gap-6 sm:grid-cols-3 border-t-2 border-black pt-6">
                {stats.map((item) => (
                  <div key={item.label}>
                    <dt className="hand-drawn text-xs uppercase tracking-wide text-black font-bold mb-2">{item.label}</dt>
                    <dd className="hand-drawn text-base font-bold text-black">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


