export default function PreparationTips() {
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
          PREPARATION
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Before You Launch
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          Success starts before your campaign goes live. Prepare thoroughly:
        </p>
        <div className="space-y-4">
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Build Your Network First
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Start building your audience weeks or months before launch. Create social media accounts, 
              join relevant communities, and engage with potential backers. Having supporters ready 
              on day one creates momentum.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Set a Realistic Goal
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Research similar projects and set a goal you can actually reach. It's better to exceed 
              a lower goal than miss a high one. Consider all costs: production, marketing, fees, and 
              a contingency buffer.
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Create Quality Content
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Invest in professional photos, a compelling video, and clear descriptions. Projects with 
              quality visuals get 3x more funding. Your content is your first impression—make it count.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Prepare Your Story
            </h3>
            <p className="text-base font-semibold text-gray-800">
              People back projects they connect with emotionally. Tell your story: why you're building 
              this, what problem you're solving, and why you're the right person to do it. Authenticity 
              builds trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

