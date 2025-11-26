export default function PricingHero() {
  return (
    <section className="bg-yellow-400 halftone-bg py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="browser-window bg-yellow-50">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                PRICING
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-8 md:p-12">
              <h1 className="hand-drawn mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                Transparent Pricing
              </h1>
              <div className="squiggly-underline inline-block mb-6" />
              <p className="hand-drawn text-lg md:text-xl font-bold text-black mb-4 max-w-3xl mx-auto">
                No hidden fees. No equity required. Just simple, transparent pricing.
              </p>
              <p className="hand-drawn text-base font-bold text-black max-w-2xl mx-auto leading-relaxed">
                We believe in complete transparency. Here is exactly what you will pay when you fundraise on Inventagious.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

