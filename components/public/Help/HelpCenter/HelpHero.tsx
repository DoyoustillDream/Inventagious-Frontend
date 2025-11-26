export default function HelpHero() {
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
            HELP CENTER
          </div>
          <div className="flex-1" />
        </div>
        <div className="p-8 md:p-12">
          <h1 className="hand-drawn mb-6 text-4xl md:text-5xl lg:text-6xl font-bold text-black">
            Get Support & Answers
          </h1>
          <div className="squiggly-underline inline-block mb-6" />
          <p className="hand-drawn text-lg md:text-xl font-bold text-gray-800 mb-4 max-w-3xl mx-auto">
            Find answers to common questions, learn how to use Inventagious, and get the support you need.
          </p>
        </div>
      </div>
    </div>
  );
}

