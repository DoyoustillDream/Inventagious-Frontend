import { IconArrowRight, IconTarget, IconLock } from '../icons';

export default function BasicInfoStep() {
  return (
    <div className="space-y-6">
      <div className="browser-window bg-yellow-50 border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Project Title <span className="text-red-600">*</span>
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Your project title is the first thing people see. Make it:
          </p>
          <ul className="space-y-2 text-base font-semibold text-gray-800">
            <li className="flex items-start gap-3">
              <IconArrowRight className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>Clear:</strong> People should understand what you're building</span>
            </li>
            <li className="flex items-start gap-3">
              <IconArrowRight className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>Compelling:</strong> Make it interesting and memorable</span>
            </li>
            <li className="flex items-start gap-3">
              <IconArrowRight className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>Concise:</strong> Keep it under 60 characters for best results</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="browser-window bg-white border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Description
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Tell your story! Your description should include:
          </p>
          <ul className="space-y-2 text-base font-semibold text-gray-800">
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">1</span>
              </span>
              <span><strong>What:</strong> What problem are you solving?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">2</span>
              </span>
              <span><strong>Why:</strong> Why is your solution unique or better?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">3</span>
              </span>
              <span><strong>How:</strong> How will you use the funds?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">4</span>
              </span>
              <span><strong>Impact:</strong> What impact will this have?</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="browser-window bg-yellow-50 border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Project Type <span className="text-red-600">*</span>
          </h3>
          <div className="space-y-4">
            <div className="border-4 border-black bg-white p-4">
              <h4 className="hand-drawn text-lg font-bold text-black mb-2 flex items-center gap-2">
                <IconTarget className="w-5 h-5" />
                Crowdfunding
              </h4>
              <p className="text-base font-semibold text-gray-800">
                Open to everyone! Backers can contribute any amount publicly. 
                Perfect for products, services, or community-driven projects.
              </p>
            </div>
            <div className="border-4 border-black bg-white p-4">
              <h4 className="hand-drawn text-lg font-bold text-black mb-2 flex items-center gap-2">
                <IconLock className="w-5 h-5" />
                Private Funding
              </h4>
              <p className="text-base font-semibold text-gray-800">
                For accredited investors and private deals. More control over who can invest 
                and at what amounts. Ideal for larger projects or equity-based funding.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="browser-window bg-white border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Category
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Choose a category that best fits your project. This helps backers discover your project. 
            Available categories include:
          </p>
          <div className="flex flex-wrap gap-2">
            {['Web3', 'Solana', 'Hardware', 'Software', 'Blockchain', 'Innovation', 'DeFi', 'NFT', 'Gaming', 'AI/ML', 'IoT', 'Energy'].map((cat) => (
              <span
                key={cat}
                className="inline-block border-2 border-black bg-yellow-400 px-4 py-2 hand-drawn text-sm font-bold text-black"
              >
                {cat}
              </span>
            ))}
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-4">
            And more! You'll see all available categories when creating your project.
          </p>
        </div>
      </div>
    </div>
  );
}

