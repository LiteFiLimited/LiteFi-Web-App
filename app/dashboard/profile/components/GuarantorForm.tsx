"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import { HiOutlineUpload } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import ProfileSavedModal from "@/app/components/ProfileSavedModal";
import { useRouter } from "next/navigation";
import { useFormValidator, validationRules } from "@/lib/formValidator";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToastContext } from '@/app/components/ToastProvider';

interface GuarantorFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

type ValidationState = "idle" | "loading" | "success" | "error";

export default function GuarantorForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly = false }: GuarantorFormProps) {
  const { profile, isLoading: profileLoading, updateGuarantor } = useUserProfile();
  const { error: showError } = useToastContext();
  
  const initialFormData = {
    firstName: "",
    lastName: "",
    middleName: "",
    relationship: "",
    phoneNumber: "",
    emailAddress: "",
    bvn: "",
    occupation: "",
    address: ""
  };

  const [showSavedModal, setShowSavedModal] = useState(false);
  const [idCardFile, setIdCardFile] = useState<FileWithPreview | null>(null);
  const router = useRouter();
  
  // Add BVN validation state
  const [bvnValidationState, setBvnValidationState] = useState<ValidationState>("idle");
  const [bvnReadOnly, setBvnReadOnly] = useState(isReadOnly);

  // Define validation rules for the form fields
  const rules = {
    firstName: validationRules.required,
    lastName: validationRules.required,
    middleName: () => true, // Optional field
    relationship: validationRules.required,
    phoneNumber: validationRules.phone,
    emailAddress: validationRules.optionalEmail, // Optional but must be valid if provided
    bvn: (value: string) => /^\d{11}$/.test(value),
    occupation: validationRules.required,
    address: validationRules.required
  };

  // Use the form validator hook
  const {
    formData,
    setFormData,
    showErrors,
    validations,
    handleChange,
    handleBlur,
    touchAllFields,
    isFormValid
  } = useFormValidator(initialFormData, rules);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile?.guarantor) {
      const guarantor = profile.guarantor;
      setFormData({
        firstName: guarantor.firstName || "",
        lastName: guarantor.lastName || "",
        middleName: guarantor.middleName || "",
        relationship: guarantor.relationship || "",
        phoneNumber: guarantor.phone || "",
        emailAddress: guarantor.email || "",
        bvn: guarantor.bvn || "",
        occupation: guarantor.occupation || "",
        address: guarantor.address || ""
      });

      // Set validation states if values exist
      if (guarantor.bvn) {
        setBvnValidationState("success");
        setBvnReadOnly(true);
      }
    }
  }, [profile]);

  // Dropzone setup for ID card upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0])
      });
      setIdCardFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const removeFile = () => {
    if (idCardFile?.preview) {
      URL.revokeObjectURL(idCardFile.preview);
    }
    setIdCardFile(null);
  };

  // Check if form is valid including the required ID card file
  const isFormWithFileValid = () => {
    return isFormValid() && (idCardFile !== null || profile?.guarantor?.idCardUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAllFields();

    if (!isFormWithFileValid()) {
      showError("Please fill all required fields correctly and upload an ID card");
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('firstName', formData.firstName);
      formDataToSubmit.append('lastName', formData.lastName);
      formDataToSubmit.append('middleName', formData.middleName);
      formDataToSubmit.append('relationship', formData.relationship);
      formDataToSubmit.append('email', formData.emailAddress);
      formDataToSubmit.append('phone', formData.phoneNumber);
      formDataToSubmit.append('bvn', formData.bvn);
      formDataToSubmit.append('occupation', formData.occupation);
      formDataToSubmit.append('address', formData.address);

      if (idCardFile) {
        formDataToSubmit.append('idCard', idCardFile);
      }

      await updateGuarantor(formDataToSubmit);
      setShowSavedModal(true);
      if (onSave) onSave(formData);
    } catch (error) {
      showError("Failed to save guarantor information. Please try again.");
    }
  };
  
  const handleCloseModal = () => {
    setShowSavedModal(false);
  };
  
  const handleStartInvesting = () => {
    setShowSavedModal(false);
    router.push('/dashboard/investments');
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

  if (profileLoading) {
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
              <Label htmlFor="firstName">Guarantor First Name</Label>
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
              <Label htmlFor="lastName">Guarantor Last Name</Label>
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
              <Label htmlFor="middleName">Guarantor Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
                placeholder="Enter middle name (optional)"
                className="h-12 rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship with Guarantor</Label>
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
                  <SelectItem value="HUSBAND">Spouse (Husband)</SelectItem>
                  <SelectItem value="WIFE">Spouse (Wife)</SelectItem>
                  <SelectItem value="FATHER">Father</SelectItem>
                  <SelectItem value="MOTHER">Mother</SelectItem>
                  <SelectItem value="BROTHER">Brother</SelectItem>
                  <SelectItem value="SISTER">Sister</SelectItem>
                  <SelectItem value="SON">Son</SelectItem>
                  <SelectItem value="DAUGHTER">Daughter</SelectItem>
                  <SelectItem value="OTHER_RELATIVE">Other Relative</SelectItem>
                  <SelectItem value="FRIEND">Friend</SelectItem>
                </SelectContent>
              </Select>
              {showErrors.relationship && (
                <p className="text-xs text-red-500">Relationship is required</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Guarantor Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                onBlur={() => handleBlur("phoneNumber")}
                placeholder="Enter phone number"
                className={`h-12 rounded-none ${showErrors.phoneNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.phoneNumber && (
                <p className="text-xs text-red-500">Please enter a valid phone number</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailAddress">Guarantor Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleChange("emailAddress", e.target.value)}
                onBlur={() => handleBlur("emailAddress")}
                placeholder="Enter email address"
                className={`h-12 rounded-none ${showErrors.emailAddress ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.emailAddress && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bvn">BVN</Label>
              <div className="relative">
                <Input
                  id="bvn"
                  value={formData.bvn}
                  onChange={(e) => handleChange("bvn", e.target.value.replace(/\D/g, '').slice(0, 11))}
                  onBlur={() => handleBlur("bvn")}
                  placeholder="Enter BVN"
                  className={`h-12 rounded-none pr-10 ${
                    bvnValidationState === "error" || showErrors.bvn ? 'border-red-500 focus-visible:ring-red-500' : 
                    bvnValidationState === "success" ? 'border-green-500 focus-visible:ring-green-500' : ''
                  }`}
                  readOnly={bvnReadOnly}
                  disabled={bvnValidationState === "loading" || bvnReadOnly}
                />
                <div className="absolute right-3 top-3.5">
                  {renderBvnValidationIndicator()}
                </div>
              </div>
              {showErrors.bvn && (
                <p className="text-xs text-red-500">BVN must be 11 digits</p>
              )}
              {!/^\d{11}$/.test(formData.bvn) && formData.bvn !== "" && (
                <p className="text-xs text-gray-500">BVN must be exactly 11 digits</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Guarantor Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
                onBlur={() => handleBlur("occupation")}
                placeholder="Enter occupation"
                className={`h-12 rounded-none ${showErrors.occupation ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.occupation && (
                <p className="text-xs text-red-500">Occupation is required</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="address">Guarantor Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                placeholder="Enter full address"
                className={`h-12 rounded-none ${showErrors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {showErrors.address && (
                <p className="text-xs text-red-500">Address is required</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Guarantor ID card</Label>
            {idCardFile ? (
              <div className="flex items-center justify-between bg-white p-3 border">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-xs">ID</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{idCardFile.name}</p>
                    <p className="text-xs text-gray-500">{(idCardFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 p-0 flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`cursor-pointer transition-all duration-200 p-8 text-center border-2 border-dashed 
                  ${isDragAccept 
                    ? 'border-gray-400 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <HiOutlineUpload className="w-6 h-6 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    {isDragAccept ? 'Drop file here' : 'Upload'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 h-12 rounded-none"
            disabled={!isFormWithFileValid()}
          >
            Save
          </Button>
          {allFormsCompleted && (
            <Button
              type="button"
              onClick={onGetLoan}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 h-12 rounded-none"
            >
              Get Loan
            </Button>
          )}
        </div>
      </form>

      {showSavedModal && (
        <ProfileSavedModal
          open={showSavedModal}
          onClose={handleCloseModal}
          onViewProfile={handleStartInvesting}
          allFormsCompleted={allFormsCompleted}
        />
      )}
    </>
  );
}