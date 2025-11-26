import { IconChart, IconTarget, IconGlobe, IconLock } from '../icons';

export default function FundingInfoStep() {
  return (
    <div className="space-y-6">
      <div className="browser-window bg-yellow-50 border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Funding Goal <span className="text-red-600">*</span>
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Set a realistic funding goal that covers your needs:
          </p>
          <ul className="space-y-3 text-base font-semibold text-gray-800">
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold text-xl">$</span>
              <div>
                <strong>Calculate Your Costs:</strong>
                <ul className="mt-2 ml-4 space-y-1 text-sm">
                  <li>• Development and production costs</li>
                  <li>• Marketing and promotion</li>
                  <li>• Platform fees (typically 5-10%)</li>
                  <li>• Payment processing fees</li>
                  <li>• Contingency buffer (10-20%)</li>
                </ul>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconChart className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>Research Similar Projects:</strong> See what successful projects in your category raised</span>
            </li>
            <li className="flex items-start gap-3">
              <IconTarget className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>Be Realistic:</strong> Set a goal you can actually reach. It's better to exceed a lower goal than miss a high one</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="browser-window bg-white border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Deadline (Optional)
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Setting a deadline creates urgency and helps you plan:
          </p>
          <ul className="space-y-2 text-base font-semibold text-gray-800">
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">1</span>
              </span>
              <span><strong>30-60 days:</strong> Best for most projects. Gives enough time to build momentum</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">2</span>
              </span>
              <span><strong>90+ days:</strong> For larger projects that need more time to reach their goal</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">3</span>
              </span>
              <span><strong>No deadline:</strong> Keep your project open indefinitely (for ongoing projects)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="browser-window bg-yellow-50 border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Solana Wallet Address (Optional)
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            If you want to receive funds directly to your Solana wallet, add your wallet address here.
          </p>
          <div className="bg-white border-4 border-black p-4 mb-4">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              <strong>Important:</strong>
            </p>
            <ul className="space-y-1 text-sm font-semibold text-gray-800 ml-4">
              <li>• Double-check your wallet address - transactions are irreversible</li>
              <li>• Make sure you control the wallet and have access to it</li>
              <li>• You can update this later if needed</li>
            </ul>
          </div>
          <p className="text-sm font-semibold text-gray-700">
            If you don't provide a wallet address, funds will be held by the platform until you set one up.
          </p>
        </div>
      </div>

      <div className="browser-window bg-white border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Public vs Private
          </h3>
          <div className="space-y-4">
            <div className="border-4 border-black bg-yellow-100 p-4">
              <h4 className="hand-drawn text-lg font-bold text-black mb-2 flex items-center gap-2">
                <IconGlobe className="w-5 h-5" />
                Public Project
              </h4>
              <p className="text-base font-semibold text-gray-800">
                Your project will be visible to everyone on the platform. 
                It can appear in search results, category pages, and featured sections. 
                Best for most projects!
              </p>
            </div>
            <div className="border-4 border-black bg-gray-100 p-4">
              <h4 className="hand-drawn text-lg font-bold text-black mb-2 flex items-center gap-2">
                <IconLock className="w-5 h-5" />
                Private Project
              </h4>
              <p className="text-base font-semibold text-gray-800">
                Only people with the direct link can see your project. 
                Use this for exclusive deals or projects you want to share with specific investors only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

