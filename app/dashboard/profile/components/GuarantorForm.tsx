"use client";

import React, { useState, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";

interface GuarantorFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
}

interface FileWithPreview extends File {
  preview?: string;
}

type ValidationState = "idle" | "loading" | "success" | "error";

export default function GuarantorForm({ onSave, allFormsCompleted, onGetLoan }: GuarantorFormProps) {
  const initialFormData = {
    firstName: "",
    lastName: "",
    middleName: "",
    relationship: "",
    phoneNumber: "",
    emailAddress: "",
    bvn: ""
  };

  const [showSavedModal, setShowSavedModal] = useState(false);
  const [idCardFile, setIdCardFile] = useState<FileWithPreview | null>(null);
  const router = useRouter();
  
  // Add BVN validation state
  const [bvnValidationState, setBvnValidationState] = useState<ValidationState>("idle");
  const [bvnReadOnly, setBvnReadOnly] = useState(false);
  const [testSuccess, setTestSuccess] = useState(true);

  // Define validation rules for the form fields
  const rules = {
    firstName: validationRules.required,
    lastName: validationRules.required,
    middleName: () => true, // Optional field
    relationship: validationRules.required,
    phoneNumber: validationRules.phone,
    emailAddress: validationRules.optionalEmail, // Optional but must be valid if provided
    bvn: (value: string) => /^\d{11}$/.test(value) && bvnValidationState === "success"
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

  // Implement BVN validation
  const validateBVN = async () => {
    if (!/^\d{11}$/.test(formData.bvn)) return;
    
    setBvnValidationState("loading");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isValid = testSuccess;
      
      if (isValid) {
        setBvnValidationState("success");
        setBvnReadOnly(true);
      } else {
        setBvnValidationState("error");
      }
    } catch (error) {
      setBvnValidationState("error");
    }
  };

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
    return isFormValid() && idCardFile !== null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Touch all fields to display errors
    touchAllFields();

    if (isFormWithFileValid() && onSave) {
      const submittedData = {
        ...formData,
        idCardFile
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

  const renderBvnValidationIndicator = () => {
    switch (bvnValidationState) {
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
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="business-partner">Business Partner</SelectItem>
                  <SelectItem value="colleague">Colleague</SelectItem>
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
                <p className="text-xs text-red-500">Enter a valid phone number (10-11 digits)</p>
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
              <div className="flex justify-between items-center">
                <Label htmlFor="bvn">BVN</Label>
                <div className="flex items-center gap-2">
                  {/^\d{11}$/.test(formData.bvn) && bvnValidationState !== "loading" && bvnValidationState !== "success" && !bvnReadOnly && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">{testSuccess ? "Success" : "Fail"}</span>
                        <Switch 
                          checked={testSuccess}
                          onCheckedChange={setTestSuccess}
                          className="scale-75"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={validateBVN}
                        className="text-xs h-8"
                      >
                        Validate
                      </Button>
                    </div>
                  )}
                </div>
              </div>
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
                <p className="text-xs text-red-500">BVN must be validated</p>
              )}
              {bvnValidationState === "error" && (
                <p className="text-xs text-red-500">Invalid BVN. Please check and try again.</p>
              )}
              {!/^\d{11}$/.test(formData.bvn) && formData.bvn !== "" && (
                <p className="text-xs text-gray-500">BVN must be exactly 11 digits</p>
              )}
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
              {!idCardFile && (
                <p className="text-xs text-red-500 mt-1">Guarantor ID card is required</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className={`h-12 px-16 rounded-none ${
              isFormWithFileValid() 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-red-300 cursor-not-allowed text-white"
            }`}
            disabled={!isFormWithFileValid()}
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
