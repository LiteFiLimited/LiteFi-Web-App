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
import ProfileSavedModal from "@/app/components/ProfileSavedModal";
import { useRouter } from "next/navigation";
import { useFormValidator, validationRules } from "@/lib/formValidator";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { BusinessInfo } from "@/types/user";

interface BusinessInfoFormProps {
  onSave?: (data: BusinessInfo) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

const BUSINESS_TYPES = [
  "SOLE_PROPRIETORSHIP",
  "PARTNERSHIP",
  "LIMITED_LIABILITY",
  "CORPORATION",
  "FREELANCE",
  "OTHER"
] as const;

export default function BusinessInfoForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: BusinessInfoFormProps) {
  const { profile, isLoading, updateBusiness } = useUserProfile();
  const router = useRouter();

  const initialFormData: BusinessInfo = {
    businessName: profile?.business?.businessName || "",
    businessType: profile?.business?.businessType || "",
    businessAddress: profile?.business?.businessAddress || "",
    registrationNumber: profile?.business?.registrationNumber || "",
    monthlyRevenue: profile?.business?.monthlyRevenue || 0,
    yearEstablished: profile?.business?.yearEstablished || "",
    businessEmail: profile?.business?.businessEmail || "",
    businessPhone: profile?.business?.businessPhone || ""
  };

  const rules = {
    businessName: validationRules.required,
    businessType: validationRules.required,
    businessAddress: validationRules.required,
    registrationNumber: () => true, // Optional
    monthlyRevenue: (value: number) => value > 0,
    yearEstablished: validationRules.required,
    businessEmail: validationRules.email,
    businessPhone: validationRules.phone
  };

  const {
    formData,
    showErrors,
    handleChange,
    handleBlur,
    touchAllFields,
    isFormValid
  } = useFormValidator<BusinessInfo>(initialFormData, rules);

  const [showSavedModal, setShowSavedModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAllFields();

    if (isFormValid()) {
      const businessData: BusinessInfo = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress,
        registrationNumber: formData.registrationNumber,
        monthlyRevenue: Number(formData.monthlyRevenue),
        yearEstablished: formData.yearEstablished,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone
      };

      const success = await updateBusiness(businessData);
      if (success) {
        setShowSavedModal(true);
        if (onSave) {
          onSave(businessData);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            onBlur={() => handleBlur('businessName')}
            disabled={isReadOnly}
          />
          {showErrors.businessName && (
            <span className="text-red-500 text-sm">Business name is required</span>
          )}
        </div>

        <div>
          <Label htmlFor="businessType">Business Type</Label>
          <Select
            value={formData.businessType}
            onValueChange={(value) => handleChange('businessType', value)}
            disabled={isReadOnly}
          >
            <SelectTrigger id="businessType" className="w-full">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showErrors.businessType && (
            <span className="text-red-500 text-sm">Business type is required</span>
          )}
        </div>

        <div>
          <Label htmlFor="businessAddress">Business Address</Label>
          <Input
            id="businessAddress"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={(e) => handleChange('businessAddress', e.target.value)}
            onBlur={() => handleBlur('businessAddress')}
            disabled={isReadOnly}
          />
          {showErrors.businessAddress && (
            <span className="text-red-500 text-sm">Business address is required</span>
          )}
        </div>

        <div>
          <Label htmlFor="registrationNumber">Registration Number (Optional)</Label>
          <Input
            id="registrationNumber"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={(e) => handleChange('registrationNumber', e.target.value)}
            onBlur={() => handleBlur('registrationNumber')}
            disabled={isReadOnly}
          />
        </div>

        <div>
          <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
          <Input
            id="monthlyRevenue"
            name="monthlyRevenue"
            type="number"
            value={formData.monthlyRevenue}
            onChange={(e) => handleChange('monthlyRevenue', Number(e.target.value))}
            onBlur={() => handleBlur('monthlyRevenue')}
            disabled={isReadOnly}
          />
          {showErrors.monthlyRevenue && (
            <span className="text-red-500 text-sm">Monthly revenue must be greater than 0</span>
          )}
        </div>

        <div>
          <Label htmlFor="yearEstablished">Year Established</Label>
          <Input
            id="yearEstablished"
            name="yearEstablished"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.yearEstablished}
            onChange={(e) => handleChange('yearEstablished', e.target.value)}
            onBlur={() => handleBlur('yearEstablished')}
            disabled={isReadOnly}
          />
          {showErrors.yearEstablished && (
            <span className="text-red-500 text-sm">Year established is required</span>
          )}
        </div>

        <div>
          <Label htmlFor="businessEmail">Business Email</Label>
          <Input
            id="businessEmail"
            name="businessEmail"
            type="email"
            value={formData.businessEmail}
            onChange={(e) => handleChange('businessEmail', e.target.value)}
            onBlur={() => handleBlur('businessEmail')}
            disabled={isReadOnly}
          />
          {showErrors.businessEmail && (
            <span className="text-red-500 text-sm">Please enter a valid business email address</span>
          )}
        </div>

        <div>
          <Label htmlFor="businessPhone">Business Phone</Label>
          <Input
            id="businessPhone"
            name="businessPhone"
            value={formData.businessPhone}
            onChange={(e) => handleChange('businessPhone', e.target.value)}
            onBlur={() => handleBlur('businessPhone')}
            disabled={isReadOnly}
          />
          {showErrors.businessPhone && (
            <span className="text-red-500 text-sm">Please enter a valid business phone number</span>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {!isReadOnly && (
          <Button type="submit" className="bg-red-600 text-white">
            Save Changes
          </Button>
        )}
        {allFormsCompleted && onGetLoan && (
          <Button type="button" onClick={onGetLoan} className="bg-green-600 text-white">
            Get Loan
          </Button>
        )}
      </div>

      {showSavedModal && (
        <ProfileSavedModal
          onClose={() => setShowSavedModal(false)}
          onGetLoan={onGetLoan}
          type="loan"
        />
      )}
    </form>
  );
} 