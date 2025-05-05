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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Image from "next/image";
import { useFormValidator, validationRules } from "@/lib/formValidator";
import { Button } from "@/components/ui/button";

interface EmploymentInfoFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean; // Add this new prop
}

export default function EmploymentInfoForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: EmploymentInfoFormProps) {
  const initialFormData = {
    employerName: "",
    employerAddress: "",
    title: "",
    workEmail: "",
    netSalary: "",
    businessName: "",
    businessDescription: "",
    industry: "",
    businessEmail: "",
    businessAddress: "",
    employmentType: ""
  };

  const [employmentStartDate, setEmploymentStartDate] = useState<Date | undefined>(undefined);
  const [salaryPaymentDate, setSalaryPaymentDate] = useState<string>("");
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [employmentType, setEmploymentType] = useState<string>("");
  const isBusinessOwner = employmentType === "self-employed";
  const router = useRouter();

  // Define validation rules for the form fields
  const rules = {
    employerName: validationRules.required,
    employerAddress: validationRules.required,
    title: validationRules.required,
    workEmail: validationRules.optionalEmail,
    netSalary: validationRules.required,
    businessName: validationRules.required,
    businessDescription: validationRules.required,
    industry: validationRules.notEmpty,
    businessEmail: validationRules.optionalEmail,
    businessAddress: validationRules.required,
    employmentType: validationRules.notEmpty,
  };

  // Use the form validator hook
  const {
    formData,
    setFormData,
    showErrors,
    validations,
    handleChange,
    handleBlur,
    touchAllFields
  } = useFormValidator(initialFormData, rules);

  // Additional validation for date fields that aren't in the formData
  const isEmploymentStartDateValid = !!employmentStartDate;
  const isSalaryPaymentDateValid = salaryPaymentDate !== "";

  // Extend the validator's isFormValid method to include our date fields
  const isFormValid = () => {
    const allFieldsValid = Object.keys(rules).every(
      (key) => validations[key as keyof typeof formData]
    );
    return allFieldsValid && isEmploymentStartDateValid && isSalaryPaymentDateValid;
  };

  // Custom state for date fields that need to be tracked separately
  const [dateFieldTouched, setDateFieldTouched] = useState({
    employmentStartDate: false,
    salaryPaymentDate: false,
  });

  const handleDateBlur = (field: keyof typeof dateFieldTouched) => {
    setDateFieldTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const showDateErrors = {
    employmentStartDate: dateFieldTouched.employmentStartDate && !isEmploymentStartDateValid,
    salaryPaymentDate: dateFieldTouched.salaryPaymentDate && !isSalaryPaymentDateValid,
  };

  const handleEmploymentTypeChange = (value: string) => {
    setEmploymentType(value);
    handleChange("employmentType", value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to display errors
    touchAllFields();
    setDateFieldTouched({
      employmentStartDate: true,
      salaryPaymentDate: true
    });

    if (isFormValid() && onSave) {
      const submittedData = {
        ...formData,
        employmentStartDate,
        salaryPaymentDate
      };
      onSave(submittedData);
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
        {/* Employment Type Selection - Always available */}
        <div className="space-y-2 mb-8">
          <Label htmlFor="employmentType">Employment Type</Label>
          <Select 
            value={formData.employmentType} 
            onValueChange={handleEmploymentTypeChange}
            disabled={isReadOnly}
          >
            <SelectTrigger id="employmentType" className="h-12 rounded-none">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="self-employed">Self Employed</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {employmentType && (
          <>
            {/* Display appropriate form based on employment type */}
            {isBusinessOwner ? (
              // Business Owner Form
              <div className="space-y-8">
                <h3 className="text-base font-bold">Business Information</h3>
                {/* Business Information Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleChange("businessName", e.target.value)}
                      onBlur={() => handleBlur("businessName")}
                      placeholder="Enter business name"
                      className={`h-12 rounded-none ${showErrors.businessName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                    {showErrors.businessName && (
                      <p className="text-xs text-red-500">Business name is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Describe what you do</Label>
                    <Input
                      id="businessDescription"
                      value={formData.businessDescription}
                      onChange={(e) => handleChange("businessDescription", e.target.value)}
                      onBlur={() => handleBlur("businessDescription")}
                      placeholder="Enter business description"
                      className={`h-12 rounded-none ${showErrors.businessDescription ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                    {showErrors.businessDescription && (
                      <p className="text-xs text-red-500">Business description is required</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={formData.industry} 
                      onValueChange={(value) => {
                        handleChange("industry", value);
                        handleBlur("industry");
                      }}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="industry" className={`h-12 rounded-none ${showErrors.industry ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {showErrors.industry && (
                      <p className="text-xs text-red-500">Industry is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Work email</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={formData.businessEmail}
                      onChange={(e) => handleChange("businessEmail", e.target.value)}
                      onBlur={() => handleBlur("businessEmail")}
                      placeholder="Enter work email"
                      className={`h-12 rounded-none ${showErrors.businessEmail ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                    {showErrors.businessEmail && (
                      <p className="text-xs text-red-500">Please enter a valid email address</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Work Address</Label>
                    <Input
                      id="businessAddress"
                      value={formData.businessAddress}
                      onChange={(e) => handleChange("businessAddress", e.target.value)}
                      onBlur={() => handleBlur("businessAddress")}
                      placeholder="Enter work address"
                      className={`h-12 rounded-none ${showErrors.businessAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                    {showErrors.businessAddress && (
                      <p className="text-xs text-red-500">Work address is required</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Employee Form
              <div className="space-y-8">
                <h3 className="text-base font-bold">Employment Information</h3>
                {/* Employment Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="employerName">Name of employer</Label>
                    <Input
                      id="employerName"
                      value={formData.employerName}
                      onChange={(e) => handleChange("employerName", e.target.value)}
                      onBlur={() => handleBlur("employerName")}
                      placeholder="Enter employer name"
                      className={`h-12 rounded-none ${showErrors.employerName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                    {showErrors.employerName && (
                      <p className="text-xs text-red-500">Employer name is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerAddress">Employer Address</Label>
                    <Input
                      id="employerAddress"
                      value={formData.employerAddress}
                      onChange={(e) => handleChange("employerAddress", e.target.value)}
                      onBlur={() => handleBlur("employerAddress")}
                      placeholder="Enter employer address"
                      className={`h-12 rounded-none ${showErrors.employerAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                    {showErrors.employerAddress && (
                      <p className="text-xs text-red-500">Employer address is required</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title / Position</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      onBlur={() => handleBlur("title")}
                      placeholder="Enter job title"
                      className={`h-12 rounded-none ${showErrors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                    {showErrors.title && (
                      <p className="text-xs text-red-500">Job title is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workEmail">Work email</Label>
                    <Input
                      id="workEmail"
                      type="email"
                      value={formData.workEmail}
                      onChange={(e) => handleChange("workEmail", e.target.value)}
                      onBlur={() => handleBlur("workEmail")}
                      placeholder="Enter work email"
                      className={`h-12 rounded-none ${showErrors.workEmail ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                    {showErrors.workEmail && (
                      <p className="text-xs text-red-500">Please enter a valid email address</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="employmentStartDate">Employment Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className={`h-12 border rounded-none bg-gray-50 px-4 flex items-center justify-between cursor-pointer ${showDateErrors.employmentStartDate ? 'border-red-500' : 'border-input'}`}
                             onClick={() => handleDateBlur("employmentStartDate")}>
                          <span className={employmentStartDate ? '' : 'text-muted-foreground'}>
                            {employmentStartDate ? format(employmentStartDate, "PPP") : "Select"}
                          </span>
                          <Image 
                            src="/assets/svgs/calendar.svg" 
                            alt="Calendar" 
                            width={16} 
                            height={16} 
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={employmentStartDate}
                          onSelect={setEmploymentStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {showDateErrors.employmentStartDate && (
                      <p className="text-xs text-red-500">Employment start date is required</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaryPaymentDate">Salary Payment Date</Label>
                    <Select 
                      value={salaryPaymentDate} 
                      onValueChange={(value) => {
                        setSalaryPaymentDate(value);
                        handleDateBlur("salaryPaymentDate");
                      }}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger id="salaryPaymentDate" className={`h-12 rounded-none ${showDateErrors.salaryPaymentDate ? 'border-red-500 focus-visible:ring-red-500' : ''}`}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day === 1 ? "1st" : day === 2 ? "2nd" : day === 3 ? "3rd" : `${day}th`} of the month
                          </SelectItem>
                        ))}
                        <SelectItem value="end">End of the month</SelectItem>
                      </SelectContent>
                    </Select>
                    {showDateErrors.salaryPaymentDate && (
                      <p className="text-xs text-red-500">Salary payment date is required</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="netSalary">Net Salary</Label>
                    <Input
                      id="netSalary"
                      value={formData.netSalary}
                      onChange={(e) => handleChange("netSalary", e.target.value)}
                      onBlur={() => handleBlur("netSalary")}
                      placeholder="Enter net salary"
                      className={`h-12 rounded-none ${showErrors.netSalary ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      readOnly={isReadOnly}
                      disabled={isReadOnly}
                    />
                    {showErrors.netSalary && (
                      <p className="text-xs text-red-500">Net salary is required</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

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
