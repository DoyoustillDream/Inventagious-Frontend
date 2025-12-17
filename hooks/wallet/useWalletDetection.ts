'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePhantom } from '@phantom/react-sdk';

export type WalletType = 'phantom-extension' | 'phantom-mobile' | 'phantom-oauth' | 'none';

export interface WalletDetectionResult {
  isAvailable: boolean;
  walletType: WalletType;
  recommended: boolean;
  installUrl?: string;
}

/**
 * Hook to detect available wallets before user interaction
 */
export function useWalletDetection() {
  const { isConnected } = usePhantom();
  const [detectionResult, setDetectionResult] = useState<WalletDetectionResult>({
    isAvailable: false,
    walletType: 'none',
    recommended: false,
  });
  const [isDetecting, setIsDetecting] = useState(true);

  const detectWallet = useCallback(() => {
    setIsDetecting(true);

    // Check for Phantom extension
    if (typeof window !== 'undefined') {
      const phantom = (window as any).phantom;
      const solana = (window as any).solana;

      // Check if Phantom extension is installed
      if (phantom?.solana || solana?.isPhantom) {
        setDetectionResult({
          isAvailable: true,
          walletType: 'phantom-extension',
          recommended: true,
        });
        setIsDetecting(false);
        return;
      }

      // Check if user is already connected (via OAuth or mobile)
      if (isConnected) {
        setDetectionResult({
          isAvailable: true,
          walletType: 'phantom-oauth',
          recommended: true,
        });
        setIsDetecting(false);
        return;
      }

      // Check for mobile app (via user agent or deep link support)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        setDetectionResult({
          isAvailable: true,
          walletType: 'phantom-mobile',
          recommended: true,
          installUrl: 'https://phantom.app/',
        });
        setIsDetecting(false);
        return;
      }
    }

    // No wallet detected
    setDetectionResult({
      isAvailable: false,
      walletType: 'none',
      recommended: false,
      installUrl: 'https://phantom.app/',
    });
    setIsDetecting(false);
  }, [isConnected]);

  useEffect(() => {
    detectWallet();

    // Re-detect when connection state changes
    const interval = setInterval(() => {
      detectWallet();
    }, 2000);

    return () => clearInterval(interval);
  }, [detectWallet]);

  return {
    ...detectionResult,
    isDetecting,
    redetect: detectWallet,
  };
}

