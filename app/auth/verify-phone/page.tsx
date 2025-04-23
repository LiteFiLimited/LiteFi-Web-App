"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PhoneVerificationForm from "@/app/components/PhoneVerificationForm";

export default function VerifyPhonePage() {
  const router = useRouter();
  
  const handleComplete = () => {
    // This would be called after phone verification is complete
    // Navigate to the next step (create password)
    router.push("/auth/create-password");
  };

  return <PhoneVerificationForm onComplete={handleComplete} />;
} 