const roadmap = [
  {
    title: 'Public Layer',
    highlight: 'PUBLIC',
    steps: [
      'Build the public-facing UI model',
      'Create profile structure + UI',
      'Design video-first profile layouts',
      'Integrate Helio Payments API',
    ],
  },
  {
    title: 'Private Layer',
    highlight: 'PRIVATE',
    steps: [
      'Build the private-side UI model',
      'Mirror the profile structure for investors',
      'Ship tools for investors & innovators',
      'Prepare every workflow for test-net',
    ],
  },
  {
    title: 'Test Net Launch',
    highlight: 'TESTNET',
    steps: [
      'Public testnet begins with curated projects',
      'Connect inventors & innovators for private testing',
      'Fix + finalize all key application errors',
    ],
  },
  {
    title: 'Main Net Launch',
    highlight: 'MAINNET',
    steps: [
      'Launch the final design on main-net',
      'Release iOS/Android app using Flutter',
      'Kick off platform-wide marketing',
    ],
  },
];

export default function RoadmapSection() {
  return (
    <section className="halftone-gray py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            Execution Plan
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">
            Roadmap to Main Net Launch
          </h2>
          <p className="hand-drawn mt-4 text-lg font-bold text-black max-w-3xl mx-auto">
            The original &ldquo;Main Plan&rdquo; diagram lives here as structured milestones. Each
            lane keeps teams focused on shippable outcomes and shared checkpoints.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {roadmap.map((phase) => (
            <article key={phase.title} className="browser-window">
              <div className="browser-header">
                <div className="browser-controls">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
                <div className="flex-1" />
                <div className="yellow-highlight hand-drawn text-xs font-bold">
                  {phase.highlight}
                </div>
                <div className="flex-1" />
              </div>
              <div className="p-6">
                <h3 className="hand-drawn text-xl font-bold text-black mb-5">{phase.title}</h3>
                <ul className="space-y-4">
                  {phase.steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="hand-drawn inline-flex items-center justify-center w-6 h-6 border-2 border-black bg-yellow-400 rounded-full text-xs font-bold text-black flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="hand-drawn text-sm font-bold text-black leading-relaxed">
                        {step}
                      </span>
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


