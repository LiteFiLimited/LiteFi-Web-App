"use client";

import React, { useState, useEffect } from "react";
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
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToastContext } from '@/app/components/ToastProvider';

interface BankAccountFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  personalName?: string;
  businessName?: string;
  isReadOnly?: boolean;
}

// Define proper types for our form data
interface NairaBankFormData {
  bankType: "naira";
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface ForeignBankFormData {
  bankType: "foreign";
  accountName: string;
  accountNumber: string;
  swiftCode: string;
  bankName: string;
}

// Union type for form data based on bank type
type BankFormData = NairaBankFormData | ForeignBankFormData;

const NIGERIAN_BANKS = [
  { value: "access", label: "Access Bank" },
  { value: "gtbank", label: "GT Bank" },
  { value: "firstbank", label: "First Bank" },
  { value: "zenith", label: "Zenith Bank" },
  { value: "uba", label: "UBA" },
  { value: "stanbic", label: "Stanbic IBTC" },
  { value: "fcmb", label: "FCMB" },
  { value: "sterling", label: "Sterling Bank" },
  { value: "wema", label: "Wema Bank" },
  { value: "polaris", label: "Polaris Bank" },
  { value: "fidelity", label: "Fidelity Bank" },
  { value: "union", label: "Union Bank" },
  { value: "ecobank", label: "Ecobank" },
  { value: "keystone", label: "Keystone Bank" },
  { value: "heritage", label: "Heritage Bank" },
  { value: "providus", label: "Providus Bank" },
  { value: "globus", label: "Globus Bank" },
  { value: "titan", label: "Titan Trust Bank" }
];

export default function BankAccountForm({ 
  onSave, 
  allFormsCompleted, 
  onGetLoan,
  personalName = "",
  businessName = "",
  isReadOnly = false
}: BankAccountFormProps) {
  const [bankType, setBankType] = useState<"naira" | "foreign">("naira");
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { addBankAccount } = useUserProfile();
  const { error: showError } = useToastContext();
  
  const derivedAccountName = businessName || personalName || "";

  // Initial form data based on bank type
  const getNairaInitialFormData = (): NairaBankFormData => ({
    bankType: "naira",
    bankName: "",
    accountNumber: "",
    accountName: derivedAccountName || ""
  });
  
  const getForeignInitialFormData = (): ForeignBankFormData => ({
    bankType: "foreign",
    accountName: derivedAccountName || "",
    accountNumber: "",
    swiftCode: "",
    bankName: ""
  });

  // Initialize with naira form data
  const [formData, setFormData] = useState<BankFormData>(getNairaInitialFormData());
  const [showErrors, setShowErrors] = useState<Record<string, boolean>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Define validation rules based on bank type
  const getNairaValidationRules = () => ({
    bankName: (value: string) => !!value,
    accountNumber: (value: string) => /^\d{10}$/.test(value),
    accountName: (value: string) => !!value
  });
  
  const getForeignValidationRules = () => ({
    accountName: (value: string) => !!value,
    accountNumber: (value: string) => !!value,
    swiftCode: (value: string) => !!value,
    bankName: (value: string) => !!value
  });

  const validationRules = bankType === 'naira' 
    ? getNairaValidationRules() 
    : getForeignValidationRules();

  // Handle bank type change
  const handleBankTypeChange = (type: "naira" | "foreign") => {
    setBankType(type);
    const newFormData = type === 'naira' 
      ? getNairaInitialFormData() 
      : getForeignInitialFormData();
    setFormData(newFormData);
    setShowErrors({});
    setTouched({});
  };

  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    // Don't allow changing account name if it's derived from profile
    if (field === 'accountName' && derivedAccountName) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    } as BankFormData));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field);
  };

  const validateField = (field: string) => {
    if (!touched[field]) return;

    const rule = validationRules[field as keyof typeof validationRules];
    const value = (formData as any)[field] as string;
    
    setShowErrors(prev => ({
      ...prev,
      [field]: !rule(value)
    }));
  };

  const touchAllFields = () => {
    const allFields = Object.keys(validationRules);
    const newTouched: Record<string, boolean> = {};
    
    allFields.forEach(field => {
      newTouched[field] = true;
    });
    
    setTouched(prev => ({
      ...prev,
      ...newTouched
    }));

    allFields.forEach(validateField);
  };

  const isFormValid = () => {
    const allFields = Object.keys(validationRules);
    return allFields.every(field => {
      const rule = validationRules[field as keyof typeof validationRules];
      const value = (formData as any)[field] as string;
      return rule(value);
    });
  };

  // Update account name when personal or business name changes
  useEffect(() => {
    if (derivedAccountName) {
      setFormData(prev => ({ ...prev, accountName: derivedAccountName } as BankFormData));
    }
  }, [derivedAccountName]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    touchAllFields();

    if (!isFormValid()) {
      showError('Error', 'Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await addBankAccount(formData);
      if (success) {
        setShowSavedModal(true);
        if (onSave) {
          onSave(formData);
        }
      }
    } catch (error: any) {
      showError('Error', error.message || 'Failed to add bank account');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseModal = () => {
    setShowSavedModal(false);
  };
  
  const handleViewProfile = () => {
    setShowSavedModal(false);
    router.push('/dashboard/profile');
  };

  const isNairaAccount = (data: BankFormData): data is NairaBankFormData => {
    return data.bankType === "naira";
  };

  const isForeignAccount = (data: BankFormData): data is ForeignBankFormData => {
    return data.bankType === "foreign";
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-8">
          {/* Bank Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="bankType">Bank Type</Label>
            <Select 
              value={bankType} 
              onValueChange={(value) => handleBankTypeChange(value as "naira" | "foreign")}
              disabled={isReadOnly}
            >
              <SelectTrigger 
                id="bankType" 
                className="h-12 rounded-none bg-gray-50"
              >
                <SelectValue placeholder="Select bank type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="naira">Naira Account</SelectItem>
                <SelectItem value="foreign">Foreign Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Naira Account Fields */}
          {bankType === "naira" && isNairaAccount(formData) && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Select 
                    value={formData.bankName} 
                    onValueChange={(value) => {
                      handleChange("bankName", value);
                      handleBlur("bankName");
                    }}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger 
                      id="bankName" 
                      className={`h-12 rounded-none bg-gray-50 ${showErrors.bankName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_BANKS.map(bank => (
                        <SelectItem key={bank.value} value={bank.value}>
                          {bank.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showErrors.bankName && (
                    <p className="text-sm text-red-500">Please select a bank</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange("accountNumber", e.target.value)}
                    onBlur={() => handleBlur("accountNumber")}
                    className={`h-12 rounded-none bg-gray-50 ${showErrors.accountNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    placeholder="Enter 10-digit account number"
                    maxLength={10}
                    disabled={isReadOnly}
                  />
                  {showErrors.accountNumber && (
                    <p className="text-sm text-red-500">Please enter a valid 10-digit account number</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => handleChange("accountName", e.target.value)}
                  onBlur={() => handleBlur("accountName")}
                  className={`h-12 rounded-none ${derivedAccountName ? 'bg-gray-100' : 'bg-gray-50'} ${showErrors.accountName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="Enter account name"
                  disabled={!!derivedAccountName}
                />
                {showErrors.accountName && (
                  <p className="text-sm text-red-500">Please enter the account name</p>
                )}
                {derivedAccountName && (
                  <p className="text-xs text-gray-500">Account name is automatically populated from your profile</p>
                )}
              </div>
            </div>
          )}

          {/* Foreign Account Fields */}
          {bankType === "foreign" && isForeignAccount(formData) && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                    onBlur={() => handleBlur("bankName")}
                    className={`h-12 rounded-none bg-gray-50 ${showErrors.bankName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    placeholder="Enter bank name"
                    disabled={isReadOnly}
                  />
                  {showErrors.bankName && (
                    <p className="text-sm text-red-500">Please enter the bank name</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                  <Input
                    id="swiftCode"
                    type="text"
                    value={formData.swiftCode}
                    onChange={(e) => handleChange("swiftCode", e.target.value)}
                    onBlur={() => handleBlur("swiftCode")}
                    className={`h-12 rounded-none bg-gray-50 ${showErrors.swiftCode ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    placeholder="Enter SWIFT/BIC code"
                    disabled={isReadOnly}
                  />
                  {showErrors.swiftCode && (
                    <p className="text-sm text-red-500">Please enter the SWIFT/BIC code</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number/IBAN</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange("accountNumber", e.target.value)}
                    onBlur={() => handleBlur("accountNumber")}
                    className={`h-12 rounded-none bg-gray-50 ${showErrors.accountNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    placeholder="Enter account number or IBAN"
                    disabled={isReadOnly}
                  />
                  {showErrors.accountNumber && (
                    <p className="text-sm text-red-500">Please enter the account number or IBAN</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => handleChange("accountName", e.target.value)}
                    onBlur={() => handleBlur("accountName")}
                    className={`h-12 rounded-none ${derivedAccountName ? 'bg-gray-100' : 'bg-gray-50'} ${showErrors.accountName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    placeholder="Enter account name"
                    disabled={!!derivedAccountName}
                  />
                  {showErrors.accountName && (
                    <p className="text-sm text-red-500">Please enter the account name</p>
                  )}
                  {derivedAccountName && (
                    <p className="text-xs text-gray-500">Account name is automatically populated from your profile</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className={`h-12 px-16 rounded-none ${
              isFormValid() && !isSubmitting && !isReadOnly
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-red-300 cursor-not-allowed text-white"
            }`}
            disabled={!isFormValid() || isSubmitting || isReadOnly}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>

      {showSavedModal && (
        <ProfileSavedModal
          open={showSavedModal}
          onClose={handleCloseModal}
          onViewProfile={handleViewProfile}
          allFormsCompleted={allFormsCompleted}
          onGetLoan={onGetLoan}
        />
      )}
    </>
  );
}
