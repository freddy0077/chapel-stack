'use client';

import { useState, useEffect } from 'react';
import { useOnboardingState } from './hooks/useOnboardingState';
import { ChurchProfileData } from '@/graphql/types/onboardingTypes';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@tremor/react';

// Import extracted screen components
import WelcomeScreen from './screens/WelcomeScreen';
import ChurchProfileScreen from './screens/ChurchProfileScreen';
import AdminSetupScreen from './screens/AdminSetupScreen';
// import BrandingScreen from './screens/BrandingScreen';
import UserInvitationsScreen from './screens/UserInvitationsScreen';
// import RoleConfigurationScreen from './screens/RoleConfigurationScreen';
import FinanceSetupScreen from './screens/FinanceSetupScreen';
import OnboardingCompletionScreen from './screens/OnboardingCompletionScreen';
import BranchCountScreen from './screens/BranchCountScreen';
import BranchDetailsScreen from './screens/BranchDetailsScreen';

// Import common components
import LoadingSpinner from './common/LoadingSpinner';

// Import types and utilities
import { getCompletedScreens } from './utils/completedScreens';
import { ONBOARDING_SCREEN_ORDER } from './utils/onboardingStepOrder';

// Import type for BranchDetailsInput
import type { BranchDetailsInput } from './screens/BranchDetailsScreen';

// Main onboarding flow component
interface ModernOnboardingFlowProps {
  branchId: string | null;
  onComplete: (selectedModules: string[], churchProfile: ChurchProfileData) => void;
}

const ModernOnboardingFlow = ({ branchId, onComplete }: ModernOnboardingFlowProps) => {
  // New: State for branch onboarding
  const [branchStep, setBranchStep] = useState<number>(0); // 0: Welcome, 1: Church Profile, 2: Admin Setup, 3: BranchCount, 4: BranchDetails, ...
  const [churchProfile, setChurchProfile] = useState<ChurchProfileData | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiError] = useState<string | null>(null);

  // Branch onboarding state
  const [branchCount, setBranchCount] = useState<number>(1);
  const [branches, setBranches] = useState<BranchDetailsInput[]>([]);

  // Optionally: module/currency options for BranchDetailsScreen
  const moduleOptions = [
    'Attendance', 'Finance', 'Groups', 'Ministries', 'Sacraments', 'Staff', 'Reports', 'Events', 'Media', 'Messaging', 'Settings',
  ];
  const currencyOptions = [
    'USD', 'EUR', 'GBP', 'GHS', 'NGN', 'KES', 'ZAR', 'INR', 'CNY', 'JPY', 'BRL', 'MXN', 'AUD', 'CAD', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'RUB', 'TRY', 'EGP', 'MAD', 'AED', 'SAR', 'ILS', 'PKR', 'BDT', 'UAH', 'ARS', 'CLP', 'COP', 'PEN', 'VND', 'THB', 'SGD', 'MYR', 'IDR', 'KRW', 'PHP', 'NZD', 'HKD', 'TWD', 'CZK', 'HUF', 'RON', 'HRK', 'BGN', 'SRD', 'XOF', 'XAF', 'XCD', 'XPF', 'XDR', 'XAG', 'XAU', 'XPT', 'XPD', 'BTC', 'ETH', 'USDT', 'USDC', 'BUSD', 'DAI', 'SOL', 'BNB', 'MATIC', 'DOGE', 'SHIB', 'LTC', 'TRX', 'DOT', 'AVAX', 'UNI', 'LINK', 'ADA', 'XRP', 'BCH', 'XLM', 'FIL', 'ETC', 'EOS', 'XTZ', 'ATOM', 'NEO', 'AAVE', 'KSM', 'YFI', 'SUSHI', 'COMP', 'SNX', 'CRV', 'MKR', 'ZRX', 'ENJ', 'BAT', 'CHZ', 'GRT', '1INCH', 'REN', 'BAL', 'SRM', 'ALGO', 'AMP', 'ANKR', 'BAND', 'CVC', 'DNT', 'GNO', 'KNC', 'LOOM', 'LRC', 'MANA', 'NMR', 'OXT', 'PAX', 'RLC', 'STORJ', 'UMA', 'ZEC', 'ZEN', 'ZIL', 'ZRX',
  ];

  // Use the centralized onboarding state hook
  const {
    currentStep,
    handleNext,
    handleBack,
    handleFinish
  } = useOnboardingState({ branchId, onComplete });

  // Stepper steps definition
  const ONBOARDING_STEPS = [
    'Welcome',
    'Church Profile',
    'Admin Setup',
    'Branch Count',
    'Branch Details',
    'User Invitations',
    'Complete',
  ];

  function Stepper({ currentStep }: { currentStep: number }) {
    return (
      <div className="flex items-center justify-center gap-0 md:gap-2 mb-10 w-full overflow-x-auto">
        {ONBOARDING_STEPS.map((label) => {
          const isActive = ONBOARDING_STEPS.indexOf(label) === currentStep;
          const isCompleted = ONBOARDING_STEPS.indexOf(label) < currentStep;
          return (
            <div key={label} className="flex items-center">
              <div
                className={`flex flex-col items-center min-w-[90px] md:min-w-[120px] px-1 md:px-2`}
              >
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg border-4 transition
                    ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : isCompleted ? 'bg-green-400 border-green-400 text-white' : 'bg-white border-gray-300 text-gray-400'}`}
                >
                  {isCompleted ? <span>&#10003;</span> : ONBOARDING_STEPS.indexOf(label) + 1}
                </div>
                <span className={`mt-2 text-xs md:text-sm font-medium text-center ${isActive ? 'text-indigo-700' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}>{label}</span>
              </div>
              {ONBOARDING_STEPS.indexOf(label) < ONBOARDING_STEPS.length - 1 && (
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
          onClick={() => setIsLoadingApi(true)}
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
    ONBOARDING_STEPS.forEach((step) => {
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
          isLoading={false}
        />
      );
    }
    // Step 1: Church Profile
    if (branchStep === 1) {
      return (
        <ChurchProfileScreen
          onNext={() => setBranchStep(2)}
          onBack={() => setBranchStep(0)}
          isLoading={false}
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
          isLoading={false}
        />
      );
    }
    // Step 3: Branch Count
    if (branchStep === 3) {
      return (
        <BranchCountScreen
          onNext={(count: number) => {
            setBranchCount(count);
            setBranches(prev => {
              if (prev.length === count) return prev;
              if (count > prev.length) {
                // Extend with empty branches, preserving existing data
                return [
                  ...prev,
                  ...Array.from({ length: count - prev.length }, () => ({
                    branchName: '',
                    address: '',
                    status: '',
                    establishedDate: '',
                    city: '',
                    country: '',
                    phone: '',
                    email: '',
                    website: '',
                    currency: '',
                    modules: [],
                    admin: { name: '', email: '', password: '' },
                    settings: { timezone: '' },
                  }))
                ];
              } else {
                // Truncate, preserving existing data
                return prev.slice(0, count);
              }
            });
            setBranchStep(4);
          }}
          onBack={() => setBranchStep(2)}
          isLoading={false}
        />
      );
    }
    // Step 4: Branch Details
    if (branchStep === 4) {
      return (
        <BranchDetailsScreen
          branches={branches}
          setBranches={setBranches}
          moduleOptions={moduleOptions}
          currencyOptions={currencyOptions}
          onNext={() => setBranchStep(5)}
          onBack={() => setBranchStep(3)}
          isLoading={false}
        />
      );
    }
    // Step 5: User Invitations
    if (branchStep === 5) {
      return (
        <UserInvitationsScreen
          onNext={() => setBranchStep(6)}
          onBack={() => setBranchStep(4)}
          isLoading={false}
        />
      );
    }
    // Step 6: Complete
    if (branchStep === 6) {
      return <OnboardingCompletionScreen onFinish={handleFinish} />;
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
            isLoading={false}
            churchProfile={churchProfile}
            setChurchProfile={setChurchProfile}
          />
        );
      case 2: // Module Selection
        return (
          <AdminSetupScreen
            onNext={handleNext}
            onBack={handleBack}
            isLoading={false}
          />
        );
      case 3: // Member Data Import
        return (
          <FinanceSetupScreen
            onNext={handleNext}
            onBack={handleBack}
            isLoading={false}
          />
        );
      case 4: // Financial Data Import
        return (
          <FinanceSetupScreen
            onNext={handleNext}
            onBack={handleBack}
            isLoading={false}
          />
        );
      case 5: // Completion
        return (
          <OnboardingCompletionScreen
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
