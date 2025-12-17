import { AddressType } from "@phantom/browser-sdk";

// Get redirect URL - use environment variable or default to localhost for development
const getRedirectUrl = () => {
  if (process.env.NEXT_PUBLIC_PHANTOM_REDIRECT_URL) {
    return process.env.NEXT_PUBLIC_PHANTOM_REDIRECT_URL;
  }
  // Default to localhost for development
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }
  // Server-side fallback
  return "http://localhost:3000/auth/callback";
};

export const phantomConfig = {
  providers: ["google", "apple", "injected", "deeplink"] as ("google" | "apple" | "injected" | "deeplink")[],
  appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID || "",
  addressTypes: [AddressType.solana] as AddressType[],
  authOptions: {
    redirectUrl: getRedirectUrl(),
  },
};

// Validate configuration (only log warning in browser to avoid server-side noise)
if (typeof window !== "undefined" && !phantomConfig.appId) {
  console.warn("Phantom App ID is not set. Please set NEXT_PUBLIC_PHANTOM_APP_ID in your .env file");
}

