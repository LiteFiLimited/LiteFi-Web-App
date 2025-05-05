"use client";

import React, { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import { HiOutlineUpload } from "react-icons/hi";
import ProfileSavedModal from "@/app/components/ProfileSavedModal";
import { useRouter } from "next/navigation";

interface DocumentsFormProps {
  onSave?: (data: any) => void;
  allFormsCompleted?: boolean;
  onGetLoan?: () => void;
  savedDocuments?: boolean; // Add this new prop
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

export default function DocumentsForm({ onSave, allFormsCompleted, onGetLoan, savedDocuments = false }: DocumentsFormProps) {
  const [documents, setDocuments] = useState<DocumentsState>({});
  const [showSavedModal, setShowSavedModal] = useState(false);
  const router = useRouter();

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
      id: 'governmentId',
      label: 'Valid Government Issued ID (Compulsory)',
      file: documents.governmentId,
      dropzoneProps: createDropzoneProps('governmentId'),
      onRemove: handleDocumentRemove('governmentId'),
      required: true,
      editable: !savedDocuments || editableAfterSave.includes('governmentId')
    },
    {
      id: 'utilityBill',
      label: 'Utility Bill (Compulsory)',
      file: documents.utilityBill,
      dropzoneProps: createDropzoneProps('utilityBill'),
      onRemove: handleDocumentRemove('utilityBill'),
      required: true,
      editable: !savedDocuments || editableAfterSave.includes('utilityBill')
    },
    {
      id: 'workId',
      label: 'Work ID',
      file: documents.workId,
      dropzoneProps: createDropzoneProps('workId'),
      onRemove: handleDocumentRemove('workId'),
      required: false,
      editable: !savedDocuments || editableAfterSave.includes('workId')
    },
    {
      id: 'cacCertificate',
      label: 'CAC Certificate',
      file: documents.cacCertificate,
      dropzoneProps: createDropzoneProps('cacCertificate'),
      onRemove: handleDocumentRemove('cacCertificate'),
      required: false,
      editable: !savedDocuments || editableAfterSave.includes('cacCertificate')
    },
    {
      id: 'cacMemart',
      label: 'CAC 2 and 7or Memart or CAC Application Status',
      file: documents.cacMemart, 
      dropzoneProps: createDropzoneProps('cacMemart'),
      onRemove: handleDocumentRemove('cacMemart'),
      required: false,
      editable: !savedDocuments || editableAfterSave.includes('cacMemart')
    },
    {
      id: 'storeFront',
      label: 'Picture of front of Shop or Store or Business',
      file: documents.storeFront,
      dropzoneProps: createDropzoneProps('storeFront'),
      onRemove: handleDocumentRemove('storeFront'),
      required: false,
      editable: true // Always editable
    },
    {
      id: 'goodsImages',
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
      .every(doc => documents[doc.id as keyof DocumentsState]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    if (onSave) {
      onSave(documents);
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
              ) : (
                doc.editable ? (
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
                )
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
