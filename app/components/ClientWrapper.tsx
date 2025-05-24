"use client";

import React from "react";
import ToastProvider from "@/app/components/ToastProvider";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
} 