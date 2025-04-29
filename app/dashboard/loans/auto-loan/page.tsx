"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2, X } from "lucide-react"; // Import X icon
import { HiOutlineUpload } from "react-icons/hi";
import { useDropzone } from "react-dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileWithPreview extends File {
  preview?: string;
}

export default function AutoLoanPage() {
  const [amount, setAmount] = React.useState("");
  const [months, setMonths] = React.useState("");
  const [make, setMake] = React.useState("");
  const [model, setModel] = React.useState("");
  const [year, setYear] = React.useState("");
  const [mileage, setMileage] = React.useState("");
  const [plateNumber, setPlateNumber] = React.useState("");
  
  // State for different types of files
  const [carImages, setCarImages] = React.useState<{
    front?: FileWithPreview;
    back?: FileWithPreview;
    interior?: FileWithPreview;
    engine?: FileWithPreview;
  }>({});
  
  const [documents, setDocuments] = React.useState<{
    registration?: FileWithPreview;
    plateNumber?: FileWithPreview;
    ownership?: FileWithPreview;
    customs: FileWithPreview[];
  }>({
    customs: []
  });

  const handleCustomsDocDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setDocuments(prev => ({ 
      ...prev, 
      customs: [...(prev.customs || []), ...filesWithPreview] 
    }));
  }, []);

  const removeCustomsDoc = (fileToRemove: FileWithPreview) => {
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setDocuments(prev => ({
      ...prev,
      customs: prev.customs.filter(file => file !== fileToRemove)
    }));
  };

  const { getRootProps: getCustomsRootProps, getInputProps: getCustomsInputProps, isDragActive: isCustomsDragActive } = useDropzone({ 
    onDrop: handleCustomsDocDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      amount,
      months,
      make,
      model,
      year,
      mileage,
      plateNumber,
      carImages,
      documents,
    });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[800px]">
        <div className="mb-8">
          <Link 
            href="/dashboard/loans" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <Image 
              src="/assets/svgs/arrow-back.svg" 
              alt="Back" 
              width={8}
              height={8}
              className="mr-2"
            />
            Create New Auto loan
          </Link>
        </div>

        <h2 className="text-[32px] font-semibold mb-8">Apply for an Auto Loan</h2>

        <div className="bg-white p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount you want to borrow</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="Enter amount in naira"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="months">How many months</Label>
                <Select value={months} onValueChange={setMonths}>
                  <SelectTrigger className="h-12 rounded-none">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-4">Provide collateral details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Select value={make} onValueChange={setMake}>
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="lexus">Lexus</SelectItem>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camry">Camry</SelectItem>
                      <SelectItem value="corolla">Corolla</SelectItem>
                      <SelectItem value="accord">Accord</SelectItem>
                      <SelectItem value="civic">Civic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => {
                        const year = 2024 - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input
                    id="mileage"
                    type="text"
                    placeholder="Enter"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    className="h-12 rounded-none"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="plateNumber">Plate Number</Label>
                  <Input
                    id="plateNumber"
                    type="text"
                    placeholder="Enter"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="h-12 rounded-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-4">Upload car images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ImageUploadBox
                  title="Front"
                  file={carImages.front}
                  onDrop={(files) => setCarImages(prev => ({ ...prev, front: files[0] }))}
                  onRemove={() => setCarImages(prev => ({ ...prev, front: undefined }))}
                />
                <ImageUploadBox
                  title="Back"
                  file={carImages.back}
                  onDrop={(files) => setCarImages(prev => ({ ...prev, back: files[0] }))}
                  onRemove={() => setCarImages(prev => ({ ...prev, back: undefined }))}
                />
                <ImageUploadBox
                  title="Interior"
                  file={carImages.interior}
                  onDrop={(files) => setCarImages(prev => ({ ...prev, interior: files[0] }))}
                  onRemove={() => setCarImages(prev => ({ ...prev, interior: undefined }))}
                />
                <ImageUploadBox
                  title="Engine"
                  file={carImages.engine}
                  onDrop={(files) => setCarImages(prev => ({ ...prev, engine: files[0] }))}
                  onRemove={() => setCarImages(prev => ({ ...prev, engine: undefined }))}
                />
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-4">Upload car documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DocumentUploadBox
                  title="Vehicle Registration Certificate"
                  file={documents.registration}
                  onDrop={(files) => setDocuments(prev => ({ ...prev, registration: files[0] }))}
                  onRemove={() => setDocuments(prev => ({ ...prev, registration: undefined }))}
                />
                <DocumentUploadBox
                  title="Plate Number"
                  file={documents.plateNumber}
                  onDrop={(files) => setDocuments(prev => ({ ...prev, plateNumber: files[0] }))}
                  onRemove={() => setDocuments(prev => ({ ...prev, plateNumber: undefined }))}
                />
                <DocumentUploadBox
                  title="Proof of Ownership"
                  file={documents.ownership}
                  onDrop={(files) => setDocuments(prev => ({ ...prev, ownership: files[0] }))}
                  onRemove={() => setDocuments(prev => ({ ...prev, ownership: undefined }))}
                />
              </div>
              <div className="mt-4">
                {documents.customs && documents.customs.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Customs Documents (for imported vehicles)</p>
                    <div className="space-y-2">
                      {documents.customs.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 border">
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
                            onClick={() => removeCustomsDoc(file)}
                            className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 p-0 flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}

                      {/* Add more files option */}
                      <div 
                        {...getCustomsRootProps()} 
                        className="cursor-pointer transition-all duration-200 p-4 text-center border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 mt-2"
                      >
                        <input {...getCustomsInputProps()} />
                        <div className="flex flex-col items-center gap-1">
                          <HiOutlineUpload className="w-5 h-5 text-gray-400" />
                          <div className="text-xs text-gray-600">Add more files</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Customs Documents (for imported vehicles)</p>
                    <div
                      {...getCustomsRootProps()}
                      className={`cursor-pointer transition-all duration-200 p-8 text-center border-2 border-dashed 
                        ${isCustomsDragActive 
                          ? 'border-gray-400 bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                    >
                      <input {...getCustomsInputProps()} />
                      <div className="flex flex-col items-center gap-2">
                        <HiOutlineUpload className="w-6 h-6 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          {isCustomsDragActive ? 'Drop files here' : 'Upload'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 h-12 px-16 rounded-none"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface UploadBoxProps {
  title: string;
  file?: FileWithPreview;
  onDrop: (acceptedFiles: File[]) => void;
  onRemove: () => void;
}

function ImageUploadBox({ title, file, onDrop, onRemove }: UploadBoxProps) {
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">{title}</p>
      {file ? (
        <div className="relative border rounded-none">
          <img
            src={URL.createObjectURL(file)}
            alt={title}
            className="w-full h-32 object-cover"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 p-0"
          >
            <X className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`cursor-pointer transition-all duration-200 h-32 flex flex-col items-center justify-center border-2 border-dashed 
            ${isDragAccept 
              ? 'border-gray-400 bg-gray-50' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            }`}
        >
          <input {...getInputProps()} />
          <HiOutlineUpload className="w-5 h-5 text-gray-400 mb-1" />
          <span className="text-xs text-gray-500">
            {isDragAccept ? 'Drop image here' : 'Upload'}
          </span>
        </div>
      )}
    </div>
  );
}

function DocumentUploadBox({ title, file, onDrop, onRemove }: UploadBoxProps) {
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">{title}</p>
      {file ? (
        <div className="flex items-center justify-between bg-white p-3 border">
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
            onClick={onRemove}
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
  );
}