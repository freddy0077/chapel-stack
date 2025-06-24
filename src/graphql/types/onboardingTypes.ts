// src/graphql/types/onboardingTypes.ts

// Defined based on /Users/frederickankamah/CascadeProjects/church-system-be/docs/onboarding.md

export enum OnboardingStep {
  WELCOME = 'WELCOME',
  ADMIN_SETUP = 'ADMIN_SETUP',
  ORGANIZATION_DETAILS = 'ORGANIZATION_DETAILS',
  BRANCH_SETUP = 'BRANCH_SETUP',
  BRANDING = 'BRANDING',
  USER_INVITATIONS = 'USER_INVITATIONS',
  ROLE_CONFIGURATION = 'ROLE_CONFIGURATION',
  MEMBER_IMPORT = 'MEMBER_IMPORT',
  FINANCIAL_SETUP = 'FINANCIAL_SETUP',
  MODULE_QUICK_START = 'MODULE_QUICK_START',
  COMPLETION = 'COMPLETION',
}

// Defined based on /Users/frederickankamah/CascadeProjects/church-system-be/docs/onboarding.md

export interface OnboardingProgress {
  id: string;
  branchId: string;
  completedSteps: OnboardingStep[];
  currentStep: OnboardingStep;
  isCompleted: boolean;
  importedMembers: boolean;
  importedFinances: boolean;
  startedAt: string; // GraphQL Date typically comes as string, can be converted to Date object
  completedAt?: string | null;
  lastUpdatedAt: string;
}

// Define interfaces for step-specific data types
export interface ChurchProfileData {
  name: string;
  branches: number;
  size: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  denomination?: string;
  foundingYear?: number;
  vision?: string;
  missionStatement?: string;
}

export interface OnboardingStepData {
  churchProfile?: ChurchProfileData;
  selectedModules?: string[];
  // Add other step-specific data types as needed
}

export interface CompleteOnboardingStepInput {
  branchId: string;
  stepKey: OnboardingStep; // Uses the OnboardingStep enum
  data?: OnboardingStepData | Record<string, unknown>; // Optional data specific to each step
}

export interface InitialBranchSetupInput {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  phoneNumber?: string;
  timezone?: string;
  currency?: string;
}

export interface InitialSettingsInput {
  organizationName: string; // Required field
  organizationDescription?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  websiteUrl?: string;
}

export interface ImportError {
  row: number;
  column: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  totalRecords: number;
  importedRecords: number;
  errors: ImportError[];
  message: string;
}
