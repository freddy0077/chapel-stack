"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { CREATE_MEMBER } from "@/graphql/queries/memberQueries";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  IdentificationIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// Define family member type
type FamilyMember = {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
};

// Define Tab structure for organization
interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

export default function NewMember() {
  // --- Glassy Hero Section ---
  // Placed outside the main card, before the form
  const Hero = () => (
    <div className="relative mb-8">
      <div className="absolute inset-0 h-40 w-full bg-gradient-to-r from-indigo-400/80 via-indigo-600/60 to-indigo-800/80 blur-[2px] rounded-3xl" aria-hidden="true"></div>
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 px-6 py-8 rounded-3xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 shadow-2xl border border-indigo-100 dark:border-slate-800">
        <UserCircleIcon className="h-14 w-14 text-indigo-600 mb-2" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">Add New Member</h1>
        <p className="text-base text-gray-600 dark:text-gray-300">Fill in the details below to add a new member to your church branch.</p>
      </div>
    </div>
  );

  // --- Floating Back Arrow ---
  const BackArrow = () => (
    <div className="mb-4">
      <Link
        href="/dashboard/members"
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-white/80 rounded-full px-3 py-1 shadow transition"
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" aria-hidden="true" />
        Back to Members
      </Link>
    </div>
  );
  const router = useRouter();

  // Define tabs for the form sections
  const tabs: TabItem[] = [
    {
      id: "personal",
      label: "Personal Information",
      icon: <UserCircleIcon className="h-5 w-5" />, 
      description: "Basic personal details",
    },
    {
      id: "contact",
      label: "Contact Details",
      icon: <EnvelopeIcon className="h-5 w-5" />, 
      description: "Contact information",
    },
    {
      id: "membership",
      label: "Membership",
      icon: <IdentificationIcon className="h-5 w-5" />, 
      description: "Church membership details",
    },
    {
      id: "family",
      label: "Family",
      icon: <UserGroupIcon className="h-5 w-5" />, 
      description: "Family relationships",
    },
    {
      id: "introduction",
      label: "Introduction",
      icon: <BuildingOfficeIcon className="h-5 w-5" />, 
      description: "How they found the church",
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    status: "ACTIVE",
    joinDate: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    invitedBy: "",
    invitedByRelationship: "",
    reasonForVisiting: "",
    previousChurch: "",
  });

  // Family members state
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // For animations
  const [isChangingTab, setIsChangingTab] = useState(false);

  // Show component when loaded (for animation)
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    setHasLoaded(true);
  }, []);

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    // Required fields validation based on active tab
    if (activeTab === "personal") {
      if (!formData.firstName.trim()) errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (formData.gender && !["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"].includes(formData.gender)) {
        errors.gender = "Please select a valid gender";
      }
    } else if (activeTab === "contact") {
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (formData.phone && !/^[\d\+\-\(\)\s]+$/.test(formData.phone)) {
        errors.phone = "Please enter a valid phone number";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle tab change with validation
  const handleTabChange = (tabId: string) => {
    // Validate current tab before switching, unless going backward
    const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const newTabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (newTabIndex > currentTabIndex) {
      if (!validateForm()) return;
    }
    setIsChangingTab(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsChangingTab(false);
    }, 200);
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle adding a new family member
  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      firstName: "",
      lastName: "",
      relationship: "",
    };
    setFamilyMembers(prev => [...prev, newMember]);
  };

  // Handle removing a family member
  const removeFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  // Handle updating family member data
  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(prev => prev.map(member => member.id === id ? { ...member, [field]: value } : member));
  };

  // Set up the createMember mutation
  const [createMember, { loading: mutationLoading }] = useMutation(CREATE_MEMBER, {
    onError: (error) => {
      console.error("Error creating member:", error);
      setFormErrors(prev => ({
        ...prev,
        general: error.message || "Failed to save member. Please try again.",
      }));
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all tabs before submission
    let allTabsValid = true;
    // Store current tab to restore it after validation
    const currentTab = activeTab;
    // Validate each tab
    for (const tab of tabs) {
      setActiveTab(tab.id);
      if (!validateForm()) {
        allTabsValid = false;
        break;
      }
    }
    setActiveTab(currentTab);
    if (!allTabsValid) return;
    setIsSubmitting(true);
    try {
      const input = {
        ...formData,
        family: familyMembers.map(({ id, ...rest }) => rest),
      };
      await createMember({ variables: { input } });
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000);
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        status: "ACTIVE",
        joinDate: "",
        dateOfBirth: "",
        gender: "",
        maritalStatus: "",
        invitedBy: "",
        invitedByRelationship: "",
        reasonForVisiting: "",
        previousChurch: "",
      });
      setFamilyMembers([]);
      setActiveTab(tabs[0].id);
      setFormErrors({});
      router.push("/dashboard/members");
    } catch (error) {
      // handled by onError
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render fields for each tab
  const renderInputField = (name: string, label: string, type: string = "text") => (
    <div className="sm:col-span-3">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          id={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          rows={3}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      )}
      {formErrors[name] && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {formErrors[name]}
        </p>
      )}
    </div>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {renderInputField("firstName", "First Name")}
            {renderInputField("middleName", "Middle Name")}
            {renderInputField("lastName", "Last Name")}
            {renderInputField("dateOfBirth", "Date of Birth", "date")}
            {renderInputField("gender", "Gender")}
            {renderInputField("maritalStatus", "Marital Status")}
          </div>
        );
      case "contact":
        return (
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {renderInputField("email", "Email", "email")}
            {renderInputField("phone", "Phone", "tel")}
            {renderInputField("address", "Address")}
            {renderInputField("city", "City")}
            {renderInputField("state", "State")}
            {renderInputField("zip", "ZIP/Postal Code")}
          </div>
        );
      case "membership":
        return (
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {renderInputField("status", "Status")}
            {renderInputField("joinDate", "Join Date", "date")}
            {renderInputField("previousChurch", "Previous Church")}
          </div>
        );
      case "family":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-200">Family Members</h3>
              <button
                type="button"
                onClick={addFamilyMember}
                className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium shadow"
              >
                <PlusIcon className="h-5 w-5 mr-1" /> Add Member
              </button>
            </div>
            {familyMembers.length === 0 ? (
              <p className="text-gray-500">No family members added yet.</p>
            ) : (
              familyMembers.map((member, idx) => (
                <div key={member.id} className="flex flex-col sm:flex-row gap-4 items-center border-b border-gray-200 pb-4 mb-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={member.firstName}
                      onChange={e => updateFamilyMember(member.id, "firstName", e.target.value)}
                      className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={member.lastName}
                      onChange={e => updateFamilyMember(member.id, "lastName", e.target.value)}
                      className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Relationship"
                      value={member.relationship}
                      onChange={e => updateFamilyMember(member.id, "relationship", e.target.value)}
                      className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g. Spouse, Child, Parent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(member.id)}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 font-medium shadow"
                  >
                    <MinusIcon className="h-5 w-5 mr-1" /> Remove
                  </button>
                </div>
              ))
            )}
          </div>
        );
      case "introduction":
        return (
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {renderInputField("invitedBy", "Invited By")}
            {renderInputField("invitedByRelationship", "Relationship to Inviter")}
            {renderInputField("reasonForVisiting", "Reason for Visiting", "textarea")}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success notification */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center p-4 bg-green-100 text-green-700 rounded-lg shadow-lg border border-green-200"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span>Member added successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <BackArrow />
        <Hero />
        <div className="max-w-3xl mx-auto mt-8 mb-16">
          <div className="bg-white/70 dark:bg-slate-900/60 shadow-2xl rounded-3xl p-8 sm:p-10 border border-indigo-100 dark:border-slate-800 backdrop-blur-xl">
            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              {/* Tab Navigation - Glassy, sticky, animated underline */}
              <div className="mb-8 sticky top-0 z-20 bg-transparent">
                <nav className="flex space-x-2 overflow-x-auto pb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        flex items-center px-4 py-2 rounded-full font-semibold relative transition-all
                        ${activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-white/60 dark:bg-slate-800/60 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-slate-700'}
                      `}
                      aria-current={activeTab === tab.id ? "page" : undefined}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.span
                          layoutId="tab-underline"
                          className="absolute left-0 right-0 -bottom-1 h-1 rounded bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-800"
                          transition={{ type: "spring", stiffness: 600, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
              {/* Tab progress indicator */}
              <div className="mb-6">
                <div className="flex items-center">
                  {tabs.map((tab, index) => (
                    <div key={tab.id} className="flex items-center">
                      <div className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        ${activeTab === tab.id
                          ? 'bg-indigo-600 text-white'
                          : index < tabs.findIndex(t => t.id === activeTab)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-500'}
                      `}>
                        {index + 1}
                      </div>
                      {index < tabs.length - 1 && (
                        <div className="flex-1 h-1 bg-gray-200 mx-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Form errors general */}
              {formErrors.general && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{formErrors.general}</h3>
                    </div>
                  </div>
                </div>
              )}
              {/* Dynamic tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
              {/* Navigation buttons */}
              <div className="pt-5 border-t border-gray-200 mt-8 flex justify-between flex-col sm:flex-row gap-4 sm:gap-0">
                <div>
                  {activeTab !== tabs[0].id && (
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                        if (currentIndex > 0) {
                          handleTabChange(tabs[currentIndex - 1].id);
                        }
                      }}
                      className="inline-flex items-center px-6 py-2 border border-gray-300 shadow-sm text-base font-semibold rounded-full text-indigo-700 bg-white/80 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                      <ArrowLeftIcon className="mr-2 h-5 w-5" /> Previous
                    </button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Link
                    href="/dashboard/members"
                    className="inline-flex items-center px-6 py-2 border border-gray-300 shadow-sm text-base font-semibold rounded-full text-gray-700 bg-white/80 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                  >
                    Cancel
                  </Link>
                  {activeTab !== tabs[tabs.length - 1].id ? (
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                        if (currentIndex < tabs.length - 1) {
                          handleTabChange(tabs[currentIndex + 1].id);
                        }
                      }}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-base font-semibold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                      Next <ArrowLeftIcon className="ml-2 h-5 w-5 rotate-180" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || mutationLoading}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-base font-semibold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Member"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewMember;
