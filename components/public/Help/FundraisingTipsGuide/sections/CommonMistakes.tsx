
export default function CommonMistakes() {
  return (
    <div className="browser-window bg-white">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold">
          AVOID THESE
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Common Mistakes to Avoid
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          Learn from others' mistakes. Avoid these pitfalls:
        </p>
        <div className="space-y-4">
          <div className="border-4 border-red-300 bg-red-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Setting Goals Too High
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Unrealistic goals scare away backers and make failure more likely. Research similar 
              projects and set achievable targets.
            </p>
          </div>
          <div className="border-4 border-red-300 bg-red-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Poor Quality Content
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Blurry photos, bad videos, and unclear descriptions kill campaigns. Invest in quality 
              visuals and clear communication.
            </p>
          </div>
          <div className="border-4 border-red-300 bg-red-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Not Building an Audience First
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Launching without a network means no one knows about your project. Build your audience 
              before you launch.
            </p>
          </div>
          <div className="border-4 border-red-300 bg-red-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Going Silent After Launch
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Projects that don't update regularly lose momentum. Stay active, respond to questions, 
              and keep backers engaged.
            </p>
          </div>
          <div className="border-4 border-red-300 bg-red-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Ignoring Feedback
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Backers provide valuable insights. Listen to their feedback, answer questions, and 
              show you value their input.
            </p>
          </div>
          <div className="border-4 border-red-300 bg-red-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Spamming Communities
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Don't just drop your link and leave. Build relationships first, add value to communities, 
              and share your project naturally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

