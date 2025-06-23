import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency with commas
 * @param value Number to format
 * @returns Formatted string with commas (e.g. 1,000,000)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NG').format(value);
}
