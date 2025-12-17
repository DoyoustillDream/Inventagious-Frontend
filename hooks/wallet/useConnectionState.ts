'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';

export type ConnectionMethod = 'google' | 'apple' | 'injected' | null;

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string | null;
  connectionMethod: ConnectionMethod;
  connectedAt: number | null;
  error: Error | null;
}

/**
 * Enhanced connection state management hook
 */
export function useConnectionState() {
  const { publicKey, connected, connecting } = usePhantomWallet();
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    isConnecting: false,
    walletAddress: null,
    connectionMethod: null,
    connectedAt: null,
    error: null,
  });

  // Update state when connection changes
  useEffect(() => {
    const walletAddress = publicKey?.toString() || null;

    setConnectionState((prev) => ({
      ...prev,
      isConnected: connected,
      isConnecting: connecting,
      walletAddress,
      connectedAt: connected && !prev.isConnected ? Date.now() : prev.connectedAt,
      error: null,
    }));
  }, [connected, connecting, publicKey]);

  // Persist connection state to localStorage
  useEffect(() => {
    if (connectionState.isConnected && connectionState.walletAddress) {
      localStorage.setItem('wallet-connection-state', JSON.stringify({
        walletAddress: connectionState.walletAddress,
        connectedAt: connectionState.connectedAt,
        connectionMethod: connectionState.connectionMethod,
      }));
    } else {
      localStorage.removeItem('wallet-connection-state');
    }
  }, [connectionState.isConnected, connectionState.walletAddress, connectionState.connectedAt, connectionState.connectionMethod]);

  // Load persisted state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wallet-connection-state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Only restore if wallet is still connected
          if (connected && publicKey?.toString() === parsed.walletAddress) {
            setConnectionState((prev) => ({
              ...prev,
              connectionMethod: parsed.connectionMethod || null,
              connectedAt: parsed.connectedAt || null,
            }));
          }
        } catch (e) {
          // Invalid saved state, ignore
        }
      }
    }
  }, [connected, publicKey]);

  const setConnectionMethod = useCallback((method: ConnectionMethod) => {
    setConnectionState((prev) => ({
      ...prev,
      connectionMethod: method,
    }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setConnectionState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const clearError = useCallback(() => {
    setConnectionState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    ...connectionState,
    setConnectionMethod,
    setError,
    clearError,
  };
}

