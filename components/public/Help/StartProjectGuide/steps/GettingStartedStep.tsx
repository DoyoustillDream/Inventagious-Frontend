import Link from 'next/link';
import { IconLightbulb } from '../icons';

export default function GettingStartedStep() {
  return (
    <div className="space-y-6">
      <div className="browser-window bg-yellow-50 border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Connect Your Wallet
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Inventagious uses Phantom Connect SDK for secure wallet authentication. You can connect using multiple methods - no browser extension required!
          </p>
          <ul className="space-y-3 text-base font-semibold text-gray-800 mb-4">
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold text-xl">1</span>
              <span><strong>Click "Connect Wallet":</strong> Use the button in the header to open connection options</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold text-xl">2</span>
              <span><strong>Choose Your Method:</strong> Sign in with Google/Apple (easiest), use Phantom extension, or connect via mobile app</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold text-xl">3</span>
              <span><strong>Sign the Message:</strong> Approve the signature request to authenticate with Inventagious</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-600 font-bold text-xl">4</span>
              <span><strong>You're Ready!</strong> Your account is automatically created when you connect your wallet</span>
            </li>
          </ul>
          <div className="bg-blue-50 border-2 border-blue-300 p-3 mb-4 rounded">
            <p className="text-sm font-semibold text-gray-800">
              <strong>💡 New to crypto?</strong> Use Google or Apple sign-in - a secure wallet is created automatically for you! No extension needed.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4 mt-4">
            <p className="text-sm font-semibold text-gray-800 flex items-start gap-2">
              <IconLightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span><strong>Tip:</strong> Your wallet address becomes your account identifier. Make sure you have access to your wallet and keep your seed phrase safe!</span>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link 
              href="/help/connect-wallet" 
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
            >
              Need more help? See our detailed wallet connection guide →
            </Link>
          </div>
        </div>
      </div>

      <div className="browser-window bg-white border-2 border-black">
        <div className="p-6">
          <h3 className="hand-drawn text-xl font-bold text-black mb-4">
            Prepare Your Materials
          </h3>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Before you start creating your project, gather these materials:
          </p>
          <ul className="space-y-3 text-base font-semibold text-gray-800">
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">1</span>
              </span>
              <span><strong>Project Title:</strong> A clear, compelling name for your project</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">2</span>
              </span>
              <span><strong>Description:</strong> Detailed explanation of what you're building</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">3</span>
              </span>
              <span><strong>Images:</strong> High-quality photos or graphics (optional but recommended)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">4</span>
              </span>
              <span><strong>Video:</strong> A video showcasing your project (optional but highly effective)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 border-2 border-black bg-yellow-400 rounded-full items-center justify-center flex-shrink-0 mt-0.5 leading-none">
                <span className="text-xs font-bold text-center leading-none">5</span>
              </span>
              <span><strong>Solana Wallet:</strong> Your wallet address for receiving funds (optional)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-100 border-4 border-black p-6">
        <p className="hand-drawn text-base font-bold text-black flex items-start gap-2">
          <IconLightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <span><strong>Tip:</strong> Projects with images and videos receive 3x more funding on average. 
          Take time to prepare quality visuals!</span>
        </p>
      </div>
    </div>
  );
}

