import { darkTheme, lightTheme, type PhantomTheme } from "@phantom/react-sdk";

/**
 * Custom Phantom theme matching Inventagious brand colors
 * Uses yellow (#FFEB3B) as brand color with black/white aesthetic
 */

// Light theme - matches app's light mode
export const inventagiousLightTheme = {
  background: "#ffffff",           // White background
  text: "#171717",                 // Dark text (matches --foreground in light mode)
  secondary: "#98979C",            // Gray for secondary text, borders, dividers
  brand: "#FFEB3B",                // Bright yellow brand color
  error: "#ff4444",                // Error state color
  success: "#27c93f",              // Success state color (matches browser green dot)
  borderRadius: "8px",             // Matches app's border radius
  overlay: "rgba(0, 0, 0, 0.6)",   // Semi-transparent overlay
} as const satisfies Partial<PhantomTheme>;

// Dark theme - matches app's dark mode
export const inventagiousDarkTheme = {
  background: "#0a0a0a",           // Dark background (matches --background in dark mode)
  text: "#ededed",                 // Light text (matches --foreground in dark mode)
  secondary: "#98979C",            // Gray for secondary text, borders, dividers
  brand: "#FFEB3B",                // Bright yellow brand color (same in both modes)
  error: "#ff4444",                // Error state color
  success: "#27c93f",              // Success state color
  borderRadius: "8px",             // Matches app's border radius
  overlay: "rgba(0, 0, 0, 0.8)",   // Darker overlay for dark mode
} as const satisfies Partial<PhantomTheme>;

/**
 * Get the appropriate theme based on system preference
 * Falls back to dark theme if unable to detect
 */
export function getPhantomTheme(): Partial<PhantomTheme> {
  if (typeof window === "undefined") {
    // Server-side: default to dark
    return inventagiousDarkTheme;
  }

  // Check system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? inventagiousDarkTheme : inventagiousLightTheme;
}

/**
 * Default export - uses system preference
 * This is the theme used by PhantomProviderWrapper
 */
export const phantomTheme = getPhantomTheme();

