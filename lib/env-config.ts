/**
 * Environment Configuration Validation
 *
 * This file validates that all required environment variables are set
 * and provides secure access to them without exposing fallback URLs.
 */

// Validate required environment variables
const validateEnvVars = () => {
  const requiredVars = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
  };

  const missing: string[] = [];

  // Check if at least one API URL is configured
  if (!requiredVars.NEXT_PUBLIC_API_URL && !requiredVars.BACKEND_API_URL) {
    missing.push("NEXT_PUBLIC_API_URL or BACKEND_API_URL");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please set these in your .env file or deployment environment."
    );
  }
};

// Validate on module load
validateEnvVars();

// Export validated environment variables
export const ENV = {
  API_URL:
    process.env.NEXT_PUBLIC_API_URL || (process.env.BACKEND_API_URL as string),
  NODE_ENV: process.env.NODE_ENV,
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

// Helper function to get API URL with validation
export const getApiUrl = (): string => {
  // Force localhost:3000 in development
  if (process.env.NODE_ENV === "development") {
    return "https://litefi-backend-741585839791.us-central1.run.app";
  }

  if (!ENV.API_URL) {
    throw new Error(
      "API URL not configured. Please set NEXT_PUBLIC_API_URL or BACKEND_API_URL environment variable."
    );
  }
  return ENV.API_URL;
};

// Log configuration status (without exposing sensitive URLs in production)
if (ENV.NODE_ENV !== "production") {
  console.log("Environment Configuration:", {
    hasApiUrl: !!ENV.API_URL,
    environment: ENV.NODE_ENV,
    forcedApiUrl: process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined
  });
}
