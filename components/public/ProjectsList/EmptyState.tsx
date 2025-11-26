import Link from 'next/link';
import Image from 'next/image';
import Star from '@/components/shared/Decorations/Star';
import Swirl from '@/components/shared/Decorations/Swirl';

interface EmptyStateProps {
  selectedType: 'all' | 'crowdfunding' | 'private_funding';
}

export default function EmptyState({ selectedType }: EmptyStateProps) {
  const getMessage = () => {
    if (selectedType === 'all') {
      return {
        title: 'No Projects Yet',
        description: 'Be the first to launch an innovative project!',
        subtitle: 'Check back soon or start your own project',
      };
    } else if (selectedType === 'crowdfunding') {
      return {
        title: 'No Crowdfunding Projects',
        description: 'No public crowdfunding campaigns at the moment',
        subtitle: 'Be the first to launch a crowdfunding project!',
      };
    } else {
      return {
        title: 'No Private Funding Projects',
        description: 'No private funding opportunities available right now',
        subtitle: 'Start your private funding campaign today',
      };
    }
  };

  const message = getMessage();

  return (
    <div className="relative py-16">
      {/* Decorative elements */}
      <div className="absolute top-8 left-8 opacity-30">
        <Star size={40} />
      </div>
      <div className="absolute top-16 right-12 opacity-30">
        <Swirl size={50} />
      </div>
      <div className="absolute bottom-12 left-1/4 opacity-30">
        <Star size={30} />
      </div>
      <div className="absolute bottom-8 right-1/4 opacity-30">
        <Swirl size={40} />
      </div>

      {/* Main content */}
      <div className="relative z-10 browser-window mx-auto max-w-2xl">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <div className="yellow-highlight hand-drawn text-xs font-bold text-center px-4">
            EMPTY STATE
          </div>
          <div className="flex-1" />
        </div>
        
        <div className="p-8 md:p-12 text-center">
          {/* Logo/Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50" />
              <Image
                src="/logos/logo-bulb.png"
                alt="Inventagious Logo"
                width={120}
                height={120}
                className="relative z-10 object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="hand-drawn mb-4 text-3xl md:text-4xl font-bold text-black">
            {message.title}
          </h2>

          {/* Description */}
          <p className="mb-2 text-lg font-semibold text-gray-800">
            {message.description}
          </p>
          <p className="mb-8 text-sm font-medium text-gray-600">
            {message.subtitle}
          </p>

          {/* Decorative line */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-1 flex-1 bg-black max-w-16" />
            <div className="squiggly-underline inline-block" />
            <div className="h-1 flex-1 bg-black max-w-16" />
          </div>

          {/* Call to action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects/create"
              className="hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-8 py-3 text-base font-bold text-black transition-all duration-300 hover:bg-yellow-600 hover:scale-105 active:scale-95 shadow-lg"
            >
              Start Your Project
            </Link>
            {selectedType !== 'all' && (
              <Link
                href="/projects"
                className="hand-drawn rounded-lg border-4 border-black bg-white px-8 py-3 text-base font-bold text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95"
              >
                View All Projects
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

