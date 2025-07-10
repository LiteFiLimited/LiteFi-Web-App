"use client";

import React, { useState, useCallback } from "react";
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

interface DocumentsFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  isReadOnly?: boolean;
  savedDocuments?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

interface DocumentsState {
  governmentId?: FileWithPreview;
  utilityBill?: FileWithPreview;
  workId?: FileWithPreview;
  cacCertificate?: FileWithPreview;
  cacMemart?: FileWithPreview;
  storeFront?: FileWithPreview;
  goodsImages?: FileWithPreview;
}

// Document type mapping for API
const DOCUMENT_TYPE_MAPPING = {
  governmentId: 'ID_DOCUMENT',
  utilityBill: 'UTILITY_BILL',
  workId: 'ID_DOCUMENT',
  cacCertificate: 'OTHER',
  cacMemart: 'OTHER',
  storeFront: 'OTHER',
  goodsImages: 'OTHER'
} as const;

export default function DocumentsForm({ 
  onSave, 
  allFormsCompleted, 
  onGetLoan, 
  isReadOnly = false, 
  savedDocuments = false 
}: DocumentsFormProps) {
  const [documents, setDocuments] = useState<DocumentsState>({});
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { uploadDocument } = useUserProfile();
  const { error: showError } = useToastContext();

  // Define which documents can be edited even after saving
  const editableAfterSave = ['storeFront', 'goodsImages'];

  // Generic handler for document drop
  const handleDocumentDrop = useCallback((docType: keyof DocumentsState) => {
    return (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0])
        });
        setDocuments(prev => ({ ...prev, [docType]: file }));
      }
    };
  }, []);

  // Modified document removal handler to check if document can be edited
  const handleDocumentRemove = useCallback((docType: keyof DocumentsState) => {
    return () => {
      // If documents are saved and this document is not in the editable list, prevent removal
      if (savedDocuments && !editableAfterSave.includes(docType)) {
        return;
      }
      
      if (documents[docType]?.preview) {
        URL.revokeObjectURL(documents[docType]!.preview!);
      }
      setDocuments(prev => {
        const updated = { ...prev };
        delete updated[docType];
        return updated;
      });
    };
  }, [documents, savedDocuments]);

  // Create modified dropzone props that respect locked documents
  const createDropzoneProps = (docType: keyof DocumentsState) => {
    const { getRootProps, getInputProps, isDragAccept } = useDropzone({
      onDrop: savedDocuments && !editableAfterSave.includes(docType) 
        ? () => {} // No-op if document is locked
        : handleDocumentDrop(docType),
      accept: {
        'application/pdf': ['.pdf'],
        'image/*': ['.png', '.jpg', '.jpeg']
      },
      maxFiles: 1,
      disabled: savedDocuments && !editableAfterSave.includes(docType), // Disable if document is locked
    });

    return { getRootProps, getInputProps, isDragAccept };
  };

  // Document upload boxes configurations
  const documentTypes = [
    {
      id: 'governmentId' as keyof DocumentsState,
      label: 'Valid Government Issued ID (Compulsory)',
      file: documents.governmentId,
      dropzoneProps: createDropzoneProps('governmentId'),
      onRemove: handleDocumentRemove('governmentId'),
      required: true,
      editable: !savedDocuments || editableAfterSave.includes('governmentId')
    },
    {
      id: 'utilityBill' as keyof DocumentsState,
      label: 'Utility Bill (Compulsory)',
      file: documents.utilityBill,
      dropzoneProps: createDropzoneProps('utilityBill'),
      onRemove: handleDocumentRemove('utilityBill'),
      required: true,
      editable: !savedDocuments || editableAfterSave.includes('utilityBill')
    },
    {
      id: 'workId' as keyof DocumentsState,
      label: 'Work ID',
      file: documents.workId,
      dropzoneProps: createDropzoneProps('workId'),
      onRemove: handleDocumentRemove('workId'),
      required: false,
      editable: !savedDocuments || editableAfterSave.includes('workId')
    },
    {
      id: 'cacCertificate' as keyof DocumentsState,
      label: 'CAC Certificate',
      file: documents.cacCertificate,
      dropzoneProps: createDropzoneProps('cacCertificate'),
      onRemove: handleDocumentRemove('cacCertificate'),
      required: false,
      editable: !savedDocuments || editableAfterSave.includes('cacCertificate')
    },
    {
      id: 'cacMemart' as keyof DocumentsState,
      label: 'CAC 2 and 7or Memart or CAC Application Status',
      file: documents.cacMemart, 
      dropzoneProps: createDropzoneProps('cacMemart'),
      onRemove: handleDocumentRemove('cacMemart'),
      required: false,
      editable: !savedDocuments || editableAfterSave.includes('cacMemart')
    },
    {
      id: 'storeFront' as keyof DocumentsState,
      label: 'Picture of front of Shop or Store or Business',
      file: documents.storeFront,
      dropzoneProps: createDropzoneProps('storeFront'),
      onRemove: handleDocumentRemove('storeFront'),
      required: false,
      editable: true // Always editable
    },
    {
      id: 'goodsImages' as keyof DocumentsState,
      label: 'Pictures of Goods or Inside of Business',
      file: documents.goodsImages, 
      dropzoneProps: createDropzoneProps('goodsImages'),
      onRemove: handleDocumentRemove('goodsImages'),
      required: false,
      editable: true // Always editable
    },
  ];

  // Check if required documents are uploaded
  const isFormValid = () => {
    return documentTypes
      .filter(doc => doc.required)
      .every(doc => documents[doc.id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      showError('Error', 'Please upload all required documents');
      return;
    }

    // Show confirmation modal instead of direct submission
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      // Upload each document individually using the documents endpoint
      const uploadPromises = Object.entries(documents)
        .filter(([_, file]) => file) // Only upload files that exist
        .map(async ([docType, file]) => {
          const formData = new FormData();
          formData.append('file', file as File);
          formData.append('type', DOCUMENT_TYPE_MAPPING[docType as keyof typeof DOCUMENT_TYPE_MAPPING]);
          formData.append('description', documentTypes.find(d => d.id === docType)?.label || docType);
          
          return uploadDocument(formData);
        });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      
      // Check if all uploads were successful
      if (results.every(result => result)) {
        setShowSavedModal(true);
        if (onSave) {
          onSave(documents);
        }
      } else {
        throw new Error('Some documents failed to upload');
      }
    } catch (error: any) {
      showError('Error', error.message || 'Failed to upload documents');
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

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {documentTypes.map(doc => (
            <div key={doc.id} className="space-y-2">
              <Label className="block mb-3">
                {doc.label}
                {!doc.editable && doc.file && <span className="ml-2 text-xs text-gray-500">(Locked)</span>}
              </Label>
              
              {doc.file ? (
                <div className="flex items-center justify-between bg-white p-3 border">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-xs">DOC</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.file.name}</p>
                      <p className="text-xs text-gray-500">{(doc.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  
                  {doc.editable && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={doc.onRemove}
                      className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 p-0 flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ) : doc.editable ? (
                <div
                  {...doc.dropzoneProps.getRootProps()}
                  className={`cursor-pointer transition-all duration-200 h-32 flex flex-col items-center justify-center border-2 border-dashed 
                    ${doc.dropzoneProps.isDragAccept 
                      ? 'border-gray-400 bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                >
                  <input {...doc.dropzoneProps.getInputProps()} />
                  <HiOutlineUpload className="w-6 h-6 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600 text-center">
                    {doc.dropzoneProps.isDragAccept ? 'Drop file here' : 'Upload'}
                  </div>
                </div>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400">
                  <p className="text-sm">Document required</p>
                </div>
              )}
              
              {doc.required && !doc.file && (
                <p className="text-xs text-red-500 mt-1">{doc.label} is required</p>
              )}
            </div>
          ))}
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

      <ConfirmationModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Document Upload"
      />
    </>
  );
} 