"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import { HiOutlineUpload } from "react-icons/hi";
import ProfileSavedModal from "@/app/components/ProfileSavedModal";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { useRouter } from "next/navigation";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToastContext } from '@/app/components/ToastProvider';
import { Document } from '@/types/user';

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
  const [existingBankStatement, setExistingBankStatement] = useState<Document | null>(null);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { uploadBankStatement, fetchDocuments } = useUserProfile();
  const { error: showError, success } = useToastContext();

  // Load existing bank statement on component mount
  useEffect(() => {
    const loadExistingBankStatement = async () => {
      try {
        setIsLoading(true);
        const docs = await fetchDocuments();
        
        // Ensure docs is an array before using find
        if (Array.isArray(docs)) {
          // Find existing bank statement
          const bankStatement = docs.find((doc: Document) => doc.type === 'BANK_STATEMENT');
          if (bankStatement) {
            setExistingBankStatement(bankStatement);
          }
        } else {
          console.warn('fetchDocuments did not return an array:', docs);
        }
      } catch (error) {
        console.error('Failed to load existing bank statements:', error);
        showError('Error', 'Failed to load existing bank statements');
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingBankStatement();
  }, [fetchDocuments]); // Now safe to include since fetchDocuments is memoized

  // Handle file drop for statements - only allow if no existing bank statement
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (existingBankStatement) {
      showError('Error', 'Bank statement already uploaded. You cannot upload multiple bank statements.');
      return;
    }
    
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(prev => [...prev, ...filesWithPreview]);
  }, [existingBankStatement, showError]);

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
    noKeyboard: false, // Allow keyboard navigation 
    disabled: !!existingBankStatement // Disable if bank statement already exists
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingBankStatement) {
      showError('Error', 'Bank statement already uploaded. You cannot upload multiple bank statements.');
      return;
    }
    
    if (files.length === 0) {
      showError('Error', 'Please upload at least one bank statement');
      return;
    }

    // Show confirmation modal instead of direct submission
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    
    try {
      // Upload each file individually using the new uploadBankStatement function
      const uploadPromises = files.map(async (file) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('description', 'Bank Statement (Last 6 Months)'); // More descriptive label
          
          await uploadBankStatement(formData);
          return true;
        } catch (error) {
          console.error(`Failed to upload bank statement:`, error);
          // Extract the error message and clean it up
          const errorMessage = error instanceof Error ? error.message : String(error);
          showError('Error', `Failed to upload ${file.name}: ${errorMessage}`);
          return false;
        }
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      
      // Check if all uploads were successful
      if (results.every(result => result)) {
        success('Success', 'Bank statement uploaded successfully');
        setShowSavedModal(true);
        if (onSave) {
          onSave({ files });
        }
        
        // Reload existing documents to update the UI
        const docs = await fetchDocuments();
        const bankStatement = docs.find((doc: Document) => doc.type === 'BANK_STATEMENT');
        if (bankStatement) {
          setExistingBankStatement(bankStatement);
        }
        
        // Clear uploaded files since they're now saved
        setFiles([]);
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
    return files.length > 0 && !existingBankStatement;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading bank statements...</div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-8">
          <div>
            <Label className="block mb-4">
              Upload Bank Statement
              {existingBankStatement && <span className="ml-2 text-xs text-green-600">✓ Already Uploaded</span>}
            </Label>
            
            {/* Show existing bank statement if it exists */}
            {existingBankStatement ? (
              <div className="bg-green-50 p-4 border border-green-200 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-semibold">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">{existingBankStatement.fileName}</p>
                    <p className="text-xs text-green-600">
                      {(existingBankStatement.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded on {new Date(existingBankStatement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-green-700 mt-2">
                  Bank statement has been uploaded successfully. According to our policy, only one bank statement can be uploaded per profile.
                </p>
              </div>
            ) : files.length === 0 ? (
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
              </div>
            )}
          </div>
        </div>

        {!existingBankStatement && (
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
        )}
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

      <ConfirmationModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Bank Statement Upload"
      />
    </>
  );
}
