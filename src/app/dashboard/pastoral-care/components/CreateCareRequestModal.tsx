"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { useCreateCareRequest } from "@/graphql/hooks/usePastoralCare";
import { useSearchMembers } from "@/graphql/hooks/useSearchMembers";
import {
  useSearchPastoralStaff,
  useSearchPastors,
} from "@/graphql/hooks/useSearchPastoralStaff";
import { 
  XMarkIcon, 
  UserIcon, 
  CheckIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

interface CreateCareRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface PastoralStaffUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  userBranches: Array<{
    branch: {
      id: string;
      name: string;
    };
    role: {
      id: string;
      name: string;
    };
  }>;
}

const requestTypes = [
  { value: "PRAYER_REQUEST", label: "Prayer Request" },
  { value: "MASS_INTENTION", label: "Mass Intention" },
  { value: "HOSPITAL_VISIT", label: "Hospital Visit" },
  { value: "HOME_VISIT", label: "Home Visit" },
  { value: "COUNSELING", label: "Counseling" },
  { value: "CRISIS_SUPPORT", label: "Crisis Support" },
  { value: "BEREAVEMENT", label: "Bereavement Support" },
  { value: "FINANCIAL_ASSISTANCE", label: "Financial Assistance" },
  { value: "SPIRITUAL_GUIDANCE", label: "Spiritual Guidance" },
  { value: "FAMILY_CRISIS", label: "Family Crisis" },
  { value: "GENERAL_SUPPORT", label: "General Support" },
  { value: "OTHER", label: "Other" },
];

const priorities = [
  { value: "LOW", label: "Low", color: "text-green-600" },
  { value: "MEDIUM", label: "Medium", color: "text-yellow-600" },
  { value: "HIGH", label: "High", color: "text-orange-600" },
  { value: "URGENT", label: "Urgent", color: "text-red-600" },
];

// Step configuration
const steps = [
  {
    id: 1,
    title: "Member & Request Type",
    description: "Select member and type of care needed",
    icon: UserIcon,
  },
  {
    id: 2,
    title: "Request Details",
    description: "Provide title, description and priority",
    icon: ClipboardDocumentListIcon,
  },
  {
    id: 3,
    title: "Assignment & Scheduling",
    description: "Assign pastor and set date",
    icon: UserGroupIcon,
  },
  {
    id: 4,
    title: "Review & Submit",
    description: "Review all details before creating",
    icon: CheckIcon,
  },
];

export default function CreateCareRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCareRequestModalProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const { createCareRequest, loading, error } = useCreateCareRequest();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    memberId: "",
    title: "",
    description: "",
    requestType: "PRAYER_REQUEST",
    priority: "MEDIUM",
    requestDate: new Date().toISOString().split("T")[0],
    assignedPastorId: "",
    assistantId: "",
    notes: "",
  });

  // Member search state
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  // Pastor search state
  const [pastorSearch, setPastorSearch] = useState("");
  const [selectedPastor, setSelectedPastor] =
    useState<PastoralStaffUser | null>(null);
  const [showPastorDropdown, setShowPastorDropdown] = useState(false);

  // Assistant search state
  const [assistantSearch, setAssistantSearch] = useState("");
  const [selectedAssistant, setSelectedAssistant] =
    useState<PastoralStaffUser | null>(null);
  const [showAssistantDropdown, setShowAssistantDropdown] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Search for members
  const {
    data: members,
    loading: memberLoading,
    error: memberError,
  } = useSearchMembers(memberSearch, organisationId || "", branchId);

  // Search for pastors (using dedicated pastor search hook)
  const { pastoralStaff: pastors, loading: pastorLoading } = useSearchPastors(
    pastorSearch,
    organisationId || "",
    branchId,
  );

  // Search for assistants (using pastoral staff search hook for broader roles)
  const { pastoralStaff: assistants, loading: assistantLoading } =
    useSearchPastoralStaff(
      assistantSearch,
      organisationId || "",
      branchId,
      ["PASTOR", "BRANCH_ADMIN", "STAFF"], // All pastoral roles for assistants
    );

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setFormData((prev) => ({ ...prev, memberId: member.id }));
    setMemberSearch(`${member.firstName} ${member.lastName}`);
    setShowMemberDropdown(false);
    // Clear member error if it exists
    if (errors.memberId) {
      setErrors((prev) => ({ ...prev, memberId: "" }));
    }
  };

  const handlePastorSelect = (pastor: PastoralStaffUser) => {
    setSelectedPastor(pastor);
    setFormData((prev) => ({ ...prev, assignedPastorId: pastor.id }));
    setPastorSearch(`${pastor.firstName} ${pastor.lastName}`);
    setShowPastorDropdown(false);
  };

  const handleAssistantSelect = (assistant: PastoralStaffUser) => {
    setSelectedAssistant(assistant);
    setFormData((prev) => ({ ...prev, assistantId: assistant.id }));
    setAssistantSearch(`${assistant.firstName} ${assistant.lastName}`);
    setShowAssistantDropdown(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMemberSearchChange = (value: string) => {
    setMemberSearch(value);
    setShowMemberDropdown(value.length > 0);
    // Clear selection if user is typing a new search
    if (
      selectedMember &&
      value !== `${selectedMember.firstName} ${selectedMember.lastName}`
    ) {
      setSelectedMember(null);
      setFormData((prev) => ({ ...prev, memberId: "" }));
    }
  };

  const handlePastorSearchChange = (value: string) => {
    setPastorSearch(value);
    setShowPastorDropdown(value.length > 0);
    // Clear selection if user is typing a new search
    if (
      selectedPastor &&
      value !== `${selectedPastor.firstName} ${selectedPastor.lastName}`
    ) {
      setSelectedPastor(null);
      setFormData((prev) => ({ ...prev, assignedPastorId: "" }));
    }
  };

  const handleAssistantSearchChange = (value: string) => {
    setAssistantSearch(value);
    setShowAssistantDropdown(value.length > 0);
    // Clear selection if user is typing a new search
    if (
      selectedAssistant &&
      value !== `${selectedAssistant.firstName} ${selectedAssistant.lastName}`
    ) {
      setSelectedAssistant(null);
      setFormData((prev) => ({ ...prev, assistantId: "" }));
    }
  };

  // Step validation functions
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.memberId.trim()) {
          newErrors.memberId = "Member is required";
        }
        break;
      case 2:
        if (!formData.title.trim()) {
          newErrors.title = "Title is required";
        }
        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
        }
        break;
      case 3:
        if (!formData.requestDate) {
          newErrors.requestDate = "Request date is required";
        }
        break;
      case 4:
        // Final validation - all required fields
        if (!formData.memberId.trim()) {
          newErrors.memberId = "Member is required";
        }
        if (!formData.title.trim()) {
          newErrors.title = "Title is required";
        }
        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
        }
        if (!formData.requestDate) {
          newErrors.requestDate = "Request date is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    return validateStep(4);
  };

  // Step navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setFormData({
      memberId: "",
      title: "",
      description: "",
      requestType: "PRAYER_REQUEST",
      priority: "MEDIUM",
      requestDate: new Date().toISOString().split("T")[0],
      assignedPastorId: "",
      assistantId: "",
      notes: "",
    });
    setMemberSearch("");
    setSelectedMember(null);
    setShowMemberDropdown(false);
    setPastorSearch("");
    setSelectedPastor(null);
    setShowPastorDropdown(false);
    setAssistantSearch("");
    setSelectedAssistant(null);
    setShowAssistantDropdown(false);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!organisationId) {
      setErrors({ submit: "Organisation information is missing" });
      return;
    }

    try {
      const input = {
        memberId: formData.memberId.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        requestType: formData.requestType,
        priority: formData.priority,
        requestDate: formData.requestDate,
        assignedPastorId: formData.assignedPastorId.trim() || undefined,
        assistantId: formData.assistantId.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        organisationId,
        branchId: branchId || undefined,
      };

      await createCareRequest(input);
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors({ submit: "Failed to create care request. Please try again." });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20"
            >
              {/* Modern Glassmorphism Header */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-8 py-8">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl font-bold text-white"
                    >
                      New Care Request
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-2 text-white/90 text-lg"
                    >
                      Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                    </motion.p>
                  </div>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleClose}
                    className="rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => {
                      const isActive = currentStep === step.id;
                      const isCompleted = completedSteps.includes(step.id);
                      const isAccessible = step.id <= currentStep || completedSteps.includes(step.id - 1);
                      const StepIcon = step.icon;

                      return (
                        <div key={step.id} className="flex items-center">
                          <button
                            onClick={() => isAccessible && goToStep(step.id)}
                            disabled={!isAccessible}
                            className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                              isCompleted
                                ? 'bg-white text-indigo-600 border-white shadow-lg'
                                : isActive
                                ? 'bg-white/20 text-white border-white shadow-lg scale-110'
                                : isAccessible
                                ? 'bg-white/10 text-white/70 border-white/30 hover:bg-white/20 hover:border-white/50'
                                : 'bg-white/5 text-white/30 border-white/20 cursor-not-allowed'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckIcon className="h-6 w-6" />
                            ) : (
                              <StepIcon className="h-6 w-6" />
                            )}
                          </button>
                          {index < steps.length - 1 && (
                            <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                              completedSteps.includes(step.id) ? 'bg-white' : 'bg-white/20'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center">
                    <p className="text-white/90 text-sm font-medium">
                      {steps[currentStep - 1]?.description}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {errors.submit}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px]"
                  >
                    {/* Step 1: Member & Request Type */}
                    {currentStep === 1 && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
                            <UserIcon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Member & Request Type</h3>
                          <p className="text-gray-600">Select the member who needs care and the type of request</p>
                        </div>

                        {/* Member Selection */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Select Member *
                          </label>
                          <div className="relative">
                            <div className="relative">
                              <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                value={memberSearch}
                                onChange={(e) => handleMemberSearchChange(e.target.value)}
                                onFocus={() =>
                                  setShowMemberDropdown(memberSearch.length > 0)
                                }
                                className={`w-full rounded-xl border-2 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                                  errors.memberId
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-gray-200"
                                }`}
                                placeholder="Search for a member..."
                              />
                            </div>

                            {showMemberDropdown && memberSearch.length > 0 && (
                              <div className="absolute z-30 mt-2 w-full rounded-xl bg-white border border-gray-200 shadow-xl max-h-64 overflow-auto">
                                {memberLoading && (
                                  <div className="p-4 text-center">
                                    <div className="inline-flex items-center gap-3 text-gray-600">
                                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                                      <span className="text-sm font-medium">
                                        Searching members...
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {!memberLoading && members.length === 0 && (
                                  <div className="p-4 text-center text-gray-500">
                                    <UserIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-sm font-medium">
                                      No members found
                                    </p>
                                  </div>
                                )}
                                {!memberLoading &&
                                  members.length > 0 &&
                                  members.map((member) => (
                                    <button
                                      key={member.id}
                                      type="button"
                                      onClick={() => handleMemberSelect(member)}
                                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                          <UserIcon className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-gray-900 truncate">
                                            {member.firstName} {member.lastName}
                                          </p>
                                          {member.email && (
                                            <p className="text-sm text-gray-500 truncate">
                                              {member.email}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}

                            {/* Click outside to close dropdown */}
                            {showMemberDropdown && (
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setShowMemberDropdown(false)}
                              />
                            )}
                          </div>
                          {errors.memberId && (
                            <p className="mt-2 text-sm text-red-600 font-medium">
                              {errors.memberId}
                            </p>
                          )}
                        </div>

                        {/* Request Type */}
                        <div>
                          <label
                            htmlFor="requestType"
                            className="block text-sm font-semibold text-gray-900 mb-3"
                          >
                            Request Type *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {requestTypes.map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => handleInputChange("requestType", type.value)}
                                className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                                  formData.requestType === type.value
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    formData.requestType === type.value ? 'bg-indigo-500' : 'bg-gray-300'
                                  }`} />
                                  <span className="font-medium text-sm">{type.label}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Request Details */}
                    {currentStep === 2 && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
                            <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Details</h3>
                          <p className="text-gray-600">Provide a clear title, description, and priority level</p>
                        </div>

                        {/* Title */}
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-semibold text-gray-900 mb-3"
                          >
                            Title *
                          </label>
                          <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            className={`w-full rounded-xl border-2 bg-gray-50 py-4 pl-4 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                              errors.title
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200"
                            }`}
                            placeholder="Enter a brief title for the request"
                          />
                          {errors.title && (
                            <p className="mt-2 text-sm text-red-600 font-medium">
                              {errors.title}
                            </p>
                          )}
                        </div>

                        {/* Description */}
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-semibold text-gray-900 mb-3"
                          >
                            Description *
                          </label>
                          <textarea
                            id="description"
                            rows={5}
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            className={`w-full rounded-xl border-2 bg-gray-50 py-4 pl-4 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 resize-none ${
                              errors.description
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-200"
                            }`}
                            placeholder="Describe the care request in detail..."
                          />
                          {errors.description && (
                            <p className="mt-2 text-sm text-red-600 font-medium">
                              {errors.description}
                            </p>
                          )}
                        </div>

                        {/* Priority */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Priority Level *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {priorities.map((priority) => (
                              <button
                                key={priority.value}
                                type="button"
                                onClick={() => handleInputChange("priority", priority.value)}
                                className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                                  formData.priority === priority.value
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    priority.value === 'LOW' ? 'bg-green-500' :
                                    priority.value === 'MEDIUM' ? 'bg-yellow-500' :
                                    priority.value === 'HIGH' ? 'bg-orange-500' : 'bg-red-500'
                                  }`} />
                                  <span className={`font-medium text-sm ${
                                    formData.priority === priority.value ? 'text-indigo-700' : priority.color
                                  }`}>
                                    {priority.label}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Assignment & Scheduling */}
                    {currentStep === 3 && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4">
                            <UserGroupIcon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Assignment & Scheduling</h3>
                          <p className="text-gray-600">Set the request date and assign pastoral staff</p>
                        </div>

                        {/* Request Date */}
                        <div>
                          <label
                            htmlFor="requestDate"
                            className="block text-sm font-semibold text-gray-900 mb-3"
                          >
                            Request Date *
                          </label>
                          <div className="relative">
                            <CalendarDaysIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              type="date"
                              id="requestDate"
                              value={formData.requestDate}
                              onChange={(e) =>
                                handleInputChange("requestDate", e.target.value)
                              }
                              className={`w-full rounded-xl border-2 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                                errors.requestDate
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                  : "border-gray-200"
                              }`}
                            />
                          </div>
                          {errors.requestDate && (
                            <p className="mt-2 text-sm text-red-600 font-medium">
                              {errors.requestDate}
                            </p>
                          )}
                        </div>

                        {/* Assigned Pastor */}
                        <div>
                          <label
                            htmlFor="assignedPastor"
                            className="block text-sm font-semibold text-gray-900 mb-3"
                          >
                            Assigned Pastor (Optional)
                          </label>
                          <div className="relative">
                            <div className="relative">
                              <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                id="assignedPastor"
                                value={pastorSearch}
                                onChange={(e) => handlePastorSearchChange(e.target.value)}
                                onFocus={() =>
                                  setShowPastorDropdown(pastorSearch.length > 0)
                                }
                                className="w-full rounded-xl border-2 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 border-gray-200"
                                placeholder="Search for pastor"
                              />
                            </div>

                            {showPastorDropdown && pastorSearch.length > 0 && (
                              <div className="absolute z-30 mt-2 w-full rounded-xl bg-white border border-gray-200 shadow-xl max-h-64 overflow-auto">
                                {pastorLoading && (
                                  <div className="p-4 text-center">
                                    <div className="inline-flex items-center gap-3 text-gray-600">
                                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                                      <span className="text-sm font-medium">
                                        Searching pastors...
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {!pastorLoading && pastors.length === 0 && (
                                  <div className="p-4 text-center text-gray-500">
                                    <UserIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-sm font-medium">
                                      No pastors found
                                    </p>
                                  </div>
                                )}
                                {!pastorLoading &&
                                  pastors.length > 0 &&
                                  pastors.map((pastor) => (
                                    <button
                                      key={pastor.id}
                                      type="button"
                                      onClick={() => handlePastorSelect(pastor)}
                                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                          <UserIcon className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-gray-900 truncate">
                                            {pastor.firstName} {pastor.lastName}
                                          </p>
                                          {pastor.email && (
                                            <p className="text-sm text-gray-500 truncate">
                                              {pastor.email}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}

                            {/* Click outside to close dropdown */}
                            {showPastorDropdown && (
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setShowPastorDropdown(false)}
                              />
                            )}
                          </div>
                        </div>

                        {/* Assistant/Delegate */}
                        <div>
                          <label
                            htmlFor="assistant"
                            className="block text-sm font-semibold text-gray-900 mb-3"
                          >
                            Assistant/Delegate (Optional)
                          </label>
                          <p className="text-xs text-gray-500 mb-3">
                            Assign a group head or member to assist the pastor with this request
                          </p>
                          <div className="relative">
                            <div className="relative">
                              <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                id="assistant"
                                value={assistantSearch}
                                onChange={(e) =>
                                  handleAssistantSearchChange(e.target.value)
                                }
                                onFocus={() =>
                                  setShowAssistantDropdown(assistantSearch.length > 0)
                                }
                                className="w-full rounded-xl border-2 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 border-gray-200"
                                placeholder="Search for assistant or delegate"
                              />
                            </div>

                            {showAssistantDropdown && assistantSearch.length > 0 && (
                              <div className="absolute z-30 mt-2 w-full rounded-xl bg-white border border-gray-200 shadow-xl max-h-64 overflow-auto">
                                {assistantLoading && (
                                  <div className="p-4 text-center">
                                    <div className="inline-flex items-center gap-3 text-gray-600">
                                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                                      <span className="text-sm font-medium">
                                        Searching assistants...
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {!assistantLoading && assistants.length === 0 && (
                                  <div className="p-4 text-center text-gray-500">
                                    <UserIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                    <p className="text-sm font-medium">
                                      No assistants found
                                    </p>
                                  </div>
                                )}
                                {!assistantLoading &&
                                  assistants.length > 0 &&
                                  assistants.map((assistant) => (
                                    <button
                                      key={assistant.id}
                                      type="button"
                                      onClick={() => handleAssistantSelect(assistant)}
                                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                          <UserIcon className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-gray-900 truncate">
                                            {assistant.firstName} {assistant.lastName}
                                          </p>
                                          {assistant.email && (
                                            <p className="text-sm text-gray-500 truncate">
                                              {assistant.email}
                                            </p>
                                          )}
                                          <p className="text-xs text-green-600 font-medium">
                                            Assistant/Delegate
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}

                            {/* Click outside to close dropdown */}
                            {showAssistantDropdown && (
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setShowAssistantDropdown(false)}
                              />
                            )}
                          </div>
                        </div>

                        {/* Notes (Optional) */}
                        <div>
                          <label
                            htmlFor="notes"
                            className="block text-sm font-semibold text-gray-900 mb-3"
                          >
                            Additional Notes
                          </label>
                          <div className="relative">
                            <DocumentTextIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            <textarea
                              id="notes"
                              rows={4}
                              value={formData.notes}
                              onChange={(e) => handleInputChange("notes", e.target.value)}
                              className="w-full rounded-xl border-2 bg-gray-50 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 border-gray-200 resize-none"
                              placeholder="Any additional notes or special instructions..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Review & Submit */}
                    {currentStep === 4 && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4">
                            <CheckIcon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h3>
                          <p className="text-gray-600">Please review all details before creating the care request</p>
                        </div>

                        {/* Review Summary */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Member</h4>
                              <p className="text-gray-700">
                                {selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : 'Not selected'}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Request Type</h4>
                              <p className="text-gray-700">
                                {requestTypes.find(t => t.value === formData.requestType)?.label}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Priority</h4>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  formData.priority === 'LOW' ? 'bg-green-500' :
                                  formData.priority === 'MEDIUM' ? 'bg-yellow-500' :
                                  formData.priority === 'HIGH' ? 'bg-orange-500' : 'bg-red-500'
                                }`} />
                                <span className="text-gray-700">
                                  {priorities.find(p => p.value === formData.priority)?.label}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Request Date</h4>
                              <p className="text-gray-700">
                                {new Date(formData.requestDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Title</h4>
                            <p className="text-gray-700">{formData.title}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                            <p className="text-gray-700">{formData.description}</p>
                          </div>
                          
                          {selectedPastor && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Assigned Pastor</h4>
                              <p className="text-gray-700">
                                {selectedPastor.firstName} {selectedPastor.lastName}
                              </p>
                            </div>
                          )}
                          
                          {selectedAssistant && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Assistant/Delegate</h4>
                              <p className="text-gray-700">
                                {selectedAssistant.firstName} {selectedAssistant.lastName}
                              </p>
                            </div>
                          )}
                          
                          {formData.notes && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
                              <p className="text-gray-700">{formData.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all"
                    >
                      Cancel
                    </button>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 text-sm font-semibold text-indigo-600 bg-indigo-50 border-2 border-indigo-200 rounded-xl hover:bg-indigo-100 hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all"
                      >
                        Previous
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {currentStep < steps.length ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-lg hover:shadow-xl"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2"
                      >
                        {loading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        )}
                        {loading ? "Creating Request..." : "Create Request"}
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
