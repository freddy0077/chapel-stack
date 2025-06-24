"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_MEMBER } from "@/graphql/queries/memberQueries";
import { CheckCircleIcon, XMarkIcon, UserPlusIcon } from "@heroicons/react/24/outline";

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
            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-0">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                      <input name="email" value={formData.email} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                      {renderError("email")}
                    </div>
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
                      <label className="block text-sm font-medium text-gray-900 mb-1">State</label>
                      <input name="state" value={formData.state} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Zip</label>
                      <input name="zip" value={formData.zip} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                  </div>
                </section>
                {/* Membership Section */}
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Membership</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <label className="block text-sm font-medium text-gray-900 mb-1">Join Date</label>
                      <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Previous Church</label>
                      <input name="previousChurch" value={formData.previousChurch} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
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
                {/* Introduction */}
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Introduction</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Invited By</label>
                      <input name="invitedBy" value={formData.invitedBy} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Relationship to Inviter</label>
                      <input name="invitedByRelationship" value={formData.invitedByRelationship} onChange={handleChange} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-900 mb-1">Reason for Visiting</label>
                      <textarea name="reasonForVisiting" value={formData.reasonForVisiting} onChange={handleChange} rows={2} className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm" />
                    </div>
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
