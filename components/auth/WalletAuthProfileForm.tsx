'use client';

import { useWalletAuth } from '@/hooks/useWalletAuth';
import CompleteProfileForm from '@/components/auth/CompleteProfileForm';

/**
 * Component to render profile completion form when needed
 */
export default function WalletAuthProfileForm() {
  const { showProfileForm, pendingWalletAddress, handleProfileComplete, handleProfileCancel } = useWalletAuth();

  // Debug logging
  console.log('[WalletAuthProfileForm] State:', {
    showProfileForm,
    pendingWalletAddress,
    hasAddress: !!pendingWalletAddress,
  });

  if (!showProfileForm || !pendingWalletAddress) {
    console.log('[WalletAuthProfileForm] Not showing form - showProfileForm:', showProfileForm, 'pendingWalletAddress:', pendingWalletAddress);
    return null;
  }

  console.log('[WalletAuthProfileForm] Rendering CompleteProfileForm');

  return (
    <CompleteProfileForm
      walletAddress={pendingWalletAddress}
      onComplete={handleProfileComplete}
      onCancel={handleProfileCancel}
    />
  );
}

