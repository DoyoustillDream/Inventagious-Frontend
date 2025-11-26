'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useWallet } from './useWallet';
import { useAuth } from '@/components/auth/AuthProvider';
import { authApi } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';

/**
 * Hook to automatically authenticate with backend when wallet connects
 * This bridges wallet connection to backend JWT authentication
 */
export function useWalletAuth() {
  const { publicKey, connected, signMessage } = useWallet();
  const { user, isAuthenticated, setUser, logout: authLogout } = useAuth();
  const authInProgressRef = useRef(false);
  const lastAuthenticatedWalletRef = useRef<string | null>(null);

  // Authenticate wallet when connected
  const authenticateWallet = useCallback(async () => {
    // Safety checks
    if (!connected || !publicKey || authInProgressRef.current) {
      return;
    }

    const walletAddress = publicKey.toString();

    // Skip if already authenticated with this wallet
    if (isAuthenticated && user?.walletAddress === walletAddress) {
      lastAuthenticatedWalletRef.current = walletAddress;
      return;
    }

    // Skip if already processing this wallet
    if (lastAuthenticatedWalletRef.current === walletAddress && authInProgressRef.current) {
      return;
    }

    // Check for existing valid token
    const existingToken = apiClient.getToken();
    if (existingToken) {
      try {
        const profile = await authApi.getProfile();
        if (profile.walletAddress === walletAddress) {
          setUser(profile);
          lastAuthenticatedWalletRef.current = walletAddress;
          return;
        }
      } catch (error) {
        // Token invalid, will authenticate below
        apiClient.clearToken();
        authLogout();
      }
    }

    // Prevent concurrent authentication
    authInProgressRef.current = true;
    lastAuthenticatedWalletRef.current = walletAddress;

    try {
      // Create authentication message
      const timestamp = Date.now();
      const message = `Sign this message to authenticate with Inventagious.\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
      const messageBytes = new TextEncoder().encode(message);

      // Request signature from wallet
      let signature: Uint8Array;
      try {
        signature = await signMessage(messageBytes);
      } catch (signError: any) {
        if (signError?.message?.includes('User rejected') || signError?.message?.includes('User cancelled')) {
          throw signError;
        }
        const errorMsg = signError?.message?.includes('keyring')
          ? 'Your wallet does not support message signing. Please try a different wallet (e.g., Phantom, Solflare).'
          : `Failed to sign message: ${signError?.message || 'Unknown error'}`;
        console.error(errorMsg, signError);
        throw new Error(errorMsg);
      }

      // Convert signature to base64
      const signatureBase64 = btoa(String.fromCharCode(...signature));

      // Authenticate with backend
      let authResponse;
      try {
        authResponse = await authApi.connectWallet({
          walletAddress,
          signature: signatureBase64,
          timestamp,
        });
      } catch (error) {
        // If connect fails, try registering
        authResponse = await authApi.registerWithWallet({
          walletAddress,
          signature: signatureBase64,
          timestamp,
        });
      }

      // Update state
      setUser(authResponse.user);
      lastAuthenticatedWalletRef.current = walletAddress;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User rejected') || error.message.includes('User cancelled')) {
          console.log('User rejected wallet signature');
          lastAuthenticatedWalletRef.current = null;
        } else {
          console.error('Error authenticating wallet:', error);
        }
      } else {
        console.error('Error authenticating wallet:', error);
      }
      lastAuthenticatedWalletRef.current = null;
    } finally {
      authInProgressRef.current = false;
    }
  }, [connected, publicKey, signMessage, isAuthenticated, user, setUser, authLogout]);

  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      authenticateWallet();
    } else if (!connected) {
      // Reset when disconnected
      lastAuthenticatedWalletRef.current = null;
    }
  }, [connected, publicKey, authenticateWallet]);

  // Handle wallet disconnection
  const handleDisconnect = useCallback(async () => {
    // Note: wallet disconnect is handled by useWallet hook
    // Here we just clear backend auth
    authApi.logout();
    authLogout();
    lastAuthenticatedWalletRef.current = null;
  }, [authLogout]);

  return {
    authenticateWallet,
    handleDisconnect,
  };
}

