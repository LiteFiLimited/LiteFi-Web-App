import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Initialize the Outfit font
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LiteFi - Financial Services",
  description: "Fast track to financial freedom",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className={`min-h-screen bg-background ${outfit.className}`}>{children}</body>
    </html>
  );
} 