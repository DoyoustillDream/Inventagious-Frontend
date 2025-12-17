'use client';

import { useConnectionState } from '@/hooks/wallet/useConnectionState';

interface ConnectionStatusProps {
  showDetails?: boolean;
}

export default function ConnectionStatus({ showDetails = true }: ConnectionStatusProps) {
  const connectionState = useConnectionState();

  if (!connectionState.isConnected) {
    return null;
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatConnectionTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="browser-window bg-green-50 border-2 border-green-500 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <div className="flex-1">
          <p className="hand-drawn text-sm font-bold text-green-800">
            Wallet Connected
          </p>
          {showDetails && connectionState.walletAddress && (
            <div className="mt-1 space-y-1">
              <p className="hand-drawn text-xs font-bold text-green-700">
                {formatAddress(connectionState.walletAddress)}
              </p>
              {connectionState.connectionMethod && (
                <p className="hand-drawn text-xs font-bold text-green-600">
                  via {connectionState.connectionMethod}
                </p>
              )}
              {connectionState.connectedAt && (
                <p className="hand-drawn text-xs font-bold text-green-600">
                  {formatConnectionTime(connectionState.connectedAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

