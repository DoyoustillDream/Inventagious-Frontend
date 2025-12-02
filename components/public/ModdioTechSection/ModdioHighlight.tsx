'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ModdioHighlight() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 },
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={contentRef}
      className="opacity-0 translate-y-8 transition-all duration-700"
    >
      <div className="bg-[#282c34] rounded-xl p-8 md:p-10 lg:p-12 border border-gray-700">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00a8ff]/20 to-[#ff6b6b]/20 rounded-full blur-2xl" />
              <div className="relative bg-[#1a1d24] p-4 rounded-2xl border border-gray-700/50">
                <Image
                  src="https://www.modd.io/_next/static/media/logo.08e05f95.svg"
                  alt="Moddio Logo"
                  width={300}
                  height={74}
                  className="h-auto w-auto max-w-[300px]"
                  unoptimized
                />
              </div>
            </div>
          </div>
          <h3 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Web 3 Native <span className="bg-gradient-to-r from-[#00a8ff] to-[#ff6b6b] bg-clip-text text-transparent">Game Engine</span>
          </h3>
          <div className="w-32 h-1 bg-gradient-to-r from-[#00a8ff] via-[#ff6b6b] to-[#00a8ff] mx-auto mb-6 rounded-full" />
        </div>
        <div className="space-y-6">
          <p className="text-lg font-medium text-gray-300 leading-relaxed">
            <span className="text-[#00a8ff] font-bold">Moddio</span> is an open-source, 
            no-code game engine that empowers creators to build and deploy multiplayer games 
            without writing a single line of code. With over{' '}
            <span className="text-[#ff6b6b] font-bold">200,000 users</span> and{' '}
            <span className="text-[#ff6b6b] font-bold">4,000+ game creators</span> monthly, 
            Moddio is revolutionizing game development.
          </p>
          
          <div className="relative bg-gradient-to-br from-[#1a1d24] to-[#0f1115] rounded-xl p-8 border border-gray-700/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00a8ff]/10 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-[#00a8ff] to-[#ff6b6b] rounded-full" />
                What features are included?
              </h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#00a8ff] text-xs font-bold">✓</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300">Optimized netcode using lag compensation algorithms and data compression easily supporting 100+ moving entities in a single server instance.</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#00a8ff] text-xs font-bold">✓</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300">Integrated 2D physics engine (Box2D & more)</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#00a8ff] text-xs font-bold">✓</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300">Free game server hosting with automatic scaling</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#00a8ff] text-xs font-bold">✓</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300">Item system supporting melee & range weapons, consumable items, and wearable items</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#00a8ff] text-xs font-bold">✓</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300">Fully customizable unit attribute system for displaying health, energy, etc.</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#00a8ff] text-xs font-bold">✓</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300">Dialogues designed for story-driven games (e.g. visual novels)</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#00a8ff] text-xs font-bold">✓</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300">Item Shop system</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#00a8ff] text-xs font-bold">✓</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300">AI with built-in behaviours (idle, provoked, and enemy detection) and pathfinding</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#00a8ff]/20 to-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#00a8ff] text-xs font-bold">✓</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300">Mobile compatibility and control customization</span>
                </li>
                <li className="flex items-start group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#ff6b6b]/20 to-[#ff6b6b]/10 border border-[#ff6b6b]/30 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#ff6b6b] text-xs font-bold">+</span>
                  </div>
                  <span className="group-hover:text-gray-200 transition-colors duration-300 font-semibold">and many more!</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="group relative bg-gradient-to-br from-[#1a1d24] to-[#0f1115] rounded-xl p-6 border border-gray-700/50 hover:border-[#00a8ff]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00a8ff]/20 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00a8ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#00a8ff] transition-colors duration-300">
                  No-Code Development
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Intuitive drag-and-drop editor that makes game creation accessible to everyone, 
                  regardless of programming experience.
                </p>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-[#1a1d24] to-[#0f1115] rounded-xl p-6 border border-gray-700/50 hover:border-[#00a8ff]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#00a8ff]/20 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00a8ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#00a8ff] transition-colors duration-300">
                  Built-In Netcode
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Integrated networking code and free server hosting, so you can focus on 
                  game design instead of infrastructure.
                </p>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-[#1a1d24] to-[#0f1115] rounded-xl p-6 border border-gray-700/50 hover:border-[#ff6b6b]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#ff6b6b]/20 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#ff6b6b] transition-colors duration-300">
                  Cross-Platform
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Games run seamlessly across web browsers, iOS, Android, PC, and gaming consoles 
                  for maximum reach.
                </p>
              </div>
            </div>
            <div className="group relative bg-gradient-to-br from-[#1a1d24] to-[#0f1115] rounded-xl p-6 border border-gray-700/50 hover:border-[#ff6b6b]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#ff6b6b]/20 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#ff6b6b] transition-colors duration-300">
                  Open Source
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  Community-driven platform that encourages contributions and continuous 
                  innovation from developers worldwide.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-[#1a1d24] rounded-lg p-6 border border-gray-700">
            <h4 className="text-xl font-bold text-white mb-4">How to get started</h4>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We recommend beginners to start from{' '}
              <Link
                href="https://docs.modd.io/?id=how-to-get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6b6b] hover:text-[#ff5252] font-bold underline"
              >
                making your first game guide
              </Link>
              . You can also view our{' '}
              <Link
                href="https://www.modd.io/showcase"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6b6b] hover:text-[#ff5252] font-bold underline"
              >
                premade game templates
              </Link>
              .
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Also, check out these places to learn more and get involved with the community:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-[#00a8ff] mr-3 mt-1">•</span>
                <span>
                  <strong className="text-white">Learning Resources:</strong> Our dedicated learning center filled with insightful tutorials, guides, and articles. Whether you're a beginner looking for a step-by-step tutorial or an experienced developer seeking advanced tips, Learning Resources will get you what you need to know.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00a8ff] mr-3 mt-1">•</span>
                <span>
                  <strong className="text-white">Creators Lounge on Discord:</strong> Join our thriving community on{' '}
                  <Link
                    href="https://discord.gg/moddio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff6b6b] hover:text-[#ff5252] font-bold underline"
                  >
                    Discord
                  </Link>
                  . You can connect with other creators, collaborate on projects, seek advice, or simply engage in game development discussions.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00a8ff] mr-3 mt-1">•</span>
                <span>
                  <strong className="text-white">Moddio Forum:</strong> You can discuss ideas, ask questions, share your work, and provide feedback to fellow developers. Whether you're troubleshooting a problem or seeking inspiration for your next project, the forums are a helpful and supportive space.
                </span>
              </li>
            </ul>
            <p className="text-gray-300 mt-4 leading-relaxed">
              In addition to these resources, Moddio provides monetization through{' '}
              <Link
                href="https://docs.modd.io/?id=monetization"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6b6b] hover:text-[#ff5252] font-bold underline"
              >
                Modd Coins
              </Link>
              .
            </p>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="https://docs.modd.io"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center bg-gradient-to-r from-[#00a8ff] to-[#0099e6] hover:from-[#0099e6] hover:to-[#00a8ff] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#00a8ff]/30 hover:scale-105 gap-2"
            >
              <span>View Moddio Documentation</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

