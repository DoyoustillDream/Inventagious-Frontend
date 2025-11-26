import Link from 'next/link';
import { IconCheck, IconLightbulb } from '../icons';

export default function ReviewLaunchStep() {
  return (
    <div className="space-y-6">
      <div className="browser-window bg-yellow-50 border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Pre-Launch Checklist
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Before you hit "Create Project", review these items:
          </p>
          <div className="space-y-3">
            {[
              { category: 'Content', items: ['Title is clear and compelling', 'Description tells your story well', 'No spelling or grammar errors'] },
              { category: 'Funding', items: ['Funding goal is realistic', 'Deadline is set (if applicable)', 'Solana wallet address is correct (if provided)'] },
              { category: 'Media', items: ['Project image is high quality', 'Video URL works (if provided)', 'All links are accessible'] },
              { category: 'Settings', items: ['Project type is correct (Crowdfunding/Private)', 'Category is appropriate', 'Public/Private setting is correct'] },
            ].map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white border-4 border-black p-4">
                <h4 className="hand-drawn text-lg font-bold text-black mb-3">
                  {section.category}
                </h4>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <IconCheck className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-base font-semibold text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="browser-window bg-white border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            After Launch
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Once your project is live, here's what to do next:
          </p>
          <ul className="space-y-3 text-base font-semibold text-gray-800">
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">1</span>
              </span>
              <span><strong>Share Widely:</strong> Post on social media, email your network, and share in relevant communities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">2</span>
              </span>
              <span><strong>Engage with Backers:</strong> Respond to comments, answer questions, and keep supporters updated</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">3</span>
              </span>
              <span><strong>Update Regularly:</strong> Post updates about progress, milestones, and achievements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">4</span>
              </span>
              <span><strong>Stay Active:</strong> Projects with regular updates get more funding</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-100 border-4 border-black p-6">
        <h4 className="hand-drawn text-lg font-bold text-black mb-3 flex items-center gap-2">
          <IconLightbulb className="w-5 h-5" />
          Pro Tips for Success
        </h4>
        <ul className="space-y-2 text-base font-semibold text-gray-800">
          <li>• Launch on a Tuesday or Wednesday for best visibility</li>
          <li>• Have your first few backers ready to contribute immediately</li>
          <li>• Create a launch day social media campaign</li>
          <li>• Reach out to influencers or media in your space</li>
          <li>• Consider offering early-bird rewards or perks</li>
        </ul>
      </div>

      <div className="browser-window bg-yellow-50 border-2 border-black">
        <div className="p-6 text-center">
          <h3 className="hand-drawn text-2xl font-bold text-black mb-4">
            Ready to Launch?
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-6">
            You've reviewed everything. Now it's time to create your project and start fundraising!
          </p>
          <Link
            href="/projects/create"
            className="hand-drawn inline-block border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
          >
            Create Your Project Now
          </Link>
        </div>
      </div>
    </div>
  );
}

