import Link from 'next/link';

export default function GettingStarted() {
  return (
    <div className="browser-window bg-yellow-50">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold">
          GET STARTED
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Ready to Get Started?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border-4 border-black p-6">
            <h3 className="hand-drawn text-xl font-bold text-black mb-3">
              For Inventors
            </h3>
            <p className="text-base font-semibold text-gray-800 mb-4">
              Create a private project and start connecting with investors:
            </p>
            <ol className="space-y-2 text-sm font-semibold text-gray-800 mb-4">
              <li className="flex items-start gap-2">
                <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                  <span className="text-xs font-bold text-center leading-none">1</span>
                </span>
                <span>Create your project and set it to private</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                  <span className="text-xs font-bold text-center leading-none">2</span>
                </span>
                <span>Share your project link with potential investors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                  <span className="text-xs font-bold text-center leading-none">3</span>
                </span>
                <span>Review and accept deal proposals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                  <span className="text-xs font-bold text-center leading-none">4</span>
                </span>
                <span>Complete milestones to receive funding</span>
              </li>
            </ol>
            <Link
              href="/projects/create"
              className="hand-drawn block w-full border-4 border-black bg-black px-6 py-3 text-base font-bold text-white text-center transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
            >
              Create Private Project
            </Link>
          </div>
          <div className="bg-white border-4 border-black p-6">
            <h3 className="hand-drawn text-xl font-bold text-black mb-3">
              For Investors
            </h3>
            <p className="text-base font-semibold text-gray-800 mb-4">
              Discover and invest in exclusive opportunities:
            </p>
            <ol className="space-y-2 text-sm font-semibold text-gray-800 mb-4">
              <li className="flex items-start gap-2">
                <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                  <span className="text-xs font-bold text-center leading-none">1</span>
                </span>
                <span>Browse private projects or get invited</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                  <span className="text-xs font-bold text-center leading-none">2</span>
                </span>
                <span>Review project details and connect with inventors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                  <span className="text-xs font-bold text-center leading-none">3</span>
                </span>
                <span>Create a deal proposal with your terms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                  <span className="text-xs font-bold text-center leading-none">4</span>
                </span>
                <span>Funds escrowed when deal is accepted</span>
              </li>
            </ol>
            <Link
              href="/projects"
              className="hand-drawn block w-full border-4 border-black bg-black px-6 py-3 text-base font-bold text-white text-center transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
            >
              Browse Projects
            </Link>
          </div>
        </div>
        <div className="bg-white border-4 border-black p-6">
          <h3 className="hand-drawn text-lg font-bold text-black mb-3">
            Security & Transparency
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-3">
            All private funding deals are secured by Solana smart contracts:
          </p>
          <ul className="space-y-2 text-sm font-semibold text-gray-800">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>Funds held in secure escrow until milestones are met</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>Automatic milestone-based releases</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>All transactions recorded on blockchain</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>No intermediaries, no delays, no disputes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">•</span>
              <span>Platform fees automatically collected (1.9%)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

