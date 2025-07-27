import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  useOnboardingProgress,
  useInitializeOnboarding,
  useCompleteOnboardingStep,
  useInitiateBranchSetup,
  useConfigureInitialSettings
} from '@/graphql/hooks/useOnboarding';
import { 
  OnboardingStep, 
  CompleteOnboardingStepInput,
  InitialBranchSetupInput,
  InitialSettingsInput
} from '@/graphql/types/onboardingTypes';
import { OnboardingProgress } from '@/graphql/types/onboardingTypes';
import { ChurchProfile, saveModulePreferences } from '../ModulePreferences';
import { useAuth } from '@/contexts/AuthContextEnhanced';

/**
 * Custom hook for managing onboarding state
 * Centralizes state management and API interactions for the onboarding flow
 */
export const useOnboardingState = ({ branchId, onComplete }: { branchId: string | null, onComplete: (selectedModules: string[], churchProfile: ChurchProfile) => void }) => {
  // Core state
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps] = useState(6); // Total number of steps in the onboarding flow
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [churchProfile, setChurchProfile] = useState<ChurchProfile>({
    name: '',
    branches: 1,
    size: 'small',
    email: '',
    phoneNumber: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    denomination: '',
    foundingYear: new Date().getFullYear(),
    vision: '',
    missionStatement: '',
    description: '',
    timezone: '',
    currency: '',
    primaryColor: '#4f46e5',
    secondaryColor: '#1e40af',
    tertiaryColor: '#6b7280',
    fontFamily: 'Inter'
  });

  // API hooks
  const { 
    onboardingProgress: progressData, 
    loading: progressLoading, 
    error: progressError,
    refetchOnboardingProgress: refetchProgress
  } = useOnboardingProgress(branchId);

  const { 
    initializeOnboarding: runInitializeOnboarding, 
    loading: initializingLoading, 
    error: initializeError 
  } = useInitializeOnboarding();

  const { 
    completeOnboardingStep: runCompleteOnboardingStep, 
    loading: completingStepLoading, 
    error: completeStepError 
  } = useCompleteOnboardingStep();
  
  const {
    initiateBranchSetup: runInitiateBranchSetup,
    loading: branchSetupLoading,
    error: branchSetupError
  } = useInitiateBranchSetup();
  
  const {
    configureInitialSettings: runConfigureInitialSettings,
    loading: settingsLoading,
    error: settingsError
  } = useConfigureInitialSettings();

  // Derived state
  const isLoadingApi = progressLoading || initializingLoading || branchSetupLoading || settingsLoading;
  const apiError = progressError?.message || 
    initializeError?.message || 
    completeStepError?.message || 
    branchSetupError?.message || 
    settingsError?.message || 
    null;
  const progress: OnboardingProgress | null = progressData || null;

  // Map backend step to local UI step index
  const backendStepToLocalIndex = (backendStep: OnboardingStep | string | undefined): number => {
    if (!backendStep) return 0;
    
    const stepMapping: Record<string, number> = {
      [OnboardingStep.WELCOME]: 0,
      [OnboardingStep.ORGANIZATION_DETAILS]: 1,
      [OnboardingStep.MODULE_QUICK_START]: 2,
      [OnboardingStep.MEMBER_IMPORT]: 3,
      [OnboardingStep.FINANCIAL_SETUP]: 4,
      [OnboardingStep.COMPLETION]: 5
    };
    
    return stepMapping[backendStep] !== undefined ? stepMapping[backendStep] : 0;
  };

  // Map local UI step index to backend step
  const localIndexToBackendStep = (localIndex: number): OnboardingStep => {
    const indexMapping: Record<number, OnboardingStep> = {
      0: OnboardingStep.WELCOME,
      1: OnboardingStep.ORGANIZATION_DETAILS,
      2: OnboardingStep.MODULE_QUICK_START,
      3: OnboardingStep.MEMBER_IMPORT,
      4: OnboardingStep.FINANCIAL_SETUP,
      5: OnboardingStep.COMPLETION
    };
    
    return indexMapping[localIndex] || OnboardingStep.WELCOME;
  };

  // Initialize onboarding or fetch progress
  const fetchOrInitializeProgress = useCallback(async () => {
    if (!branchId) return;

    try {
      const { data } = await refetchProgress();
      
      if (!data?.onboardingProgress) {
        // Initialize onboarding if no progress exists
        await runInitializeOnboarding({ variables: { branchId } });
        await refetchProgress();
      } else {
        // Set current step based on backend progress
        const backendStep = data.onboardingProgress.currentStep;
        setCurrentStep(backendStepToLocalIndex(backendStep));
        
        // Check if we have saved modules in local storage for this branch
        const storageKey = `onboarding_modules_${branchId}`;
        const savedModules = localStorage.getItem(storageKey);
        
        if (savedModules) {
          try {
            const parsedModules = JSON.parse(savedModules);
            setSelectedModules(parsedModules);
          } catch (err) {
            console.error('Failed to parse saved modules:', err);
          }
        } else {
        }
        
        // If the current step is past MODULE_QUICK_START, we know the user has completed this step
        const moduleQuickStartIndex = backendStepToLocalIndex(OnboardingStep.MODULE_QUICK_START);
        const currentStepIndex = backendStepToLocalIndex(backendStep);
        if (currentStepIndex > moduleQuickStartIndex) {
        }
      }
    } catch (err) {
      console.error('Failed to initialize onboarding:', err);
    }
  }, [branchId, refetchProgress, runInitializeOnboarding]);

  // Handle navigation to next step
  const handleNext = async () => {
    if (!branchId) return;
    
    const nextStep = currentStep + 1;
    const currentBackendStep = localIndexToBackendStep(currentStep);
    
    try {
      // Handle specific actions based on the current step
      if (currentStep === 1) { // Church Profile step
        try {
          // First, set up the branch with basic information
          const branchSetupInput: InitialBranchSetupInput = {
            name: churchProfile.name,
            address: churchProfile.address,
            city: churchProfile.city,
            country: churchProfile.country,
            email: churchProfile.email,
            phoneNumber: churchProfile.phoneNumber,
            timezone: churchProfile.timezone,
            currency: churchProfile.currency
          };
          
          const branchSetupResult = await runInitiateBranchSetup({
            variables: {
              input: branchSetupInput
            }
          });
          
          if (branchSetupResult.errors) {
            throw new Error(branchSetupResult.errors[0].message || 'Failed to set up branch');
          }
          
          // Then, configure initial settings
          const initialSettingsInput: InitialSettingsInput = {
            organizationName: churchProfile.name, // Required field
            organizationDescription: churchProfile.description,
            logo: churchProfile.logo,
            primaryColor: churchProfile.primaryColor,
            secondaryColor: churchProfile.secondaryColor,
            websiteUrl: churchProfile.website
          };
          
          const settingsResult = await runConfigureInitialSettings({
            variables: {
              branchId,
              input: initialSettingsInput
            }
          });
          
          if (settingsResult.errors) {
            throw new Error(settingsResult.errors[0].message || 'Failed to configure settings');
          }
        } catch (stepError: Error | unknown) {
          // Show toast for specific step error
          const errorMessage = stepError instanceof Error 
            ? stepError.message 
            : 'Failed to complete church profile setup';
          toast.error(errorMessage);
          return; // Stay on current page
        }
      }
      
      // Prepare step data based on current step
      let stepData = {};

      // For ORGANIZATION_DETAILS step, include church profile data
      if (currentStep === 1) { // ORGANIZATION_DETAILS step
        stepData = { ...churchProfile };
      }
      
      // For module selection step, include the selected modules
      if (currentStep === 2) { // MODULE_QUICK_START step
        stepData = {
          selectedModules: selectedModules
        };
        
        // Save selected modules to local storage for persistence across sessions
        const storageKey = `onboarding_modules_${branchId}`;
        try {
          localStorage.setItem(storageKey, JSON.stringify(selectedModules));
        } catch (err) {
          console.error('Failed to save modules to local storage:', err);
        }
      }

      // Mark current step as complete in the backend
      const response = await runCompleteOnboardingStep({
        variables: {
          input: {
            branchId,
            stepKey: currentBackendStep,
            ...stepData // Spread all step fields directly
          } as CompleteOnboardingStepInput
        }
      });
      
      if (response.errors) {
        throw new Error(response.errors[0].message || 'Failed to complete step');
      }
      
      // Store branchId from ORGANIZATION_DETAILS step for admin setup only
      if (
        currentStep === 1 &&
        response.data?.completeOnboardingStep?.branchId // assuming backend returns branchId here
      ) {
        try {
          localStorage.setItem('onboardingAdminBranchId', response.data.completeOnboardingStep.branchId);
        } catch (err) {
          console.error('Failed to store branchId for admin setup:', err);
        }
      }
      
      if (response.data?.completeOnboardingStep) {
        setCurrentStep(nextStep);
      }
    } catch (err: Error | unknown) {
      console.error('Failed to complete step:', err);
      // Show error toast and stay on current page
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An error occurred. Please try again.';
      toast.error(errorMessage);
      // Do NOT proceed to next step on error
    }
  };

  // Handle navigation to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Initialize onboarding on component mount
  useEffect(() => {
    if (branchId) {
      fetchOrInitializeProgress();
    }
  }, [branchId, fetchOrInitializeProgress]);

  // File upload state
  const [memberFile, setMemberFile] = useState<File | null>(null);
  const [financialFile, setFinancialFile] = useState<File | null>(null);
  const [memberImportError, setMemberImportError] = useState<string | null>(null);
  const [financialImportError, setFinancialImportError] = useState<string | null>(null);
  
  // Import data hooks
  const [memberImportLoading, setMemberImportLoading] = useState(false);
  const [financialImportLoading, setFinancialImportLoading] = useState(false);
  const [memberTemplateLoading, setMemberTemplateLoading] = useState(false);
  const [fundsTemplateLoading, setFundsTemplateLoading] = useState(false);

  // Handle modules selection
  const handleModulesSelected = (modules: string[]) => {
    setSelectedModules(modules);
  };

  // Handle member template download
  const handleMemberTemplateDownload = () => {
    setMemberTemplateLoading(true);
    // Implementation would go here
    setTimeout(() => setMemberTemplateLoading(false), 1000);
  };

  // Handle financial template download
  const handleFinancialTemplateDownload = () => {
    setFundsTemplateLoading(true);
    // Implementation would go here
    setTimeout(() => setFundsTemplateLoading(false), 1000);
  };

  // Handle member data import
  const handleMemberImport = () => {
    if (memberFile) {
      setMemberImportLoading(true);
      // Implementation would go here
      setTimeout(() => {
        setMemberImportLoading(false);
        // Clear any previous errors
        setMemberImportError(null);
        handleNext();
      }, 1000);
    } else {
      handleNext(); // Skip if no file
    }
  };

  // Handle financial data import
  const handleFinancialImport = () => {
    if (financialFile) {
      setFinancialImportLoading(true);
      // Implementation would go here
      setTimeout(() => {
        setFinancialImportLoading(false);
        // Clear any previous errors
        setFinancialImportError(null);
        handleNext();
      }, 1000);
    } else {
      handleNext(); // Skip if no file
    }
  };

  const { user } = useAuth(); // Get the authenticated user

  // Finish the onboarding process
  const handleFinish = () => {
    if (onComplete) {
      const isSuperAdmin = user?.primaryRole === 'super_admin';

      // For super admins, we don't need to save module preferences as they see all modules.
      // For other users, we save their actual selections.
      const modulesToSave = isSuperAdmin ? [] : selectedModules;

      // Save the final state to localStorage
      saveModulePreferences(modulesToSave, churchProfile);
      
      // Trigger the onComplete callback passed in props with the actual selections from the UI
      onComplete(selectedModules, churchProfile);
    }
  };

  return {
    // State
    currentStep,
    totalSteps,
    selectedModules,
    churchProfile,
    progress,
    isLoadingApi,
    apiError,
    completingStepLoading,
    memberFile,
    financialFile,
    memberImportError,
    financialImportError,
    memberImportLoading,
    financialImportLoading,
    memberTemplateLoading,
    fundsTemplateLoading,
    
    // Setters
    setCurrentStep,
    setSelectedModules,
    setChurchProfile,
    setMemberFile,
    setFinancialFile,
    
    // Handlers
    handleNext,
    handleBack,
    fetchOrInitializeProgress,
    handleModulesSelected,
    handleMemberTemplateDownload,
    handleFinancialTemplateDownload,
    handleMemberImport,
    handleFinancialImport,
    handleFinish,
    
    // Mapping utilities
    backendStepToLocalIndex,
    localIndexToBackendStep
  };
};
