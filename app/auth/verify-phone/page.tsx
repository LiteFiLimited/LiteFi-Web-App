"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PhoneVerificationForm from "@/app/components/PhoneVerificationForm";

export default function VerifyPhonePage() {
  const router = useRouter();

  const handleComplete = () => {
    // Redirect to create password after phone verification
    router.push("/auth/create-password");
  };

  return <PhoneVerificationForm onCompleteAction={handleComplete} />;
} 