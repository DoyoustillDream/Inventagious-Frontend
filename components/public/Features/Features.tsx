import Image from 'next/image';

export default function Features() {
  const features = [
    {
      title: 'CROWD FUNDING',
      description: 'Raise funds publicly from the community for your innovative projects',
      details: 'Launch your invention to the world and let the community support your vision. Perfect for inventors ready to bring their ideas to market.',
      iconLabel: 'FUND',
      highlight: 'Public Support',
      icon: '/icons/coin-gold.png',
    },
    {
      title: 'PRIVATE FUNDING',
      description: 'Connect with investors privately and raise capital without giving up equity',
      details: 'Secure funding from accredited investors through private deals. Keep 100% ownership of your invention while accessing the capital you need.',
      iconLabel: 'LOCK',
      highlight: 'Zero Equity',
      icon: '/icons/coin-silver.png',
    },
    {
      title: 'SOLANA',
      description: 'Fast, scalable transactions using Solana blockchain technology',
      details: 'Lightning-fast transactions with minimal fees. Built on Solana for speed, scalability, and the ability to stake, cash out, or build on-chain.',
      iconLabel: 'SOL',
      highlight: 'Lightning Fast',
      icon: '/icons/coin-red.png',
    },
  ];

  return (
    <section className="bg-yellow-400 halftone-bg py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
            How It Works
          </h2>
          <div className="squiggly-underline inline-block mb-6" />
          <p className="max-w-3xl mx-auto text-lg font-semibold text-black leading-relaxed">
            Inventagious offers two powerful ways to fundraise for inventors and innovators. 
            Whether you're building on Solana or creating the next breakthrough technology, 
            we provide the tools to get your project funded—fast.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="browser-window p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="browser-header mb-6">
                <div className="browser-controls">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
              </div>
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center gap-3 border-4 border-black bg-[var(--yellow-bright)] px-8 py-4">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <span className="text-3xl font-bold hand-drawn text-black">
                    {feature.iconLabel}
                  </span>
                </div>
              </div>
              <div className="mb-4 text-center">
                <span className="yellow-highlight hand-drawn text-lg font-bold">
                  {feature.title}
                </span>
              </div>
              <div className="mb-3 text-center">
                <span className="inline-block border-2 border-black bg-white px-4 py-1 text-xs font-bold hand-drawn text-black">
                  {feature.highlight}
                </span>
              </div>
              <p className="text-center text-base font-semibold text-black mb-4 leading-relaxed">
                {feature.description}
              </p>
              <p className="text-center text-sm text-gray-700 leading-relaxed">
                {feature.details}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="inline-block border-4 border-black bg-[var(--yellow-bright)] px-8 py-4 hand-drawn">
            <p className="text-lg font-bold text-black mb-2">
              Built Specifically for Inventors & Innovators
            </p>
            <p className="text-sm font-semibold text-black">
              No equity required • Fast Solana transactions • Web3 & Worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
