'use client';

import { useState, useEffect } from 'react';
import { 
  useOnboardingProgress,
  useInitializeOnboarding,
  useCompleteOnboardingStep,
  useInitiateBranchSetup,
  useConfigureInitialSettings,
  useImportMemberData,
  useImportFinancialData,
  useGenerateMemberImportTemplate,
  useGenerateFundsImportTemplate
} from '@/graphql/hooks/useOnboarding';
import { 
  OnboardingStep, 
  CompleteOnboardingStepInput,
  ChurchProfileData
} from '@/graphql/types/onboardingTypes';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@tremor/react';

// Import extracted screen components
import WelcomeScreen from './screens/WelcomeScreen';
import BranchCountScreen from './screens/BranchCountScreen';
import BranchDetailsScreen, { BranchDetailsInput } from './screens/BranchDetailsScreen';
import ChurchProfileScreen from './screens/ChurchProfileScreen';
import ModuleSelectionScreen from './screens/ModuleSelectionScreen';
import MemberDataImportScreen from './screens/MemberDataImportScreen';
import FinancialDataImportScreen from './screens/FinancialDataImportScreen';
import CompletionScreen from './screens/CompletionScreen';
import AdminSetupScreen from './screens/AdminSetupScreen';
import BrandingScreen from './screens/BrandingScreen';
import UserInvitationsScreen from './screens/UserInvitationsScreen';
import RoleConfigurationScreen from './screens/RoleConfigurationScreen';
import MemberImportScreen from './screens/MemberImportScreen';
import FinanceSetupScreen from './screens/FinanceSetupScreen';
import OnboardingCompletionScreen from './screens/OnboardingCompletionScreen';

// Import common components
import LoadingSpinner from './common/LoadingSpinner';

// Import types and utilities
import { ChurchProfile } from './ModulePreferences';
import { useOnboardingState } from './hooks/useOnboardingState';
import { getCompletedScreens } from './utils/completedScreens';
import { ONBOARDING_SCREEN_ORDER } from './utils/onboardingStepOrder';

// Main onboarding flow component
interface ModernOnboardingFlowProps {
  branchId: string | null;
  onComplete: (selectedModules: string[], churchProfile: ChurchProfile) => void;
}

// Basic mapping from backend OnboardingStep to local UI step index
function backendStepToLocalIndex(backendStep: OnboardingStep | string | undefined): number {
  // Handle case where it's a string
  const step = typeof backendStep === 'string' 
    ? backendStep as unknown as OnboardingStep 
    : backendStep;
    
  switch(step) {
    case OnboardingStep.WELCOME:
      return 0;
    case OnboardingStep.ADMIN_SETUP: 
      return 1;
    case OnboardingStep.MODULE_QUICK_START:
      return 2;
    case OnboardingStep.MEMBER_IMPORT:
      return 3;
    case OnboardingStep.FINANCIAL_SETUP:
      return 4;
    case OnboardingStep.BRANCH_SETUP:
      return 5; // Completion step
    default:
      return 0; // Default to first step if unrecognized
  }
}

const ModernOnboardingFlow = ({ branchId, onComplete }: ModernOnboardingFlowProps) => {
  // New: State for branch onboarding
  const [branchStep, setBranchStep] = useState<number>(0); // 0: Welcome, 1: Church Profile, 2: Admin Setup, 3: BranchCount, 4: BranchDetails, ...
  const [branchCount, setBranchCount] = useState<number>(1);
  const [branches, setBranches] = useState<BranchDetailsInput[]>([]);

  // Options for modules and currencies (could be fetched from API)
  const moduleOptions = [
    'Attendance', 'Finance', 'Sermons', 'Communication', 'Events', 'Ministries', 'Members', 'Reports'
  ];
  const currencyOptions = [
    'USD', 'GHS', 'NGN', 'EUR', 'GBP'
  ];
  // Use the centralized onboarding state hook
  const {
    currentStep,
    totalSteps,
    churchProfile,
    selectedModules,
    memberFile,
    financialFile,
    memberImportError,
    financialImportError,
    isLoadingApi,
    apiError,
    completingStepLoading,
    memberImportLoading,
    financialImportLoading,
    memberTemplateLoading,
    fundsTemplateLoading,
    setMemberFile,
    setFinancialFile,
    setChurchProfile,
    fetchOrInitializeProgress,
    handleNext,
    handleBack,
    handleModulesSelected,
    handleMemberTemplateDownload,
    handleFinancialTemplateDownload,
    handleMemberImport,
    handleFinancialImport,
    handleFinish
  } = useOnboardingState({ branchId, onComplete });

  // Stepper steps definition
  const ONBOARDING_STEPS = [
    'Welcome',
    'Church Profile',
    'Admin Setup',
    'Branch Count',
    'Branch Details',
    'Branding',
    'User Invitations',
    'Role Configuration',
    //'Member Import', // hidden for now
    'Finance Setup',
    'Complete',
  ];

  function Stepper({ currentStep }: { currentStep: number }) {
    return (
      <div className="flex items-center justify-center gap-0 md:gap-2 mb-10 w-full overflow-x-auto">
        {ONBOARDING_STEPS.map((label, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          return (
            <div key={label} className="flex items-center">
              <div
                className={`flex flex-col items-center min-w-[90px] md:min-w-[120px] px-1 md:px-2`}
              >
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg border-4 transition
                    ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : isCompleted ? 'bg-green-400 border-green-400 text-white' : 'bg-white border-gray-300 text-gray-400'}`}
                >
                  {isCompleted ? <span>&#10003;</span> : idx + 1}
                </div>
                <span className={`mt-2 text-xs md:text-sm font-medium text-center ${isActive ? 'text-indigo-700' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}>{label}</span>
              </div>
              {idx < ONBOARDING_STEPS.length - 1 && (
                <div className="w-8 h-1 bg-gray-200 md:w-12 mx-1 md:mx-2 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // On mount, jump to the first incomplete step after the last completed
  useEffect(() => {
    const completed = getCompletedScreens();
    if (completed.length > 0) {
      const lastIdx = Math.max(...completed.map(s => ONBOARDING_SCREEN_ORDER.indexOf(s)).filter(idx => idx >= 0));
      if (lastIdx >= 0 && lastIdx < ONBOARDING_SCREEN_ORDER.length - 1) {
        setBranchStep(lastIdx + 1);
      }
    }
  }, []);

  // Render appropriate loading state
  if (isLoadingApi) {
    return <LoadingSpinner message="Loading Onboarding..." />;
  }

  // Render error state if needed
  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <ExclamationCircleIcon className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-red-500">{apiError}</p>
        <Button
          color="red"
          className="mt-4"
          onClick={fetchOrInitializeProgress}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Add skip handler to jump to last step and set localStorage progress
  const handleSkipToEnd = () => {
    setBranchStep(ONBOARDING_STEPS.length - 1);
    // Mark all steps as completed in localStorage
    ONBOARDING_STEPS.forEach((step, idx) => {
      localStorage.setItem(`onboardingStepData_${step}`, JSON.stringify({ completed: true }));
    });
    localStorage.setItem('onboardingProgress', JSON.stringify(ONBOARDING_STEPS.map((_, i) => i)));
  };

  // Render the current step based on the step index
  const renderCurrentStep = () => {
    // Step 0: Welcome
    if (branchStep === 0) {
      return (
        <WelcomeScreen
          onNext={() => setBranchStep(1)}
          onSkip={handleSkipToEnd}
          isLoading={completingStepLoading}
        />
      );
    }
    // Step 1: Church Profile
    if (branchStep === 1) {
      return (
        <ChurchProfileScreen
          onNext={() => setBranchStep(2)}
          onBack={() => setBranchStep(0)}
          isLoading={completingStepLoading}
          churchProfile={churchProfile}
          setChurchProfile={setChurchProfile}
        />
      );
    }
    // Step 2: Admin Setup
    if (branchStep === 2) {
      return (
        <AdminSetupScreen
          onNext={() => setBranchStep(3)}
          onBack={() => setBranchStep(1)}
          isLoading={completingStepLoading}
        />
      );
    }
    // Step 3: Number of Branches
    if (branchStep === 3) {
      return (
        <BranchCountScreen
          initialCount={branchCount}
          onNext={(count) => {
            setBranchCount(count);
            // Initialize empty branch objects
            setBranches(Array.from({length: count}, () => ({
              branchName: '',
              address: '',
              status: 'active',
              establishedDate: '',
              currency: currencyOptions[0],
              modules: [],
              admin: { name: '', email: '', password: '' },
              settings: { timezone: '' }
            })));
            setBranchStep(4);
          }}
          isLoading={completingStepLoading}
        />
      );
    }
    // Step 4: Branch Details
    if (branchStep === 4) {
      return (
        <BranchDetailsScreen
          branches={branches}
          setBranches={setBranches}
          onNext={() => setBranchStep(5)}
          onBack={() => setBranchStep(3)}
          isLoading={completingStepLoading}
          moduleOptions={moduleOptions}
          currencyOptions={currencyOptions}
        />
      );
    }
    // Step 5: Branding
    if (branchStep === 5) {
      return (
        <BrandingScreen
          onNext={() => setBranchStep(6)}
          onBack={() => setBranchStep(4)}
          onSkip={() => setBranchStep(6)}
          isLoading={completingStepLoading}
        />
      );
    }
    // Step 6: User Invitations
    if (branchStep === 6) {
      return (
        <UserInvitationsScreen
          onNext={() => setBranchStep(7)}
          onBack={() => setBranchStep(5)}
          onSkip={() => setBranchStep(7)}
          isLoading={completingStepLoading}
        />
      );
    }
    // Step 7: Role Configuration
    if (branchStep === 7) {
      return (
        <RoleConfigurationScreen
          onNext={() => setBranchStep(8)}
          onBack={() => setBranchStep(6)}
          onSkip={() => setBranchStep(8)}
          isLoading={completingStepLoading}
        />
      );
    }
    // Step 8: Skip Member Import
    if (branchStep === 8) {
      return (
        <FinanceSetupScreen
          onNext={() => setBranchStep(9)}
          onBack={() => setBranchStep(7)}
          onSkip={() => setBranchStep(9)}
          isLoading={completingStepLoading}
        />
      );
    }
    // Step 9: Finance Setup
    if (branchStep === 9) {
      return (
        <FinanceSetupScreen
          onNext={() => setBranchStep(10)}
          onBack={() => setBranchStep(8)}
          onSkip={() => setBranchStep(10)}
          isLoading={completingStepLoading}
        />
      );
    }
    // Step 10: Onboarding Completion
    if (branchStep === 10) {
      return (
        <OnboardingCompletionScreen
          onFinish={handleFinish}
        />
      );
    }
    // Fallback: show the rest of the onboarding flow (original logic)
    switch (currentStep) {
      case 0: // Welcome (should not reach here)
        return null;
      case 1: // Church Profile
        return (
          <ChurchProfileScreen
            onNext={handleNext}
            onBack={handleBack}
            isLoading={completingStepLoading}
            churchProfile={churchProfile}
            setChurchProfile={setChurchProfile}
          />
        );
      case 2: // Module Selection
        return (
          <ModuleSelectionScreen
            onNext={handleNext}
            onBack={handleBack}
            onModulesSelected={handleModulesSelected}
            isLoading={completingStepLoading}
          />
        );
      case 3: // Member Data Import
        return (
          <MemberDataImportScreen
            onNext={handleNext}
            onBack={handleBack}
            isLoading={memberImportLoading}
            memberFile={memberFile}
            setMemberFile={setMemberFile}
            memberImportError={memberImportError}
            onDownloadTemplate={handleMemberTemplateDownload}
            isTemplateLoading={memberTemplateLoading}
          />
        );
      case 4: // Financial Data Import
        return (
          <FinancialDataImportScreen
            onNext={handleNext}
            onBack={handleBack}
            isLoading={financialImportLoading}
            financialFile={financialFile}
            setFinancialFile={setFinancialFile}
            financialImportError={financialImportError}
            onDownloadTemplate={handleFinancialTemplateDownload}
            isTemplateLoading={fundsTemplateLoading}
          />
        );
      case 5: // Completion
        return (
          <CompletionScreen
            onFinish={handleFinish}
            churchProfile={churchProfile}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <p>Unknown step</p>
            <Button onClick={handleBack} className="mt-4">
              Go Back
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stepper UI for all onboarding steps */}
      <div className="pt-8 px-2 md:px-8">
        <Stepper currentStep={branchStep} />
      </div>
      {/* Content area */}
      <div className="px-4 py-10">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default ModernOnboardingFlow;
