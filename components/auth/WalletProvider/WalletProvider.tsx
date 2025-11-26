'use client';

import { ReactNode } from 'react';

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  // Simple passthrough - no SDK functionality
  return <>{children}</>;
}
