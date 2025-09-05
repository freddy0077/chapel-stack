export interface OrganizationData {
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhoneCountryCode: string;
  adminPhone: string;
  adminPassword: string;
  planId: string;
  billingCycle: "MONTHLY" | "YEARLY";
  startDate: string;
  denomination?: string;
  foundingYear?: number;
  size?: string;
  vision?: string;
  missionStatement?: string;
  description?: string;
  timezone?: string;
  currency?: string;
  primaryColor?: string;
  secondaryColor?: string;
  organizationId?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface StepProps {
  organizationData: OrganizationData;
  errors: ValidationErrors;
  updateField: (field: keyof OrganizationData, value: string) => void;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: any;
}

export interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}
