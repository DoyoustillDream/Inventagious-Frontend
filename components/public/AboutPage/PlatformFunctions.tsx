const platformFunctions = [
  {
    title: 'Crowdfunding (Public Layer)',
    description:
      'Launch a public-facing profile with videos, story blocks, and milestone tracking. Fans can back you instantly in SOL or USDC.',
    highlights: [
      'UI modeled specifically for the public side of Inventagious',
      'Profile structure + media-first layout built for storytelling',
      'Helio Payments API embedded for instant contributions',
    ],
    accent: 'from-yellow-200 to-yellow-100',
  },
  {
    title: 'Private Funding (Private Layer)',
    description:
      'Work directly with investors and innovators in a secure workspace. Share diligence files, track commitments, and prep for test-net.',
    highlights: [
      'Private-only UI mirrors the public experience for continuity',
      'Workflow tools for investors and innovators to collaborate',
      'Ready for test-net and main-net checkpoints with escrow options',
    ],
    accent: 'from-gray-200 to-gray-100',
  },
];

export default function PlatformFunctions() {
  return (
    <section className="bg-yellow-400 halftone-bg py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            Platform Functions
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">
            Two sides of one mission-driven platform
          </h2>
          <p className="hand-drawn mt-4 text-lg font-bold text-black">
            Whether you&apos;re raising from your community or an invite-only group of investors, the
            experience feels cohesive, fast, and crypto-native.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {platformFunctions.map((layer, index) => (
            <article key={layer.title} className="browser-window">
              <div className="browser-header">
                <div className="browser-controls">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
                <div className="flex-1" />
                <div className="yellow-highlight hand-drawn text-xs font-bold">
                  {index === 0 ? 'PUBLIC LAYER' : 'PRIVATE LAYER'}
                </div>
                <div className="flex-1" />
              </div>
              <div className="p-8">
                <h3 className="hand-drawn text-xl font-bold text-black mb-4">{layer.title}</h3>
                <p className="hand-drawn text-lg font-bold text-black mb-6">{layer.description}</p>
                <ul className="space-y-3">
                  {layer.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-yellow-400 border-2 border-black flex-shrink-0" />
                      <span className="hand-drawn text-sm font-bold text-black">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


