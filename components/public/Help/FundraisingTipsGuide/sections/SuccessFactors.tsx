import Link from 'next/link';

export default function SuccessFactors() {
  return (
    <div className="browser-window bg-yellow-50">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold">
          SUCCESS FACTORS
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Key Success Factors
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          The most successful campaigns share these characteristics:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Clear Value Proposition
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Backers immediately understand what you're building and why it matters.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Strong Founder Story
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              People back people. Share your journey, passion, and why you're the right person.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Active Communication
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Regular updates, quick responses, and genuine engagement build trust.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Realistic Planning
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Achievable goals, clear timelines, and honest expectations set you up for success.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Quality Presentation
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Professional visuals, clear descriptions, and polished content show you're serious.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Community Building
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Engaged communities become your best advocates and long-term supporters.
            </p>
          </div>
        </div>
        <div className="bg-white border-4 border-black p-6 text-center">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Ready to Launch Your Campaign?
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-6">
            Now that you know the strategies, it's time to put them into action!
          </p>
          <Link
            href="/projects/create"
            className="hand-drawn inline-block border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
          >
            Create Your Project
          </Link>
        </div>
      </div>
    </div>
  );
}

