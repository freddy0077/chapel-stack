"use client";
import { Fragment, useState, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_MEMBER } from "@/graphql/queries/memberQueries";
import { CheckCircleIcon, XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";

// Define family member type
 type FamilyMember = {
   id: string;
   firstName: string;
   lastName: string;
   relationship: string;
 };

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { organisationId: orgIdFromFilter, branchId: branchIdFromFilter } = useOrganizationBranchFilter();
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const isSuperAdmin = user?.primaryRole === "super_admin";
  const organisationId = user?.organisationId || orgIdFromFilter;
  const { branches = [], loading: branchesLoading } = useFilteredBranches(isSuperAdmin ? { organisationId } : undefined);
  
  // Improved branch selection logic
  const branchId = useMemo(() => {
    if (isSuperAdmin) {
      return selectedBranchId;
    } else {
      // For non-super admin users, try to get branch from filter, user's branches, or first available branch
      return branchIdFromFilter || 
             user?.userBranches?.[0]?.branch?.id || 
             user?.branchId ||
             branches?.[0]?.id;
    }
  }, [isSuperAdmin, selectedBranchId, branchIdFromFilter, user, branches]);

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
    previousChurch: ""
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (formData.phone && !/^[\d\+\-\(\)\s]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    // Branch validation for super admin users
    if (isSuperAdmin && !selectedBranchId) {
      errors.branch = "Please select a branch for this member";
    }
    // General branch validation - ensure we have a valid branchId
    if (!branchId) {
      errors.general = "No branch selected or available for this user";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const addFamilyMember = () => {
    setFamilyMembers(prev => [...prev, { id: Date.now().toString(), firstName: "", lastName: "", relationship: "" }]);
  };
  const removeFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };
  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(prev => prev.map(member => member.id === id ? { ...member, [field]: value } : member));
  };

  // Mutation
  const [createMember, { loading: mutationLoading }] = useMutation(CREATE_MEMBER, {
    onError: (error) => {
      setFormErrors(prev => ({ ...prev, general: error.message || "Failed to save member. Please try again." }));
      setIsSubmitting(false);
    }
  });

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setShowSuccessNotification(false);
    try {
      const memberInput = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        joinDate: formData.joinDate || undefined,
        membershipStatus: formData.status || "ACTIVE",
        branchId: branchId,
        organisationId: organisationId,
        Address_Member_addressIdToAddress: {
          create: {
            street1: formData.address || "",
            city: formData.city || "Default City",
            country: "Default Country",
            state: formData.state || null,
            postalCode: formData.zip || null
          }
        }
      };
      await createMember({ variables: { input: memberInput } });
      setShowSuccessNotification(true);
      setTimeout(() => {
        setShowSuccessNotification(false);
        onClose();
        router.refresh();
      }, 1200);
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render error message
  const renderError = (field: string) => formErrors[field] ? (
    <p className="mt-1 text-xs text-red-600">{formErrors[field]}</p>
  ) : null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            {/* Redesigned Modal Panel for better alignment and professionalism */}
            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-0 relative flex flex-col">
              {/* Close button */}
              <button
                type="button"
                className="absolute right-6 top-6 z-10 rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
                aria-label="Close"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              {/* Header */}
              <div className="px-8 pt-8 pb-4 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-white rounded-t-3xl flex items-center gap-3">
                <UserPlusIcon className="h-8 w-8 text-indigo-500" />
                <div>
                  <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-1">
                    Add New Member
                  </Dialog.Title>
                  <p className="text-sm text-gray-500">Fill in the details below to add a new member to your church branch.</p>
                </div>
              </div>
              {/* Success notification */}
              {showSuccessNotification && (
                <div className="flex items-center p-3 bg-green-100 text-green-700 rounded-lg shadow mx-8 mt-6">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  <span>Member added successfully!</span>
                </div>
              )}
              {/* Form */}
              <form onSubmit={handleSubmit} autoComplete="off" noValidate className="px-8 py-8">
                {/* Personal Info */}
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">First Name<span className="text-red-500">*</span></label>
                      <input name="firstName" value={formData.firstName} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" required />
                      {renderError("firstName")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Last Name<span className="text-red-500">*</span></label>
                      <input name="lastName" value={formData.lastName} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" required />
                      {renderError("lastName")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Middle Name</label>
                      <input name="middleName" value={formData.middleName} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                      {renderError("email")}
                    </div>
                  </div>
                </section>

                {/* Branch Selection (Super Admin only) */}
                {isSuperAdmin && (
                  <section className="mt-8">
                    <h3 className="font-semibold text-gray-900 mb-2">Branch Assignment</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Branch <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedBranchId}
                        onChange={(e) => setSelectedBranchId(e.target.value)}
                        className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
                        required
                      >
                        <option value="">Select a branch...</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                      {!selectedBranchId && isSuperAdmin && (
                        <p className="mt-1 text-xs text-red-600">Please select a branch for this member</p>
                      )}
                    </div>
                  </section>
                )}

                {/* Contact & Address Info */}
                <section className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Contact & Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Phone</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                      {renderError("phone")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Address</label>
                      <input name="address" value={formData.address} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">City</label>
                      <input name="city" value={formData.city} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">State/Region</label>
                      <input name="state" value={formData.state} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">ZIP/Postal Code</label>
                      <input name="zip" value={formData.zip} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                  </div>
                </section>
                {/* Status & Dates */}
                <section className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Status & Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Status</label>
                      <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm">
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="VISITOR">Visitor</option>
                        <option value="FIRST_TIME_VISITOR">First Time Visitor</option>
                        <option value="RETURNING_VISITOR">Returning Visitor</option>
                        <option value="DECEASED">Deceased</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Date of Birth</label>
                      <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Join Date</label>
                      <input name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                  </div>
                </section>
                {/* Gender & Marital Status */}
                <section className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Other Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm">
                        <option value="">Select</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Marital Status</label>
                      <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm">
                        <option value="">Select</option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                      </select>
                    </div>
                  </div>
                </section>
                {/* Reason for Visiting & Previous Church */}
                <section className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Background & Invitation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Reason for Visiting</label>
                      <input name="reasonForVisiting" value={formData.reasonForVisiting} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Previous Church</label>
                      <input name="previousChurch" value={formData.previousChurch} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                  </div>
                </section>
                {/* Submission Button */}
                <div className="mt-10 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Member"}
                  </button>
                </div>
                {formErrors.general && <div className="mt-4 text-center text-sm text-red-600">{formErrors.general}</div>}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
