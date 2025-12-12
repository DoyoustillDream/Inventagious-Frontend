import Link from 'next/link';

interface Tip {
  id: string;
  title: string;
  href: string;
  icon: 'lightbulb' | 'edit' | 'help-sent';
  color: string;
}

const tips: Tip[] = [
  {
    id: 'top-tips',
    title: 'Top tips for your Inventagious project',
    href: '/tips/fundraising',
    icon: 'lightbulb',
    color: 'from-yellow-400 to-yellow-300',
  },
  {
    id: 'storytelling',
    title: 'Tips for telling a great project story',
    href: '/tips/storytelling',
    icon: 'edit',
    color: 'from-blue-400 to-blue-300',
  },
  {
    id: 'sharing',
    title: 'Tips for sharing your project',
    href: '/tips/sharing',
    icon: 'help-sent',
    color: 'from-purple-400 to-purple-300',
  },
];

// SVG Icons - Larger versions
const IconLightbulb = () => (
  <svg
    aria-hidden="true"
    className="h-16 w-16 text-black"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"
    />
    <circle cx="12" cy="9" r="1.5" fill="white" />
  </svg>
);

const IconEdit = () => (
  <svg
    aria-hidden="true"
    className="h-16 w-16 text-black"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
    />
    <path d="M12 8l4 4M8 12l4 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconHelpSent = () => (
  <svg
    aria-hidden="true"
    className="h-16 w-16 text-black"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
    />
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);

const getIcon = (iconType: Tip['icon']) => {
  switch (iconType) {
    case 'lightbulb':
      return <IconLightbulb />;
    case 'edit':
      return <IconEdit />;
    case 'help-sent':
      return <IconHelpSent />;
    default:
      return <IconLightbulb />;
  }
};

export default function FundraisingTips() {
  return (
    <section className="halftone-gray py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <h2 className="hand-drawn text-4xl md:text-5xl font-bold text-black mb-0">
            Top crowdfunding tips
          </h2>
          <Link
            href="/tips"
            className="hidden lg:flex hand-drawn items-center rounded-lg border-4 border-black bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-400"
          >
            <span>View all</span>
          </Link>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tips.map((tip) => (
            <Link
              key={tip.id}
              href={tip.href}
              className="browser-window transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="browser-header">
                <div className="browser-controls">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
              </div>
              <div className={`relative aspect-square w-full overflow-hidden bg-gradient-to-br ${tip.color} p-8`}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="mb-4">{getIcon(tip.icon)}</div>
                  <h3 className="hand-drawn text-lg font-bold text-black">
                    {tip.title}
                  </h3>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="yellow-highlight hand-drawn text-xs font-bold px-2 py-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/tips"
            className="hand-drawn inline-flex items-center rounded-lg border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition hover:bg-yellow-400"
          >
            <span>View all tips</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
