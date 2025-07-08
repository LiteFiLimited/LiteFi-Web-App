"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PersonalInfoForm from "./components/PersonalInfoForm";
import EmploymentInfoForm from "./components/EmploymentInfoForm";
import NextOfKinForm from "./components/NextOfKinForm";
import GuarantorForm from "./components/GuarantorForm";
import BankAccountForm from "./components/BankAccountForm";
import BankStatementForm from "./components/BankStatementForm";
import DocumentsForm from "./components/DocumentsForm";
import SecuritySettings from "./components/SecuritySettings";
import BusinessInfoForm from "./components/BusinessInfoForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import ProfilePictureUpload from "@/app/components/ProfilePictureUpload";



export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const router = useRouter();
  const { profile, uploadProfilePicture } = useUserProfile();

  // Track form completion and read-only status
  const [formCompletionStatus, setFormCompletionStatus] = useState({
    personal: false,
    employment: false,
    business: false,
    kin: false,
    guarantor: false,
    bankAccount: false,
    bankStatement: false,
    documents: false
  });

  // Track read-only states
  const [formReadOnlyStatus, setFormReadOnlyStatus] = useState({
    personal: false,
    employment: false,
    business: false,
    kin: false,
    guarantor: false,
    bankAccount: false,
    bankStatement: false,
    documents: false
  });

  // Track form data for passing between components
  const [formData, setFormData] = useState({
    personal: {
      firstName: "",
      lastName: ""
    },
    business: {
      businessName: ""
    }
  });

  // Initialize read-only states based on profile data
  useEffect(() => {
    if (profile) {
      setFormReadOnlyStatus({
        personal: !!profile.firstName || !!profile.lastName,
        employment: !!profile.employment?.employmentStatus,
        business: false,
        kin: !!profile.nextOfKin?.firstName,
        guarantor: !!profile.guarantor?.firstName,
        bankAccount: !!profile.bankAccounts?.[0]?.accountNumber,
        bankStatement: !!profile.bankStatement?.documentUrl,
        documents: false // Documents can be updated
      });
    }
  }, [profile]);

  // Track if user is a business owner
  const isBusinessOwner = profile?.employment?.employmentStatus === 'SELF_EMPLOYED';

  const allFormsCompleted = React.useMemo(() => {
    return Object.values(formCompletionStatus).every(Boolean);
  }, [formCompletionStatus]);

  // Update form completion status
  const updateFormCompletionStatus = (formName: keyof typeof formCompletionStatus, isComplete: boolean) => {
    setFormCompletionStatus(prev => ({
      ...prev,
      [formName]: isComplete
    }));
    
    // Also set read-only status when form is completed
    if (isComplete && formName !== 'documents') {
      setFormReadOnlyStatus(prev => ({
        ...prev,
        [formName]: true
      }));
    }
  };

  const tabs = [
    { id: "my-profile", label: "My Profile" },
    { id: "security", label: "Security" }
  ];

  const personalInfoTabs = [
    { id: "personal", label: "Personal Info" },
    { id: "employment", label: "Employment Info" },
    { id: "kin", label: "Next of Kin" },
    { id: "guarantor", label: "Guarantor" },
    { id: "bank-account", label: "Bank Account" },
    { id: "bank-statement", label: "Bank Statement" },
    { id: "documents", label: "Documents" }
  ];

  // Create a list of all tab IDs that are part of the "My Profile" section
  const myProfileTabIds = personalInfoTabs.map(tab => tab.id);

  // Handle profile picture upload
  const handleProfilePictureUpload = async (file: File): Promise<string> => {
    setIsUploadingImage(true);
    try {
      const result = await uploadProfilePicture(file);
      return result;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle form submissions
  const handleSavePersonalInfo = (data: any) => {
    setFormData(prev => ({ ...prev, personal: data }));
    updateFormCompletionStatus('personal', true);
  };

  const handleSaveEmploymentInfo = (data: any) => {
    updateFormCompletionStatus('employment', true);
  };

  const handleSaveBusinessInfo = (data: any) => {
    setFormData(prev => ({ ...prev, business: data }));
    updateFormCompletionStatus('business', true);
  };

  const handleSaveNextOfKinInfo = (data: any) => {
    updateFormCompletionStatus('kin', true);
  };

  const handleSaveGuarantorInfo = (data: any) => {
    updateFormCompletionStatus('guarantor', true);
  };

  const handleSaveBankAccount = (data: any) => {
    updateFormCompletionStatus('bankAccount', true);
  };

  const handleSaveBankStatement = (data: any) => {
    updateFormCompletionStatus('bankStatement', true);
  };

  const handleSaveDocuments = (data: any) => {
    updateFormCompletionStatus('documents', true);
  };

  // Handle loan navigation
  const handleGetLoan = () => {
    router.push('/dashboard/loans');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <p className="text-muted-foreground mb-6">Manage your profile from this page</p>

      <div className="bg-white rounded-md border border-gray-200">
        <div className="flex flex-col lg:flex-row">
          {/* Left sidebar navigation - fixed width */}
          <div className="w-full lg:w-60 border-b lg:border-b-0 lg:border-r border-gray-200">
            <div className="p-3">
              <div className="space-y-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`w-full text-left px-3 py-2.5 text-sm ${
                      (myProfileTabIds.includes(activeTab) && tab.id === "my-profile") || 
                      (activeTab === "security" && tab.id === "security")
                        ? "bg-gray-200 font-medium"
                        : ""
                    } hover:bg-gray-50 transition-colors`}
                    onClick={() => setActiveTab(tab.id === "my-profile" ? "personal" : tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tabs for Personal Info */}
            {activeTab === "personal" || activeTab === "employment" || activeTab === "kin" || 
             activeTab === "guarantor" || activeTab === "bank-account" || activeTab === "bank-statement" ||
             activeTab === "documents" ? (
              <div>
                <div className="border-b overflow-x-auto scrollbar-hide">
                  <div className="flex">
                    {personalInfoTabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`py-3 px-3 text-sm whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-b-2 border-red text-red font-semibold"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-gray-50 p-3 mb-6 text-sm rounded-sm">
                    <p className="text-gray-700">
                      {activeTab === "personal" 
                        ? "Update your personal information to be able to start investing immediately"
                        : "You will be able to access our loan feature when you update your Employment Info, Next of Kin, Guarantor, Bank Account, Bank Statement and Documents"}
                    </p>
                  </div>

                  {/* Personal Information Content */}
                  {activeTab === "personal" && (
                    <div>
                      <h2 className="text-lg font-bold mb-6">Personal Information</h2>
                      
                      {/* Profile Picture Section */}
                      <div className="mb-8">
                        <h3 className="text-sm font-medium mb-4">Profile picture</h3>
                        <ProfilePictureUpload
                          currentAvatarUrl={profile?.profile?.avatarUrl}
                          onUpload={handleProfilePictureUpload}
                          isUploading={isUploadingImage}
                          onUploadSuccess={() => {
                            // Optional: Add any additional success handling here
                            console.log('Profile picture uploaded successfully');
                          }}
                        />
                      </div>
                      
                      {/* Personal Info Form */}
                      <PersonalInfoForm 
                        onSave={handleSavePersonalInfo} 
                        allFormsCompleted={allFormsCompleted}
                        onGetLoan={handleGetLoan}
                        isReadOnly={formReadOnlyStatus.personal}
                      />
                    </div>
                  )}

                  {/* Employment/Business Info Content */}
                  {activeTab === "employment" && (
                    <div>
                      <h2 className="text-lg font-bold mb-6">
                        {isBusinessOwner ? "Business Information" : "Employment Information"}
                      </h2>
                      {isBusinessOwner ? (
                        <BusinessInfoForm 
                          onSave={handleSaveBusinessInfo} 
                          allFormsCompleted={allFormsCompleted}
                          onGetLoan={handleGetLoan}
                          isReadOnly={formReadOnlyStatus.business}
                        />
                      ) : (
                        <EmploymentInfoForm 
                          onSave={handleSaveEmploymentInfo} 
                          allFormsCompleted={allFormsCompleted}
                          onGetLoan={handleGetLoan}
                          isReadOnly={formReadOnlyStatus.employment}
                        />
                      )}
                    </div>
                  )}

                  {/* Next of Kin Content */}
                  {activeTab === "kin" && (
                    <div>
                      <h2 className="text-lg font-bold mb-6">Next of Kin</h2>
                      <NextOfKinForm 
                        onSave={handleSaveNextOfKinInfo} 
                        allFormsCompleted={allFormsCompleted}
                        onGetLoan={handleGetLoan}
                        isReadOnly={formReadOnlyStatus.kin}
                      />
                    </div>
                  )}

                  {/* Guarantor Content */}
                  {activeTab === "guarantor" && (
                    <div>
                      <h2 className="text-lg font-bold mb-6">Guarantor - Business Owner Only</h2>
                      <GuarantorForm 
                        onSave={handleSaveGuarantorInfo} 
                        allFormsCompleted={allFormsCompleted}
                        onGetLoan={handleGetLoan}
                        isReadOnly={formReadOnlyStatus.guarantor}
                      />
                    </div>
                  )}

                  {/* Bank Account Content */}
                  {activeTab === "bank-account" && (
                    <div>
                      <h2 className="text-lg font-bold mb-6">Bank Account Details</h2>
                      <BankAccountForm 
                        onSave={handleSaveBankAccount} 
                        allFormsCompleted={allFormsCompleted}
                        onGetLoan={handleGetLoan}
                        isReadOnly={formReadOnlyStatus.bankAccount}
                        personalName={formData.personal.firstName ? `${formData.personal.firstName} ${formData.personal.lastName}` : ""}
                        businessName={isBusinessOwner ? formData.business.businessName : ""}
                      />
                    </div>
                  )}

                  {/* Bank Statement Content */}
                  {activeTab === "bank-statement" && (
                    <div>
                      <h2 className="text-lg font-bold mb-6">Bank Statement</h2>
                      <BankStatementForm 
                        onSave={handleSaveBankStatement} 
                        allFormsCompleted={allFormsCompleted}
                        onGetLoan={handleGetLoan}
                        isReadOnly={formReadOnlyStatus.bankStatement}
                      />
                    </div>
                  )}

                  {/* Documents Content */}
                  {activeTab === "documents" && (
                    <div>
                      <h2 className="text-lg font-bold mb-6">Documents</h2>
                      <DocumentsForm 
                        onSave={handleSaveDocuments} 
                        allFormsCompleted={allFormsCompleted}
                        onGetLoan={handleGetLoan}
                        isReadOnly={false} // Documents can always be updated
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === "security" ? (
              // Security tab content
              <div className="p-6">
                <SecuritySettings />
              </div>
            ) : (
              // Default fallback (shouldn't reach here)
              <div className="p-6">
                <p className="text-gray-500">Select a tab to view content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}