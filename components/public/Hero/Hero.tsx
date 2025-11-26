import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-yellow-400 halftone-bg py-24">
      <div className="absolute top-4 right-4">
        <span className="star-decoration" />
      </div>
      <div className="absolute bottom-8 left-8">
        <span className="swirl-decoration" />
      </div>
      <div className="container mx-auto relative z-10 px-4">
        <div className="browser-window mx-auto max-w-4xl">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
          </div>
          <div className="text-center p-6 md:p-10 lg:p-12">
            <div className="mb-6 flex justify-center">
              <Image
                src="/logos/logo-animated.gif"
                alt="Inventagious Logo"
                width={120}
                height={120}
                className="object-contain"
                unoptimized
              />
            </div>
            <h1 className="hand-drawn mb-6 text-4xl md:text-5xl font-bold text-black leading-tight">
              Where Ideas & Innovation Meet
            </h1>
            <div className="mb-8 inline-block">
              <div className="yellow-highlight hand-drawn text-4xl md:text-5xl font-bold px-6 py-3">
                INVENTAGIOUS
              </div>
            </div>
            <p className="mb-8 text-base md:text-lg font-bold text-black max-w-2xl mx-auto leading-relaxed">
              A crowdfunding & private fundraising platform for Inventors & 
              Innovators in Web3 & Worldwide using the cryptocurrency Solana
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/projects"
                className="hand-drawn rounded-lg border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition hover:bg-gray-100"
              >
                Explore Projects
              </Link>
              <Link
                href="/projects/create"
                className="hand-drawn rounded-lg border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition hover:bg-gray-800"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
