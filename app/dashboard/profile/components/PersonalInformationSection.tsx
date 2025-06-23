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
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  educationLevelOptions,
  employmentStatusOptions,
  maritalStatusOptions,
} from '@/lib/data/states';
import { FormData, FormField, ValidationState, ValidationErrors } from './types';

interface PersonalInformationSectionProps {
  formData: FormData;
  handleChange: (field: FormField, value: string) => void;
  handleBlur: (field: FormField) => void;
  showErrors: Record<string, boolean>;
  validations: Record<string, boolean>;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  dateInputValue: string;
  handleDateInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bvnValidationState: ValidationState;
  ninValidationState: ValidationState;
  bvnReadOnly: boolean;
  ninReadOnly: boolean;
  validationErrors: ValidationErrors;
  validateBVN: () => void;
  validateNIN: () => void;
}

export function PersonalInformationSection({
  formData,
  handleChange,
  handleBlur,
  showErrors,
  validations,
  date,
  setDate,
  dateInputValue,
  handleDateInput,
  bvnValidationState,
  ninValidationState,
  bvnReadOnly,
  ninReadOnly,
  validationErrors,
  validateBVN,
  validateNIN
}: PersonalInformationSectionProps) {
  const renderValidationIndicator = (state: "idle" | "loading" | "success" | "error") => {
    switch (state) {
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

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>First Name</Label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={() => handleBlur("firstName")}
            className={showErrors.firstName && !validations.firstName ? "border-red-500" : ""}
            placeholder="Enter first name"
          />
        </div>

        <div className="space-y-4">
          <Label>Last Name</Label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
            className={showErrors.lastName && !validations.lastName ? "border-red-500" : ""}
            placeholder="Enter last name"
          />
        </div>

        <div className="space-y-4">
          <Label>Middle Name (Optional)</Label>
          <Input
            name="middleName"
            value={formData.middleName}
            onChange={(e) => handleChange("middleName", e.target.value)}
            placeholder="Enter middle name"
          />
        </div>

        <div className="space-y-4">
          <Label>Phone Number</Label>
          <Input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            onBlur={() => handleBlur("phoneNumber")}
            className={showErrors.phoneNumber && !validations.phoneNumber ? "border-red-500" : ""}
            placeholder="Enter phone number (e.g. +234 or 0...)"
          />
          {showErrors.phoneNumber && !validations.phoneNumber && (
            <span className="text-red-500 text-sm">Please enter a valid phone number</span>
          )}
        </div>

        <div className="space-y-4">
          <Label>Email</Label>
          <Input
            name="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={showErrors.email && !validations.email ? "border-red-500" : ""}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-4">
          <Label>Date of Birth</Label>
          <div className="relative">
            <Input
              value={dateInputValue}
              onChange={(e) => {
                // Remove any non-digit characters
                const digits = e.target.value.replace(/\D/g, '');
                
                // Format as dd/mm/yyyy
                let formatted = '';
                if (digits.length > 0) formatted += digits.slice(0, 2);
                if (digits.length > 2) formatted += '/' + digits.slice(2, 4);
                if (digits.length > 4) formatted += '/' + digits.slice(4, 8);
                
                handleDateInput({
                  ...e,
                  target: { ...e.target, value: formatted }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="DD/MM/YYYY"
              onBlur={() => handleBlur("dateOfBirth")}
              className={cn(
                showErrors.dateOfBirth && !validations.dateOfBirth ? "border-red-500" : "",
                "pr-10"
              )}
              maxLength={10}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="absolute right-0 top-0 h-full px-2"
                  type="button"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (newDate) {
                      const formatted = format(newDate, "dd/MM/yyyy");
                      handleDateInput({
                        target: { value: formatted }
                      } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {showErrors.dateOfBirth && !validations.dateOfBirth && (
              <span className="text-red-500 text-sm">Please enter a valid date in DD/MM/YYYY format</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label>BVN</Label>
          <div className="relative">
            <Input
              name="bvn"
              value={formData.bvn}
              onChange={(e) => handleChange("bvn", e.target.value)}
              onBlur={validateBVN}
              readOnly={bvnReadOnly}
              className={cn(
                "pr-10",
                showErrors.bvn && !validations.bvn ? "border-red-500" : ""
              )}
              placeholder="Enter BVN"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {renderValidationIndicator(bvnValidationState)}
            </div>
          </div>
          {validationErrors.bvn && (
            <p className="text-sm text-red-500">{validationErrors.bvn}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label>NIN</Label>
          <div className="relative">
            <Input
              name="nin"
              value={formData.nin}
              onChange={(e) => handleChange("nin", e.target.value)}
              onBlur={validateNIN}
              readOnly={ninReadOnly}
              className={cn(
                "pr-10",
                showErrors.nin && !validations.nin ? "border-red-500" : ""
              )}
              placeholder="Enter NIN"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {renderValidationIndicator(ninValidationState)}
            </div>
          </div>
          {validationErrors.nin && (
            <p className="text-sm text-red-500">{validationErrors.nin}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Marital Status</Label>
          <Select
            name="maritalStatus"
            value={formData.maritalStatus}
            onValueChange={(value) => handleChange("maritalStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(maritalStatusOptions).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Highest Education</Label>
          <Select
            name="highestEducation"
            value={formData.highestEducation}
            onValueChange={(value) => handleChange("highestEducation", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(educationLevelOptions).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Employment Type</Label>
          <Select
            name="employmentType"
            value={formData.employmentType}
            onValueChange={(value) => handleChange("employmentType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(employmentStatusOptions).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 