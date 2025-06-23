import statesData from './nigeria-state-and-lgas.json';

export interface StateData {
  state: string;
  alias: string;
  lgas: string[];
}

export const states: StateData[] = statesData;

export const homeOwnershipOptions = {
  RENTING: 'Renting',
  OWNED: 'Owned',
  LIVING_WITH_FAMILY: 'Living with Family'
} as const;

export const educationLevelOptions = {
  BSC: "Bachelor's Degree",
  MSC_PHD: "Master's Degree or PhD",
  SECONDARY: 'Secondary Education',
  PRIMARY_NO_SCHOOL: 'Primary Education or No Formal Education'
} as const;

export const employmentStatusOptions = {
  EMPLOYED: 'Employed',
  SELF_EMPLOYED: 'Self-employed',
  UNEMPLOYED: 'Unemployed',
  RETIRED: 'Retired',
  STUDENT: 'Student'
} as const;

export const maritalStatusOptions = {
  SINGLE: 'Single',
  MARRIED: 'Married',
  DIVORCED: 'Divorced',
  WIDOWED: 'Widowed'
} as const;

export const nextOfKinRelationshipOptions = {
  HUSBAND: 'Husband',
  WIFE: 'Wife',
  FATHER: 'Father',
  MOTHER: 'Mother',
  BROTHER: 'Brother',
  SISTER: 'Sister',
  SON: 'Son',
  DAUGHTER: 'Daughter',
  OTHER_RELATIVE: 'Other Relative',
  FRIEND: 'Friend'
} as const;

export type HomeOwnership = keyof typeof homeOwnershipOptions;
export type EducationLevel = keyof typeof educationLevelOptions;
export type EmploymentStatus = keyof typeof employmentStatusOptions;
export type MaritalStatus = keyof typeof maritalStatusOptions;
export type NextOfKinRelationship = keyof typeof nextOfKinRelationshipOptions; 