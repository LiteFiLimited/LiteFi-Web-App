export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  bvn?: string;
  nin?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  employment?: EmploymentInfo;
  business?: BusinessInfo;
  nextOfKin?: NextOfKinInfo;
  bankAccounts?: BankAccount[];
  documents?: Document[];
}

export interface EmploymentInfo {
  employmentStatus: 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'STUDENT' | 'RETIRED';
  employerName?: string;
  jobTitle?: string;
  workAddress?: string;
  monthlyIncome?: number;
  employmentStartDate?: string;
  workEmail?: string;
  workPhone?: string;
}

export interface BusinessInfo {
  businessName: string;
  businessType: string;
  businessAddress: string;
  registrationNumber?: string;
  monthlyRevenue: number;
  yearEstablished: string;
  businessEmail?: string;
  businessPhone?: string;
}

export interface NextOfKinInfo {
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Document {
  id: string;
  type: 'ID_DOCUMENT' | 'PROOF_OF_ADDRESS' | 'BANK_STATEMENT' | 'PAYMENT_PROOF' | 'SALARY_SLIP' | 'BUSINESS_REGISTRATION' | 'LOAN_AGREEMENT' | 'OTHER';
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  description?: string;
  uploadedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  error?: string;
}

// Add UserData type - it's an alias for UserProfile
export type UserData = UserProfile;