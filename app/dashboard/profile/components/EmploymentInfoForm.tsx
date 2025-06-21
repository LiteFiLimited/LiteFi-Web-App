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
import { useFormValidator } from "@/lib/formValidator";
import { Button } from "@/components/ui/button";
import { useUserProfile } from '@/hooks/useUserProfile';
import { validationRules } from '@/lib/formValidator';
import { EmploymentInfo } from '@/types/user';

interface EmploymentInfoFormProps {
  onSave?: (data: EmploymentInfo) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

export default function EmploymentInfoForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: EmploymentInfoFormProps) {
  const { profile, isLoading, updateEmployment } = useUserProfile();
  const router = useRouter();

  const initialFormData: EmploymentInfo = {
    employmentStatus: profile?.employment?.employmentStatus || 'UNEMPLOYED',
    employerName: profile?.employment?.employerName || "",
    jobTitle: profile?.employment?.jobTitle || "",
    workAddress: profile?.employment?.workAddress || "",
    monthlyIncome: profile?.employment?.monthlyIncome || 0,
    employmentStartDate: profile?.employment?.employmentStartDate || "",
    workEmail: profile?.employment?.workEmail || "",
    workPhone: profile?.employment?.workPhone || ""
  };

  const rules = {
    employmentStatus: validationRules.required,
    employerName: (value: string) => 
      initialFormData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
    jobTitle: (value: string) => 
      initialFormData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
    workAddress: (value: string) => 
      initialFormData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
    monthlyIncome: (value: number) => 
      initialFormData.employmentStatus === 'EMPLOYED' ? value > 0 : true,
    employmentStartDate: (value: string) => 
      initialFormData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
    workEmail: (value: string) => 
      initialFormData.employmentStatus === 'EMPLOYED' ? validationRules.email(value) : true,
    workPhone: (value: string) => 
      initialFormData.employmentStatus === 'EMPLOYED' ? validationRules.phone(value) : true
  };

  const {
    formData,
    showErrors,
    handleChange,
    handleBlur,
    touchAllFields,
    isFormValid,
    setFormData
  } = useFormValidator<EmploymentInfo>(initialFormData, rules);

  const [showSavedModal, setShowSavedModal] = useState(false);

  // Handle employment status change
  const handleEmploymentStatusChange = (status: string) => {
    handleChange('employmentStatus', status);
    
    // Reset form if unemployed/student/retired
    if (['UNEMPLOYED', 'STUDENT', 'RETIRED'].includes(status)) {
      setFormData({
        ...formData,
        employmentStatus: status as EmploymentInfo['employmentStatus'],
        employerName: "",
        jobTitle: "",
        workAddress: "",
        monthlyIncome: 0,
        employmentStartDate: "",
        workEmail: "",
        workPhone: ""
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAllFields();

    if (isFormValid()) {
      const employmentData: EmploymentInfo = {
        employmentStatus: formData.employmentStatus,
        ...(formData.employmentStatus === 'EMPLOYED' && {
          employerName: formData.employerName,
          jobTitle: formData.jobTitle,
          workAddress: formData.workAddress,
          monthlyIncome: Number(formData.monthlyIncome),
          employmentStartDate: formData.employmentStartDate,
          workEmail: formData.workEmail,
          workPhone: formData.workPhone
        })
      };

      const success = await updateEmployment(employmentData);
      if (success) {
        setShowSavedModal(true);
        if (onSave) {
          onSave(employmentData);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const isEmployed = formData.employmentStatus === 'EMPLOYED';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="employmentStatus">Employment Status</Label>
          <Select
            value={formData.employmentStatus}
            onValueChange={handleEmploymentStatusChange}
            disabled={isReadOnly}
          >
            <SelectTrigger id="employmentStatus" className="w-full h-12 rounded-none">
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EMPLOYED">Employed</SelectItem>
              <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
              <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
              <SelectItem value="RETIRED">Retired</SelectItem>
            </SelectContent>
          </Select>
          {showErrors.employmentStatus && (
            <span className="text-red-500 text-sm">Employment status is required</span>
          )}
        </div>

        {isEmployed && (
          <>
            <div className="space-y-2">
              <Label htmlFor="employerName">Employer Name</Label>
              <Input
                id="employerName"
                name="employerName"
                value={formData.employerName}
                onChange={(e) => handleChange('employerName', e.target.value)}
                onBlur={() => handleBlur('employerName')}
                disabled={isReadOnly}
                className="h-12 rounded-none"
              />
              {showErrors.employerName && (
                <span className="text-red-500 text-sm">Employer name is required</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                onBlur={() => handleBlur('jobTitle')}
                disabled={isReadOnly}
                className="h-12 rounded-none"
              />
              {showErrors.jobTitle && (
                <span className="text-red-500 text-sm">Job title is required</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workAddress">Work Address</Label>
              <Input
                id="workAddress"
                name="workAddress"
                value={formData.workAddress}
                onChange={(e) => handleChange('workAddress', e.target.value)}
                onBlur={() => handleBlur('workAddress')}
                disabled={isReadOnly}
                className="h-12 rounded-none"
              />
              {showErrors.workAddress && (
                <span className="text-red-500 text-sm">Work address is required</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income</Label>
              <Input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => handleChange('monthlyIncome', Number(e.target.value))}
                onBlur={() => handleBlur('monthlyIncome')}
                disabled={isReadOnly}
                className="h-12 rounded-none"
              />
              {showErrors.monthlyIncome && (
                <span className="text-red-500 text-sm">Monthly income is required</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentStartDate">Employment Start Date</Label>
              <Input
                id="employmentStartDate"
                name="employmentStartDate"
                type="date"
                value={formData.employmentStartDate}
                onChange={(e) => handleChange('employmentStartDate', e.target.value)}
                onBlur={() => handleBlur('employmentStartDate')}
                disabled={isReadOnly}
                max={new Date().toISOString().split('T')[0]}
                className="h-12 rounded-none"
              />
              {showErrors.employmentStartDate && (
                <span className="text-red-500 text-sm">Employment start date is required</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workEmail">Work Email</Label>
              <Input
                id="workEmail"
                name="workEmail"
                type="email"
                value={formData.workEmail}
                onChange={(e) => handleChange('workEmail', e.target.value)}
                onBlur={() => handleBlur('workEmail')}
                disabled={isReadOnly}
                className="h-12 rounded-none"
              />
              {showErrors.workEmail && (
                <span className="text-red-500 text-sm">Please enter a valid work email address</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workPhone">Work Phone</Label>
              <Input
                id="workPhone"
                name="workPhone"
                value={formData.workPhone}
                onChange={(e) => handleChange('workPhone', e.target.value)}
                onBlur={() => handleBlur('workPhone')}
                disabled={isReadOnly}
                className="h-12 rounded-none"
              />
              {showErrors.workPhone && (
                <span className="text-red-500 text-sm">Please enter a valid work phone number</span>
              )}
            </div>
          </>
        )}
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
          onClose={handleCloseModal}
          onGetLoan={onGetLoan}
          type="loan"
        />
      )}
    </form>
  );
}
