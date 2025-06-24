"use client";

import React from "react";
import ToastProvider from "@/app/components/ToastProvider";
import { EligibilityProvider } from "@/app/components/EligibilityProvider";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ToastProvider>
      <EligibilityProvider>
        {children}
      </EligibilityProvider>
    </ToastProvider>
  );
} 