"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProfileSavedModal from "@/app/components/ProfileSavedModal";
import { useRouter } from "next/navigation";
import { useFormValidator, validationRules } from "@/lib/formValidator";

interface BankAccountFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
}

export default function BankAccountForm({ onSave, allFormsCompleted, onGetLoan }: BankAccountFormProps) {
  const initialFormData = {
    bankName: "",
    accountNumber: "",
    accountName: ""
  };

  const [showSavedModal, setShowSavedModal] = useState(false);
  const router = useRouter();

  // Define validation rules for the form fields
  const rules = {
    bankName: validationRules.required,
    accountNumber: (value: string) => /^\d{10}$/.test(value),
    accountName: validationRules.required
  };

  // Use the form validator hook
  const {
    formData,
    showErrors,
    validations,
    handleChange,
    handleBlur,
    touchAllFields,
    isFormValid
  } = useFormValidator(initialFormData, rules);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to display errors
    touchAllFields();

    if (isFormValid() && onSave) {
      onSave(formData);
      setShowSavedModal(true);
    }
  };
  
  const handleCloseModal = () => {
    setShowSavedModal(false);
  };
  
  const handleViewProfile = () => {
    setShowSavedModal(false);
    router.push('/dashboard/profile');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Select 
                value={formData.bankName} 
                onValueChange={(value) => {
                  handleChange("bankName", value);
                  handleBlur("bankName");
                }}
              >
                <SelectTrigger 
                  id="bankName" 
                  className={`h-12 rounded-none bg-gray-50 ${showErrors.bankName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                >
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="access">Access Bank</SelectItem>
                  <SelectItem value="gtbank">GT Bank</SelectItem>
                  <SelectItem value="firstbank">First Bank</SelectItem>
                  <SelectItem value="zenith">Zenith Bank</SelectItem>
                  <SelectItem value="uba">UBA</SelectItem>
                  <SelectItem value="stanbic">Stanbic IBTC</SelectItem>
                  <SelectItem value="fcmb">FCMB</SelectItem>
                  <SelectItem value="sterling">Sterling Bank</SelectItem>
                </SelectContent>
              </Select>
              {showErrors.bankName && (
                <p className="text-xs text-red-500">Bank name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                onBlur={() => handleBlur("accountNumber")}
                placeholder="Enter account number"
                className={`h-12 rounded-none bg-gray-50 ${showErrors.accountNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.accountNumber && (
                <p className="text-xs text-red-500">Enter a valid 10-digit account number</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => handleChange("accountName", e.target.value)}
                onBlur={() => handleBlur("accountName")}
                placeholder="Enter account name"
                className={`h-12 rounded-none bg-gray-50 ${showErrors.accountName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.accountName && (
                <p className="text-xs text-red-500">Account name is required</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className={`h-12 px-16 rounded-none ${
              isFormValid() 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-red-300 cursor-not-allowed text-white"
            }`}
            disabled={!isFormValid()}
          >
            Save
          </Button>
        </div>
      </form>
      
      {showSavedModal && (
        <ProfileSavedModal 
          onClose={handleCloseModal}
          onStartInvesting={handleViewProfile}
          onGetLoan={onGetLoan}
          type={allFormsCompleted ? "loan" : "investment"}
        />
      )}
    </>
  );
}
