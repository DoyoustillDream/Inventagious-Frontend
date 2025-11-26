const targetMarkets = [
  {
    title: 'Target Market 1',
    detail: 'Project founders & innovators building on Solana — new or pre-existing teams.',
  },
  {
    title: 'Target Market 2',
    detail: 'Inventors turning world-changing ideas into reality and needing a faster path.',
  },
];

const marketSize = [
  { label: 'Total Available Market (TAM)', value: '$17.2B' },
  { label: 'Serviceable Available Market (SAM)', value: '$80M' },
  { label: 'Serviceable Obtainable Market (SOM)', value: '$172M' },
];

export default function MarketOpportunitySection() {
  return (
    <section className="bg-yellow-400 halftone-bg py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            Market Opportunity
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">
            We&apos;re focused on founders who ship
          </h2>
          <p className="hand-drawn mt-4 text-lg font-bold text-black">
            Crowdfunding in North America alone is a multibillion-dollar category. Inventagious adds
            a private funding lane, unlocking a much larger slice of the market for Solana-native
            teams.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                TARGET MARKETS
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-8">
              <h3 className="hand-drawn text-lg font-bold text-black mb-6">Target Markets</h3>
              <div className="space-y-5">
                {targetMarkets.map((target) => (
                  <article key={target.title} className="border-2 border-black bg-white p-5">
                    <p className="hand-drawn text-xs font-bold uppercase tracking-wide text-black">
                      {target.title}
                    </p>
                    <p className="hand-drawn mt-2 font-bold text-black">{target.detail}</p>
                  </article>
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
                MARKET SIZE
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-8">
              <h3 className="hand-drawn text-lg font-bold text-black mb-6">Market Size Snapshot</h3>
              <dl className="grid gap-6">
                {marketSize.map((stat) => (
                  <div key={stat.label}>
                    <dt className="hand-drawn text-xs uppercase tracking-wide text-black font-bold">{stat.label}</dt>
                    <dd className="hand-drawn mt-2 text-3xl font-bold text-black">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="hand-drawn mt-6 text-sm font-bold text-black">
                Source: Crowdfunding Market Size for North America. Inventagious bridges both public
                and private capital, so we capture share from multiple funding behaviors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


