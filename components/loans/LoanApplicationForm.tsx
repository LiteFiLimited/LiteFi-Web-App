import { useState, FormEvent, ChangeEvent } from 'react';
import axiosInstance from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToastContext } from '@/app/components/ToastProvider';
import { useRouter } from 'next/navigation';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

interface LoanApplicationFormProps {
  productId: string;
  loanType: string;
  maxAmount: number;
  minAmount?: number;
  maxDuration?: number;
  minDuration?: number;
}

export function LoanApplicationForm({
  productId,
  loanType,
  maxAmount,
  minAmount = 5000,
  maxDuration = 60,
  minDuration = 1
}: LoanApplicationFormProps) {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToastContext();
  const router = useRouter();

  // Format amount as currency
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Remove all non-numeric characters
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    // Format with commas
    if (value) {
      const formattedValue = parseInt(value).toLocaleString();
      setAmount(formattedValue);
    } else {
      setAmount('');
    }
  };

  // Convert formatted amount back to number
  const getAmountAsNumber = (): number => {
    return parseInt(amount.replace(/,/g, '')) || 0;
  };

  const validateForm = (): boolean => {
    const amountValue = getAmountAsNumber();
    const durationValue = parseInt(duration);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      showError("Invalid Amount", "Please enter a valid loan amount");
      return false;
    }
    
    if (amountValue < minAmount) {
      showError("Amount Too Low", `Minimum loan amount is ₦${minAmount.toLocaleString()}`);
      return false;
    }
    
    if (amountValue > maxAmount) {
      showError("Amount Too High", `Maximum loan amount is ₦${maxAmount.toLocaleString()}`);
      return false;
    }
    
    if (isNaN(durationValue) || durationValue <= 0) {
      showError("Invalid Duration", "Please select a valid loan duration");
      return false;
    }
    
    if (durationValue < minDuration || durationValue > maxDuration) {
      showError("Invalid Duration", `Loan duration must be between ${minDuration} and ${maxDuration} months`);
      return false;
    }
    
    if (!purpose.trim()) {
      showError("Purpose Required", "Please provide the purpose for this loan");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const loanData = {
        productId,
        amount: getAmountAsNumber(),
        duration: parseInt(duration),
        purpose
      };
      
      // Determine which API endpoint to use based on loan type
      let response;
      switch(loanType.toLowerCase()) {
        case 'salary':
          response = await axiosInstance.post('/loans/salary', loanData);
          break;
        case 'working_capital':
        case 'working-capital':
          response = await axiosInstance.post('/loans/working-capital', loanData);
          break;
        case 'auto':
          response = await axiosInstance.post('/loans/auto', loanData);
          break;
        case 'travel':
          response = await axiosInstance.post('/loans/travel', loanData);
          break;
        default:
          throw new Error('Invalid loan type');
      }
      
      if (response.data.success) {
        success("Application Submitted", "Your loan application has been submitted successfully");
        
        // Redirect to loans page after short delay
        setTimeout(() => {
          router.push('/dashboard/loans');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to submit loan application');
      }
    } catch (error: any) {
      showError("Application Failed", error.message || "Failed to submit loan application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount you want to borrow</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">₦</span>
            </div>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`Enter amount (up to ₦${maxAmount.toLocaleString()})`}
              className="pl-8 h-12 rounded-none"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500">
            Min: ₦{minAmount.toLocaleString()} | Max: ₦{maxAmount.toLocaleString()}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Loan Duration (months)</Label>
          <Select 
            value={duration}
            onValueChange={setDuration}
            disabled={isLoading}
          >
            <SelectTrigger className="h-12 rounded-none">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: maxDuration}, (_, i) => i + 1)
                .filter(num => num >= minDuration)
                .map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'month' : 'months'}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose of Loan</Label>
        <textarea
          id="purpose"
          value={purpose}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPurpose(e.target.value)}
          placeholder="Explain why you need this loan"
          className="w-full min-h-[100px] rounded-none border border-input bg-transparent px-3 py-2 text-sm"
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-none text-sm font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Submit Application"}
      </Button>
    </form>
  );
}
