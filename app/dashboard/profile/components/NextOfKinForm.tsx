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
import { NextOfKinInfo } from "@/types/user";

interface NextOfKinFormProps {
  onSave?: (data: NextOfKinInfo) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

const RELATIONSHIPS = [
  "SPOUSE",
  "PARENT",
  "CHILD",
  "SIBLING",
  "UNCLE",
  "AUNT",
  "COUSIN",
  "FRIEND",
  "OTHER"
] as const;

export default function NextOfKinForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: NextOfKinFormProps) {
  const { profile, isLoading, updateNextOfKin } = useUserProfile();
  const router = useRouter();

  const initialFormData: NextOfKinInfo = {
    firstName: profile?.nextOfKin?.firstName || "",
    lastName: profile?.nextOfKin?.lastName || "",
    relationship: profile?.nextOfKin?.relationship || "",
    phone: profile?.nextOfKin?.phone || "",
    email: profile?.nextOfKin?.email || "",
    address: profile?.nextOfKin?.address || ""
  };

  const rules = {
    firstName: validationRules.required,
    lastName: validationRules.required,
    relationship: validationRules.required,
    phone: validationRules.phone,
    email: validationRules.email,
    address: validationRules.required
  };

  const {
    formData,
    showErrors,
    handleChange,
    handleBlur,
    touchAllFields,
    isFormValid
  } = useFormValidator<NextOfKinInfo>(initialFormData, rules);

  const [showSavedModal, setShowSavedModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAllFields();

    if (isFormValid()) {
      const nextOfKinData: NextOfKinInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        relationship: formData.relationship,
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      };

      const success = await updateNextOfKin(nextOfKinData);
      if (success) {
        setShowSavedModal(true);
        if (onSave) {
          onSave(nextOfKinData);
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
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            disabled={isReadOnly}
            className="h-12 rounded-none"
          />
          {showErrors.firstName && (
            <span className="text-red-500 text-sm">First name is required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            disabled={isReadOnly}
            className="h-12 rounded-none"
          />
          {showErrors.lastName && (
            <span className="text-red-500 text-sm">Last name is required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">Relationship</Label>
          <Select
            value={formData.relationship}
            onValueChange={(value) => handleChange('relationship', value)}
            disabled={isReadOnly}
          >
            <SelectTrigger id="relationship" className="w-full h-12 rounded-none">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIPS.map((rel) => (
                <SelectItem key={rel} value={rel}>
                  {rel.charAt(0) + rel.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showErrors.relationship && (
            <span className="text-red-500 text-sm">Relationship is required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            disabled={isReadOnly}
            className="h-12 rounded-none"
          />
          {showErrors.phone && (
            <span className="text-red-500 text-sm">Please enter a valid phone number</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            disabled={isReadOnly}
            className="h-12 rounded-none"
          />
          {showErrors.email && (
            <span className="text-red-500 text-sm">Please enter a valid email address</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
            disabled={isReadOnly}
            className="h-12 rounded-none"
          />
          {showErrors.address && (
            <span className="text-red-500 text-sm">Address is required</span>
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
