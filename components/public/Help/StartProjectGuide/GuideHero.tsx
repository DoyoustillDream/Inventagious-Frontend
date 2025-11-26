export default function GuideHero() {
  return (
    <div className="max-w-5xl mx-auto text-center mb-12">
      <div className="browser-window bg-yellow-50">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <div className="yellow-highlight hand-drawn text-xs font-bold">
            PROJECT LAUNCH GUIDE
          </div>
          <div className="flex-1" />
        </div>
        <div className="p-8 md:p-12">
          <h1 className="hand-drawn mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-black">
            How to Start Your Project
          </h1>
          <div className="squiggly-underline inline-block mb-6" />
          <p className="hand-drawn text-lg md:text-xl font-bold text-gray-800 mb-4 max-w-3xl mx-auto">
            A complete step-by-step guide to launching your project on Inventagious
          </p>
          <p className="text-base font-semibold text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Whether you're building the next big Web3 innovation or creating a hardware prototype, 
            this guide will walk you through everything you need to know to successfully launch and fund your project.
          </p>
        </div>
      </div>
    </div>
  );
}

