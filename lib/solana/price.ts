import { apiClient } from '@/lib/api/client';

interface PriceCache {
  price: number;
  timestamp: number;
}

let priceCache: PriceCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get current Solana price in USD
 * Uses cached value if available and fresh
 */
export async function getSolanaPrice(): Promise<number> {
  // Return cached price if still valid
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
    return priceCache.price;
  }

  try {
    const data = await apiClient.get<{ price: number; currency: string }>('/solana/price');
    const price = data?.price;

    if (!price || typeof price !== 'number' || price <= 0) {
      throw new Error('Invalid price data from API');
    }

    // Update cache
    priceCache = {
      price,
      timestamp: Date.now(),
    };

    return price;
  } catch (error) {
    // Return cached price if available (even if expired)
    if (priceCache) {
      console.warn('Failed to fetch fresh Solana price, using cached value:', error);
      return priceCache.price;
    }

    // If no cache exists, throw error
    throw new Error('Solana price not available and no cached price found. Please try again later.');
  }
}

/**
 * Convert USD amount to SOL
 */
export async function usdToSol(usdAmount: number): Promise<number> {
  if (usdAmount <= 0) {
    return 0;
  }

  const price = await getSolanaPrice();
  return usdAmount / price;
}

/**
 * Convert SOL amount to USD
 */
export async function solToUsd(solAmount: number): Promise<number> {
  if (solAmount <= 0) {
    return 0;
  }

  const price = await getSolanaPrice();
  return solAmount * price;
}

/**
 * Clear the price cache (useful for testing)
 */
export function clearPriceCache(): void {
  priceCache = null;
}

