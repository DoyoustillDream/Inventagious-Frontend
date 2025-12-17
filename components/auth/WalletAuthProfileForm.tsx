'use client';

import { useWalletAuth } from '@/hooks/useWalletAuth';
import CompleteProfileForm from '@/components/auth/CompleteProfileForm';

/**
 * Component to render profile completion form when needed
 */
export default function WalletAuthProfileForm() {
  const { showProfileForm, pendingWalletAddress, oauthUser, handleProfileComplete, handleProfileCancel } = useWalletAuth();

  // Debug logging
  console.log('[WalletAuthProfileForm] State:', {
    showProfileForm,
    pendingWalletAddress,
    hasAddress: !!pendingWalletAddress,
    oauthUser,
  });

  if (!showProfileForm || !pendingWalletAddress) {
    console.log('[WalletAuthProfileForm] Not showing form - showProfileForm:', showProfileForm, 'pendingWalletAddress:', pendingWalletAddress);
    return null;
  }

  // Note: Phantom SDK doesn't expose OAuth user email/name in the user object
  // The user object only contains wallet connection info (walletId, addresses, authProvider, etc.)
  // OAuth profile data (email/name) is not available through Phantom SDK
  // Users will need to manually enter their email/name in the profile form
  const oauthData = null; // Phantom SDK doesn't provide OAuth profile data

  return (
    <CompleteProfileForm
      walletAddress={pendingWalletAddress}
      onComplete={handleProfileComplete}
      onCancel={handleProfileCancel}
      oauthUser={oauthData}
    />
  );
}

