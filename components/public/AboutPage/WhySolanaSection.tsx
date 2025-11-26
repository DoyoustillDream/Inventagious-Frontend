const reasons = [
  {
    title: 'Reason 1',
    detail:
      'Solana adoption is accelerating, bringing a much larger mainstream audience. Inventagious keeps projects in front of that momentum.',
  },
  {
    title: 'Reason 2',
    detail:
      'Solana infrastructure is weaving into platforms like Shopify, proving it is ready for commerce-grade scale and real-world utility.',
  },
];

const capabilities = [
  'Lightning-fast transactions for global contributors',
  'Ability for founders to cash out, stake, or reinvest instantly',
  'Rugged developer ecosystem for launching new tooling on-chain',
];

export default function WhySolanaSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            Why Solana?
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">
            Built on Solana for speed and scale
          </h2>
          <p className="hand-drawn mt-4 text-lg font-bold text-black">
            We chose Solana because it offers the perfect combination of speed, scalability, and a growing ecosystem. 
            This allows us to deliver instant payments and a seamless experience for inventors and backers worldwide.
          </p>
          <div className="mt-8 browser-window">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                TIMING
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-6">
              <p className="hand-drawn text-base font-bold text-black">
                Solana&apos;s growing adoption and integration with platforms like Shopify shows it&apos;s ready for 
                real-world commerce. We&apos;re building on this momentum to create the best funding experience for inventors.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 space-y-8">
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                CORE REASONS
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-6">
              <h3 className="hand-drawn text-lg font-bold text-black mb-4">Core reasons</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {reasons.map((reason) => (
                  <div key={reason.title} className="border-2 border-black bg-white p-4">
                    <p className="hand-drawn text-xs font-bold uppercase tracking-wide text-black">
                      {reason.title}
                    </p>
                    <p className="hand-drawn mt-2 font-bold text-black">{reason.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                CAPABILITIES
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-6">
              <h3 className="hand-drawn text-lg font-bold text-black mb-4">What founders get on Solana</h3>
              <ul className="space-y-3">
                {capabilities.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-yellow-400 border-2 border-black flex-shrink-0" />
                    <span className="hand-drawn text-sm font-bold text-black">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


