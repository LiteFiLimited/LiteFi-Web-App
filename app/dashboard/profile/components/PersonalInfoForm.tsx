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
import { CheckCircle, XCircle, Loader2, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToastContext } from '@/app/components/ToastProvider';
import { 
  states,
  type HomeOwnership,
  type EducationLevel,
  type EmploymentStatus,
  type MaritalStatus
} from '@/lib/data/states';
import { PersonalInformationSection } from "./PersonalInformationSection";
import { AddressDetailsSection } from "./AddressDetailsSection";
import { FormData, ValidationState, ValidationErrors } from './types';
import ConfirmationModal from '@/app/components/ConfirmationModal';

interface PersonalInfoFormProps {
  onSave?: (data: FormData) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

export default function PersonalInfoForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: PersonalInfoFormProps) {
  const { profile, isLoading, updateProfile, fetchProfile } = useUserProfile();
  const { error: showError } = useToastContext();
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();
  
  const [bvnValidationState, setBvnValidationState] = useState<ValidationState>("idle");
  const [ninValidationState, setNinValidationState] = useState<ValidationState>("idle");
  const [bvnReadOnly, setBvnReadOnly] = useState(isReadOnly);
  const [ninReadOnly, setNinReadOnly] = useState(isReadOnly);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateInputValue, setDateInputValue] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [selectedState, setSelectedState] = useState<string>("");
  const [availableLgas, setAvailableLgas] = useState<string[]>([]);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);

  // Individual field read-only states based on actual profile data
  const [fieldReadOnlyStatus, setFieldReadOnlyStatus] = useState({
    firstName: false,
    lastName: false,
    middleName: false,
    phoneNumber: false,
    email: false,
    dateOfBirth: false,
    bvn: false,
    nin: false,
    maritalStatus: false,
    highestEducation: false,
    employmentType: false,
    streetNo: false,
    streetName: false,
    nearestBusStop: false,
    state: false,
    localGovernment: false,
    homeOwnership: false,
    yearsInCurrentAddress: false
  });

  const getInitialFormData = (): FormData => ({
    firstName: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    bvn: "",
    nin: "",
    maritalStatus: "",
    highestEducation: "",
    employmentType: "",
    streetNo: "",
    streetName: "",
    nearestBusStop: "",
    state: "",
    localGovernment: "",
    homeOwnership: "",
    yearsInCurrentAddress: ""
  });

  const {
    formData,
    setFormData,
    showErrors,
    validations,
    handleChange,
    handleBlur,
    touchAllFields,
    isFormValid
  } = useFormValidator<FormData>(getInitialFormData(), {
    firstName: (value: string) => !value || validationRules.minLength(2)(value),
    lastName: (value: string) => !value || validationRules.minLength(2)(value),
    middleName: () => true, // Always valid
    phoneNumber: (value: string) => !value || validationRules.phone(value),
    email: (value: string) => !value || validationRules.email(value),
    dateOfBirth: (value: string) => !value || /^\d{2}\/\d{2}\/\d{4}$/.test(value), // Optional field with DD/MM/YYYY format
    bvn: (value: string) => !value || /^\d{11}$/.test(value), // Optional field, but if provided must be exactly 11 digits
    nin: (value: string) => !value || /^\d{11}$/.test(value), // Optional field, but if provided must be exactly 11 digits
    maritalStatus: () => true, // Always valid
    highestEducation: () => true, // Always valid
    employmentType: () => true, // Always valid
    streetNo: () => true, // Always valid
    streetName: () => true, // Always valid
    nearestBusStop: () => true, // Always valid
    state: () => true, // Always valid
    localGovernment: () => true, // Always valid
    homeOwnership: () => true, // Always valid
    yearsInCurrentAddress: () => true, // Always valid
  });

  // Custom handleChange that tracks user modifications
  const handleUserChange = (field: keyof FormData, value: string) => {
    handleChange(field, value);
    setHasUserMadeChanges(true);
  };

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      const newFormData: FormData = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        middleName: "",
        phoneNumber: profile.phone || "",
        email: profile.email || "",
        dateOfBirth: profile.profile?.dateOfBirth || "",
        bvn: profile.profile?.bvn || "",
        nin: profile.profile?.nin || "",
        maritalStatus: (profile.profile?.maritalStatus as MaritalStatus) || "",
        highestEducation: (profile.profile?.educationLevel as EducationLevel) || "",
        employmentType: (profile.employment?.employmentStatus as EmploymentStatus) || "",
        streetNo: profile.profile?.address?.split(' ')[0] || "",
        streetName: profile.profile?.address?.split(' ').slice(1).join(' ') || "",
        nearestBusStop: profile.profile?.nearestBusStop || "",
        state: profile.profile?.state || "",
        localGovernment: profile.profile?.city || "",
        homeOwnership: (profile.profile?.homeOwnership as HomeOwnership) || "",
        yearsInCurrentAddress: profile.profile?.yearsAtAddress || ""
      };
      
      setFormData(newFormData);
      // Ensure loading profile data doesn't trigger hasUserMadeChanges
      setHasUserMadeChanges(false);
      
      // Initialize date if available
      if (profile.profile?.dateOfBirth) {
        try {
          // Handle different date formats (dd/mm/yyyy or yyyy-mm-dd)
          let parsedDate;
          const dateStr = profile.profile.dateOfBirth;
          
          if (dateStr.includes('/')) {
            // DD/MM/YYYY format - split and rearrange
            const [day, month, year] = dateStr.split('/');
            if (day && month && year) {
              parsedDate = new Date(`${year}-${month}-${day}`);
            }
          } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Already in YYYY-MM-DD format
            parsedDate = new Date(dateStr);
          } else {
            // Try direct parsing as a fallback
            parsedDate = new Date(dateStr);
          }
          
          if (parsedDate && !isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
            setDateInputValue(format(parsedDate, "dd/MM/yyyy"));
            // Keep the date in DD/MM/YYYY format for consistency with validation and display
            // Use original handleChange to avoid triggering user changes flag during loading
            handleChange("dateOfBirth", format(parsedDate, "dd/MM/yyyy"));
          } else {
            console.warn("Invalid date value:", dateStr);
            setDate(undefined);
            setDateInputValue(dateStr); // Keep the original value for display
            handleChange("dateOfBirth", ""); // Clear the value in form data
          }
        } catch (error) {
          console.error("Error parsing date:", error);
          setDate(undefined);
          setDateInputValue(profile.profile.dateOfBirth); // Keep the original value for display
          handleChange("dateOfBirth", ""); // Clear the value in form data
        }
      }

      // Set validation states if values exist and mark as validated
      // BVN and NIN should only be read-only if they have been successfully validated
      if (profile.profile?.bvn && profile.profile?.bvnVerified) {
        setBvnValidationState("success");
        setBvnReadOnly(true);
      } else if (profile.profile?.bvn) {
        // Has value but not verified - keep editable but show as idle
        setBvnValidationState("idle");
        setBvnReadOnly(false);
      }
      
      if (profile.profile?.nin && profile.profile?.ninVerified) {
        setNinValidationState("success");
        setNinReadOnly(true);
      } else if (profile.profile?.nin) {
        // Has value but not verified - keep editable but show as idle
        setNinValidationState("idle");
        setNinReadOnly(false);
      }

      // Set state and LGAs
      if (profile.profile?.state) {
        setSelectedState(profile.profile.state);
        const stateData = states.find(s => s.state === profile.profile?.state);
        if (stateData) {
          setAvailableLgas(stateData.lgas);
        }
      }

      // Update field read-only states based on actual profile data
      // CORRECT LOGIC: Fields are read-only if they have values (not null/empty)
      setFieldReadOnlyStatus({
        firstName: !!profile.firstName,
        lastName: !!profile.lastName,
        middleName: false, // Middle name is always editable as it doesn't exist in profile
        phoneNumber: !!profile.phone,
        email: !!profile.email,
        dateOfBirth: !!profile.profile?.dateOfBirth,
        bvn: !!(profile.profile?.bvn && profile.profile?.bvnVerified),
        nin: !!(profile.profile?.nin && profile.profile?.ninVerified),
        maritalStatus: !!profile.profile?.maritalStatus,
        highestEducation: !!profile.profile?.educationLevel,
        employmentType: !!profile.employment?.employmentStatus,
        streetNo: !!profile.profile?.address?.split(' ')[0],
        streetName: !!profile.profile?.address?.split(' ').slice(1).join(' '),
        nearestBusStop: !!profile.profile?.nearestBusStop,
        state: !!profile.profile?.state,
        localGovernment: !!profile.profile?.city,
        homeOwnership: !!profile.profile?.homeOwnership,
        yearsInCurrentAddress: !!profile.profile?.yearsAtAddress
      });
      
      // Make sure loading profile data doesn't trigger save button
      setHasUserMadeChanges(false);
    }
  }, [profile]);

  // Update readonly states when isReadOnly prop changes
  useEffect(() => {
    setBvnReadOnly(isReadOnly);
    setNinReadOnly(isReadOnly);
  }, [isReadOnly]);

  const handleStateChange = (value: string) => {
    handleUserChange("state", value);
    setSelectedState(value);
    const stateData = states.find(s => s.state === value);
    if (stateData) {
      setAvailableLgas(stateData.lgas);
      handleUserChange("localGovernment", "");
    }
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInputValue(e.target.value);
    
    // Store the display format (DD/MM/YYYY) directly for validation
    handleUserChange("dateOfBirth", e.target.value);
    
    // If it's a complete and valid date, also update the calendar date state
    if (e.target.value && e.target.value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = e.target.value.split('/');
      const isoFormatDate = `${year}-${month}-${day}`;
      
      // Also update the date state to keep the calendar in sync
      const parsedDate = new Date(isoFormatDate);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    }
  };

  const validateBVN = () => {
    if (!formData.bvn) return;
    setBvnValidationState("loading");
    // Simulate BVN validation - allow any input with exactly 11 digits for testing
    setTimeout(() => {
      const bvnRegex = /^\d{11}$/;
      if (bvnRegex.test(formData.bvn)) {
        setBvnValidationState("success");
        setBvnReadOnly(true);
        setValidationErrors(prev => ({ ...prev, bvn: undefined }));
      } else {
        setBvnValidationState("error");
        setValidationErrors(prev => ({ ...prev, bvn: "BVN must be exactly 11 digits" }));
      }
    }, 1000);
  };

  const validateNIN = () => {
    if (!formData.nin) return;
    setNinValidationState("loading");
    // Simulate NIN validation - allow any input with exactly 11 digits for testing
    setTimeout(() => {
      const ninRegex = /^\d{11}$/;
      if (ninRegex.test(formData.nin)) {
        setNinValidationState("success");
        setNinReadOnly(true);
        setValidationErrors(prev => ({ ...prev, nin: undefined }));
      } else {
        setNinValidationState("error");
        setValidationErrors(prev => ({ ...prev, nin: "NIN must be exactly 11 digits" }));
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    
    // Don't require all fields to be filled - allow partial updates
    // Only validate the fields that have values
    const fieldsWithValues = Object.entries(formData).filter(([_, value]) => 
      value && typeof value === 'string' && value.trim() !== ''
    );
    let hasValidationErrors = false;
    
    // Check validation only for fields that have values
    for (const [fieldName] of fieldsWithValues) {
      if (fieldName in validations && !validations[fieldName as keyof typeof validations]) {
        hasValidationErrors = true;
        break;
      }
    }
    
    if (hasValidationErrors) {
      showError("Please fix the validation errors in the filled fields");
      return;
    }

    try {
      // Create flat structure as expected by the API
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || undefined,
        phone: formData.phoneNumber,
        // Keep date in DD/MM/YYYY format as the backend expects this format
        dateOfBirth: formData.dateOfBirth,
        gender: "MALE", // Default value - TODO: should be collected from form
        address: `${formData.streetNo} ${formData.streetName}`.trim(),
        streetName: formData.streetName || undefined,
        nearestBusStop: formData.nearestBusStop || undefined,
        city: formData.localGovernment || undefined,
        state: formData.state || undefined,
        localGovernment: formData.localGovernment || undefined,
        country: "Nigeria", // Default value
        nationality: "Nigerian", // Default value
        bvn: formData.bvn || undefined,
        nin: formData.nin || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        educationLevel: formData.highestEducation || undefined,
        homeOwnership: formData.homeOwnership || undefined,
        yearsAtAddress: formData.yearsInCurrentAddress || undefined,
        employmentStatus: formData.employmentType || undefined,
      };

      // Remove undefined fields to avoid sending empty values
      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => value !== undefined)
      );

      const success = await updateProfile(cleanData);
      if (success) {
        // Refresh the profile data to show updated values
        await fetchProfile();
        // Reset the flag since changes have been saved
        setHasUserMadeChanges(false);
        setShowSavedModal(true);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };
  
  const handleCloseModal = () => {
    setShowSavedModal(false);
  };
  
  const handleViewProfile = () => {
    router.push("/dashboard/investments");
  };

  const renderBvnValidationIndicator = () => {
    switch (bvnValidationState) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const renderNinValidationIndicator = () => {
    switch (ninValidationState) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Check if all editable fields are completed to determine button text
  const allEditableFieldsCompleted = React.useMemo(() => {
    // Check if any field that is currently editable (not read-only) has a value
    const editableFields = Object.keys(fieldReadOnlyStatus).filter(
      key => !fieldReadOnlyStatus[key as keyof typeof fieldReadOnlyStatus]
    );
    
    return editableFields.length === 0; // All fields are read-only, meaning all are completed
  }, [fieldReadOnlyStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PersonalInformationSection
        formData={formData}
        handleChange={handleUserChange}
        handleBlur={handleBlur}
        showErrors={showErrors}
        validations={validations}
        date={date}
        setDate={setDate}
        dateInputValue={dateInputValue}
        handleDateInput={handleDateInput}
        bvnValidationState={bvnValidationState}
        ninValidationState={ninValidationState}
        bvnReadOnly={bvnReadOnly}
        ninReadOnly={ninReadOnly}
        validationErrors={validationErrors}
        validateBVN={validateBVN}
        validateNIN={validateNIN}
        fieldReadOnlyStatus={fieldReadOnlyStatus}
      />

      <AddressDetailsSection
        formData={formData}
        handleChange={handleUserChange}
        showErrors={showErrors}
        validations={validations}
        selectedState={selectedState}
        handleStateChange={handleStateChange}
        availableLgas={availableLgas}
        fieldReadOnlyStatus={fieldReadOnlyStatus}
      />

      <div className="flex justify-end space-x-4">
        {hasUserMadeChanges && (
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
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
            Profile Locked
          </Button>
        )}
      </div>
      
      <ConfirmationModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Profile Changes"
        confirmText="Save Changes"
        cancelText="Cancel"
      />
      
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