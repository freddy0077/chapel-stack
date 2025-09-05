"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@apollo/client";
import { CREATE_MEMBER } from "@/graphql/queries/memberQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";

// Step Components
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ContactAddressStep from "./steps/ContactAddressStep";
import EmergencyFamilyStep from "./steps/EmergencyFamilyStep";
import ChurchMembershipStep from "./steps/ChurchMembershipStep";
import CommunicationPrefsStep from "./steps/CommunicationPrefsStep";
import ReviewSubmitStep from "./steps/ReviewSubmitStep";

// Types
import {
  CreateMemberInput,
  Gender,
  MaritalStatus,
  MembershipStatus,
  MembershipType,
  PrivacyLevel,
} from "../../types/member.types";
import { WizardFormData } from "./types/WizardTypes";

interface AddMemberWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (member: any) => void;
}

const WIZARD_STEPS = [
  { id: 1, title: "Personal Information", component: PersonalInfoStep },
  { id: 2, title: "Contact & Address", component: ContactAddressStep },
  { id: 3, title: "Emergency & Family", component: EmergencyFamilyStep },
  { id: 4, title: "Church & Membership", component: ChurchMembershipStep },
  {
    id: 5,
    title: "Communication Preferences",
    component: CommunicationPrefsStep,
  },
  { id: 6, title: "Review & Submit", component: ReviewSubmitStep },
];

const AddMemberWizard: React.FC<AddMemberWizardProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<WizardFormData>({
    firstName: "",
    lastName: "",
    gender: Gender.NOT_SPECIFIED,
    maritalStatus: MaritalStatus.UNKNOWN,
    membershipStatus: MembershipStatus.VISITOR,
    membershipType: MembershipType.REGULAR,
    privacyLevel: PrivacyLevel.STANDARD,
    preferredLanguage: "en",
    headOfHousehold: false,
    isRegularAttendee: false,
  });

  const [createMember] = useMutation(CREATE_MEMBER, {
    onCompleted: (data) => {
      setIsSubmitting(false);
      onSuccess?.(data.createMember);
      handleClose();
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error("Error creating member:", error);
    },
  });

  const updateFormData = (stepData: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare the data for submission
      const submitData: CreateMemberInput = {
        ...formData,
        branchId: user?.branchId,
        organisationId: user?.organisationId,
        // Remove UI-specific fields
        confirmEmail: undefined,
        profileImage: undefined,
      };

      await createMember({
        variables: { createMemberInput: submitData },
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Submission error:", error);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      firstName: "",
      lastName: "",
      gender: Gender.NOT_SPECIFIED,
      maritalStatus: MaritalStatus.UNKNOWN,
      membershipStatus: MembershipStatus.VISITOR,
      membershipType: MembershipType.REGULAR,
      privacyLevel: PrivacyLevel.STANDARD,
      preferredLanguage: "en",
      headOfHousehold: false,
      isRegularAttendee: false,
    });
    onClose();
  };

  const getCurrentStepComponent = () => {
    const step = WIZARD_STEPS.find((s) => s.id === currentStep);
    console.log("Current step:", currentStep, "Step found:", step);

    if (!step) {
      console.error("Step not found for currentStep:", currentStep);
      return <div className="p-4 text-red-500">Error: Step not found</div>;
    }

    const StepComponent = step.component;
    console.log("StepComponent:", StepComponent);

    if (!StepComponent) {
      console.error("StepComponent is undefined for step:", step);
      return (
        <div className="p-4 text-red-500">Error: Step component not found</div>
      );
    }

    try {
      return (
        <StepComponent
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === WIZARD_STEPS.length}
        />
      );
    } catch (error) {
      console.error("Error rendering step component:", error);
      return (
        <div className="p-4 text-red-500">
          Error rendering step: {error.message}
        </div>
      );
    }
  };

  if (!isOpen) return null;

  console.log(
    "AddMemberWizard rendering, isOpen:",
    isOpen,
    "currentStep:",
    currentStep,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
        >
          {/* Debug Info */}
          <div className="mb-4 p-2 bg-yellow-100 text-xs text-yellow-800 rounded">
            Debug: Step {currentStep} of {WIZARD_STEPS.length} | FormData keys:{" "}
            {Object.keys(formData).length}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Add New Member
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Step {currentStep} of {WIZARD_STEPS.length}:{" "}
                {WIZARD_STEPS.find((s) => s.id === currentStep)?.title}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {WIZARD_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.id}
                  </div>
                  {index < WIZARD_STEPS.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 text-center">
              {Math.round((currentStep / WIZARD_STEPS.length) * 100)}% Complete
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {getCurrentStepComponent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AddMemberWizard;
