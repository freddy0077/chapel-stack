import { CreateMemberInput } from '../../../types/member.types';

export interface WizardFormData extends Omit<CreateMemberInput, 'branchId' | 'organisationId'> {
  // Additional UI-specific fields
  confirmEmail?: string;
  profileImage?: File;
}

export interface WizardStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface StepValidation {
  isValid: boolean;
  errors: ValidationError[];
}
