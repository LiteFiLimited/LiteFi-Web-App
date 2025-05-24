"use client";

import React from "react";
import Image from "next/image";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyButtonProps {
  textToCopy: string;
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: string) => void;
  className?: string;
  iconSize?: number;
}

export default function CopyButton({ 
  textToCopy, 
  onCopySuccess, 
  onCopyError, 
  className = "",
  iconSize = 16 
}: CopyButtonProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const handleCopy = async () => {
    const success = await copyToClipboard(textToCopy);
    
    if (success) {
      onCopySuccess?.(textToCopy);
    } else {
      onCopyError?.("Failed to copy to clipboard");
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={`hover:opacity-70 transition-opacity ${className}`}
      title={isCopied ? "Copied!" : "Copy to clipboard"}
    >
      <Image
        src="/assets/svgs/copy.svg"
        alt={isCopied ? "Copied" : "Copy"}
        width={iconSize}
        height={iconSize}
        className={isCopied ? "opacity-50" : ""}
      />
    </button>
  );
} 