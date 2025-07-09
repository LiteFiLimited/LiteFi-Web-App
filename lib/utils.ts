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
export const formatCurrency = (value: number): string => {
  if (typeof value !== "number" || isNaN(value)) {
    return "0";
  }
  try {
    return new Intl.NumberFormat("en-NG").format(value);
  } catch (error) {
    // Fallback for potential Intl issues
    return value.toLocaleString("en-US");
  }
};

/**
 * Transform avatar URL from legacy CDN to Google Cloud Storage format
 * @param avatarUrl - The original avatar URL
 * @returns Transformed URL for Google Cloud Storage
 */
export const transformAvatarUrl = (avatarUrl?: string): string | undefined => {
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
};
