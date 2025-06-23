import { 
  HomeOwnership,
  EducationLevel,
  EmploymentStatus,
  MaritalStatus
} from '@/lib/data/states';

export type FormField = 
  | "firstName"
  | "lastName"
  | "middleName"
  | "phoneNumber"
  | "email"
  | "dateOfBirth"
  | "bvn"
  | "nin"
  | "maritalStatus"
  | "highestEducation"
  | "employmentType"
  | "streetNo"
  | "streetName"
  | "nearestBusStop"
  | "state"
  | "localGovernment"
  | "homeOwnership"
  | "yearsInCurrentAddress";

export interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  bvn: string;
  nin: string;
  maritalStatus: MaritalStatus | "";
  highestEducation: EducationLevel | "";
  employmentType: EmploymentStatus | "";
  streetNo: string;
  streetName: string;
  nearestBusStop: string;
  state: string;
  localGovernment: string;
  homeOwnership: HomeOwnership | "";
  yearsInCurrentAddress: string;
}

export type ValidationState = "idle" | "loading" | "success" | "error";

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface FormHandlers {
  handleChange: (field: FormField, value: string) => void;
  handleBlur: (field: FormField) => void;
} 