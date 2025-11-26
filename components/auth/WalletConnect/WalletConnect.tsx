'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useWalletAuth } from '@/hooks/useWalletAuth';

export default function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const { publicKey, connected, connecting, connect, disconnect, availableWallets } = useWallet();
  const { handleDisconnect: handleWalletAuthDisconnect } = useWalletAuth();
  
  // Ensure component only renders after client-side mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show placeholder during SSR to prevent hydration mismatch
  // Using a simple invisible div to prevent layout shift
  if (!mounted) {
    return (
      <div 
        style={{ 
          display: 'inline-block',
          minWidth: '140px',
          height: '40px'
        }}
        aria-hidden="true"
      />
    );
  }

  const handleConnect = async () => {
    try {
      // Try to connect - will detect wallets if not already detected
      await connect();
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      // Show user-friendly error message
      const errorMessage = error?.message || 'Failed to connect wallet';
      if (errorMessage.includes('No wallet available') || availableWallets.length === 0) {
        alert('No wallet found. Please install a Solana wallet extension like Phantom or Solflare, then refresh the page.');
      } else {
        alert(`Failed to connect: ${errorMessage}`);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      await handleWalletAuthDisconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // If connected, show custom connected UI with disconnect button
  if (connected && publicKey) {
    const address = publicKey.toString();
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <div className="hand-drawn flex items-center gap-2 rounded-lg border-4 border-black bg-gradient-to-r from-white to-yellow-50 px-4 py-2.5 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="relative flex-shrink-0">
          <svg
            className="h-6 w-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base font-bold text-black whitespace-nowrap">{shortAddress}</span>
        </div>

        <div className="h-6 w-0.5 bg-black flex-shrink-0"></div>

        <button
          onClick={handleDisconnect}
          className="flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 py-1.5 text-xs font-bold text-black transition-all duration-200 hover:bg-red-100 hover:border-red-600 hover:scale-105 active:scale-95 flex-shrink-0"
          aria-label="Disconnect wallet"
          title="Disconnect wallet"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  // Connect button - always clickable, will show error if no wallet found
  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="hand-drawn rounded-lg border-4 border-black bg-gradient-to-r from-white to-yellow-50 px-4 py-2.5 text-base font-bold text-black shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative z-10"
      aria-label="Connect wallet"
      title="Connect wallet"
      type="button"
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
