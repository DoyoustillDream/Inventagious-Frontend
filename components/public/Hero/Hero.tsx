import Link from 'next/link';
import ProjectCarousel from '@/components/public/ProjectCarousel';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-yellow-400 halftone-bg py-16 md:py-24">
      <div className="absolute top-4 right-4">
        <span className="star-decoration" />
      </div>
      <div className="absolute bottom-8 left-8">
        <span className="swirl-decoration" />
      </div>
      <div className="container mx-auto relative z-10 px-4">
        {/* Hero Content Section */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="hand-drawn mb-2 text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight">
            Where Ideas & Innovation Meet
          </h1>
          <div className="mb-3 inline-block">
            <div className="yellow-highlight hand-drawn text-xl md:text-2xl lg:text-3xl font-bold px-4 py-2">
              INVENTAGIOUS
            </div>
          </div>
          <p className="mb-4 text-sm md:text-base font-bold text-black leading-relaxed">
            Crowdfunding & private fundraising for Inventors & Innovators
          </p>
        </div>

        {/* Featured Projects Carousel Section */}
        <div className="max-w-7xl mx-auto">
          <ProjectCarousel maxProjects={10} />
        </div>
      </div>
    </section>
  );
}
