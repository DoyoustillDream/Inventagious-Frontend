'use client';

import { useWalletDetection } from '@/hooks/wallet/useWalletDetection';

interface WalletRecommendationProps {
  onSelectMethod?: (method: 'google' | 'apple' | 'injected') => void;
}

export default function WalletRecommendation({ onSelectMethod }: WalletRecommendationProps) {
  const detection = useWalletDetection();

  if (!detection.isAvailable) {
    return null;
  }

  const recommendations = [];

  if (detection.walletType === 'phantom-extension') {
    recommendations.push({
      method: 'injected' as const,
      label: 'Browser Extension',
      description: 'Connect using your installed Phantom extension',
      icon: '🔌',
      recommended: true,
    });
  }

  recommendations.push(
    {
      method: 'google' as const,
      label: 'Google Account',
      description: 'Sign in with your Google account',
      icon: '🔵',
      recommended: false,
    },
    {
      method: 'apple' as const,
      label: 'Apple ID',
      description: 'Sign in with your Apple ID',
      icon: '🍎',
      recommended: false,
    }
  );

  return (
    <div className="space-y-3">
      <p className="hand-drawn text-sm font-bold text-gray-700 mb-4">
        Choose how you'd like to connect:
      </p>
      {recommendations.map((rec) => (
        <button
          key={rec.method}
          onClick={() => onSelectMethod?.(rec.method)}
          className={`w-full browser-window p-4 text-left transition-all ${
            rec.recommended
              ? 'bg-yellow-50 border-2 border-yellow-500 hover:bg-yellow-100'
              : 'bg-white border-2 border-black hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl">{rec.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="hand-drawn text-base font-bold text-black">
                  {rec.label}
                </h4>
                {rec.recommended && (
                  <span className="hand-drawn text-xs font-bold text-yellow-600 bg-yellow-200 px-2 py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>
              <p className="hand-drawn text-xs font-bold text-gray-600 mt-1">
                {rec.description}
              </p>
            </div>
            <div className="text-gray-400">→</div>
          </div>
        </button>
      ))}
    </div>
  );
}

