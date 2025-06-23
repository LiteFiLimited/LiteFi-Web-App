"use client";

import React, { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import { HiOutlineUpload } from "react-icons/hi";
import ProfileSavedModal from "@/app/components/ProfileSavedModal";
import { useRouter } from "next/navigation";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToastContext } from '@/app/components/ToastProvider';

interface BankStatementFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

export default function BankStatementForm({ onSave, allFormsCompleted, onGetLoan, isReadOnly }: BankStatementFormProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { uploadBankStatement } = useUserProfile();
  const { error: showError } = useToastContext();

  // Handle file drop for statements
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  // Remove file
  const removeFile = (fileToRemove: FileWithPreview) => {
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files.filter(file => file !== fileToRemove));
  };

  // Set up dropzone with explicit click handling to ensure it opens the file dialog
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    noClick: false, // Ensure clicks are processed
    noKeyboard: false // Allow keyboard navigation 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      showError('Error', 'Please upload at least one bank statement');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`statement`, file);
      });

      const success = await uploadBankStatement(formData);
      if (success) {
        setShowSavedModal(true);
        if (onSave) {
          onSave({ files });
        }
      }
    } catch (error: any) {
      showError('Error', error.message || 'Failed to upload bank statement');
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

  const isFormValid = () => {
    return files.length > 0;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-8">
          <div>
            <Label className="block mb-4">Upload Bank Statement</Label>
            
            {files.length === 0 ? (
              <div 
                className={`cursor-pointer transition-all duration-200 p-8 border-2 border-dashed 
                  ${isDragActive 
                    ? 'border-gray-400 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                onClick={open}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <HiOutlineUpload className="w-6 h-6 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    {isDragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Supported formats: PDF, PNG, JPG, JPEG
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-transparent">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 mb-2 border">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 text-xs">DOC</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file)}
                      className="flex-shrink-0 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Add more files option */}
                <div 
                  className="cursor-pointer transition-all duration-200 p-6 text-center border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 mt-4"
                  onClick={open}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <HiOutlineUpload className="w-5 h-5 text-gray-400 mb-2" />
                    <div className="text-sm text-gray-600">Add more files</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className={`h-12 px-16 rounded-none ${
              isFormValid() && !isSubmitting
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-red-300 cursor-not-allowed text-white"
            }`}
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Save'}
          </Button>
        </div>
      </form>

      {showSavedModal && (
        <ProfileSavedModal
          open={showSavedModal}
          onClose={handleCloseModal}
          onViewProfile={handleViewProfile}
          allFormsCompleted={allFormsCompleted}
          onGetLoan={onGetLoan}
        />
      )}
    </>
  );
}
