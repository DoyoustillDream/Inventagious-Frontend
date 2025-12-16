'use client';

import WalletAuthProfileForm from '@/components/auth/WalletAuthProfileForm';

/**
 * Component to initialize wallet authentication
 * Renders profile completion form when needed
 */
export default function WalletAuthInitializer() {
  // Just render the profile form - authentication is handled by WalletConnect component
  return <WalletAuthProfileForm />;
}

