'use client';

import { useEffect } from 'react';
import { initializeProgramIds } from '@/lib/solana/program-ids';

/**
 * Component that initializes Solana program IDs from backend
 * This should be included early in the app lifecycle
 */
export default function ProgramIdsInitializer() {
  useEffect(() => {
    // Initialize program IDs on mount
    initializeProgramIds().catch((error) => {
      console.error('Failed to initialize program IDs:', error);
    });
  }, []);

  // This component doesn't render anything
  return null;
}

