const problems = [
  {
    title: 'Problem 1',
    description:
      'It takes far too long to get new technology into the hands of real users. Legacy platforms slow the launch process with endless approvals.',
  },
  {
    title: 'Problem 2',
    description:
      'Founders give up large chunks of equity at the earliest stages, which limits future leverage and long-term control.',
  },
  {
    title: 'Problem 3',
    description:
      'Getting capital quickly is nearly impossible with Web2 rails. Traditional payment flows delay momentum and create friction worldwide.',
  },
];

const solutions = [
  {
    title: 'Solution 1',
    description:
      'Inventagious creates a streamlined path to market so inventors can launch to the public and private investors at the same time.',
  },
  {
    title: 'Solution 2',
    description:
      'We help founders raise capital without giving up any equity by design. Backers get speed, transparency, and crypto-native rails.',
  },
  {
    title: 'Solution 3',
    description:
      'Solana + Helio delivers instant payments, so builders can cash out, stake, or reinvest without the typical fundraising drag.',
  },
];

export default function ProblemSolutionSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            Our Mission
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">Removing friction for founders</h2>
          <p className="hand-drawn mt-4 text-lg font-bold text-black">
            We identified the biggest challenges inventors face and built solutions to address them.
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
                PROBLEMS
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-8">
              <h3 className="hand-drawn text-xl font-bold text-black mb-6">Challenges inventors face</h3>
              <div className="space-y-6">
                {problems.map((item) => (
                  <article key={item.title} className="border-2 border-black bg-white p-5">
                    <p className="hand-drawn text-xs font-bold uppercase tracking-wide text-black">
                      {item.title}
                    </p>
                    <p className="hand-drawn mt-2 font-bold text-black">{item.description}</p>
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
                SOLUTIONS
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-8">
              <h3 className="hand-drawn text-xl font-bold text-black mb-6">How we help</h3>
              <div className="space-y-6">
                {solutions.map((item) => (
                  <article key={item.title} className="border-2 border-black bg-white p-5">
                    <p className="hand-drawn text-xs font-bold uppercase tracking-wide text-black">
                      {item.title}
                    </p>
                    <p className="hand-drawn mt-2 font-bold text-black">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


