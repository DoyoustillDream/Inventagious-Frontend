'use client';

import { useWalletAuth } from '@/hooks/useWalletAuth';
import WalletAuthProfileForm from '@/components/auth/WalletAuthProfileForm';

/**
 * Component to initialize wallet authentication
 * Automatically authenticates with backend when wallet connects
 */
export default function WalletAuthInitializer() {
  // This hook automatically handles wallet authentication
  useWalletAuth();
  
  // Render profile completion form when needed
  return <WalletAuthProfileForm />;
}

