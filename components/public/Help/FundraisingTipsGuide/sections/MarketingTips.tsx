export default function MarketingTips() {
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
          MARKETING
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Marketing Your Campaign
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          Get the word out and reach your target audience:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Social Media Strategy
            </h3>
            <ul className="space-y-2 text-sm font-semibold text-gray-800">
              <li>• Post daily updates and milestones</li>
              <li>• Use relevant hashtags</li>
              <li>• Share behind-the-scenes content</li>
              <li>• Engage with comments and messages</li>
              <li>• Cross-post on multiple platforms</li>
            </ul>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Email Marketing
            </h3>
            <ul className="space-y-2 text-sm font-semibold text-gray-800">
              <li>• Build an email list before launch</li>
              <li>• Send launch announcement</li>
              <li>• Weekly progress updates</li>
              <li>• Personal thank-you messages</li>
              <li>• Remind about deadlines</li>
            </ul>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Community Engagement
            </h3>
            <ul className="space-y-2 text-sm font-semibold text-gray-800">
              <li>• Join relevant Discord/Slack communities</li>
              <li>• Participate in Reddit discussions</li>
              <li>• Share in Web3 and Solana groups</li>
              <li>• Don't spam—add value first</li>
              <li>• Build genuine relationships</li>
            </ul>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Press & Media
            </h3>
            <ul className="space-y-2 text-sm font-semibold text-gray-800">
              <li>• Reach out to relevant blogs and news sites</li>
              <li>• Create a press kit with assets</li>
              <li>• Pitch to tech and crypto publications</li>
              <li>• Leverage your unique story</li>
              <li>• Follow up professionally</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

