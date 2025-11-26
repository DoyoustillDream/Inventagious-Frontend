import Link from 'next/link';

export default function CategoryHero() {
  return (
    <section className="bg-yellow-400 halftone-bg py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="hand-drawn mb-6 text-5xl md:text-6xl font-bold text-black">
            Browse Projects by Category
          </h1>
          <p className="mb-8 text-lg md:text-xl font-bold text-black max-w-3xl mx-auto leading-relaxed">
            Inventors and innovators around the world are building groundbreaking projects on Solana. 
            Discover innovation across Web3, hardware, software, and more.
          </p>
          <Link
            href="/projects/create"
            className="hand-drawn inline-block rounded-lg border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition hover:bg-gray-800 hover:scale-105 active:scale-95"
          >
            Start Your Project
          </Link>
        </div>
      </div>
    </section>
  );
}

