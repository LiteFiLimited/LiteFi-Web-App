import React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export type EligibilityType = "investment" | "loan";

// Format field names for better readability
const formatFieldName = (field: string): string => {
  // Handle specific field formatting cases
  if (field === "proof of_address" || field === "proof_of_address") return "Document: Proof of Address";
  if (field === "id document" || field === "id_document") return "ID Document";
  if (field === "education level" || field === "education_level") return "Education Level";
  if (field === "employment information" || field === "employment_information") return "Employment Information";
  if (field === "next of kin" || field === "next_of_kin") return "Next of Kin";

  // Handle other field formats - convert snake_case or space_case to proper format
  return field
    .split(/[_\s]+/) // Split on underscores or spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface MissingFieldItemProps {
  field: string;
  completed: boolean;
}

const MissingFieldItem = ({ field, completed }: MissingFieldItemProps) => (
  <div className="flex items-center gap-2 mb-2">
    {completed ? (
      <CheckCircle2 className="text-green-500 h-5 w-5 flex-shrink-0" />
    ) : (
      <XCircle className="text-red-400 h-5 w-5 flex-shrink-0" />
    )}
    <span className={`text-sm ${completed ? "line-through text-gray-400" : "text-gray-700"}`}>
      {formatFieldName(field)}
    </span>
  </div>
);

interface EligibilityModalProps {
  isOpen: boolean;
  type: EligibilityType;
  missingFields: string[];
  onClose: () => void;
}

export const EligibilityModal = ({ isOpen, type, missingFields, onClose }: EligibilityModalProps) => {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 rounded-xl overflow-hidden">
        <div className="bg-red-500 p-6 text-center relative">
          <div className="absolute top-4 right-4">
            {/* No close button - the modal is not closeable */}
          </div>
          <div className="mb-4">
            <div className="flex justify-center">
              <AlertCircle 
                size={64}
                className="text-white opacity-90"
              />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {type === "investment" ? "Complete Your Investment Profile" : "Complete Your Loan Profile"}
          </h2>
          <p className="text-white text-opacity-90 text-sm">
            {type === "investment" 
              ? "Please complete your profile to access investment features." 
              : "Please complete your profile to apply for a loan."}
          </p>
        </div>
        
        <div className="p-6">
          <h3 className="font-medium text-base mb-4">Missing Information:</h3>
          <div className="space-y-1 max-h-[200px] overflow-y-auto mb-6">
            {missingFields.map((field, index) => (
              <MissingFieldItem 
                key={index} 
                field={field} 
                completed={false}
              />
            ))}
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleProfileClick}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Complete Your Profile
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Please complete these items to proceed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
