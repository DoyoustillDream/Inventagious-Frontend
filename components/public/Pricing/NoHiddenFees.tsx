const noFees = [
  'No setup fees',
  'No monthly subscriptions',
  'No hidden charges',
  'No equity requirements',
  'No withdrawal fees',
  'No payment processing fees (beyond platform fee)',
];

export default function NoHiddenFees() {
  return (
    <section className="halftone-gray py-16">
      <div className="container mx-auto px-4">
        <div className="browser-window max-w-4xl mx-auto">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <div className="yellow-highlight hand-drawn text-xs font-bold">
              NO HIDDEN FEES
            </div>
            <div className="flex-1" />
          </div>
          <div className="p-8">
            <h2 className="hand-drawn text-2xl font-bold text-black mb-6 text-center">
              What you won't pay
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {noFees.map((fee, index) => (
                <div key={index} className="flex items-center gap-3 border-2 border-black bg-white p-4">
                  <svg className="h-6 w-6 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hand-drawn text-sm font-bold text-black">{fee}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t-2 border-black pt-6">
              <p className="hand-drawn text-base font-bold text-black text-center">
                The only fee you pay is our transparent 1.9% platform fee when you receive funding. 
                That's it. No surprises.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

