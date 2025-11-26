'use client';

import { useWalletAuth } from '@/hooks/useWalletAuth';

/**
 * Component to initialize wallet authentication
 * Automatically authenticates with backend when wallet connects
 */
export default function WalletAuthInitializer() {
  // This hook automatically handles wallet authentication
  useWalletAuth();
  return null;
}

