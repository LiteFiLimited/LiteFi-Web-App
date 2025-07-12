export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: {
    dateOfBirth?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    bvn?: string;
    nin?: string;
    maritalStatus?: string;
    educationLevel?: string;
    nearestBusStop?: string;
    homeOwnership?: string;
    yearsAtAddress?: string;
    bvnVerified?: boolean;
    ninVerified?: boolean;
    kycVerified?: boolean;
    kycVerifiedAt?: string;
    avatarUrl?: string;
  };
  employment?: EmploymentInfo;
  business?: BusinessInfo;
  nextOfKin?: NextOfKinInfo;
  guarantor?: GuarantorInfo;
  bankAccounts?: BankAccount[];
  bankStatement?: BankStatement;
  documents?: Document[];
}

export interface EmploymentInfo {
  employmentStatus:
    | "EMPLOYED"
    | "SELF_EMPLOYED"
    | "UNEMPLOYED"
    | "STUDENT"
    | "RETIRED";
  employer?: string;
  jobTitle?: string;
  workEmail?: string;
  workPhone?: string;
  monthlySalary?: number;
  employerAddress?: string;
  employerStreet?: string;
  employerCity?: string;
  employerState?: string;
  employerCountry?: string;
  employerPostalCode?: string;
  startDate?: string; // Format: dd/mm/yyyy
  salaryPaymentDate?: number; // 1-31
  endDate?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export interface GuarantorInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  relationship: string;
  phone: string;
  email: string;
  bvn: string;
  bvnVerified?: boolean;
  occupation: string;
  address: string;
  idCardUrl?: string;
  idCard?: File;
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

export interface BankStatement {
  id: string;
  documentUrl: string;
  uploadedAt: string;
  verified: boolean;
}

export interface Document {
  id: string;
  userId: string;
  type:
    | "PROFILE_PICTURE"
    | "ID_DOCUMENT"
    | "UTILITY_BILL"
    | "BANK_STATEMENT"
    | "BUSINESS_REGISTRATION"
    | "PICTURE_OF_BUSINESS_FRONT"
    | "PICTURES_OF_GOODS"
    | "OTHER";
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  url: string;
  investmentId?: string | null;
  loanId?: string | null;
  transactionId?: string | null;
  verified: boolean;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  description?: string;
  createdAt: string;
  updatedAt: string;
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
