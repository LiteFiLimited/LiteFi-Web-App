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
import ProfileSavedModal from "@/app/components/ProfileSavedModal";
import { useRouter } from "next/navigation";
import { useFormValidator, validationRules } from "@/lib/formValidator";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { NextOfKinInfo } from "@/types/user";
import { Loader2 } from "lucide-react";

interface NextOfKinFormProps {
  onSave?: (data: NextOfKinInfo) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

// Updated relationship options from API documentation
const RELATIONSHIPS = [
  "HUSBAND",
  "WIFE",
  "FATHER",
  "MOTHER",
  "BROTHER",
  "SISTER",
  "SON",
  "DAUGHTER",
  "OTHER_RELATIVE",
  "FRIEND"
] as const;

// Mapping for display labels
const RELATIONSHIP_LABELS: Record<string, string> = {
  HUSBAND: "Spouse (Husband)",
  WIFE: "Spouse (Wife)",
  FATHER: "Father",
  MOTHER: "Mother",
  BROTHER: "Brother",
  SISTER: "Sister",
  SON: "Son",
  DAUGHTER: "Daughter",
  OTHER_RELATIVE: "Other Relative",
  FRIEND: "Friend"
};

export default function NextOfKinForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: NextOfKinFormProps) {
  const { profile, isLoading: profileLoading, updateNextOfKin, fetchProfile } = useUserProfile();
  const router = useRouter();
  const [formReadOnly, setFormReadOnly] = useState(isReadOnly);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData: NextOfKinInfo = {
    firstName: "",
    lastName: "",
    relationship: "",
    phone: "",
    email: "",
    address: ""
  };

  const rules = {
    firstName: validationRules.required,
    lastName: validationRules.required,
    relationship: validationRules.required,
    phone: validationRules.phone,
    email: validationRules.optionalEmail, // Email is optional for next of kin
    address: validationRules.required
  };

  const {
    formData,
    setFormData,
    showErrors,
    handleChange,
    handleBlur,
    touchAllFields,
    isFormValid
  } = useFormValidator<NextOfKinInfo>(initialFormData, rules);

  const [showSavedModal, setShowSavedModal] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile?.nextOfKin) {
      const nextOfKin = profile.nextOfKin;
      setFormData({
        firstName: nextOfKin.firstName || "",
        lastName: nextOfKin.lastName || "",
        relationship: nextOfKin.relationship || "",
        phone: nextOfKin.phone || "",
        email: nextOfKin.email || "",
        address: nextOfKin.address || ""
      });
      
      // If next of kin data exists and is complete, set form to read-only
      if (nextOfKin.firstName && nextOfKin.lastName && nextOfKin.relationship) {
        setFormReadOnly(true);
      }
    }
  }, [profile, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAllFields();

    if (isFormValid()) {
      setIsSubmitting(true);
      const nextOfKinData: NextOfKinInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        relationship: formData.relationship,
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      };

      try {
      const success = await updateNextOfKin(nextOfKinData);
      if (success) {
        setShowSavedModal(true);
          setFormReadOnly(true); // Set form to read-only after successful update
        if (onSave) {
          onSave(nextOfKinData);
          }
          // Fetch updated profile data
          await fetchProfile();
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowSavedModal(false);
  };

  const handleViewProfile = () => {
    // Implement the logic to view the profile
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
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
            disabled={formReadOnly || isSubmitting}
            className="h-12 rounded-none"
            placeholder="Enter first name"
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
            disabled={formReadOnly || isSubmitting}
            className="h-12 rounded-none"
            placeholder="Enter last name"
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
            disabled={formReadOnly || isSubmitting}
          >
            <SelectTrigger id="relationship" className="w-full h-12 rounded-none">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIPS.map((rel) => (
                <SelectItem key={rel} value={rel}>
                  {RELATIONSHIP_LABELS[rel]}
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
            disabled={formReadOnly || isSubmitting}
            className="h-12 rounded-none"
            placeholder="Enter phone number (e.g. +234...)"
          />
          {showErrors.phone && (
            <span className="text-red-500 text-sm">Please enter a valid phone number</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            disabled={formReadOnly || isSubmitting}
            className="h-12 rounded-none"
            placeholder="Enter email address"
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
            disabled={formReadOnly || isSubmitting}
            className="h-12 rounded-none"
            placeholder="Enter full address"
          />
          {showErrors.address && (
            <span className="text-red-500 text-sm">Address is required</span>
          )}
        </div>
      </div>

      {!formReadOnly && (
      <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isSubmitting} className="bg-red-500 hover:bg-red-600 text-white">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
        )}

      {showSavedModal && (
        <ProfileSavedModal
          open={showSavedModal}
          onClose={handleCloseModal}
          onViewProfile={handleViewProfile}
          allFormsCompleted={allFormsCompleted}
          onGetLoan={onGetLoan}
        />
      )}
    </form>
  );
}
