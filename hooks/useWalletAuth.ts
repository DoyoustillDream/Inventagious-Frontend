'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useWallet } from './useWallet';
import { useAuth } from '@/components/auth/AuthProvider';
import { authApi } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import { useAuthRedirect } from './useAuthRedirect';

/**
 * Hook to handle wallet authentication
 * Simplified, reliable authentication flow
 */
export function useWalletAuth() {
  const { publicKey, connected, signMessage } = useWallet();
  const { user, isAuthenticated, setUser, logout: authLogout } = useAuth();
  const { redirectAfterAuth } = useAuthRedirect();
  
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [pendingWalletAddress, setPendingWalletAddress] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Track current authentication attempt to prevent duplicates
  const authAttemptRef = useRef<string | null>(null);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Authenticate wallet with backend
   */
  const authenticateWallet = useCallback(async (force = false) => {
    // Safety checks
    if (!connected || !publicKey) {
      return;
    }

    const walletAddress = publicKey.toString();

    // Prevent duplicate authentication attempts for the same wallet
    if (!force && authAttemptRef.current === walletAddress && isAuthenticating) {
      return;
    }

    // Skip if already authenticated with this wallet
    if (!force && isAuthenticated && user?.walletAddress === walletAddress) {
      return;
    }

    // Check for existing valid token first
    const existingToken = apiClient.getToken();
    if (existingToken && !force) {
      try {
        const profile = await authApi.getProfile();
        if (profile.walletAddress?.toLowerCase() === walletAddress.toLowerCase()) {
          setUser(profile);
          // Redirect after a brief delay to ensure state is updated
          setTimeout(() => {
            redirectAfterAuth();
          }, 100);
          return;
        } else {
          // Wallet mismatch, clear token
          apiClient.clearToken();
          authLogout();
        }
      } catch (error) {
        // Token invalid, clear it
        apiClient.clearToken();
        authLogout();
      }
    }

    // Mark authentication in progress
    authAttemptRef.current = walletAddress;
    setIsAuthenticating(true);

    try {
      // Step 1: Create authentication message
      const timestamp = Date.now();
      const message = `Sign this message to authenticate with Inventagious.\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
      const messageBytes = new TextEncoder().encode(message);

      // Step 2: Request signature from wallet
      let signature: Uint8Array;
      try {
        signature = await signMessage(messageBytes);
      } catch (signError: any) {
        // Handle user rejection
        if (
          signError?.message?.includes('User rejected') ||
          signError?.message?.includes('User cancelled') ||
          signError?.message?.includes('rejected')
        ) {
          console.log('User rejected wallet signature');
          authAttemptRef.current = null;
          setIsAuthenticating(false);
          return;
        }
        throw signError;
      }

      // Step 3: Convert signature to base64
      const signatureBase64 = btoa(String.fromCharCode(...signature));

      // Step 4: Authenticate with backend
      let authResponse;
      try {
        // Try to connect (login) first
        authResponse = await authApi.connectWallet({
          walletAddress,
          signature: signatureBase64,
          timestamp,
        });
      } catch (connectError: any) {
        // If user not found (404), try registering
        if (connectError?.status === 404 || connectError?.message?.includes('not found')) {
          authResponse = await authApi.registerWithWallet({
            walletAddress,
            signature: signatureBase64,
            timestamp,
          });
        } else {
          throw connectError;
        }
      }

      // Step 5: Handle response
      if (authResponse.requiresProfileCompletion || !authResponse.user?.id) {
        // Profile completion needed
        setPendingWalletAddress(walletAddress);
        setShowProfileForm(true);
        if (authResponse.access_token) {
          apiClient.setToken(authResponse.access_token);
        }
        setIsAuthenticating(false);
        return;
      }

      // Step 6: Update auth state
      if (authResponse.user && authResponse.access_token) {
        setUser(authResponse.user);
        // Ensure token is stored
        apiClient.setToken(authResponse.access_token);
        
        // Wait a moment for state to update, then redirect
        setTimeout(() => {
          redirectAfterAuth();
        }, 150);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Reset state on error
      authAttemptRef.current = null;
    } finally {
      setIsAuthenticating(false);
    }
  }, [connected, publicKey, signMessage, isAuthenticated, user, setUser, authLogout, redirectAfterAuth]);

  // Auto-authenticate when wallet connects (but not if already authenticated)
  useEffect(() => {
    // Clear any existing timeout
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
    }

    if (connected && publicKey && !isAuthenticated && !isAuthenticating) {
      // Small delay to ensure wallet state is stable
      authTimeoutRef.current = setTimeout(() => {
        authenticateWallet();
      }, 200);
    } else if (!connected) {
      // Reset when disconnected
      authAttemptRef.current = null;
      setShowProfileForm(false);
      setPendingWalletAddress(null);
    }

    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, [connected, publicKey, isAuthenticated, isAuthenticating, authenticateWallet]);

  // Handle wallet disconnection
  const handleDisconnect = useCallback(async () => {
    authApi.logout();
    authLogout();
    authAttemptRef.current = null;
    setShowProfileForm(false);
    setPendingWalletAddress(null);
  }, [authLogout]);

  // Handle profile completion
  const handleProfileComplete = useCallback(async () => {
    setShowProfileForm(false);
    const completedWalletAddress = pendingWalletAddress;
    setPendingWalletAddress(null);

    // Re-authenticate to get updated user data
    if (connected && publicKey && completedWalletAddress === publicKey.toString()) {
      // Wait a moment for backend to process
      setTimeout(() => {
        authenticateWallet(true).then(() => {
          setTimeout(() => {
            redirectAfterAuth('/profile');
          }, 200);
        }).catch((error) => {
          console.error('Error re-authenticating after profile completion:', error);
          redirectAfterAuth('/profile');
        });
      }, 300);
    } else {
      redirectAfterAuth('/profile');
    }
  }, [connected, publicKey, pendingWalletAddress, authenticateWallet, redirectAfterAuth]);

  // Handle profile cancellation
  const handleProfileCancel = useCallback(() => {
    setShowProfileForm(false);
    setPendingWalletAddress(null);
    authApi.logout();
    authLogout();
    authAttemptRef.current = null;
  }, [authLogout]);

  return {
    authenticateWallet: () => authenticateWallet(true),
    handleDisconnect,
    showProfileForm,
    pendingWalletAddress,
    handleProfileComplete,
    handleProfileCancel,
    isAuthenticating,
  };
}
