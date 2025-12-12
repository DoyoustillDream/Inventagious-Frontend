import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { WebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Top Fundraising Tips for Your Inventagious Project | Inventagious',
  description:
    'Discover proven fundraising tips and strategies to make your Inventagious project successful. Learn how to set goals, engage backers, and reach your funding target.',
  openGraph: {
    title: 'Top Fundraising Tips for Your Inventagious Project | Inventagious',
    description:
      'Discover proven fundraising tips and strategies to make your Inventagious project successful.',
    url: `${siteConfig.url}/tips/fundraising`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Fundraising Tips - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Fundraising Tips for Your Inventagious Project | Inventagious',
    description: 'Discover proven fundraising tips and strategies to make your Inventagious project successful.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

const tips = [
  {
    title: 'Set a Realistic Funding Goal',
    description:
      'Research similar projects and calculate your actual costs. Set a goal that covers your needs but is achievable. Remember, you can always exceed your goal!',
  },
  {
    title: 'Create a Compelling Story',
    description:
      'Your project story is crucial. Explain why your invention matters, what problem it solves, and why people should care. Be authentic and passionate.',
  },
  {
    title: 'Use High-Quality Media',
    description:
      'Invest in professional photos and videos. Visual content is the first thing potential backers see. Show your product in action and make it look amazing.',
  },
  {
    title: 'Engage Early and Often',
    description:
      'Start building your audience before launch. Share updates regularly, respond to comments, and keep your backers informed throughout the campaign.',
  },
  {
    title: 'Leverage Your Network',
    description:
      'Your friends, family, and colleagues are your first supporters. Don\'t be shy about asking them to share your project. Word-of-mouth is powerful.',
  },
  {
    title: 'Offer Great Rewards',
    description:
      'Create meaningful rewards that provide value. Early bird pricing, exclusive access, or special editions can motivate people to contribute.',
  },
  {
    title: 'Be Transparent',
    description:
      'Share your progress, challenges, and milestones. Transparency builds trust. Backers want to know how their money is being used.',
  },
  {
    title: 'Plan Your Launch',
    description:
      'Choose the right time to launch. Avoid major holidays or competing events. Give yourself enough time to build momentum before your deadline.',
  },
];

export default function FundraisingTipsPage() {
  return (
    <>
      <WebPageSchema
        title="Top Fundraising Tips for Your Inventagious Project | Inventagious"
        description="Discover proven fundraising tips and strategies to make your Inventagious project successful."
        url={`${siteConfig.url}/tips/fundraising`}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main-content" className="flex-1 halftone-gray py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="browser-window bg-yellow-50">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    FUNDRAISING TIPS
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-8 md:p-12 text-center">
                  <h1 className="hand-drawn mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                    Top Tips for Your Inventagious Project
                  </h1>
                  <div className="squiggly-underline inline-block mb-6" />
                  <p className="hand-drawn text-lg md:text-xl font-bold text-gray-800 mb-4 max-w-3xl mx-auto">
                    Proven strategies to help you reach your funding goal and bring your innovation to life
                  </p>
                  <p className="text-base font-semibold text-gray-700 max-w-2xl mx-auto leading-relaxed">
                    Learn from successful campaigns and apply these proven strategies to maximize your fundraising success.
                  </p>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="max-w-6xl mx-auto">
              <div className="browser-window bg-white mb-8">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    ESSENTIAL TIPS
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="space-y-4">
                    {tips.map((tip, index) => (
                      <div
                        key={index}
                        className={`border-4 border-black p-4 ${
                          index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                        }`}
                      >
                        <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-base font-semibold text-gray-800">
                          {tip.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="browser-window bg-white mb-8">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    MORE RESOURCES
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="hand-drawn text-2xl font-bold text-black mb-6">
                    Explore More Tips
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/tips/storytelling"
                      className="block p-4 border-4 border-black bg-white hover:bg-yellow-50 transition-all"
                    >
                      <h3 className="hand-drawn font-bold text-black mb-1">
                        Tips for Telling a Great Project Story
                      </h3>
                      <p className="text-sm text-gray-700 font-semibold">
                        Learn how to craft a compelling narrative
                      </p>
                    </Link>
                    <Link
                      href="/tips/sharing"
                      className="block p-4 border-4 border-black bg-white hover:bg-yellow-50 transition-all"
                    >
                      <h3 className="hand-drawn font-bold text-black mb-1">
                        Tips for Sharing Your Project
                      </h3>
                      <p className="text-sm text-gray-700 font-semibold">
                        Effective strategies for promoting your campaign
                      </p>
                    </Link>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="browser-window bg-yellow-50">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    READY TO START?
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-8 text-center">
                  <p className="hand-drawn text-xl font-bold text-black mb-6">
                    Apply these tips and launch your project today!
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
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

