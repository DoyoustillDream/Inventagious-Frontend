# Phantom Connect SDK Migration Guide

This guide explains how to migrate from the current wallet implementation to Phantom Connect SDK, which provides a more robust, secure, and user-friendly wallet integration experience.

## Table of Contents

1. [Overview](#overview)
2. [Key Benefits](#key-benefits)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Migration Steps](#migration-steps)
7. [Component-by-Component Migration](#component-by-component-migration)
8. [Backend Considerations](#backend-considerations)
9. [Testing Checklist](#testing-checklist)
10. [Troubleshooting](#troubleshooting)

## Overview

### Current Implementation

The current implementation uses:
- Custom `useWallet` hook with Wallet Standard API
- Direct integration with Phantom browser extension
- Manual wallet detection and connection management
- Custom authentication flow with message signing

### Phantom Connect SDK

Phantom Connect SDK provides:
- **Multiple authentication methods**: Google OAuth, Apple ID, browser extension, and mobile deeplink
- **Embedded wallets**: Non-custodial wallets created through OAuth (users control their keys)
- **Unified API**: Same interface for both injected (extension) and embedded wallets
- **Built-in UI components**: Pre-built connection modal and buttons
- **Multi-chain support**: Solana and Ethereum (EVM) support
- **Better security**: Advanced transaction simulation and security features

## Key Benefits

1. **User Experience**: Users can sign in with Google/Apple without installing browser extensions
2. **Mobile Support**: Deeplink support for Phantom mobile app
3. **Security**: Built-in transaction simulation and security checks
4. **Maintenance**: Less custom code to maintain
5. **Flexibility**: Support for both extension and embedded wallets
6. **Multi-chain**: Native support for Solana and Ethereum operations

## Prerequisites

### 1. Register Your App in Phantom Portal

1. Go to [Phantom Portal](https://phantom.com/portal)
2. Sign up or log in
3. Register your application
4. **Get your App ID** (you'll need this for configuration)
5. **Allowlist your domains**:
   - Add your production domain (e.g., `https://yourapp.com`)
   - Add your development domain (e.g., `http://localhost:3000`)
6. **Configure redirect URLs**:
   - Add your OAuth callback URL (e.g., `https://yourapp.com/auth/callback`)
   - Add your development callback URL (e.g., `http://localhost:3000/auth/callback`)

### 2. Environment Variables

Add to your `.env` file:

```env
NEXT_PUBLIC_PHANTOM_APP_ID=your-app-id-from-portal
NEXT_PUBLIC_PHANTOM_REDIRECT_URL=http://localhost:3000/auth/callback
```

For production, update `NEXT_PUBLIC_PHANTOM_REDIRECT_URL` to your production callback URL.

## Installation

### Step 1: Install Phantom React SDK

```bash
npm install @phantom/react-sdk
```

### Step 2: Install Solana Dependencies (if not already installed)

The SDK requires `@solana/web3.js` for Solana operations:

```bash
npm install @solana/web3.js
```

### Step 3: Optional - Install Ethereum Dependencies (for EVM support)

If you want Ethereum support:

```bash
npm install viem
```

## Configuration

### Step 1: Create Phantom Provider Configuration

Create a new file: `frontend/lib/phantom/config.ts`

```typescript
import { AddressType } from "@phantom/browser-sdk";

export const phantomConfig = {
  providers: ["google", "apple", "injected", "deeplink"] as const,
  appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID || "",
  addressTypes: [AddressType.solana] as const, // Add AddressType.ethereum if needed
  authOptions: {
    redirectUrl: process.env.NEXT_PUBLIC_PHANTOM_REDIRECT_URL || 
                 typeof window !== "undefined" 
                   ? `${window.location.origin}/auth/callback`
                   : "",
  },
};

// Validate configuration
if (!phantomConfig.appId) {
  console.warn("Phantom App ID is not set. Please set NEXT_PUBLIC_PHANTOM_APP_ID in your .env file");
}
```

### Step 2: Create Theme Configuration (Optional)

Create `frontend/lib/phantom/theme.ts`:

```typescript
import { darkTheme, lightTheme } from "@phantom/react-sdk";

// Use pre-built themes
export const phantomTheme = darkTheme; // or lightTheme

// Or create custom theme
export const customPhantomTheme = {
  background: "#1a1a1a",
  text: "#ffffff",
  secondary: "#98979C",
  brand: "#ab9ff2",
  error: "#ff4444",
  success: "#00ff00",
  borderRadius: "16px",
  overlay: "rgba(0, 0, 0, 0.8)",
};
```

## Migration Steps

### High-Level Migration Plan

1. ✅ Install Phantom Connect SDK
2. ✅ Set up Phantom Provider in root layout
3. ✅ Create new wallet hooks using Phantom SDK
4. ✅ Update authentication flow
5. ✅ Replace wallet connection UI components
6. ✅ Update transaction signing logic
7. ✅ Test all wallet operations
8. ✅ Remove old wallet implementation

## Component-by-Component Migration

### 1. Update Root Layout

**File**: `frontend/app/layout.tsx`

Replace the `WalletProvider` with `PhantomProvider`:

```typescript
import { PhantomProvider, darkTheme } from "@phantom/react-sdk";
import { phantomConfig } from "@/lib/phantom/config";
import { phantomTheme } from "@/lib/phantom/theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PhantomProvider
          config={phantomConfig}
          theme={phantomTheme}
          appIcon="https://yourapp.com/icon.png" // Your app icon URL
          appName="Inventagious"
        >
          <AuthProvider>
            <WalletAuthProvider>
              {/* ... rest of providers */}
            </WalletAuthProvider>
          </AuthProvider>
        </PhantomProvider>
      </body>
    </html>
  );
}
```

### 2. Create Auth Callback Page

**File**: `frontend/app/auth/callback/page.tsx`

Create a new page to handle OAuth callbacks:

```typescript
'use client';

import { PhantomProvider, ConnectBox, darkTheme } from "@phantom/react-sdk";
import { phantomConfig } from "@/lib/phantom/config";
import { phantomTheme } from "@/lib/phantom/theme";

export default function AuthCallbackPage() {
  return (
    <PhantomProvider
      config={phantomConfig}
      theme={phantomTheme}
      appIcon="https://yourapp.com/icon.png"
      appName="Inventagious"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connecting to Phantom...</h1>
          <ConnectBox />
        </div>
      </div>
    </PhantomProvider>
  );
}
```

### 3. Create New Wallet Hook

**File**: `frontend/hooks/usePhantomWallet.ts`

Create a new hook that wraps Phantom SDK functionality:

```typescript
'use client';

import { usePhantom, useSolana, useConnect, useDisconnect, useAccounts } from "@phantom/react-sdk";
import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";

export interface UsePhantomWalletReturn {
  // Connection state
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  isLoading: boolean;
  
  // Connection methods
  connect: (provider?: "google" | "apple" | "injected") => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Solana operations
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  signTransaction: (transaction: any) => Promise<any>;
  signAndSendTransaction: (transaction: any) => Promise<{ hash: string }>;
  
  // Addresses
  addresses: Array<{ address: string; addressType: string }> | null;
}

/**
 * Hook to manage Phantom wallet connection using Phantom Connect SDK
 */
export function usePhantomWallet(): UsePhantomWalletReturn {
  const { isConnected, isLoading: phantomLoading, user } = usePhantom();
  const { connect: phantomConnect, isConnecting, error } = useConnect();
  const { disconnect: phantomDisconnect } = useDisconnect();
  const addresses = useAccounts();
  const { solana, isAvailable: solanaAvailable } = useSolana();

  // Get Solana public key from addresses
  const solanaAddress = addresses?.find(
    addr => addr.addressType === "solana"
  );
  const publicKey = solanaAddress 
    ? new PublicKey(solanaAddress.address)
    : null;

  const connect = useCallback(async (
    provider: "google" | "apple" | "injected" = "injected"
  ) => {
    try {
      await phantomConnect({ provider });
    } catch (err) {
      console.error("Failed to connect:", err);
      throw err;
    }
  }, [phantomConnect]);

  const disconnect = useCallback(async () => {
    try {
      await phantomDisconnect();
    } catch (err) {
      console.error("Failed to disconnect:", err);
      throw err;
    }
  }, [phantomDisconnect]);

  const signMessage = useCallback(async (message: Uint8Array): Promise<Uint8Array> => {
    if (!solanaAvailable || !solana) {
      throw new Error("Solana is not available");
    }
    
    const result = await solana.signMessage(
      new TextDecoder().decode(message)
    );
    
    // Convert signature to Uint8Array
    // The SDK returns signature in a specific format, adjust based on actual return type
    return new Uint8Array(Buffer.from(result.signature, 'base64'));
  }, [solana, solanaAvailable]);

  const signTransaction = useCallback(async (transaction: any) => {
    if (!solanaAvailable || !solana) {
      throw new Error("Solana is not available");
    }
    
    // Note: signTransaction is not supported for embedded wallets
    // Use signAndSendTransaction instead for embedded wallets
    if (solana.isConnected) {
      return await solana.signTransaction(transaction);
    }
    throw new Error("Wallet not connected");
  }, [solana, solanaAvailable]);

  const signAndSendTransaction = useCallback(async (transaction: any) => {
    if (!solanaAvailable || !solana) {
      throw new Error("Solana is not available");
    }
    
    const result = await solana.signAndSendTransaction(transaction);
    return { hash: result.hash };
  }, [solana, solanaAvailable]);

  return {
    publicKey,
    connected: isConnected && !!publicKey,
    connecting: isConnecting,
    isLoading: phantomLoading,
    connect,
    disconnect,
    signMessage,
    signTransaction,
    signAndSendTransaction,
    addresses,
  };
}
```

### 4. Update WalletAuthProvider

**File**: `frontend/components/auth/WalletAuthProvider.tsx`

Update to use the new Phantom wallet hook:

```typescript
'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { usePhantomWallet } from '@/hooks/usePhantomWallet'; // Updated import
import { useAuth } from '@/components/auth/AuthProvider';
import { authApi } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

// ... existing interfaces ...

export function WalletAuthProvider({ children }: WalletAuthProviderProps) {
  const { publicKey, connected, signMessage } = usePhantomWallet(); // Updated
  const { user, isAuthenticated, setUser, logout: authLogout } = useAuth();
  const { redirectAfterAuth } = useAuthRedirect();
  
  // ... rest of the component remains the same ...
  // The authentication logic stays the same, just using the new hook
}
```

### 5. Update WalletConnect Component

**File**: `frontend/components/auth/WalletConnect/WalletConnect.tsx`

Replace with Phantom SDK components:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { useWalletAuth } from '@/components/auth/WalletAuthProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { useModal, ConnectButton } from "@phantom/react-sdk";
import { useToast } from '@/components/shared/Toast';
import UserMenu from './UserMenu';

export default function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const { publicKey, connected, connecting, connect, disconnect } = usePhantomWallet();
  const { isAuthenticated } = useAuth();
  const { authenticateWallet, handleDisconnect: handleWalletAuthDisconnect, isAuthenticating } = useWalletAuth();
  const { showError, showWarning } = useToast();
  const { open: openModal } = useModal();
  
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // If authenticated, show user menu
  if (isAuthenticated && publicKey) {
    return <UserMenu />;
  }

  // If wallet connected but not authenticated, show sign in button
  if (connected && publicKey && !isAuthenticated) {
    return (
      <button
        onClick={() => authenticateWallet()}
        disabled={isAuthenticating}
        className="hand-drawn rounded-lg border-4 border-black bg-gradient-to-r from-white to-yellow-50 px-4 py-2.5 text-base font-bold text-black shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative z-10"
      >
        {isAuthenticating ? 'Signing In...' : 'Sign In'}
      </button>
    );
  }

  // Option 1: Use Phantom's ConnectButton component
  return (
    <ConnectButton />
  );

  // Option 2: Use custom button with modal
  // return (
  //   <button
  //     onClick={openModal}
  //     className="hand-drawn rounded-lg border-4 border-black bg-gradient-to-r from-white to-yellow-50 px-4 py-2.5 text-base font-bold text-black shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative z-10"
  //   >
  //     Connect Wallet
  //   </button>
  // );
}
```

### 6. Update Transaction Signing

**File**: `frontend/lib/solana/hooks/useTransactionSigning.ts`

Update to use Phantom SDK's Solana hook:

```typescript
import { useSolana } from "@phantom/react-sdk";
import { VersionedTransaction } from "@solana/web3.js";

export function useTransactionSigning() {
  const { solana, isAvailable } = useSolana();

  const signAndSendTransaction = async (
    transaction: VersionedTransaction
  ): Promise<string> => {
    if (!isAvailable || !solana) {
      throw new Error("Solana wallet is not available");
    }

    if (!solana.isConnected) {
      throw new Error("Wallet is not connected");
    }

    try {
      const result = await solana.signAndSendTransaction(transaction);
      return result.hash;
    } catch (error: any) {
      console.error("Transaction signing error:", error);
      throw error;
    }
  };

  return {
    signAndSendTransaction,
    isAvailable: isAvailable && solana?.isConnected,
  };
}
```

### 7. Update Campaign and Deal Hooks

Update any hooks that use `useWallet` to use `usePhantomWallet` instead:

**Files to update**:
- `frontend/lib/solana/hooks/useCampaign.ts`
- `frontend/lib/solana/hooks/useDeal.ts`
- Any other files importing `useWallet`

Replace:
```typescript
import { useWallet } from '@/hooks/useWallet';
```

With:
```typescript
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
```

And update the hook usage:
```typescript
const { publicKey, connected, signAndSendTransaction } = usePhantomWallet();
```

## Backend Considerations

### Message Signature Format

The backend should continue to work with the same message signature format. However, verify that:

1. **Signature encoding**: Phantom SDK may return signatures in a different format. Check the actual return type and adjust if needed.

2. **Message format**: Ensure the message format matches what the backend expects. The current message format in `WalletAuthProvider.tsx` should work, but verify the signature encoding.

### Testing Backend Integration

1. Test authentication with Google OAuth
2. Test authentication with Apple ID
3. Test authentication with browser extension
4. Verify signature validation works correctly
5. Test profile completion flow

## Testing Checklist

### Connection Testing

- [ ] Connect with Google OAuth
- [ ] Connect with Apple ID
- [ ] Connect with browser extension (Phantom installed)
- [ ] Connect with mobile deeplink (on mobile device)
- [ ] Disconnect functionality
- [ ] Auto-reconnect on page refresh

### Authentication Testing

- [ ] Sign in with Google OAuth wallet
- [ ] Sign in with Apple ID wallet
- [ ] Sign in with extension wallet
- [ ] Profile completion flow
- [ ] Token persistence
- [ ] Logout functionality

### Transaction Testing

- [ ] Sign messages for authentication
- [ ] Sign and send Solana transactions
- [ ] Handle transaction errors
- [ ] Network switching (mainnet/devnet)

### UI Testing

- [ ] Connection modal appears correctly
- [ ] ConnectButton displays correctly
- [ ] ConnectBox on callback page works
- [ ] User menu displays after authentication
- [ ] Loading states display correctly
- [ ] Error messages display correctly

### Edge Cases

- [ ] No wallet installed (should show OAuth options)
- [ ] User rejects connection
- [ ] User rejects signature
- [ ] Network errors
- [ ] Session expiration
- [ ] Multiple tabs open

## Troubleshooting

### Common Issues

#### 1. "App ID is not set" Warning

**Solution**: Ensure `NEXT_PUBLIC_PHANTOM_APP_ID` is set in your `.env` file.

#### 2. OAuth Redirect Not Working

**Solution**: 
- Verify redirect URL is allowlisted in Phantom Portal
- Ensure the callback page exists at `/auth/callback`
- Check that the redirect URL matches exactly (including protocol and port)

#### 3. Signature Verification Fails

**Solution**:
- Verify the message format matches backend expectations
- Check signature encoding (base64 vs hex)
- Ensure timestamp is included and valid

#### 4. Embedded Wallet Not Creating

**Solution**:
- Verify App ID is correct
- Check that domains are allowlisted
- Ensure OAuth providers are enabled in config

#### 5. Extension Not Detected

**Solution**:
- Verify "injected" is in the providers array
- Check browser console for errors
- Ensure Phantom extension is installed and enabled

### Debug Configuration

Enable debug logging to troubleshoot issues:

```typescript
import { PhantomProvider, DebugLevel } from "@phantom/react-sdk";

const debugConfig = {
  enabled: true,
  level: DebugLevel.DEBUG,
  callback: (message) => {
    console.log(`[Phantom SDK] ${message.category}: ${message.message}`, message.data);
  },
};

<PhantomProvider
  config={phantomConfig}
  theme={phantomTheme}
  debugConfig={debugConfig}
  // ... other props
>
  {/* ... */}
</PhantomProvider>
```

## Migration Timeline

### Phase 1: Setup (Day 1)
- Install SDK and dependencies
- Register app in Phantom Portal
- Create configuration files
- Set up Phantom Provider

### Phase 2: Core Migration (Days 2-3)
- Create new wallet hooks
- Update WalletAuthProvider
- Update WalletConnect component
- Create auth callback page

### Phase 3: Integration (Days 4-5)
- Update transaction signing
- Update campaign/deal hooks
- Update all components using wallet

### Phase 4: Testing (Days 6-7)
- Test all connection methods
- Test authentication flow
- Test transactions
- Fix any issues

### Phase 5: Cleanup (Day 8)
- Remove old wallet implementation
- Remove unused dependencies
- Update documentation
- Deploy to production

## Additional Resources

- [Phantom React SDK Documentation](https://docs.phantom.app/react-sdk)
- [Phantom Portal](https://phantom.com/portal)
- [Phantom Connect Overview](https://docs.phantom.app/connect)
- [Example Applications](https://github.com/phantom-labs/connect-examples)

## Support

If you encounter issues during migration:

1. Check the [Phantom SDK documentation](https://docs.phantom.app)
2. Review the [example applications](https://github.com/phantom-labs/connect-examples)
3. Contact Phantom support through the Portal

---

**Note**: This migration maintains backward compatibility with your backend authentication system. The message signing and authentication flow remain the same, only the wallet connection method changes.


