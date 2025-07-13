import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency with commas
 * @param value Number to format
 * @returns Formatted string with commas (e.g. 1,000,000)
 */
export function formatCurrency(value: number | string): string {
  // Convert string to number if needed
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Check for invalid input
  if (typeof numValue !== "number" || isNaN(numValue)) {
    return "0";
  }

  try {
    // Use Intl.NumberFormat with fallback
    if (typeof Intl !== "undefined" && Intl.NumberFormat) {
      return new Intl.NumberFormat("en-NG").format(numValue);
    } else {
      // Fallback implementation
      return numValue.toLocaleString("en-US");
    }
  } catch (error) {
    console.warn(
      "formatCurrency: Intl.NumberFormat failed, using fallback:",
      error
    );
    // Manual fallback for worst case
    return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

/**
 * Transform avatar URL from legacy CDN to Google Cloud Storage format
 * @param avatarUrl - The original avatar URL
 * @returns Transformed URL for Google Cloud Storage
 */
export function transformAvatarUrl(avatarUrl?: string): string | undefined {
  if (!avatarUrl) return undefined;

  // Check if it's a legacy CDN URL and transform it
  if (avatarUrl.includes("https://cdn.litefi.ng/uploads/")) {
    return avatarUrl.replace(
      "https://cdn.litefi.ng/uploads/",
      "https://storage.googleapis.com/litefi-uploads/"
    );
  }

  // Return the URL as-is if it's already in the correct format
  return avatarUrl;
}

// Default export for better compatibility
export default {
  cn,
  formatCurrency,
  transformAvatarUrl,
};
