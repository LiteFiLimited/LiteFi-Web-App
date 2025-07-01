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
