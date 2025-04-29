"use client";

import React, { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import { HiOutlineUpload } from "react-icons/hi";
import ProfileSavedModal from "@/app/components/ProfileSavedModal";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BankStatementFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
}

interface FileWithPreview extends File {
  preview?: string;
}

export default function BankStatementForm({ onSave, allFormsCompleted, onGetLoan }: BankStatementFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const router = useRouter();

  // Handle file drop for statements
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(prev => [...prev, ...filesWithPreview]);
    // Auto-select upload method when files are added
    setSelectedMethod('upload');
  }, []);

  // Remove file
  const removeFile = (fileToRemove: FileWithPreview) => {
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files.filter(file => file !== fileToRemove));
    
    // If no files remain, unselect the upload method
    if (files.length <= 1 && selectedMethod === 'upload') {
      setSelectedMethod(null);
    }
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

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMethod === 'upload' && files.length === 0) {
      // Show validation error
      return;
    }

    if (onSave) {
      const data = {
        method: selectedMethod,
        files: selectedMethod === 'upload' ? files : []
      };
      onSave(data);
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

  const isFormValid = () => {
    if (!selectedMethod) return false;
    if (selectedMethod === 'upload' && files.length === 0) return false;
    return true;
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block mb-4">Via Mono</Label>
              <div 
                className={`p-6 bg-accent-red border-2 ${selectedMethod === 'mono' ? 'border-red-500' : 'border-transparent'} cursor-pointer transition-all duration-200`}
                onClick={() => handleMethodSelect('mono')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm">Proceed using</span>
                    <div className="ml-2">
                      <Image 
                        src="/assets/svgs/mono.svg" 
                        alt="Mono" 
                        width={80} 
                        height={28} 
                      />
                    </div>
                  </div>
                  <Image 
                    src="/assets/svgs/arrow-right.svg"
                    alt="Proceed" 
                    width={16} 
                    height={16} 
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="block mb-4">Via Mybankstatement</Label>
              <div 
                className={`p-6 bg-accent-red border-2 ${selectedMethod === 'mybankstatement' ? 'border-red-500' : 'border-transparent'} cursor-pointer transition-all duration-200`}
                onClick={() => handleMethodSelect('mybankstatement')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm">Proceed using</span>
                    <div className="ml-2">
                      <Image 
                        src="/assets/svgs/bank-statement.svg" 
                        alt="MyBankStatement" 
                        width={120} 
                        height={28} 
                      />
                    </div>
                  </div>
                  <Image 
                    src="/assets/svgs/arrow-right.svg"
                    alt="Proceed" 
                    width={16} 
                    height={16} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-sm font-bold">Or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div>
            <Label className="block mb-4">Upload</Label>
            
            {files.length === 0 ? (
              <div 
                className={`cursor-pointer transition-all duration-200 p-8 border-2 border-dashed 
                  ${isDragActive 
                    ? 'border-gray-400 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                onClick={() => {
                  setSelectedMethod('upload');
                  open(); // Explicitly open the file dialog
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <HiOutlineUpload className="w-6 h-6 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    {isDragActive ? 'Drop files here' : 'Upload'}
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
                  onClick={open} // Explicitly open file dialog on click
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
