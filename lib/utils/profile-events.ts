/**
 * Utility functions for profile-related events
 */

/**
 * Dispatches a custom event to notify components that the profile has been updated
 * This allows components like UserMenu to refresh their profile data
 */
export function dispatchProfileUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('profile-updated'));
  }
}

