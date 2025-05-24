import { useState, useCallback } from 'react';

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      // Check if the Clipboard API is available
      if ('clipboard' in navigator) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Failed to copy text: ', error);
      setIsCopied(false);
      return false;
    }
  }, []);

  return { copyToClipboard, isCopied };
}; 