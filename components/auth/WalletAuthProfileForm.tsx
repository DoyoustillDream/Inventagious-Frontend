'use client';

import { useWalletAuth } from '@/hooks/useWalletAuth';
import CompleteProfileForm from '@/components/auth/CompleteProfileForm';

/**
 * Component to render profile completion form when needed
 */
export default function WalletAuthProfileForm() {
  const { showProfileForm, pendingWalletAddress, handleProfileComplete, handleProfileCancel } = useWalletAuth();

  if (!showProfileForm || !pendingWalletAddress) {
    return null;
  }

  return (
    <CompleteProfileForm
      walletAddress={pendingWalletAddress}
      onComplete={handleProfileComplete}
      onCancel={handleProfileCancel}
    />
  );
}

