export default function LaunchTips() {
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
          LAUNCH STRATEGY
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Launch Day Strategy
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          The first 48 hours are critical. Make them count:
        </p>
        <div className="space-y-4">
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-lg font-bold text-black">1</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Launch on Tuesday or Wednesday
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  These days typically see the most engagement. Avoid weekends and Mondays when people 
                  are catching up on work.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-lg font-bold text-black">2</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Have Early Backers Ready
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  Line up friends, family, and early supporters to contribute immediately. Projects 
                  that reach 20% of their goal in the first 48 hours are much more likely to succeed.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-lg font-bold text-black">3</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Create Launch Day Buzz
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  Post on all your social media channels, send emails to your network, and reach out 
                  to relevant communities. Create a sense of excitement and urgency.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-lg font-bold text-black">4</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Be Available and Responsive
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  Answer questions quickly, engage with comments, and thank early backers personally. 
                  Your responsiveness shows you're serious and builds trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

