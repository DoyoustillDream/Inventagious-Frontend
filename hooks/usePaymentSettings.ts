'use client';

import { useState, useEffect } from 'react';
import { getPaymentSettings, PaymentSettings } from '@/lib/api/payment-settings';

/**
 * Hook to get payment settings from backend
 * Automatically caches results for 5 minutes
 */
export function usePaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        setIsLoading(true);
        setError(null);
        const paymentSettings = await getPaymentSettings();
        if (mounted) {
          setSettings(paymentSettings);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load payment settings'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, isLoading, error };
}

