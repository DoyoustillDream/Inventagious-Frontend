export default function EngagementTips() {
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
          ENGAGEMENT
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Keep Backers Engaged
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          Active projects get more funding. Stay engaged throughout your campaign:
        </p>
        <div className="space-y-4">
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Regular Updates
            </h3>
            <p className="text-base font-semibold text-gray-800 mb-3">
              Post updates at least once a week. Share progress, milestones, challenges, and wins. 
              Transparency builds trust and keeps backers invested in your journey.
            </p>
            <div className="bg-yellow-50 border-2 border-black p-3">
              <p className="text-sm font-semibold text-gray-800">
                <strong>Update Ideas:</strong> Behind-the-scenes photos, development progress, 
                new features, team introductions, milestone celebrations, challenges overcome.
              </p>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Respond to Everyone
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Answer questions, respond to comments, and thank backers personally. Every interaction 
              is an opportunity to build relationships and show you care. Backers who feel heard 
              become advocates.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Create Urgency
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Use deadlines effectively. Remind backers about time limits, share progress toward goals, 
              and create limited-time offers or early-bird rewards. But be genuine—don't create false urgency.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Build Community
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Create a space for backers to connect—Discord, Telegram, or a dedicated forum. 
              Community members become your best marketers and often contribute more over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

