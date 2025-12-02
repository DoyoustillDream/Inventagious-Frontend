'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useToast } from '@/components/shared/Toast';
import UserMenu from './UserMenu';

export default function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const { publicKey, connected, connecting, connect, disconnect, availableWallets } = useWallet();
  const { handleDisconnect: handleWalletAuthDisconnect } = useWalletAuth();
  const { showError, showWarning } = useToast();
  
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
        showWarning('No wallet found. Please install a Solana wallet extension like Phantom or Solflare, then refresh the page.');
      } else {
        showError(`Failed to connect: ${errorMessage}`);
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

  // If connected, show user menu with profile link
  if (connected && publicKey) {
    const address = publicKey.toString();
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <UserMenu
        walletAddress={address}
        shortAddress={shortAddress}
        onDisconnect={handleDisconnect}
      />
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
