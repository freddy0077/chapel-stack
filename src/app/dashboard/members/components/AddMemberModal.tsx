"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_MEMBER } from "@/graphql/queries/memberQueries";
import { GET_BRANCHES } from "@/graphql/queries/branchQueries";
import { CheckCircleIcon, XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { useAuth } from "@/graphql/hooks/useAuth";
import { humanizeError } from "@/utils/humanizeError";

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
  console.log("User from AddMemberModal:", user);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const branchId = user?.primaryRole === "super_admin" ? selectedBranchId : (user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0]?.branch?.id : undefined);
  const organisationId = user?.organisationId;
  console.log("Organisation ID:", organisationId);
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

  // Fetch branches for super admin
  const { data: branchesData, loading: branchesLoading } = useQuery(GET_BRANCHES, {
    variables: { filter: organisationId ? { organisationId } : undefined },
    skip: user?.primaryRole !== "super_admin"
  });

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    // Required fields
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "Region is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.maritalStatus) errors.maritalStatus = "Marital status is required";
    if (!formData.status) errors.status = "Status is required";
    if (!formData.membershipDate) errors.membershipDate = "Membership date is required";
    // For super admin, branch must be selected
    if (user?.primaryRole === "super_admin" && !branchId) errors.branchId = "Branch is required";
    // Format checks
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
            userId: formData.userId || undefined,
            spouseId: formData.spouseId || undefined,
            parentId: formData.parentId || undefined,
            branchId: branchId,
            organisationId: organisationId
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
      const friendly = humanizeError(error?.message || "Failed to save member. Please try again.");
      toast.error(friendly);
      setFormErrors(prev => ({ ...prev, general: friendly }));
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
        {/* Glassmorphism Backdrop */}
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-300/30 via-white/40 to-indigo-100/40 backdrop-blur-[6px]" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center w-full">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="relative w-full max-w-3xl bg-white/90 rounded-3xl shadow-2xl border border-indigo-100 p-8 animate-fadeInUp overflow-visible max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-400 hover:text-indigo-500 transition-colors text-2xl font-bold"
                  onClick={onClose}
                  aria-label="Close add"
                >
                  ×
                </button>
                {/* Icon, title, subtitle */}
                <div className="flex flex-col items-center gap-2 mb-6">
                  <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 shadow">
                    <UserPlusIcon className="h-8 w-8 text-indigo-500" />
                  </span>
                  <h2 className="text-2xl font-extrabold text-indigo-700">Add New Member</h2>
                  <p className="text-gray-500 text-sm">Fill in the details below to add a new member to your church branch.</p>
                </div>
                {/* Success notification */}
                {showSuccessNotification && (
                  <div className="flex items-center p-3 bg-green-100 text-green-700 rounded-lg shadow mb-6">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <span>Member added successfully!</span>
                  </div>
                )}
                {/* Branch Selector for Super Admin */}
                {user?.primaryRole === "super_admin" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch<span className="text-red-500">*</span></label>
                    <select
                      name="branchId"
                      value={selectedBranchId}
                      onChange={e => setSelectedBranchId(e.target.value)}
                      className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm"
                      required
                    >
                      <option value="">Select Branch</option>
                      {branchesData?.branches?.items?.map((branch: any) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                    {renderError("branchId")}
                  </div>
                )}
                <form onSubmit={handleSubmit} autoComplete="off" noValidate className="space-y-6">
                  {/* Validation summary */}
                  {formErrors.general && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                      <XMarkIcon className="h-5 w-5 text-red-400" />
                      <span>{formErrors.general}</span>
                    </div>
                  )}
                  {Object.keys(formErrors).length > 0 && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                      Please fix the errors below before submitting the form.
                    </div>
                  )}
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name<span className="text-red-500">*</span></label>
                      <input name="firstName" value={formData.firstName} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" required />
                      {renderError("firstName")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name<span className="text-red-500">*</span></label>
                      <input name="lastName" value={formData.lastName} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" required />
                      {renderError("lastName")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                      <input name="middleName" value={formData.middleName} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender<span className="text-red-500">*</span></label>
                      <select required name="gender" value={formData.gender} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm">
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        {/*<option value="OTHER">Other</option>*/}
                        {/*<option value="PREFER_NOT_TO_SAY">Prefer not to say</option>*/}
                      </select>
                      {renderError("gender")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth<span className="text-red-500">*</span></label>
                      <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" />
                      {renderError("dateOfBirth")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status<span className="text-red-500">*</span></label>
                      <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" required>
                        <option value="">Select Status</option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                        <option value="SEPARATED">Separated</option>
                        <option value="OTHER">Other</option>
                      </select>
                      {renderError("maritalStatus")}
                    </div>
                  </div>
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                      <input required name="email" value={formData.email} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" />
                      {renderError("email")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number<span className="text-red-500">*</span></label>
                      <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" required />
                      {renderError("phoneNumber")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address<span className="text-red-500">*</span></label>
                      <input name="address" value={formData.address} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" required />
                      {renderError("address")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City<span className="text-red-500">*</span></label>
                      <input name="city" value={formData.city} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" required />
                      {renderError("city")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Region<span className="text-red-500">*</span></label>
                      <input name="state" value={formData.state} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" required />
                      {renderError("state")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input name="postalCode" value={formData.postalCode} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" />
                      {renderError("postalCode")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country<span className="text-red-500">*</span></label>
                      <input name="country" value={formData.country} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" required />
                      {renderError("country")}
                    </div>
                  </div>
                  {/* Membership Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status<span className="text-red-500">*</span></label>
                      <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" required>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="VISITOR">Visitor</option>
                        <option value="TRANSFERRED">Transferred</option>
                      </select>
                      {renderError("status")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Membership Date<span className="text-red-500">*</span></label>
                      <input required type="date" name="membershipDate" value={formData.membershipDate} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" />
                      {renderError("membershipDate")}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Baptism Date</label>
                      <input type="date" name="baptismDate" value={formData.baptismDate} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Date</label>
                      <input type="date" name="confirmationDate" value={formData.confirmationDate} onChange={handleChange} className="block w-full rounded-full border border-gray-200 py-2 px-4 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base shadow-sm" />
                    </div>
                  </div>
                  {/* Family Members Section */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Family Members</h3>
                    <div className="space-y-2">
                      {familyMembers.map((member) => (
                        <div key={member.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 rounded-md p-3">
                          <input type="text" placeholder="First Name" value={member.firstName} onChange={e => updateFamilyMember(member.id, "firstName", e.target.value)} className="rounded-full border-gray-300 focus:ring-indigo-400 focus:border-indigo-400" />
                          <input type="text" placeholder="Last Name" value={member.lastName} onChange={e => updateFamilyMember(member.id, "lastName", e.target.value)} className="rounded-full border-gray-300 focus:ring-indigo-400 focus:border-indigo-400" />
                          <div className="flex gap-2">
                            <input type="text" placeholder="Relationship" value={member.relationship} onChange={e => updateFamilyMember(member.id, "relationship", e.target.value)} className="rounded-full border-gray-300 focus:ring-indigo-400 focus:border-indigo-400 flex-1" />
                            <button type="button" onClick={() => removeFamilyMember(member.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addFamilyMember} className="mt-2 inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-full text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100">Add Family Member</button>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-end mt-8 gap-3 pt-4 border-t border-gray-100">
                    <button type="button" className="inline-flex items-center rounded-full bg-white px-6 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={onClose}>Cancel</button>
                    <button type="submit" className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-2 text-base font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition" disabled={isSubmitting || mutationLoading}>
                      {isSubmitting ? "Saving..." : <><UserPlusIcon className="h-5 w-5 mr-2" />Save Member</>}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
