"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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

export default function SalaryLoanPage() {
  const [amount, setAmount] = React.useState("");
  const [months, setMonths] = React.useState("");
  const [purpose, setPurpose] = React.useState("");
  const [employerName, setEmployerName] = React.useState("");
  const [monthlySalary, setMonthlySalary] = React.useState("");
  const [salaryDay, setSalaryDay] = React.useState("");
  const [workEmail, setWorkEmail] = React.useState("");
  const [make, setMake] = React.useState("");
  const [model, setModel] = React.useState("");
  const [modelOfVehicle, setModelOfVehicle] = React.useState("");
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
    customs?: FileWithPreview;
    identificationDocument?: FileWithPreview;
    bankStatement?: FileWithPreview;
  }>({});

  const showCollateral = React.useMemo(() => {
    const numericAmount = Number(amount.replace(/[^0-9]/g, ""));
    return numericAmount >= 2000000;
  }, [amount]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!amount || !months || !purpose || !employerName || !monthlySalary || !salaryDay || !workEmail) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare loan application data
      const amountValue = Number(amount.replace(/[^0-9]/g, ""));
      const monthsValue = Number(months);
      const monthlySalaryValue = Number(monthlySalary.replace(/[^0-9]/g, ""));
      const salaryDayValue = Number(salaryDay);
      
      // First fetch available loan products to get the correct product ID
      const { loanApi } = await import('@/lib/loanApi');
      const productsResponse = await loanApi.getLoanProducts();
      
      if (!productsResponse.success) {
        setError('Failed to fetch loan products. Please try again later.');
        setIsSubmitting(false);
        return;
      }
      
      // Find the first active SALARY type product
      const salaryProduct = productsResponse.data?.find(
        (product: { type: string; status: string }) => product.type === 'SALARY' && product.status === 'ACTIVE'
      );
      
      if (!salaryProduct) {
        setError('No available salary loan products found. Please try again later.');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare document IDs (this would be populated after document upload)
      const documentIds = [];
      if (documents.identificationDocument) documentIds.push('doc_id');
      if (documents.bankStatement) documentIds.push('doc_bank');
      
      const loanData = {
        productId: salaryProduct.id,
        amount: amountValue,
        duration: monthsValue,
        purpose: purpose,
        employerName: employerName,
        monthlySalary: monthlySalaryValue,
        salaryDay: salaryDayValue,
        workEmail: workEmail,
        documentIds: documentIds
      };
      
      // Submit loan application
      const response = await loanApi.createSalaryLoan(loanData);
      
      if (response.success) {
        setSuccess(true);
        // Redirect to loan details or confirmation page
        setTimeout(() => {
          window.location.href = '/dashboard/loans';
        }, 2000);
      } else {
        setError(response.message || 'Failed to submit loan application');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
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
            Create New Salary loan
          </Link>
        </div>

        <h2 className="text-[32px] font-semibold mb-8">Apply for a salary loan</h2>

        <div className="bg-white p-8">
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
              <h3 className="font-medium">Loan Application Submitted!</h3>
              <p>Your loan application has been successfully submitted. You will be redirected to the loans page.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                  <h3 className="font-medium">Error</h3>
                  <p>{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount you want to borrow *</Label>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Enter amount in naira (up to ₦10,000,000)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 rounded-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="months">How many months *</Label>
                  <Select value={months} onValueChange={setMonths} required>
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Loan purpose *</Label>
                <Select value={purpose} onValueChange={setPurpose} required>
                  <SelectTrigger className="h-12 rounded-none">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="medical">Medical Expenses</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="personal">Personal Use</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="employerName">Employer Name *</Label>
                  <Input
                    id="employerName"
                    type="text"
                    placeholder="Enter your employer's name"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    className="h-12 rounded-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workEmail">Work Email *</Label>
                  <Input
                    id="workEmail"
                    type="email"
                    placeholder="Enter your work email"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className="h-12 rounded-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="monthlySalary">Monthly Salary *</Label>
                  <Input
                    id="monthlySalary"
                    type="text"
                    placeholder="Enter your monthly salary"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    className="h-12 rounded-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryDay">Salary Day *</Label>
                  <Select value={salaryDay} onValueChange={setSalaryDay} required>
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            {showCollateral && (
              <>
                <div>
                  <h3 className="text-base font-medium mb-4">Provide collateral details</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    To proceed with loan request above <span className="text-black font-bold">₦2,000,000</span>, we'll need a few details about your collateral for added security.
                  </p>
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
                      <Label htmlFor="modelOfVehicle">Model of Vehicle</Label>
                      <Select value={modelOfVehicle} onValueChange={setModelOfVehicle}>
                        <SelectTrigger className="h-12 rounded-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2021">2021</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage</Label>
                      <Select value={mileage} onValueChange={setMileage}>
                        <SelectTrigger className="h-12 rounded-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-50000">0 - 50,000 km</SelectItem>
                          <SelectItem value="50000-100000">50,000 - 100,000 km</SelectItem>
                          <SelectItem value="100000-150000">100,000 - 150,000 km</SelectItem>
                          <SelectItem value="150000+">150,000+ km</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="plateNumber">Plate Number</Label>
                      <Select value={plateNumber} onValueChange={setPlateNumber}>
                        <SelectTrigger className="h-12 rounded-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <DocumentUploadBox
                      title="Customs Documents (for imported vehicles)"
                      file={documents.customs}
                      onDrop={(files) => setDocuments(prev => ({ ...prev, customs: files[0] }))}
                      onRemove={() => setDocuments(prev => ({ ...prev, customs: undefined }))}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <h3 className="text-base font-medium mb-4">Required Documents</h3>
              <p className="text-sm text-gray-500 mb-6">
                Please upload the following documents to process your loan application.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentUploadBox
                  title="Identification Document (ID card, passport, or driver's license) *"
                  file={documents.identificationDocument}
                  onDrop={(files) => setDocuments(prev => ({ ...prev, identificationDocument: files[0] }))}
                  onRemove={() => setDocuments(prev => ({ ...prev, identificationDocument: undefined }))}
                />
                <DocumentUploadBox
                  title="Bank Statement (last 3 months) *"
                  file={documents.bankStatement}
                  onDrop={(files) => setDocuments(prev => ({ ...prev, bankStatement: files[0] }))}
                  onRemove={() => setDocuments(prev => ({ ...prev, bankStatement: undefined }))}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 h-12 px-16 rounded-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Application'}
              </Button>
            </div>
          </form>
          )}
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
            <Trash2 className="h-3 w-3 text-red-500" />
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