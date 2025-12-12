import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { WebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Tips for Sharing Your Project | Inventagious',
  description:
    'Learn effective strategies for sharing your Inventagious project. Discover how to reach your audience, leverage social media, and maximize your campaign visibility.',
  openGraph: {
    title: 'Tips for Sharing Your Project | Inventagious',
    description:
      'Learn effective strategies for sharing your Inventagious project and maximizing campaign visibility.',
    url: `${siteConfig.url}/tips/sharing`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Sharing Tips - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tips for Sharing Your Project | Inventagious',
    description: 'Learn effective strategies for sharing your Inventagious project.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

const tips = [
  {
    title: 'Start Before Launch',
    description:
      'Build anticipation by sharing your journey before launch. Tease your project, share behind-the-scenes content, and build an email list of interested supporters.',
  },
  {
    title: 'Leverage Social Media',
    description:
      'Use all relevant platforms - Twitter, Instagram, LinkedIn, Facebook. Each platform has a different audience. Tailor your message but maintain consistent branding.',
  },
  {
    title: 'Create Shareable Content',
    description:
      'Make it easy for others to share. Create eye-catching graphics, short videos, and clear calls-to-action. People share content that\'s visually appealing and easy to understand.',
  },
  {
    title: 'Engage Your Personal Network',
    description:
      'Your friends, family, and colleagues are your first supporters. Don\'t hesitate to ask them to share. Personal recommendations carry more weight than ads.',
  },
  {
    title: 'Use Email Marketing',
    description:
      'Build an email list and send regular updates. Email has high engagement rates. Share milestones, behind-the-scenes content, and remind people about your campaign.',
  },
  {
    title: 'Partner with Influencers',
    description:
      'Reach out to influencers in your niche. A mention from someone with a following can significantly boost your visibility. Offer them early access or exclusive content.',
  },
  {
    title: 'Engage with Communities',
    description:
      'Join relevant online communities, forums, and groups. Share your project where it\'s relevant, but focus on adding value, not just promoting. Build genuine relationships.',
  },
  {
    title: 'Track and Optimize',
    description:
      'Monitor which channels drive the most traffic and contributions. Double down on what works. Use analytics to understand your audience and refine your strategy.',
  },
];

const sharingChannels = [
  {
    name: 'Social Media',
    description: 'Twitter, Instagram, LinkedIn, Facebook, TikTok',
    tips: ['Post regularly', 'Use hashtags', 'Engage with comments', 'Share updates'],
  },
  {
    name: 'Email',
    description: 'Newsletter, personal emails, updates',
    tips: ['Build a list early', 'Send regular updates', 'Personalize messages', 'Include clear CTAs'],
  },
  {
    name: 'Communities',
    description: 'Forums, groups, Discord, Reddit',
    tips: ['Join relevant communities', 'Add value first', 'Follow community rules', 'Build relationships'],
  },
  {
    name: 'Press & Media',
    description: 'Blogs, news sites, podcasts',
    tips: ['Write a press release', 'Reach out to journalists', 'Offer exclusives', 'Be newsworthy'],
  },
];

const sharingSchedule = [
  {
    phase: 'Before',
    title: 'Pre-Launch',
    description: 'Build anticipation, gather email subscribers, create buzz',
  },
  {
    phase: 'During',
    title: 'Campaign Active',
    description: 'Share updates daily, respond to comments, celebrate milestones',
  },
  {
    phase: 'After',
    title: 'Post-Campaign',
    description: 'Thank supporters, share progress, build long-term community',
  },
];

export default function SharingTipsPage() {
  return (
    <>
      <WebPageSchema
        title="Tips for Sharing Your Project | Inventagious"
        description="Learn effective strategies for sharing your Inventagious project and maximizing campaign visibility."
        url={`${siteConfig.url}/tips/sharing`}
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
                    SHARING TIPS
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-8 md:p-12 text-center">
                  <h1 className="hand-drawn mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                    Tips for Sharing Your Project
                  </h1>
                  <div className="squiggly-underline inline-block mb-6" />
                  <p className="hand-drawn text-lg md:text-xl font-bold text-gray-800 mb-4 max-w-3xl mx-auto">
                    Learn how to effectively promote your campaign and reach the right audience to maximize your funding success
                  </p>
                  <p className="text-base font-semibold text-gray-700 max-w-2xl mx-auto leading-relaxed">
                    Visibility is key to success. Discover proven strategies for getting your project in front of the right people.
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
                    SHARING STRATEGIES
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

              {/* Sharing Channels Guide */}
              <div className="browser-window bg-white mb-8">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    SHARING CHANNELS
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-6">
                    Where to Share Your Project
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sharingChannels.map((channel, index) => (
                      <div
                        key={index}
                        className={`border-4 border-black p-4 ${
                          index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                        }`}
                      >
                        <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                          {channel.name}
                        </h3>
                        <p className="text-sm text-gray-700 font-semibold mb-3">
                          {channel.description}
                        </p>
                        <ul className="space-y-1">
                          {channel.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm font-semibold text-gray-800">
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sharing Schedule */}
              <div className="browser-window bg-white mb-8">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    SHARING SCHEDULE
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-6">
                    When to Share
                  </h2>
                  <div className="space-y-4">
                    {sharingSchedule.map((item, index) => (
                      <div
                        key={index}
                        className={`border-4 border-black p-4 ${
                          index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="hand-drawn text-xl font-bold text-black flex-shrink-0">
                            {item.phase}
                          </span>
                          <div className="flex-1">
                            <h3 className="hand-drawn text-lg font-bold text-black mb-1">
                              {item.title}
                            </h3>
                            <p className="text-base font-semibold text-gray-800">
                              {item.description}
                            </p>
                          </div>
                        </div>
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
                      href="/tips/fundraising"
                      className="block p-4 border-4 border-black bg-white hover:bg-yellow-50 transition-all"
                    >
                      <h3 className="hand-drawn font-bold text-black mb-1">
                        Top Tips for Your Inventagious Project
                      </h3>
                      <p className="text-sm text-gray-700 font-semibold">
                        Essential fundraising strategies
                      </p>
                    </Link>
                    <Link
                      href="/tips/storytelling"
                      className="block p-4 border-4 border-black bg-white hover:bg-yellow-50 transition-all"
                    >
                      <h3 className="hand-drawn font-bold text-black mb-1">
                        Tips for Telling a Great Project Story
                      </h3>
                      <p className="text-sm text-gray-700 font-semibold">
                        Craft compelling narratives
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
                    READY TO SHARE?
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-8 text-center">
                  <p className="hand-drawn text-xl font-bold text-black mb-6">
                    Create your project and start sharing it with the world!
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
