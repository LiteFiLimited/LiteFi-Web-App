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
import { useFormValidator } from "@/lib/formValidator";
import { Button } from "@/components/ui/button";
import { useUserProfile } from '@/hooks/useUserProfile';
import { validationRules } from '@/lib/formValidator';
import { EmploymentInfo } from '@/types/user';
import { useToastContext } from '@/app/components/ToastProvider';
import ConfirmationModal from '@/app/components/ConfirmationModal';

interface EmploymentInfoFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

// Updated interface to match backend API
interface EmploymentFormData {
  employmentStatus: 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'STUDENT' | 'RETIRED';
  employer?: string;
  jobTitle?: string;
  workEmail?: string;
  workPhone?: string;
  monthlySalary?: number;
  employerAddress?: string;
  employerStreet?: string;
  employerCity?: string;
  employerState?: string;
  employerCountry?: string;
  startDate?: string; // Format: dd/mm/yyyy
  salaryPaymentDate?: number; // 1-31
}

export default function EmploymentInfoForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: EmploymentInfoFormProps) {
  const { profile, isLoading, updateEmployment, fetchProfile } = useUserProfile();
  const router = useRouter();
  const { error: showError } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Individual field read-only states based on actual employment data
  const [fieldReadOnlyStatus, setFieldReadOnlyStatus] = useState({
    employmentStatus: false,
    employer: false,
    jobTitle: false,
    workEmail: false,
    workPhone: false,
    monthlySalary: false,
    employerAddress: false,
    employerStreet: false,
    employerCity: false,
    employerState: false,
    employerCountry: false,
    startDate: false,
    salaryPaymentDate: false
  });

  // Map profile data to form data structure
  const getInitialFormData = (): EmploymentFormData => ({
    employmentStatus: 'UNEMPLOYED',
    employer: "",
    jobTitle: "",
    workEmail: "",
    workPhone: "",
    monthlySalary: 0,
    employerAddress: "",
    employerStreet: "",
    employerCity: "",
    employerState: "",
    employerCountry: "",
    startDate: "",
    salaryPaymentDate: 1
  });

  // Initialize form validator with initial data and empty rules
  const {
    formData,
    setFormData,
    showErrors,
    handleChange,
    handleBlur,
    touchAllFields,
    isFormValid,
    setValidationRules
  } = useFormValidator<EmploymentFormData>(getInitialFormData(), {});

  // Custom handleChange that tracks user modifications
  const handleUserChange = (field: keyof EmploymentFormData, value: string | number) => {
    handleChange(field, value);
    setHasUserMadeChanges(true);
  };

  // Set up validation rules after formData is initialized
  useEffect(() => {
    setValidationRules({
      employmentStatus: validationRules.required,
      employer: (value: string): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
      jobTitle: (value: string): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
      workEmail: (value: string): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? validationRules.email(value) : true,
      workPhone: (value: string): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
      monthlySalary: (value: number): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? value > 0 : true,
      employerAddress: (value: string): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
      employerStreet: (value: string): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
      employerCity: (value: string): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
      employerState: (value: string): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
      employerCountry: (value: string): boolean => 
        formData.employmentStatus === 'EMPLOYED' ? validationRules.required(value) : true,
      startDate: (value: string): boolean => {
        if (formData.employmentStatus !== 'EMPLOYED') return true;
        if (!validationRules.required(value)) return false;
        // Validate date format (dd/mm/yyyy)
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        return datePattern.test(value);
      },
      salaryPaymentDate: (value: number): boolean => {
        if (formData.employmentStatus !== 'EMPLOYED') return true;
        return value >= 1 && value <= 31;
      }
    });
  }, [formData.employmentStatus, setValidationRules]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile?.employment) {
      const employment = profile.employment;
      const newFormData: EmploymentFormData = {
        employmentStatus: employment.employmentStatus || 'UNEMPLOYED',
        employer: employment.employer || "",
        jobTitle: employment.jobTitle || "",
        workEmail: employment.workEmail || "",
        workPhone: employment.workPhone || "",
        monthlySalary: employment.monthlySalary || 0,
        employerAddress: employment.employerAddress || "",
        employerStreet: employment.employerStreet || "",
        employerCity: employment.employerCity || "",
        employerState: employment.employerState || "",
        employerCountry: employment.employerCountry || "",
        startDate: employment.startDate || "",
        salaryPaymentDate: employment.salaryPaymentDate || 1
      };
      
      setFormData(newFormData);
      // Ensure loading employment data doesn't trigger hasUserMadeChanges
      setHasUserMadeChanges(false);

      // Update field read-only states based on actual employment data
      // Fields are read-only if they have values (not null/empty)
      setFieldReadOnlyStatus({
        employmentStatus: !!employment.employmentStatus,
        employer: !!employment.employer,
        jobTitle: !!employment.jobTitle,
        workEmail: !!employment.workEmail,
        workPhone: !!employment.workPhone,
        monthlySalary: !!(employment.monthlySalary && employment.monthlySalary > 0),
        employerAddress: !!employment.employerAddress,
        employerStreet: !!employment.employerStreet,
        employerCity: !!employment.employerCity,
        employerState: !!employment.employerState,
        employerCountry: !!employment.employerCountry,
        startDate: !!employment.startDate,
        salaryPaymentDate: !!(employment.salaryPaymentDate && employment.salaryPaymentDate > 0)
      });
      
      // Make sure loading employment data doesn't trigger save button
      setHasUserMadeChanges(false);
    }
  }, [profile]);

  // Handle employment status change
  const handleEmploymentStatusChange = (status: EmploymentFormData['employmentStatus']) => {
    handleUserChange('employmentStatus', status);
    setServerErrors([]);
    
    // Reset form if not employed
    if (status !== 'EMPLOYED') {
      setFormData({
        employmentStatus: status,
        employer: "",
        jobTitle: "",
        workEmail: "",
        workPhone: "",
        monthlySalary: 0,
        employerAddress: "",
        employerStreet: "",
        employerCity: "",
        employerState: "",
        employerCountry: "",
        startDate: "",
        salaryPaymentDate: 1
      });
    }
  };

  const formatDateForSubmission = (date: string): string => {
    // If already in dd/mm/yyyy format, return as is
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      return date;
    }
    
    // If in yyyy-mm-dd format (from input type="date"), convert to dd/mm/yyyy
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    }
    
    return date;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAllFields();
    setServerErrors([]);

    if (isFormValid()) {
      // Show confirmation modal instead of directly submitting
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      // For EMPLOYED status, send all fields
      // For other statuses, only send the status
      const employmentData: any = {
        employmentStatus: formData.employmentStatus
      };

      if (formData.employmentStatus === 'EMPLOYED') {
        employmentData.employer = formData.employer;
        employmentData.jobTitle = formData.jobTitle;
        employmentData.workEmail = formData.workEmail;
        employmentData.workPhone = formData.workPhone;
        employmentData.monthlySalary = Number(formData.monthlySalary);
        employmentData.employerAddress = formData.employerAddress;
        employmentData.employerStreet = formData.employerStreet;
        employmentData.employerCity = formData.employerCity;
        employmentData.employerState = formData.employerState;
        employmentData.employerCountry = formData.employerCountry;
        employmentData.startDate = formatDateForSubmission(formData.startDate || '');
        employmentData.salaryPaymentDate = Number(formData.salaryPaymentDate);
      }

      const success = await updateEmployment(employmentData);
      if (success) {
        // Refresh the employment data to show updated values
        await fetchProfile();
        // Reset the flag since changes have been saved
        setHasUserMadeChanges(false);
        setShowSavedModal(true);
        if (onSave) {
          onSave(employmentData);
        }
      }
    } catch (error: any) {
      // Handle array of error messages from backend
      if (Array.isArray(error.message)) {
        setServerErrors(error.message);
      } else {
        showError('Error', error.message || 'Failed to update employment information. Please try again.');
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
      {serverErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
          <h3 className="font-medium">Please fix the following errors:</h3>
          <ul className="list-disc pl-5 mt-2">
            {serverErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="employmentStatus">Employment Status</Label>
          <Select
            value={formData.employmentStatus}
            onValueChange={handleEmploymentStatusChange}
            disabled={fieldReadOnlyStatus.employmentStatus || isSubmitting}
          >
            <SelectTrigger id="employmentStatus" className="w-full h-12 rounded-none">
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EMPLOYED">Employed</SelectItem>
              <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
              <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
              <SelectItem value="RETIRED">Retired</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isEmployed && (
          <>
            <div className="space-y-2">
              <Label htmlFor="employer">Employer</Label>
              <Input
                id="employer"
                name="employer"
                value={formData.employer || ''}
                onChange={(e) => handleUserChange("employer", e.target.value)}
                onBlur={() => handleBlur("employer")}
                className={`h-12 rounded-none ${showErrors.employer ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.employer || isSubmitting}
                placeholder="Enter your employer's name"
              />
              {showErrors.employer && (
                <p className="text-red-500 text-sm">Employer is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle || ''}
                onChange={(e) => handleUserChange("jobTitle", e.target.value)}
                onBlur={() => handleBlur("jobTitle")}
                className={`h-12 rounded-none ${showErrors.jobTitle ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.jobTitle || isSubmitting}
                placeholder="Enter your job title"
              />
              {showErrors.jobTitle && (
                <p className="text-red-500 text-sm">Job title is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workEmail">Work Email</Label>
              <Input
                id="workEmail"
                name="workEmail"
                type="email"
                value={formData.workEmail || ''}
                onChange={(e) => handleUserChange("workEmail", e.target.value)}
                onBlur={() => handleBlur("workEmail")}
                className={`h-12 rounded-none ${showErrors.workEmail ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.workEmail || isSubmitting}
                placeholder="Enter your work email address"
              />
              {showErrors.workEmail && (
                <p className="text-red-500 text-sm">Please enter a valid work email</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workPhone">Work Phone</Label>
              <Input
                id="workPhone"
                name="workPhone"
                value={formData.workPhone || ''}
                onChange={(e) => handleUserChange("workPhone", e.target.value)}
                onBlur={() => handleBlur("workPhone")}
                className={`h-12 rounded-none ${showErrors.workPhone ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.workPhone || isSubmitting}
                placeholder="Enter your work phone number"
              />
              {showErrors.workPhone && (
                <p className="text-red-500 text-sm">Work phone number is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlySalary">Monthly Salary</Label>
              <Input
                id="monthlySalary"
                name="monthlySalary"
                type="number"
                value={formData.monthlySalary || ''}
                onChange={(e) => handleUserChange("monthlySalary", Number(e.target.value))}
                onBlur={() => handleBlur("monthlySalary")}
                className={`h-12 rounded-none ${showErrors.monthlySalary ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.monthlySalary || isSubmitting}
                placeholder="Enter your monthly salary"
                min="0"
              />
              {showErrors.monthlySalary && (
                <p className="text-red-500 text-sm">Monthly salary must be greater than 0</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerAddress">Employer Address</Label>
              <Input
                id="employerAddress"
                name="employerAddress"
                value={formData.employerAddress || ''}
                onChange={(e) => handleUserChange("employerAddress", e.target.value)}
                onBlur={() => handleBlur("employerAddress")}
                className={`h-12 rounded-none ${showErrors.employerAddress ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.employerAddress || isSubmitting}
              />
              {showErrors.employerAddress && (
                <p className="text-red-500 text-sm">Employer address is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerStreet">Employer Street</Label>
              <Input
                id="employerStreet"
                name="employerStreet"
                value={formData.employerStreet || ''}
                onChange={(e) => handleUserChange("employerStreet", e.target.value)}
                onBlur={() => handleBlur("employerStreet")}
                className={`h-12 rounded-none ${showErrors.employerStreet ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.employerStreet || isSubmitting}
                placeholder="Enter your employer's street address"
              />
              {showErrors.employerStreet && (
                <p className="text-red-500 text-sm">Employer street address is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerCity">Employer City</Label>
              <Input
                id="employerCity"
                name="employerCity"
                value={formData.employerCity || ''}
                onChange={(e) => handleUserChange("employerCity", e.target.value)}
                onBlur={() => handleBlur("employerCity")}
                className={`h-12 rounded-none ${showErrors.employerCity ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.employerCity || isSubmitting}
                placeholder="Enter your employer's city"
              />
              {showErrors.employerCity && (
                <p className="text-red-500 text-sm">Employer city is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerState">Employer State</Label>
              <Input
                id="employerState"
                name="employerState"
                value={formData.employerState || ''}
                onChange={(e) => handleUserChange("employerState", e.target.value)}
                onBlur={() => handleBlur("employerState")}
                className={`h-12 rounded-none ${showErrors.employerState ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.employerState || isSubmitting}
                placeholder="Enter your employer's state"
              />
              {showErrors.employerState && (
                <p className="text-red-500 text-sm">Employer state is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employerCountry">Employer Country</Label>
              <Input
                id="employerCountry"
                name="employerCountry"
                value={formData.employerCountry || ''}
                onChange={(e) => handleUserChange("employerCountry", e.target.value)}
                onBlur={() => handleBlur("employerCountry")}
                className={`h-12 rounded-none ${showErrors.employerCountry ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.employerCountry || isSubmitting}
                placeholder="Enter your employer's country"
              />
              {showErrors.employerCountry && (
                <p className="text-red-500 text-sm">Employer country is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                value={formData.startDate || ''}
                onChange={(e) => handleUserChange("startDate", e.target.value)}
                onBlur={() => handleBlur("startDate")}
                className={`h-12 rounded-none ${showErrors.startDate ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.startDate || isSubmitting}
                placeholder="DD/MM/YYYY"
              />
              {showErrors.startDate && (
                <p className="text-red-500 text-sm">Please enter a valid start date (DD/MM/YYYY)</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryPaymentDate">Salary Payment Date</Label>
              <Input
                id="salaryPaymentDate"
                name="salaryPaymentDate"
                type="number"
                min="1"
                max="31"
                value={formData.salaryPaymentDate || ''}
                onChange={(e) => handleUserChange("salaryPaymentDate", Number(e.target.value))}
                onBlur={() => handleBlur("salaryPaymentDate")}
                className={`h-12 rounded-none ${showErrors.salaryPaymentDate ? 'border-red-500' : ''}`}
                disabled={fieldReadOnlyStatus.salaryPaymentDate || isSubmitting}
                placeholder="Enter day of month (1-31)"
              />
              {showErrors.salaryPaymentDate && (
                <p className="text-red-500 text-sm">Please enter a valid day of month (1-31)</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        {hasUserMadeChanges && (
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        )}
        
        {allEditableFieldsCompleted && !hasUserMadeChanges && (
          <Button 
            type="button" 
            disabled={true}
            className="bg-gray-400 text-white cursor-not-allowed px-8 py-2 rounded-none"
          >
            Employment Locked
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
        title="Employment Information"
      />
    </form>
  );
}
