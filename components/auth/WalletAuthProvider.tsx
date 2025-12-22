'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { useAuth } from '@/components/auth/AuthProvider';
import { authApi } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface WalletAuthContextType {
  showProfileForm: boolean;
  pendingWalletAddress: string | null;
  isAuthenticating: boolean;
  oauthUser: any | null; // OAuth user info from Phantom (email, name, etc.)
  authenticateWallet: (force?: boolean) => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handleProfileComplete: () => Promise<void>;
  handleProfileCancel: () => void;
}

const WalletAuthContext = createContext<WalletAuthContextType | undefined>(undefined);

export function useWalletAuth() {
  const context = useContext(WalletAuthContext);
  if (!context) {
    throw new Error('useWalletAuth must be used within WalletAuthProvider');
  }
  return context;
}

interface WalletAuthProviderProps {
  children: ReactNode;
}

const WALLET_ADDRESS_STORAGE_KEY = 'inventagious_wallet_address';
const LAST_CONNECTION_METHOD_KEY = 'inventagious_last_connection_method';

export function WalletAuthProvider({ children }: WalletAuthProviderProps) {
  const { publicKey, connected, signMessage, user: phantomUser, connect, isLoading: walletLoading } = usePhantomWallet();
  const { user, isAuthenticated, setUser, logout: authLogout, isLoading: authLoading } = useAuth();
  const { redirectAfterAuth } = useAuthRedirect();
  
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [pendingWalletAddress, setPendingWalletAddress] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Track current authentication attempt to prevent duplicates
  const authAttemptRef = useRef<string | null>(null);
  const autoReconnectAttemptedRef = useRef(false);

  // Note: Phantom SDK user object only contains wallet connection info
  // It does NOT contain OAuth profile data (email/name) - this is by design
  // The user object has: walletId, addresses, status, authUserId, authProvider, source
  // OAuth profile data is not exposed for privacy/security reasons

  const authenticateWallet = useCallback(async (force = false) => {
    // Safety checks
    if (!connected || !publicKey) {
      throw new Error('Wallet is not connected');
    }

    const walletAddress = publicKey.toString();

    // Prevent duplicate authentication attempts - check both ref and state
    if (isAuthenticating) {
      console.log('Authentication already in progress');
      return;
    }

    // Prevent duplicate authentication attempts for the same wallet
    if (!force && authAttemptRef.current === walletAddress) {
      console.log('Authentication already attempted for this wallet. Use force=true to retry.');
      return;
    }

    // Skip if already authenticated with this wallet
    if (!force && isAuthenticated && user?.walletAddress === walletAddress) {
      console.log('Already authenticated with this wallet');
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
      // Use UTC timezone to ensure consistency between frontend and backend
      const date = new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        timeZone: 'UTC'
      });
      
      // Format wallet address for better readability (short version for display)
      const formattedAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
      
      const message = `Welcome to Inventagious!

Please sign this message to authenticate your wallet and prove ownership.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Account: ${formattedAddress} (${walletAddress})
Date: ${date}
Timestamp: ${timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This signature is used only for authentication purposes and does not grant any permissions or authorize any transactions.

By signing, you confirm that you are the owner of this wallet address.`;
      const messageBytes = new TextEncoder().encode(message);

      // Step 2: Request signature from wallet
      let signature: Uint8Array;
      try {
        signature = await signMessage(messageBytes);
      } catch (signError: any) {
        // Handle user rejection - reset state so they can try again
        if (
          signError?.message?.includes('User rejected') ||
          signError?.message?.includes('User cancelled') ||
          signError?.message?.includes('rejected')
        ) {
          console.log('User rejected wallet signature');
          authAttemptRef.current = null;
          setIsAuthenticating(false);
          throw new Error('Sign in cancelled by user');
        }
        // Reset state on other errors too
        authAttemptRef.current = null;
        setIsAuthenticating(false);
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
      console.log('[useWalletAuth] Auth response received:', {
        hasUser: !!authResponse.user,
        userId: authResponse.user?.id,
        hasToken: !!authResponse.access_token,
        requiresProfileCompletion: authResponse.requiresProfileCompletion,
        fullResponse: authResponse,
      });

      if (authResponse.requiresProfileCompletion || !authResponse.user?.id) {
        // Profile completion needed
        console.log('[useWalletAuth] Profile completion required');
        console.log('[useWalletAuth] Setting pendingWalletAddress to:', walletAddress);
        console.log('[useWalletAuth] Setting showProfileForm to true');
        setPendingWalletAddress(walletAddress);
        setShowProfileForm(true);
        // Force a state update by logging after a brief delay
        setTimeout(() => {
          console.log('[useWalletAuth] State after setting:', {
            pendingWalletAddress: walletAddress,
            showProfileForm: true,
          });
        }, 100);
        if (authResponse.access_token) {
          apiClient.setToken(authResponse.access_token);
        }
        setIsAuthenticating(false);
        authAttemptRef.current = null;
        return;
      }

      // Step 6: Update auth state
      if (authResponse.user && authResponse.access_token) {
        console.log('[useWalletAuth] Authentication successful, updating state');
        setUser(authResponse.user);
        // Ensure token is stored
        apiClient.setToken(authResponse.access_token);
        
        // Store wallet address for auto-reconnect on refresh
        if (typeof window !== 'undefined' && walletAddress) {
          localStorage.setItem(WALLET_ADDRESS_STORAGE_KEY, walletAddress);
          // Try to detect connection method from Phantom user
          if (phantomUser) {
            const userAny = phantomUser as any;
            const connectionMethod = userAny.authProvider || userAny.source || 'injected';
            localStorage.setItem(LAST_CONNECTION_METHOD_KEY, connectionMethod);
          }
        }
        
        // Reset authentication state
        setIsAuthenticating(false);
        authAttemptRef.current = null;
        
        // Wait a moment for state to update, then redirect
        setTimeout(() => {
          redirectAfterAuth();
        }, 150);
      } else {
        // Unexpected response structure - log and handle gracefully
        console.error('[useWalletAuth] Unexpected response structure:', authResponse);
        console.error('[useWalletAuth] Missing user or access_token in response');
        setIsAuthenticating(false);
        authAttemptRef.current = null;
        throw new Error('Invalid authentication response: missing user or access token');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Reset state on error so user can try again
      authAttemptRef.current = null;
      setIsAuthenticating(false);
      // Re-throw to allow caller to handle the error
      throw error;
    }
  }, [connected, publicKey, signMessage, isAuthenticated, user, setUser, authLogout, redirectAfterAuth, isAuthenticating]);

  const handleDisconnect = useCallback(async () => {
    authApi.logout();
    authLogout();
    authAttemptRef.current = null;
    setShowProfileForm(false);
    setPendingWalletAddress(null);
    // Clear stored wallet address on disconnect
    if (typeof window !== 'undefined') {
      localStorage.removeItem(WALLET_ADDRESS_STORAGE_KEY);
      localStorage.removeItem(LAST_CONNECTION_METHOD_KEY);
    }
  }, [authLogout]);

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

  const handleProfileCancel = useCallback(() => {
    setShowProfileForm(false);
    setPendingWalletAddress(null);
    authApi.logout();
    authLogout();
    authAttemptRef.current = null;
  }, [authLogout]);

  // Auto-reconnect wallet on page refresh if we have a valid token
  useEffect(() => {
    // Only attempt once, after both auth and wallet have finished loading
    if (autoReconnectAttemptedRef.current || authLoading || walletLoading) {
      return;
    }

    const attemptAutoReconnect = async () => {
      autoReconnectAttemptedRef.current = true;

      // Check if we have a valid token and user
      const token = apiClient.getToken();
      if (!token || !isAuthenticated || !user) {
        return;
      }

      // Check if wallet is already connected with the correct address
      if (connected && publicKey) {
        const walletAddress = publicKey.toString();
        // Verify wallet matches user's wallet address
        if (user.walletAddress?.toLowerCase() === walletAddress.toLowerCase()) {
          // Already connected with correct wallet, nothing to do
          console.log('[WalletAuthProvider] Wallet already connected with correct address');
          return;
        }
      }

      // Get stored wallet address
      const storedWalletAddress = typeof window !== 'undefined' 
        ? localStorage.getItem(WALLET_ADDRESS_STORAGE_KEY)
        : null;

      // Verify stored wallet matches user's wallet
      if (!storedWalletAddress || storedWalletAddress.toLowerCase() !== user.walletAddress?.toLowerCase()) {
        console.log('[WalletAuthProvider] Stored wallet address does not match user wallet');
        return;
      }

      // Try to auto-reconnect
      try {
        const lastConnectionMethod = typeof window !== 'undefined'
          ? localStorage.getItem(LAST_CONNECTION_METHOD_KEY) || 'injected'
          : 'injected';

        // Only try injected method for auto-reconnect (silent, no popup)
        // Google/Apple require user interaction, so skip those
        if (lastConnectionMethod === 'injected') {
          console.log('[WalletAuthProvider] Attempting auto-reconnect with injected wallet');
          try {
            await connect('injected');
            // Give the connection a moment to establish
            // The connection state will update via the usePhantomWallet hook
            console.log('[WalletAuthProvider] Auto-reconnect initiated');
          } catch (connectError) {
            // Connection failed - this is expected if Phantom extension is not available
            // or user hasn't approved the connection yet
            console.log('[WalletAuthProvider] Auto-reconnect not possible (user may need to manually connect)');
          }
        } else {
          // For Google/Apple, we can't auto-reconnect without user interaction
          console.log('[WalletAuthProvider] Cannot auto-reconnect with', lastConnectionMethod, '- requires user interaction');
        }
      } catch (error) {
        // Auto-reconnect failed - that's okay, user is still authenticated via token
        // They'll just need to manually reconnect for wallet operations
        console.log('[WalletAuthProvider] Auto-reconnect failed (this is okay):', error);
      }
    };

    // Small delay to ensure everything is initialized
    const timeoutId = setTimeout(attemptAutoReconnect, 1000);
    return () => clearTimeout(timeoutId);
  }, [authLoading, walletLoading, isAuthenticated, user, connected, publicKey, connect]);

  // Auto-verify authentication when wallet reconnects with valid token
  useEffect(() => {
    // Skip if already authenticated or if wallet is not connected
    if (!connected || !publicKey || isAuthenticated || authLoading) {
      return;
    }

    // Check if we have a valid token
    const token = apiClient.getToken();
    if (!token) {
      return;
    }

    // Check if the connected wallet matches the stored wallet address
    const walletAddress = publicKey.toString();
    const storedWalletAddress = typeof window !== 'undefined'
      ? localStorage.getItem(WALLET_ADDRESS_STORAGE_KEY)
      : null;

    // If we have a token and wallet matches, verify authentication automatically
    if (storedWalletAddress && storedWalletAddress.toLowerCase() === walletAddress.toLowerCase()) {
      const verifyAuth = async () => {
        try {
          const profile = await authApi.getProfile();
          if (profile.walletAddress?.toLowerCase() === walletAddress.toLowerCase()) {
            // Token is valid and wallet matches - restore auth state
            console.log('[WalletAuthProvider] Auto-verified authentication after wallet reconnect');
            setUser(profile);
          } else {
            // Wallet mismatch - clear token
            console.log('[WalletAuthProvider] Wallet mismatch, clearing token');
            apiClient.clearToken();
            authLogout();
          }
        } catch (error) {
          // Token invalid - clear it
          console.log('[WalletAuthProvider] Token invalid, clearing');
          apiClient.clearToken();
          authLogout();
        }
      };

      // Small delay to avoid race conditions
      const timeoutId = setTimeout(verifyAuth, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [connected, publicKey, isAuthenticated, authLoading, setUser, authLogout]);

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!connected) {
      // Reset when disconnected
      authAttemptRef.current = null;
      setShowProfileForm(false);
      setPendingWalletAddress(null);
    }
  }, [connected]);

  const value: WalletAuthContextType = {
    showProfileForm,
    pendingWalletAddress,
    isAuthenticating,
    oauthUser: phantomUser, // Pass OAuth user info (email, name from Google/Apple)
    authenticateWallet: () => authenticateWallet(true),
    handleDisconnect,
    handleProfileComplete,
    handleProfileCancel,
  };

  return <WalletAuthContext.Provider value={value}>{children}</WalletAuthContext.Provider>;
}

