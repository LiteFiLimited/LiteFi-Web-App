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

interface NextOfKinFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
}

export default function NextOfKinForm({ onSave, allFormsCompleted, onGetLoan }: NextOfKinFormProps) {
  const initialFormData = {
    firstName: "",
    lastName: "",
    middleName: "",
    relationship: "",
    phoneNumber: "",
    emailAddress: ""
  };

  const [showSavedModal, setShowSavedModal] = useState(false);
  const router = useRouter();

  // Define validation rules for the form fields
  const rules = {
    firstName: validationRules.required,
    lastName: validationRules.required,
    middleName: () => true, // Optional field
    relationship: validationRules.required,
    phoneNumber: validationRules.phone,
    emailAddress: validationRules.optionalEmail // Optional but must be valid if provided
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
              <Label htmlFor="firstName">Next of Kin First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                placeholder="Enter first name"
                className={`h-12 rounded-none ${showErrors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.firstName && (
                <p className="text-xs text-red-500">First name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Next of Kin Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                placeholder="Enter last name"
                className={`h-12 rounded-none ${showErrors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.lastName && (
                <p className="text-xs text-red-500">Last name is required</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="middleName">Next of Kin Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
                placeholder="Enter middle name (optional)"
                className="h-12 rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship with Next of Kin</Label>
              <Select 
                value={formData.relationship} 
                onValueChange={(value) => {
                  handleChange("relationship", value);
                  handleBlur("relationship");
                }}
              >
                <SelectTrigger 
                  id="relationship" 
                  className={`h-12 rounded-none ${showErrors.relationship ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {showErrors.relationship && (
                <p className="text-xs text-red-500">Relationship is required</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Next of Kin Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                onBlur={() => handleBlur("phoneNumber")}
                placeholder="Enter phone number"
                className={`h-12 rounded-none ${showErrors.phoneNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.phoneNumber && (
                <p className="text-xs text-red-500">Enter a valid phone number (10-11 digits)</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailAddress">Next of Kin Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleChange("emailAddress", e.target.value)}
                onBlur={() => handleBlur("emailAddress")}
                placeholder="Enter email address (optional)"
                className={`h-12 rounded-none ${showErrors.emailAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.emailAddress && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
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
