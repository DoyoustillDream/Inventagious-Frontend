'use client';

import { useWalletDetection } from '@/hooks/wallet/useWalletDetection';
import LoadingIndicator from '../status/LoadingIndicator';
import { ONBOARDING_STEPS } from '@/lib/wallet/onboarding-config';

export default function WalletDetector() {
  const detection = useWalletDetection();

  if (detection.isDetecting) {
    return (
      <LoadingIndicator
        step={ONBOARDING_STEPS.DETECTION}
        message="Checking for available wallets..."
      />
    );
  }

  if (!detection.isAvailable) {
    return (
      <div className="browser-window bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-2xl">💡</div>
          <div className="flex-1">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              No Wallet Detected
            </h3>
            <p className="hand-drawn text-sm font-bold text-gray-700 mb-4">
              To get started, you'll need a Solana wallet. We recommend Phantom.
            </p>
            {detection.installUrl && (
              <a
                href={detection.installUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hand-drawn inline-block rounded-lg border-2 border-yellow-600 bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-500 transition"
              >
                Install Phantom
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="browser-window bg-green-50 border-2 border-green-500 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-2xl">✓</div>
        <div className="flex-1">
          <h3 className="hand-drawn text-lg font-bold text-black mb-2">
            Wallet Detected
          </h3>
          <p className="hand-drawn text-sm font-bold text-gray-700">
            {detection.walletType === 'phantom-extension' && 'Phantom extension detected. Ready to connect!'}
            {detection.walletType === 'phantom-mobile' && 'Phantom mobile app detected. Ready to connect!'}
            {detection.walletType === 'phantom-oauth' && 'Phantom wallet detected. Ready to connect!'}
          </p>
        </div>
      </div>
    </div>
  );
}

