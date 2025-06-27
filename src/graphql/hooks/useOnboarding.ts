// src/graphql/hooks/useOnboarding.ts
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_SUPER_ADMIN_USER,
  COMPLETE_ONBOARDING_STEP,
  INITIALIZE_ONBOARDING,
  RESET_ONBOARDING,
  INITIATE_BRANCH_SETUP,
  CONFIGURE_INITIAL_SETTINGS,
  IMPORT_MEMBER_DATA,
  IMPORT_FINANCIAL_DATA
} from '../mutations/onboardingMutations';
import {
  GET_ONBOARDING_PROGRESS,
  GENERATE_MEMBER_IMPORT_TEMPLATE,
  GENERATE_FUNDS_IMPORT_TEMPLATE
} from '../queries/onboardingQueries';
import {
  OnboardingProgress,
  CompleteOnboardingStepInput,
  InitialBranchSetupInput,
  InitialSettingsInput,
  ImportResult
} from '../types/onboardingTypes';

// Type definitions for mutation responses and variables
interface CreateSuperAdminUserVars {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  branchId: string;
}

export const useCreateSuperAdminUser = () => {
  const [mutate, { data, loading, error }] = useMutation<boolean, CreateSuperAdminUserVars>(
    CREATE_SUPER_ADMIN_USER
  );

  return {
    createSuperAdmin: mutate,
    success: data,
    loading,
    error,
  };
};

interface CompleteOnboardingStepData {
  completeOnboardingStep: OnboardingProgress;
}

interface CompleteOnboardingStepVars {
  input: CompleteOnboardingStepInput;
}

export const useCompleteOnboardingStep = () => {
  const [mutate, { data, loading, error }] = useMutation<
    CompleteOnboardingStepData,
    CompleteOnboardingStepVars
  >(COMPLETE_ONBOARDING_STEP);

  return {
    completeOnboardingStep: mutate,
    data: data?.completeOnboardingStep,
    loading,
    error,
  };
};

interface InitializeOnboardingData {
  initializeOnboarding: OnboardingProgress;
}

interface InitializeOnboardingVars {
  branchId: string;
}

export const useInitializeOnboarding = () => {
  const [mutate, { data, loading, error }] = useMutation<
    InitializeOnboardingData,
    InitializeOnboardingVars
  >(INITIALIZE_ONBOARDING);

  return {
    initializeOnboarding: mutate,
    data: data?.initializeOnboarding,
    loading,
    error,
  };
};

interface ResetOnboardingData {
  resetOnboarding: OnboardingProgress;
}

interface ResetOnboardingVars {
  branchId: string;
}

export const useResetOnboarding = () => {
  const [mutate, { data, loading, error }] = useMutation<
    ResetOnboardingData,
    ResetOnboardingVars
  >(RESET_ONBOARDING);

  return {
    resetOnboarding: mutate,
    data: data?.resetOnboarding,
    loading,
    error,
  };
};

interface InitiateBranchSetupVars {
  input: InitialBranchSetupInput;
}

export const useInitiateBranchSetup = () => {
  const [mutate, { data, loading, error }] = useMutation<boolean, InitiateBranchSetupVars>(
    INITIATE_BRANCH_SETUP
  );

  return {
    initiateBranchSetup: mutate,
    success: data,
    loading,
    error,
  };
};

interface ConfigureInitialSettingsVars {
  branchId: string;
  input: InitialSettingsInput;
}

export const useConfigureInitialSettings = () => {
  const [mutate, { data, loading, error }] = useMutation<boolean, ConfigureInitialSettingsVars>(
    CONFIGURE_INITIAL_SETTINGS
  );

  return {
    configureInitialSettings: mutate,
    success: data,
    loading,
    error,
  };
};

interface ImportMemberDataData {
  importMemberData: ImportResult;
}

interface ImportMemberDataVars {
  branchId: string;
  file: File;
  mapping: string;
}

export const useImportMemberData = () => {
  const [mutate, { data, loading, error }] = useMutation<
    ImportMemberDataData,
    ImportMemberDataVars
  >(IMPORT_MEMBER_DATA);

  return {
    importMemberData: mutate,
    result: data?.importMemberData,
    loading,
    error,
  };
};

interface ImportFinancialDataData {
  importFinancialData: ImportResult;
}

interface ImportFinancialDataVars {
  branchId: string;
  file: File;
  mapping: string;
  type: string;
}

export const useImportFinancialData = () => {
  const [mutate, { data, loading, error }] = useMutation<
    ImportFinancialDataData,
    ImportFinancialDataVars
  >(IMPORT_FINANCIAL_DATA);

  return {
    importFinancialData: mutate,
    result: data?.importFinancialData,
    loading,
    error,
  };
};

interface OnboardingProgressData {
  onboardingProgress: OnboardingProgress;
}

interface OnboardingProgressVars {
  branchId: string;
}

export const useOnboardingProgress = (branchId: string | null, skip?: boolean) => {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<OnboardingProgressData, OnboardingProgressVars>(
    GET_ONBOARDING_PROGRESS,
    {
      variables: { branchId: branchId ?? '' },
      skip: skip || !branchId,
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    onboardingProgress: data?.onboardingProgress,
    loading,
    error,
    refetchOnboardingProgress: refetch,
  };
};

interface MemberImportTemplateData {
  generateMemberImportTemplate: string;
}

export const useGenerateMemberImportTemplate = () => {
  const { data, loading, error } = useQuery<MemberImportTemplateData>(
    GENERATE_MEMBER_IMPORT_TEMPLATE
  );

  return {
    template: data?.generateMemberImportTemplate,
    loading,
    error,
  };
};

interface FundsImportTemplateData {
  generateFundsImportTemplate: string;
}

export const useGenerateFundsImportTemplate = () => {
  const { data, loading, error } = useQuery<FundsImportTemplateData>(
    GENERATE_FUNDS_IMPORT_TEMPLATE
  );

  return {
    template: data?.generateFundsImportTemplate,
    loading,
    error,
  };
};
