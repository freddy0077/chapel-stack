"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  UserIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { GET_SUBSCRIPTION_PLANS, CREATE_ORGANIZATION_SUBSCRIPTION } from "@/graphql/subscription-management";
import {
  BasicInfoStep,
  AddressLocationStep,
  AdminUserStep,
  SubscriptionPlanStep,
  ReviewStep,
  ModalHeader,
  ModalFooter,
  OrganizationData,
  ValidationErrors,
  WizardStep,
} from "./index";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Enter your organization's basic details",
    icon: BuildingOfficeIcon,
  },
  {
    id: "address",
    title: "Address & Location",
    description: "Provide your organization's physical address",
    icon: MapPinIcon,
  },
  {
    id: "admin",
    title: "Admin User",
    description: "Create the administrator account",
    icon: UserIcon,
  },
  {
    id: "subscription",
    title: "Subscription Plan",
    description: "Choose your subscription plan",
    icon: CreditCardIcon,
  },
  {
    id: "review",
    title: "Review & Create",
    description: "Review and confirm your organization details",
    icon: DocumentCheckIcon,
  },
];

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    name: "",
    email: "",
    phoneCountryCode: "+233",
    phoneNumber: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPhoneCountryCode: "+233",
    adminPhone: "",
    adminPassword: "",
    planId: "",
    billingCycle: "MONTHLY",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const {
    data: subscriptionPlansData,
    loading: subscriptionPlansLoading,
    error: subscriptionPlansError,
  } = useQuery(GET_SUBSCRIPTION_PLANS);

  const [createOrganizationSubscription] = useMutation(
    CREATE_ORGANIZATION_SUBSCRIPTION,
  );

  const subscriptionPlans = subscriptionPlansData?.subscriptionPlans || [];

  const updateField = (field: keyof OrganizationData, value: string) => {
    setOrganizationData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validatePhoneNumber = (countryCode: string, phone: string): string | null => {
    if (!phone.trim()) return null; // Phone is optional
    
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check for phone number length (should be reasonable for most countries)
    if (cleanPhone.length < 7 || cleanPhone.length > 12) {
      return "Phone number must be between 7-12 digits";
    }
    
    // Basic format validation - should only contain digits, spaces, dashes, parentheses
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return "Phone number contains invalid characters";
    }
    
    return null;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};

    switch (step) {
      case 0: // Basic Information
        if (!organizationData.name.trim()) {
          newErrors.name = "Organization name is required";
        }
        if (!organizationData.email.trim()) {
          newErrors.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(organizationData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        
        // Validate phone number if provided
        const phoneError = validatePhoneNumber(organizationData.phoneCountryCode, organizationData.phoneNumber);
        if (phoneError) {
          newErrors.phoneNumber = phoneError;
        }
        break;

      case 1: // Address & Location
        if (!organizationData.address.trim()) {
          newErrors.address = "Address is required";
        }
        if (!organizationData.city.trim()) {
          newErrors.city = "City is required";
        }
        if (!organizationData.state.trim()) {
          newErrors.state = "State/Region is required";
        }
        if (!organizationData.country.trim()) {
          newErrors.country = "Country is required";
        }
        break;

      case 2: // Admin User
        if (!organizationData.adminFirstName.trim()) {
          newErrors.adminFirstName = "First name is required";
        }
        if (!organizationData.adminLastName.trim()) {
          newErrors.adminLastName = "Last name is required";
        }
        if (!organizationData.adminEmail.trim()) {
          newErrors.adminEmail = "Admin email is required";
        } else if (!/\S+@\S+\.\S+/.test(organizationData.adminEmail)) {
          newErrors.adminEmail = "Please enter a valid email address";
        }
        
        // Validate admin phone number if provided
        const adminPhoneError = validatePhoneNumber(organizationData.adminPhoneCountryCode, organizationData.adminPhone);
        if (adminPhoneError) {
          newErrors.adminPhone = adminPhoneError;
        }
        
        if (!organizationData.adminPassword.trim()) {
          newErrors.adminPassword = "Password is required";
        } else if (organizationData.adminPassword.length < 8) {
          newErrors.adminPassword = "Password must be at least 8 characters";
        }
        break;

      case 3: // Subscription Plan
        if (!organizationData.planId) {
          newErrors.planId = "Please select a subscription plan";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === WIZARD_STEPS.length - 1) {
      handleSubmit();
    } else {
      if (validateStep(currentStep)) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      // Only create the subscription since organization and admin user are already created
      if (organizationData.organizationId && organizationData.planId) {
        const subscriptionResponse = await createOrganizationSubscription(
          organizationData.organizationId,
          organizationData.planId,
          {
            startDate:
              organizationData.startDate ||
              new Date().toISOString().split("T")[0],
            metadata: {
              adminFirstName: organizationData.adminFirstName,
              adminLastName: organizationData.adminLastName,
              adminEmail: organizationData.adminEmail,
              adminPhone: organizationData.adminPhone,
              billingCycle: organizationData.billingCycle,
            },
          },
        );
        if (subscriptionResponse?.id) {
          onSuccess();
          onClose();
        } else {
          setErrors({
            submit: "Failed to create subscription. Please try again.",
          });
        }
      } else {
        setErrors({
          submit: "Missing organization ID or plan ID. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      setErrors({ submit: "Failed to create subscription. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      organizationData,
      errors,
      updateField,
    };

    switch (currentStep) {
      case 0:
        return <BasicInfoStep {...stepProps} />;
      case 1:
        return <AddressLocationStep {...stepProps} />;
      case 2:
        return <AdminUserStep {...stepProps} />;
      case 3:
        return (
          <SubscriptionPlanStep
            {...stepProps}
            subscriptionPlans={subscriptionPlans}
            subscriptionPlansLoading={subscriptionPlansLoading}
            subscriptionPlansError={subscriptionPlansError}
          />
        );
      case 4:
        return (
          <ReviewStep
            {...stepProps}
            subscriptionPlans={subscriptionPlans}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border-0 shadow-2xl">
        <motion.div 
          className="flex flex-col h-full max-h-[95vh]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Fixed Header */}
          <div className="flex-shrink-0">
            <ModalHeader
              currentStep={currentStep}
              wizardSteps={WIZARD_STEPS}
              onClose={onClose}
            />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-8">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100/50">
                    <CardTitle className="flex items-center gap-4 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {React.createElement(WIZARD_STEPS[currentStep].icon, {
                          className: "w-6 h-6"
                        })}
                      </motion.div>
                      <div>
                        <div>{WIZARD_STEPS[currentStep].title}</div>
                        <p className="text-sm font-normal text-gray-600 mt-1">
                          {WIZARD_STEPS[currentStep].description}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {renderStepContent()}
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* Modern Error Display */}
                    <AnimatePresence>
                      {errors.submit && (
                        <motion.div 
                          className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-xl p-6 shadow-lg backdrop-blur-sm"
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center">
                            <motion.div
                              className="p-2 rounded-full bg-red-100 mr-3"
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                            </motion.div>
                            <div>
                              <span className="text-red-700 font-semibold">Error</span>
                              <p className="text-red-600 mt-1">{errors.submit}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0">
            <ModalFooter
              currentStep={currentStep}
              wizardSteps={WIZARD_STEPS}
              isLoading={isLoading}
              onBack={handleBack}
              onNext={handleNext}
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationModal;
