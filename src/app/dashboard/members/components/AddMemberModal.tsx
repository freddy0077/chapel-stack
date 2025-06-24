"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_MEMBER } from "@/graphql/queries/memberQueries";
import { CheckCircleIcon, XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { useAuth } from "@/graphql/hooks/useAuth";

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
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    occupation: "",
    employerName: "",
    status: "ACTIVE",
    membershipDate: "",
    baptismDate: "",
    confirmationDate: "",
    customFields: "",
    privacySettings: "",
    notes: "",
    userId: "",
    spouseId: "",
    parentId: ""
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
    if (formData.phoneNumber && !/^[\d\+\-\(\)\s]+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
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
  const [createMember, { loading: mutationLoading }] = useMutation(CREATE_MEMBER);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setShowSuccessNotification(false);
    try {
      await createMember({
        variables: {
          createMemberInput: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            middleName: formData.middleName || undefined,
            email: formData.email || undefined,
            phoneNumber: formData.phoneNumber || undefined,
            address: formData.address || undefined,
            city: formData.city || undefined,
            state: formData.state || undefined,
            postalCode: formData.postalCode || undefined,
            country: formData.country || undefined,
            dateOfBirth: formData.dateOfBirth || undefined,
            gender: formData.gender || undefined,
            maritalStatus: formData.maritalStatus || undefined,
            occupation: formData.occupation || undefined,
            employerName: formData.employerName || undefined,
            status: formData.status || "ACTIVE",
            membershipDate: formData.membershipDate || undefined,
            baptismDate: formData.baptismDate || undefined,
            confirmationDate: formData.confirmationDate || undefined,
            customFields: formData.customFields || undefined,
            privacySettings: formData.privacySettings || undefined,
            notes: formData.notes || undefined,
            branchId: branchId,
            userId: formData.userId || undefined,
            spouseId: formData.spouseId || undefined,
            parentId: formData.parentId || undefined
          }
        }
      });
      setShowSuccessNotification(true);
      toast.success("Member added successfully!");
      setTimeout(() => {
        setShowSuccessNotification(false);
        onClose();
        router.refresh();
      }, 1200);
    } catch (error: any) {
      toast.error(error?.message || "Failed to save member. Please try again.");
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
            <Dialog.Panel className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-0 overflow-visible">
              {/* Sticky header */}
              <div className="sticky top-0 z-20 flex items-center gap-3 px-8 pt-8 pb-4 border-b bg-gradient-to-br from-indigo-50 to-white rounded-t-3xl" style={{ minHeight: 80 }}>
                <UserPlusIcon className="h-8 w-8 text-indigo-500 flex-shrink-0" />
                <div className="flex-1">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-1">
                    Add New Member
                  </Dialog.Title>
                  <p className="text-sm text-gray-500">Fill in the details below to add a new member to your church branch.</p>
                </div>
                <button
                  type="button"
                  className="absolute right-6 top-6 z-30 rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={onClose}
                  aria-label="Close"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
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
              <form onSubmit={handleSubmit} autoComplete="off" noValidate className="px-8 py-8 mt-2">
                {/* Personal Info */}
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <label className="block text-sm font-medium text-gray-900 mb-1">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm">
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Date of Birth</label>
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Marital Status</label>
                      <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm">
                        <option value="">Select Status</option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                        <option value="SEPARATED">Separated</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </section>
                {/* Contact Info */}
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                      <input name="email" value={formData.email} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                      {renderError("email")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Phone Number</label>
                      <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                      {renderError("phoneNumber")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Address</label>
                      <input name="address" value={formData.address} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                  </div>
                </section>
                {/* Membership Section */}
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Membership</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Status</label>
                      <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm">
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="VISITOR">Visitor</option>
                        <option value="TRANSFERRED">Transferred</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Membership Date</label>
                      <input type="date" name="membershipDate" value={formData.membershipDate} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Baptism Date</label>
                      <input type="date" name="baptismDate" value={formData.baptismDate} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Confirmation Date</label>
                      <input type="date" name="confirmationDate" value={formData.confirmationDate} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                  </div>
                </section>
                {/* Family Members Section */}
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Family Members</h3>
                  <div className="space-y-2">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 rounded-md p-3">
                        <input type="text" placeholder="First Name" value={member.firstName} onChange={e => updateFamilyMember(member.id, "firstName", e.target.value)} className="rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                        <input type="text" placeholder="Last Name" value={member.lastName} onChange={e => updateFamilyMember(member.id, "lastName", e.target.value)} className="rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                        <div className="flex gap-2">
                          <input type="text" placeholder="Relationship" value={member.relationship} onChange={e => updateFamilyMember(member.id, "relationship", e.target.value)} className="rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 flex-1" />
                          <button type="button" onClick={() => removeFamilyMember(member.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={addFamilyMember} className="mt-2 inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100">Add Family Member</button>
                  </div>
                </section>
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 mt-10">
                  <button type="button" className="inline-flex items-center rounded-lg bg-white px-5 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={onClose}>Cancel</button>
                  <button type="submit" className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2 text-base font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition" disabled={isSubmitting || mutationLoading}>
                    {isSubmitting ? "Saving..." : "Save Member"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
