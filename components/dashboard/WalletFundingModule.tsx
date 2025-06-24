import { useState } from 'react';
import { walletApi } from '@/lib/walletApi';
import { useToastContext } from '@/app/components/ToastProvider';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface WalletFundingModuleProps {
  className?: string;
  buttonClassName?: string;
  buttonText?: string;
  redirectPath?: string;
  amount?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  variant?: 'default' | 'secondary' | 'outline';
}

export function WalletFundingModule({
  className = '',
  buttonClassName = '',
  buttonText = 'Fund with Mono',
  redirectPath,
  amount = 1000000, // Default 10,000 NGN in kobo
  onSuccess,
  onError,
  variant = 'default',
}: WalletFundingModuleProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error, info } = useToastContext();
  const router = useRouter();

  const handleFundWallet = async () => {
    setIsLoading(true);
    try {
      info("Initializing payment", "Please wait...");
      
      // Call the API to initiate Mono payment
      const response = await walletApi.initiateMonoPayment(amount);
      
      if (response.success && response.data.paymentLink) {
        success("Payment initialized", "Redirecting to Mono for secure payment");
        
        if (onSuccess) {
          onSuccess();
        }
        
        // If a redirect path is specified, go there after completing Mono payment
        // Store the redirect path in localStorage for the webhook response to use
        if (redirectPath) {
          localStorage.setItem('monoPaymentRedirectPath', redirectPath);
        }
        
        // Redirect to Mono payment page after short delay
        setTimeout(() => {
          window.location.href = response.data.paymentLink;
        }, 1000);
      } else {
        error("Payment initialization failed", response.message || "Please try again later");
        if (onError) {
          onError(new Error(response.message || "Payment initialization failed"));
        }
      }
    } catch (err: any) {
      error("Payment initialization failed", err.message || "An unexpected error occurred. Please try again later.");
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        onClick={handleFundWallet}
        disabled={isLoading}
        variant={variant}
        className={`${buttonClassName} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Initializing...' : buttonText}
      </Button>
    </div>
  );
}
