"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PhoneVerificationForm from "@/app/components/PhoneVerificationForm";

export default function VerifyPhonePage() {
  const router = useRouter();

  const handleComplete = () => {
    // Since we now collect passwords during registration, 
    // redirect to login after phone verification
    router.push("/auth/login");
  };

  return <PhoneVerificationForm onCompleteAction={handleComplete} />;
} 