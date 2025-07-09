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
import { useToastContext } from '@/app/components/ToastProvider';
import ConfirmationModal from '@/app/components/ConfirmationModal';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Individual field read-only states based on actual next of kin data
  const [fieldReadOnlyStatus, setFieldReadOnlyStatus] = useState({
    firstName: false,
    lastName: false,
    relationship: false,
    phone: false,
    email: false,
    address: false
  });

  const getInitialFormData = (): NextOfKinInfo => ({
    firstName: "",
    lastName: "",
    relationship: "",
    phone: "",
    email: "",
    address: ""
  });

  const rules = {
    firstName: validationRules.required,
    lastName: validationRules.required,
    relationship: validationRules.required,
    phone: validationRules.required, // Remove specific phone number validation - just require non-empty
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
  } = useFormValidator<NextOfKinInfo>(getInitialFormData(), rules);

  // Custom handleChange that tracks user modifications
  const handleUserChange = (field: keyof NextOfKinInfo, value: string) => {
    handleChange(field, value);
    setHasUserMadeChanges(true);
  };

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile?.nextOfKin) {
      const nextOfKin = profile.nextOfKin;
      const newFormData: NextOfKinInfo = {
        firstName: nextOfKin.firstName || "",
        lastName: nextOfKin.lastName || "",
        relationship: nextOfKin.relationship || "",
        phone: nextOfKin.phone || "",
        email: nextOfKin.email || "",
        address: nextOfKin.address || ""
      };
      
      setFormData(newFormData);
      // Ensure loading next of kin data doesn't trigger hasUserMadeChanges
      setHasUserMadeChanges(false);

      // Update field read-only states based on actual next of kin data
      // Fields are read-only if they have values (not null/empty)
      setFieldReadOnlyStatus({
        firstName: !!nextOfKin.firstName,
        lastName: !!nextOfKin.lastName,
        relationship: !!nextOfKin.relationship,
        phone: !!nextOfKin.phone,
        email: !!nextOfKin.email,
        address: !!nextOfKin.address
      });
      
      // Make sure loading next of kin data doesn't trigger save button
      setHasUserMadeChanges(false);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAllFields();

    if (isFormValid()) {
      // Show confirmation modal instead of directly submitting
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
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
        // Refresh the next of kin data to show updated values
        await fetchProfile();
        // Reset the flag since changes have been saved
        setHasUserMadeChanges(false);
        setShowSavedModal(true);
        if (onSave) {
          onSave(nextOfKinData);
        }
      }
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

  // Check if all editable fields are completed to determine button text
  const allEditableFieldsCompleted = React.useMemo(() => {
    // Check if any field that is currently editable (not read-only) has a value
    const editableFields = Object.keys(fieldReadOnlyStatus).filter(
      key => !fieldReadOnlyStatus[key as keyof typeof fieldReadOnlyStatus]
    );
    
    return editableFields.length === 0; // All fields are read-only, meaning all are completed
  }, [fieldReadOnlyStatus]);

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
            onChange={(e) => handleUserChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            disabled={fieldReadOnlyStatus.firstName || isSubmitting}
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
            onChange={(e) => handleUserChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            disabled={fieldReadOnlyStatus.lastName || isSubmitting}
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
            onValueChange={(value) => handleUserChange('relationship', value)}
            disabled={fieldReadOnlyStatus.relationship || isSubmitting}
          >
            <SelectTrigger className="h-12 rounded-none">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIPS.map((relationship) => (
                <SelectItem key={relationship} value={relationship}>
                  {RELATIONSHIP_LABELS[relationship]}
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
            type="tel"
            value={formData.phone}
            onChange={(e) => handleUserChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            disabled={fieldReadOnlyStatus.phone || isSubmitting}
            className="h-12 rounded-none"
            placeholder="Enter phone number"
          />
          {showErrors.phone && (
            <span className="text-red-500 text-sm">Phone number is required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleUserChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            disabled={fieldReadOnlyStatus.email || isSubmitting}
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
            onChange={(e) => handleUserChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
            disabled={fieldReadOnlyStatus.address || isSubmitting}
            className="h-12 rounded-none"
            placeholder="Enter full address"
          />
          {showErrors.address && (
            <span className="text-red-500 text-sm">Address is required</span>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {hasUserMadeChanges && (
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        )}
        
        {allEditableFieldsCompleted && !hasUserMadeChanges && (
          <Button 
            type="button" 
            disabled={true}
            className="bg-gray-400 text-white cursor-not-allowed"
          >
            Next of Kin Locked
          </Button>
        )}
      </div>

      {showSavedModal && (
        <ProfileSavedModal
          open={showSavedModal}
          onClose={handleCloseModal}
          onViewProfile={handleViewProfile}
          allFormsCompleted={allFormsCompleted}
          onGetLoan={onGetLoan}
        />
      )}

      <ConfirmationModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Next of Kin Details"
      />
    </form>
  );
}
