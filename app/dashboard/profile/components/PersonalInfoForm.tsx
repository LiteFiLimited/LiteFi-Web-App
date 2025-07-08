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

interface PersonalInfoFormProps {
  onSave?: (data: FormData) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

export default function PersonalInfoForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: PersonalInfoFormProps) {
  const { profile, isLoading, updateProfile } = useUserProfile();
  const { error: showError } = useToastContext();
  const [showSavedModal, setShowSavedModal] = useState(false);
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
    firstName: validationRules.minLength(2),
    lastName: validationRules.minLength(2),
    middleName: () => true,
    phoneNumber: validationRules.phone,
    email: validationRules.email,
    dateOfBirth: validationRules.date,
    bvn: (value: string) => /^\d{10,11}$/.test(value),
    nin: (value: string) => /^\d{10,11}$/.test(value),
    maritalStatus: () => true,
    highestEducation: () => true,
    employmentType: () => true,
    streetNo: () => true,
    streetName: () => true,
    nearestBusStop: () => true,
    state: () => true,
    localGovernment: () => true,
    homeOwnership: () => true,
    yearsInCurrentAddress: () => true,
  });

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
            // Update form data with the parsed date in yyyy-mm-dd format for API compatibility
            handleChange("dateOfBirth", format(parsedDate, "yyyy-MM-dd"));
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

      // Set validation states if values exist
      if (profile.profile?.bvn) {
        setBvnValidationState("success");
        setBvnReadOnly(true);
      }
      if (profile.profile?.nin) {
        setNinValidationState("success");
        setNinReadOnly(true);
      }

      // Set state and LGAs
      if (profile.profile?.state) {
        setSelectedState(profile.profile.state);
        const stateData = states.find(s => s.state === profile.profile?.state);
        if (stateData) {
          setAvailableLgas(stateData.lgas);
        }
      }
    }
  }, [profile]);

  const handleStateChange = (value: string) => {
    handleChange("state", value);
    setSelectedState(value);
    const stateData = states.find(s => s.state === value);
    if (stateData) {
      setAvailableLgas(stateData.lgas);
      handleChange("localGovernment", "");
    }
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInputValue(e.target.value);
    
    // Store the display format (DD/MM/YYYY) directly for validation
    handleChange("dateOfBirth", e.target.value);
    
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
    // Simulate BVN validation - allow any input with length between 10-11 digits for testing
    setTimeout(() => {
      const bvnRegex = /^\d{10,11}$/;
      if (bvnRegex.test(formData.bvn)) {
        setBvnValidationState("success");
        setBvnReadOnly(true);
        setValidationErrors(prev => ({ ...prev, bvn: undefined }));
      } else {
        setBvnValidationState("error");
        setValidationErrors(prev => ({ ...prev, bvn: "BVN must be 11 digits" }));
      }
    }, 1000);
  };

  const validateNIN = () => {
    if (!formData.nin) return;
    setNinValidationState("loading");
    // Simulate NIN validation - allow any input with length between 10-11 digits for testing
    setTimeout(() => {
      const ninRegex = /^\d{10,11}$/;
      if (ninRegex.test(formData.nin)) {
        setNinValidationState("success");
        setNinReadOnly(true);
        setValidationErrors(prev => ({ ...prev, nin: undefined }));
      } else {
        setNinValidationState("error");
        setValidationErrors(prev => ({ ...prev, nin: "NIN must be 11 digits" }));
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAllFields();

    if (!isFormValid()) {
      showError("Please fill all required fields correctly");
      return;
    }

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        email: formData.email,
        profile: {
        dateOfBirth: formData.dateOfBirth,
          bvn: formData.bvn,
          nin: formData.nin,
          maritalStatus: formData.maritalStatus as MaritalStatus,
          educationLevel: formData.highestEducation as EducationLevel,
          address: `${formData.streetNo} ${formData.streetName}`,
          nearestBusStop: formData.nearestBusStop,
          state: formData.state,
        city: formData.localGovernment,
          homeOwnership: formData.homeOwnership as HomeOwnership,
          yearsAtAddress: formData.yearsInCurrentAddress
        },
        employment: {
          employmentStatus: formData.employmentType as EmploymentStatus
        }
      });
      setShowSavedModal(true);
      if (onSave) onSave(formData);
    } catch (error) {
      showError("Failed to save profile. Please try again.");
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
        handleChange={handleChange}
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
      />

      <AddressDetailsSection
        formData={formData}
        handleChange={handleChange}
        showErrors={showErrors}
        validations={validations}
        selectedState={selectedState}
        handleStateChange={handleStateChange}
        availableLgas={availableLgas}
      />

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isLoading} className="bg-red-500 hover:bg-red-600 text-white">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
          </Button>
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
    </form>
  );
}