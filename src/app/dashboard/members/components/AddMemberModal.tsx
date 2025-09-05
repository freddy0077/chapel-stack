"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UsersIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useCreateMember } from "@/hooks/useCreateMember";
import {
  CreateMemberInput,
  Gender,
  MaritalStatus,
  MembershipStatus,
  MembershipType,
  PrivacyLevel,
} from "../types/member.types";
import ImageUpload from "@/components/ui/ImageUpload";
import PhoneInput from "@/components/ui/PhoneInput";
import { SORTED_COUNTRIES } from "@/constants/countries";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organisationId: string;
  branchId: string;
}

const steps = [
  { id: 1, name: "Personal Info", icon: UserIcon },
  { id: 2, name: "Contact", icon: PhoneIcon },
  { id: 3, name: "Family & Emergency", icon: UsersIcon },
  { id: 4, name: "Membership", icon: IdentificationIcon },
];

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organisationId,
  branchId,
}) => {
  const { user } = useAuth();
  const { createMember, loading } = useCreateMember();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<CreateMemberInput>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    membershipStatus: MembershipStatus.MEMBER,
    membershipType: MembershipType.REGULAR,
    privacyLevel: PrivacyLevel.STANDARD,
    organisationId: organisationId,
    branchId: branchId,
    address: "",
    city: "",
    middleName: "",
    preferredName: "",
    dateOfBirth: undefined,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.MARRIED,
    membershipDate: new Date(),
    title: "",
    nationality: "",
    placeOfBirth: "",
    nlbNumber: "",
    fatherName: "",
    motherName: "",
    fatherOccupation: "",
    motherOccupation: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    profileImageUrl: "",
  });

  const handleInputChange = (field: keyof CreateMemberInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      alert("Please fill in required fields (First Name and Last Name)");
      return;
    }

    try {
      await createMember({
        variables: {
          createMemberInput: { ...formData, organisationId, branchId },
        },
      });
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      membershipStatus: MembershipStatus.VISITOR,
      membershipType: MembershipType.REGULAR,
      privacyLevel: PrivacyLevel.STANDARD,
      organisationId: organisationId,
      branchId: branchId,
      address: "",
      city: "",
      middleName: "",
      preferredName: "",
      dateOfBirth: undefined,
      gender: Gender.MALE,
      maritalStatus: MaritalStatus.MARRIED,
      membershipDate: new Date(),
      title: "",
      nationality: "",
      placeOfBirth: "",
      nlbNumber: "",
      fatherName: "",
      motherName: "",
      fatherOccupation: "",
      motherOccupation: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    });
    setCurrentStep(1);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="space-y-6">
              {/* Profile Image Upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Profile Image
                </label>
                <ImageUpload
                  value={formData.profileImageUrl || null}
                  onChange={(imageUrl) =>
                    handleInputChange("profileImageUrl", imageUrl)
                  }
                  size="lg"
                  placeholder="Upload member profile image"
                  className="mb-6"
                  branchId={branchId}
                  organisationId={organisationId}
                  description="Member profile image"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Fields for Step 1 */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-600">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-600">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName || ""}
                    onChange={(e) =>
                      handleInputChange("middleName", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    value={formData.preferredName || ""}
                    onChange={(e) =>
                      handleInputChange("preferredName", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Title
                  </label>
                  <select
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr</option>
                    <option value="Prof">Prof</option>
                    <option value="Rev">Rev</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Elder">Elder</option>
                    <option value="Deacon">Deacon</option>
                    <option value="Deaconess">Deaconess</option>
                    <option value="Bishop">Bishop</option>
                    <option value="Apostle">Apostle</option>
                    <option value="Prophet">Prophet</option>
                    <option value="Evangelist">Evangelist</option>
                    <option value="Minister">Minister</option>
                    <option value="Sir">Sir</option>
                    <option value="Madam">Madam</option>
                    <option value="Hon">Hon</option>
                    <option value="Chief">Chief</option>
                    <option value="Nana">Nana</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.values(Gender).map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={
                      formData.dateOfBirth
                        ? new Date(formData.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "dateOfBirth",
                        e.target.value ? new Date(e.target.value) : undefined,
                      )
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    value={formData.placeOfBirth || ""}
                    onChange={(e) =>
                      handleInputChange("placeOfBirth", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Nationality
                  </label>
                  <select
                    value={formData.nationality || ""}
                    onChange={(e) =>
                      handleInputChange("nationality", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Nationality</option>
                    {SORTED_COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Marital Status
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) =>
                      handleInputChange("maritalStatus", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.values(MaritalStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Fields for Step 2 */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <PhoneInput
                  value={formData.phoneNumber || ""}
                  onChange={(phone) => handleInputChange("phoneNumber", phone)}
                  label="Phone Number"
                  placeholder="Enter phone number"
                  className=""
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Fields for Step 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Father's Name
                </label>
                <input
                  type="text"
                  value={formData.fatherName || ""}
                  onChange={(e) =>
                    handleInputChange("fatherName", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Mother's Name
                </label>
                <input
                  type="text"
                  value={formData.motherName || ""}
                  onChange={(e) =>
                    handleInputChange("motherName", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Father's Occupation
                </label>
                <input
                  type="text"
                  value={formData.fatherOccupation || ""}
                  onChange={(e) =>
                    handleInputChange("fatherOccupation", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Mother's Occupation
                </label>
                <input
                  type="text"
                  value={formData.motherOccupation || ""}
                  onChange={(e) =>
                    handleInputChange("motherOccupation", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-2 pt-4">
                <h4 className="text-md font-semibold text-gray-700">
                  Emergency Contact
                </h4>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName || ""}
                  onChange={(e) =>
                    handleInputChange("emergencyContactName", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <PhoneInput
                  value={formData.emergencyContactPhone || ""}
                  onChange={(phone) =>
                    handleInputChange("emergencyContactPhone", phone)
                  }
                  label="Contact Phone"
                  placeholder="Enter emergency contact phone"
                  className=""
                />
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Fields for Step 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Membership Date
                </label>
                <input
                  type="date"
                  value={
                    formData.membershipDate
                      ? new Date(formData.membershipDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "membershipDate",
                      e.target.value ? new Date(e.target.value) : undefined,
                    )
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Membership Status
                </label>
                <select
                  value={formData.membershipStatus}
                  onChange={(e) =>
                    handleInputChange("membershipStatus", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(MembershipStatus).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Membership Type
                </label>
                <select
                  value={formData.membershipType}
                  onChange={(e) =>
                    handleInputChange("membershipType", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(MembershipType).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  NLB Number
                </label>
                <input
                  type="text"
                  value={formData.nlbNumber || ""}
                  onChange={(e) =>
                    handleInputChange("nlbNumber", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Privacy Level
                </label>
                <select
                  value={formData.privacyLevel}
                  onChange={(e) =>
                    handleInputChange("privacyLevel", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(PrivacyLevel).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden"
          >
            <div className="p-8 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Member
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Complete the steps below to add a new member to the system.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Close modal"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-8 py-4">
              <div className="relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200"></div>
                <div
                  className="absolute left-0 top-1/2 h-0.5 bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                ></div>
                <div className="relative flex justify-between">
                  {steps.map((step) => (
                    <div key={step.id} className="text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${currentStep >= step.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <p
                        className={`text-xs mt-2 font-semibold ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"}`}
                      >
                        {step.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-8 min-h-[300px]">
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>
              </div>

              {/* Footer with Action Buttons */}
              <div className="flex justify-between items-center px-8 py-6 bg-gray-100 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                  >
                    Next
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon className="w-5 h-5 mr-2" />
                        Create Member
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMemberModal;
