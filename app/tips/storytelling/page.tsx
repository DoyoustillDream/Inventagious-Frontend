import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { WebPageSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Tips for Telling a Great Project Story | Inventagious',
  description:
    'Learn how to craft a compelling project story that connects with backers. Discover storytelling techniques that make your invention stand out and inspire support.',
  openGraph: {
    title: 'Tips for Telling a Great Project Story | Inventagious',
    description:
      'Learn how to craft a compelling project story that connects with backers and inspires support.',
    url: `${siteConfig.url}/tips/storytelling`,
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Storytelling Tips - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tips for Telling a Great Project Story | Inventagious',
    description: 'Learn how to craft a compelling project story that connects with backers.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

const tips = [
  {
    title: 'Start with the Problem',
    description:
      'Begin your story by clearly identifying the problem your invention solves. Make it relatable and show why this problem matters to your audience.',
  },
  {
    title: 'Show Your Journey',
    description:
      'Share your personal journey. How did you come up with this idea? What challenges did you face? People connect with authentic stories of passion and perseverance.',
  },
  {
    title: 'Paint a Picture',
    description:
      'Use vivid language to describe your vision. Help backers imagine the world with your invention. What will change? How will it improve lives?',
  },
  {
    title: 'Show, Don\'t Just Tell',
    description:
      'Use videos, images, and demonstrations to bring your story to life. A prototype video or demo is more powerful than paragraphs of text.',
  },
  {
    title: 'Make It Personal',
    description:
      'Share your background, expertise, and why you\'re the right person to bring this to life. Build trust by showing your commitment and capability.',
  },
  {
    title: 'Create Emotional Connection',
    description:
      'Appeal to emotions, not just logic. Show how your invention will make people feel better, safer, or more connected. Emotions drive action.',
  },
  {
    title: 'Be Clear and Concise',
    description:
      'While storytelling is important, be clear about what you\'re building. Avoid jargon and explain complex concepts simply. Your story should be easy to understand.',
  },
  {
    title: 'End with a Call to Action',
    description:
      'Finish your story with a clear call to action. Invite people to join your journey, become part of the solution, and help bring your vision to life.',
  },
];

const storyStructure = [
  {
    step: '1',
    title: 'Hook',
    description: 'Start with an attention-grabbing opening that makes people want to learn more.',
  },
  {
    step: '2',
    title: 'Problem',
    description: 'Clearly define the problem your invention solves and why it matters.',
  },
  {
    step: '3',
    title: 'Solution',
    description: 'Introduce your invention as the solution and explain how it works.',
  },
  {
    step: '4',
    title: 'Impact',
    description: 'Show the positive change your invention will create in the world.',
  },
  {
    step: '5',
    title: 'Call to Action',
    description: 'Invite backers to join your journey and help bring your vision to life.',
  },
];

export default function StorytellingTipsPage() {
  return (
    <>
      <WebPageSchema
        title="Tips for Telling a Great Project Story | Inventagious"
        description="Learn how to craft a compelling project story that connects with backers and inspires support."
        url={`${siteConfig.url}/tips/storytelling`}
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
                    STORYTELLING TIPS
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-8 md:p-12 text-center">
                  <h1 className="hand-drawn mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                    Tips for Telling a Great Project Story
                  </h1>
                  <div className="squiggly-underline inline-block mb-6" />
                  <p className="hand-drawn text-lg md:text-xl font-bold text-gray-800 mb-4 max-w-3xl mx-auto">
                    Learn how to craft a compelling narrative that connects with backers and inspires them to support your vision
                  </p>
                  <p className="text-base font-semibold text-gray-700 max-w-2xl mx-auto leading-relaxed">
                    Your story is what makes people care. Learn the techniques that turn visitors into backers.
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
                    STORYTELLING TECHNIQUES
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

              {/* Story Structure Guide */}
              <div className="browser-window bg-white mb-8">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                  <div className="flex-1" />
                  <div className="yellow-highlight hand-drawn text-xs font-bold">
                    STORY STRUCTURE
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-6">
                    The Perfect Story Structure
                  </h2>
                  <div className="space-y-4">
                    {storyStructure.map((item, index) => (
                      <div
                        key={index}
                        className={`border-4 border-black p-4 ${
                          index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="hand-drawn text-2xl font-bold text-black flex-shrink-0">
                            {item.step}
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
                      href="/tips/sharing"
                      className="block p-4 border-4 border-black bg-white hover:bg-yellow-50 transition-all"
                    >
                      <h3 className="hand-drawn font-bold text-black mb-1">
                        Tips for Sharing Your Project
                      </h3>
                      <p className="text-sm text-gray-700 font-semibold">
                        Effective promotion strategies
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
                    READY TO TELL YOUR STORY?
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="p-8 text-center">
                  <p className="hand-drawn text-xl font-bold text-black mb-6">
                    Start crafting your project story today!
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
