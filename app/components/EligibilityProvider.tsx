import React, { createContext, useContext, useState, ReactNode } from "react";
import { EligibilityModal, EligibilityType } from "./EligibilityModal";
import { userApi } from "@/lib/api";

interface EligibilityContextType {
  checkEligibility: (type: EligibilityType) => Promise<boolean>;
  closeModal: () => void;
}

const EligibilityContext = createContext<EligibilityContextType | undefined>(undefined);

interface EligibilityProviderProps {
  children: ReactNode;
}

export const EligibilityProvider = ({ children }: EligibilityProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eligibilityType, setEligibilityType] = useState<EligibilityType>("investment");
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Helper function to process field names
  const processFieldNames = (fields: string[]): string[] => {
    return fields.map(field => {
      // Convert field names to consistent format
      return field.trim().toLowerCase();
    });
  };
  
  const checkEligibility = async (type: EligibilityType): Promise<boolean> => {
    try {
      const response = await userApi.getEligibilityStatus();
      
      if (response.success && response.data) {
        const eligibility = response.data[type];
        
        if (!eligibility.complete) {
          setEligibilityType(type);
          setMissingFields(processFieldNames(eligibility.missingFields));
          setIsModalOpen(true);
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking eligibility:", error);
      return false;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <EligibilityContext.Provider value={{ checkEligibility, closeModal }}>
      {children}
      <EligibilityModal 
        isOpen={isModalOpen}
        type={eligibilityType}
        missingFields={missingFields}
        onClose={closeModal}
      />
    </EligibilityContext.Provider>
  );
};

export const useEligibility = (): EligibilityContextType => {
  const context = useContext(EligibilityContext);
  if (context === undefined) {
    throw new Error("useEligibility must be used within an EligibilityProvider");
  }
  return context;
};
