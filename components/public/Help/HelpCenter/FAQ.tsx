const faqs = [
  {
    question: 'How much does it cost to use Inventagious?',
    answer: 'Creating and launching a project is completely free. We only charge a 1.9% platform fee when you receive funding. There are no setup fees, monthly subscriptions, or hidden charges.',
  },
  {
    question: 'Do I need to give up equity?',
    answer: 'No! Inventagious is designed so you keep 100% ownership of your project. We never take equity, regardless of how much funding you raise.',
  },
  {
    question: 'How do I receive funds?',
    answer: 'Funds are sent directly to your Solana wallet instantly. You can cash out, stake to earn, or reinvest immediately. No waiting periods or holds.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept SOL and USDC through our Helio Payments integration. All transactions are processed on the Solana blockchain for instant, low-cost transfers.',
  },
  // COMMENTED OUT: Private Funding FAQ
  // {
  //   question: 'Can I run both crowdfunding and private funding?',
  //   answer: 'Yes! You can run a public crowdfunding campaign and also work with private investors simultaneously. The platform supports both funding methods.',
  // },
  {
    question: 'What happens if I do not reach my funding goal?',
    answer: 'You keep all funds raised, even if you do not reach your goal. There are no penalties or requirements to return funds if your goal is not met.',
  },
  {
    question: 'How do I connect my wallet?',
    answer: 'We use Phantom Connect SDK which offers multiple ways to connect:\n\n1) Sign in with Google or Apple (creates a secure embedded wallet automatically)\n2) Use your Phantom browser extension if you have it installed\n3) Connect via Phantom mobile app\n\nClick "Connect Wallet" in the header to see all options. No wallet extension required for Google/Apple sign-in!',
  },
];

export default function FAQ() {
  return (
    <section className="bg-yellow-400 halftone-bg py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            Frequently Asked Questions
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">
            Common questions answered
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="browser-window">
              <div className="browser-header">
                <div className="browser-controls">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
                <div className="flex-1" />
                <div className="yellow-highlight hand-drawn text-xs font-bold">
                  FAQ
                </div>
                <div className="flex-1" />
              </div>
              <div className="p-6">
                <h3 className="hand-drawn text-lg font-bold text-black mb-3">
                  {faq.question}
                </h3>
                <p className="hand-drawn text-sm font-bold text-black leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

