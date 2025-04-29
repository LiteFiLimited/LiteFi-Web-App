"use client";

import React from "react";
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

interface PersonalInfoFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
}

export default function PersonalInfoForm({ onSave, allFormsCompleted, onGetLoan }: PersonalInfoFormProps) {
  const initialFormData = {
    firstName: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    email: "",
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
  };

  const [showSavedModal, setShowSavedModal] = React.useState(false);
  const router = useRouter();

  // Define validation rules for the form fields
  const rules = {
    firstName: validationRules.minLength(2),
    lastName: validationRules.minLength(2),
    middleName: () => true, // Optional field
    phoneNumber: validationRules.phone,
    email: validationRules.email,
    bvn: validationRules.bvn,
    nin: validationRules.nin,
    maritalStatus: () => true, // Optional field
    highestEducation: () => true, // Optional field
    employmentType: () => true, // Optional field
    streetNo: () => true, // Optional field
    streetName: () => true, // Optional field
    nearestBusStop: () => true, // Optional field
    state: () => true, // Optional field
    localGovernment: () => true, // Optional field
    homeOwnership: () => true, // Optional field
    yearsInCurrentAddress: () => true, // Optional field
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
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                placeholder="Enter first name"
                className={`h-12 rounded-none ${showErrors.firstName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
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
              />
              {showErrors.email && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bvn">BVN</Label>
              <Input
                id="bvn"
                value={formData.bvn}
                onChange={(e) => handleChange("bvn", e.target.value)}
                onBlur={() => handleBlur("bvn")}
                placeholder="Enter your BVN"
                className={`h-12 rounded-none ${showErrors.bvn ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.bvn && (
                <p className="text-xs text-red-500">Enter a valid BVN (10-11 digits)</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nin">NIN *</Label>
              <Input
                id="nin"
                value={formData.nin}
                onChange={(e) => handleChange("nin", e.target.value)}
                onBlur={() => handleBlur("nin")}
                placeholder="Enter your NIN"
                className={`h-12 rounded-none ${showErrors.nin ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.nin && (
                <p className="text-xs text-red-500">Enter a valid NIN (10-11 digits) or leave blank</p>
              )}
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {/* Add other Nigerian states as needed */}
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
                  {/* Add more LGAs as needed */}
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
                value={formData.yearsInCurrentAddress}
                onChange={(e) => handleChange("yearsInCurrentAddress", e.target.value)}
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