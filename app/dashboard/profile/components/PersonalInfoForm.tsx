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
import { CheckCircle, XCircle, Loader2, CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useUserProfile } from '@/hooks/useUserProfile';

interface PersonalInfoFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

type ValidationState = "idle" | "loading" | "success" | "error";

export default function PersonalInfoForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: PersonalInfoFormProps) {
  const { profile, isLoading, updateProfile } = useUserProfile();

  const initialFormData = {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    middleName: "",
    phoneNumber: profile?.phone || "",
    email: profile?.email || "",
    dateOfBirth: profile?.dateOfBirth || "",
    bvn: profile?.bvn || "",
    nin: profile?.nin || "",
    maritalStatus: "",
    highestEducation: "",
    employmentType: "",
    streetNo: profile?.address?.split(' ')[0] || "",
    streetName: profile?.address?.split(' ').slice(1).join(' ') || "",
    nearestBusStop: "",
    state: profile?.state || "",
    localGovernment: "",
    homeOwnership: "",
    yearsInCurrentAddress: ""
  };

  const [showSavedModal, setShowSavedModal] = React.useState(false);
  const router = useRouter();
  
  const [ninValidationState, setNinValidationState] = useState<ValidationState>("idle");
  const [ninReadOnly, setNinReadOnly] = useState(isReadOnly);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [dateInputValue, setDateInputValue] = useState("");

  const rules = {
    firstName: validationRules.minLength(2),
    lastName: validationRules.minLength(2),
    middleName: () => true,
    phoneNumber: validationRules.phone,
    email: validationRules.email,
    dateOfBirth: (value: string) => value !== "",
    bvn: (value: string) => value === "" || /^\d{11}$/.test(value),
    nin: (value: string) => value === "" || /^\d{11}$/.test(value),
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
  };

  const {
    formData,
    showErrors,
    validations,
    handleChange,
    handleBlur,
    touchAllFields,
    isFormValid
  } = useFormValidator(initialFormData, rules);

  // Handle manual date input with auto-formatting
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get only numbers from input
    const inputVal = e.target.value.replace(/\D/g, '');
    
    // Format with slashes
    let formattedDate = '';
    
    if (inputVal.length > 0) {
      // Add first part (day)
      formattedDate = inputVal.substring(0, Math.min(2, inputVal.length));
      
      // Add second part (month) with slash
      if (inputVal.length > 2) {
        formattedDate += '/' + inputVal.substring(2, Math.min(4, inputVal.length));
        
        // Add third part (year) with slash
        if (inputVal.length > 4) {
          formattedDate += '/' + inputVal.substring(4, Math.min(8, inputVal.length));
        }
      }
    }
    
    // Update the input value with formatted date
    setDateInputValue(formattedDate);
    
    // Try to parse the date if it has 8 digits (full date)
    if (inputVal.length === 8) {
      try {
        const day = inputVal.substring(0, 2);
        const month = inputVal.substring(2, 4);
        const year = inputVal.substring(4, 8);
        
        const parsedDate = new Date(`${year}-${month}-${day}`);
        
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
          handleChange("dateOfBirth", format(parsedDate, "yyyy-MM-dd"));
        }
      } catch (error) {
        // Invalid date format, just update the input value
      }
    } else {
      handleChange("dateOfBirth", "");
    }
  };

  // Update the date state when the date is selected in the calendar
  React.useEffect(() => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      setDateInputValue(formattedDate);
      handleChange("dateOfBirth", format(date, "yyyy-MM-dd"));
    }
  }, [date]);

  // Initialize date from formData if it exists
  React.useEffect(() => {
    if (formData.dateOfBirth) {
      setDate(new Date(formData.dateOfBirth));
      setDateInputValue(format(new Date(formData.dateOfBirth), "dd/MM/yyyy"));
    }
  }, []);

  const validateNIN = async () => {
    if (formData.nin === "" || !/^\d{11}$/.test(formData.nin)) return;
    
    setNinValidationState("loading");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isValid = true; // Always validate successfully
      
      if (isValid) {
        setNinValidationState("success");
        setNinReadOnly(true);
      } else {
        setNinValidationState("error");
      }
    } catch (error) {
      setNinValidationState("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAllFields();

    if (isFormValid()) {
      // Format the data according to the API requirements
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: `${formData.streetNo} ${formData.streetName}`.trim(),
        city: formData.localGovernment,
        state: formData.state,
        country: "Nigeria",
        bvn: formData.bvn,
        nin: formData.nin
      };

      const success = await updateProfile(profileData);
      if (success) {
        setShowSavedModal(true);
        if (onSave) {
          onSave(profileData);
        }
      }
    }
  };
  
  const handleCloseModal = () => {
    setShowSavedModal(false);
  };
  
  const handleViewProfile = () => {
    setShowSavedModal(false);
    router.push('/dashboard/profile');
  };

  // BVN validation indicator removed

  const renderNinValidationIndicator = () => {
    switch (ninValidationState) {
      case "loading":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
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
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                placeholder="Enter first name"
                className={`h-12 rounded-none ${showErrors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
              {showErrors.firstName && (
                <p className="text-xs text-red-500">First name must be at least 2 characters</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                placeholder="Enter last name"
                className={`h-12 rounded-none ${showErrors.lastName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
              {showErrors.lastName && (
                <p className="text-xs text-red-500">Last name must be at least 2 characters</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle name (Optional)</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
                placeholder="Enter middle name"
                className="h-12 rounded-none"
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                onBlur={() => handleBlur("phoneNumber")}
                placeholder="Enter phone number"
                className={`h-12 rounded-none ${showErrors.phoneNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
              {showErrors.phoneNumber && (
                <p className="text-xs text-red-500">Enter a valid phone number (10-11 digits)</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="Enter your email"
                className={`h-12 rounded-none ${showErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
              {showErrors.email && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Input
                  id="dateOfBirth"
                  value={dateInputValue}
                  onChange={handleDateInput}
                  onBlur={() => handleBlur("dateOfBirth")}
                  placeholder="DD/MM/YYYY"
                  className={`h-12 rounded-none pr-10 ${
                    showErrors.dateOfBirth ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
                <div className="absolute right-3 top-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0"
                        disabled={isReadOnly}
                      >
                        <CalendarIcon className="h-4 w-4" />
                        <span className="sr-only">Open calendar</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={isReadOnly}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {showErrors.dateOfBirth && (
                <p className="text-xs text-red-500">Date of birth is required</p>
              )}
              {dateInputValue && dateInputValue.length > 0 && dateInputValue.length < 10 && (
                <p className="text-xs text-gray-500">Complete date format: DD/MM/YYYY</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="bvn">BVN</Label>
              </div>
              <div className="relative">
                <Input
                  id="bvn"
                  value={formData.bvn}
                  onChange={(e) => handleChange("bvn", e.target.value.replace(/\D/g, '').slice(0, 11))}
                  onBlur={() => handleBlur("bvn")}
                  placeholder="Enter your BVN"
                  className={`h-12 rounded-none ${
                    showErrors.bvn ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
              {showErrors.bvn && (
                <p className="text-xs text-red-500">BVN must be 11 digits</p>
              )}
              {!/^\d{11}$/.test(formData.bvn) && formData.bvn !== "" && (
                <p className="text-xs text-gray-500">BVN must be exactly 11 digits</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="nin">NIN (Optional)</Label>
              </div>
              <div className="relative">
                <Input
                  id="nin"
                  value={formData.nin}
                  onChange={(e) => handleChange("nin", e.target.value.replace(/\D/g, '').slice(0, 11))}
                  onBlur={() => handleBlur("nin")}
                  placeholder="Enter your NIN (optional)"
                  className={`h-12 rounded-none pr-10 ${
                    showErrors.nin && formData.nin !== "" ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  readOnly={isReadOnly}
                />
              </div>
              {showErrors.nin && formData.nin !== "" && (
                <p className="text-xs text-red-500">NIN must be exactly 11 digits</p>
              )}
              {!/^\d{11}$/.test(formData.nin) && formData.nin !== "" && (
                <p className="text-xs text-gray-500">NIN must be exactly 11 digits</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select 
                value={formData.maritalStatus} 
                onValueChange={(value) => handleChange("maritalStatus", value)}
              >
                <SelectTrigger id="maritalStatus" className="h-12 rounded-none">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="highestEducation">Highest Level of Education</Label>
              <Select 
                value={formData.highestEducation} 
                onValueChange={(value) => handleChange("highestEducation", value)}
              >
                <SelectTrigger id="highestEducation" className="h-12 rounded-none">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select 
                value={formData.employmentType} 
                onValueChange={(value) => handleChange("employmentType", value)}
              >
                <SelectTrigger id="employmentType" className="h-12 rounded-none">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-base font-bold">Address Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="streetNo">Street No</Label>
              <Input
                id="streetNo"
                value={formData.streetNo}
                onChange={(e) => handleChange("streetNo", e.target.value)}
                placeholder="Enter street number"
                className="h-12 rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streetName">Street Name</Label>
              <Input
                id="streetName"
                value={formData.streetName}
                onChange={(e) => handleChange("streetName", e.target.value)}
                placeholder="Enter street name"
                className="h-12 rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nearestBusStop">Nearest bus stop</Label>
              <Input
                id="nearestBusStop"
                value={formData.nearestBusStop}
                onChange={(e) => handleChange("nearestBusStop", e.target.value)}
                placeholder="Enter nearest bus stop"
                className="h-12 rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select 
                value={formData.state} 
                onValueChange={(value) => handleChange("state", value)}
              >
                <SelectTrigger id="state" className="h-12 rounded-none">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">Abuja</SelectItem>
                  <SelectItem value="rivers">Rivers</SelectItem>
                  <SelectItem value="kano">Kano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="localGovernment">Local government</Label>
              <Select 
                value={formData.localGovernment} 
                onValueChange={(value) => handleChange("localGovernment", value)}
              >
                <SelectTrigger id="localGovernment" className="h-12 rounded-none">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimosho">Alimosho</SelectItem>
                  <SelectItem value="ikeja">Ikeja</SelectItem>
                  <SelectItem value="eti-osa">Eti-Osa</SelectItem>
                  <SelectItem value="surulere">Surulere</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="homeOwnership">Home Ownership</Label>
              <Select 
                value={formData.homeOwnership} 
                onValueChange={(value) => handleChange("homeOwnership", value)}
              >
                <SelectTrigger id="homeOwnership" className="h-12 rounded-none">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="family">Family House</SelectItem>
                  <SelectItem value="company">Company Provided</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="yearsInCurrentAddress">Years in current address</Label>
              <Input
                id="yearsInCurrentAddress"
                type="number"
                min="0"
                step="1"
                value={formData.yearsInCurrentAddress}
                onChange={(e) => handleChange("yearsInCurrentAddress", e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => handleBlur("yearsInCurrentAddress")}
                placeholder="Enter number of years"
                className="h-12 rounded-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className={`h-12 px-16 rounded-none ${
              isFormValid() && !isReadOnly
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-red-300 cursor-not-allowed text-white"
            }`}
            disabled={!isFormValid() || isReadOnly}
          >
            {isReadOnly ? "Information Saved" : "Save"}
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