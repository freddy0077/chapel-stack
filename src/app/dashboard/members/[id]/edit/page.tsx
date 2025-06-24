"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, UserIcon, IdentificationIcon, PhoneIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useMember } from "@/graphql/hooks/useMember";
import { useUpdateMember } from "@/graphql/hooks/useUpdateMember";

interface FormErrors {
  [key: string]: string;
}

export default function EditMemberPage() {
  const { id } = useParams();
  const router = useRouter();
  const { member, loading, error } = useMember(id as string);
  const { updateMember } = useUpdateMember();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    occupation: '',
    employerName: '',
    status: '',
    membershipDate: '',
    baptismDate: '',
    confirmationDate: '',
    notes: '',
    branchId: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName || '',
        middleName: member.middleName || '',
        lastName: member.lastName || '',
        email: member.email || '',
        phoneNumber: member.phoneNumber || '',
        gender: member.gender || '',
        dateOfBirth: member.dateOfBirth || '',
        maritalStatus: member.maritalStatus || '',
        address: typeof member.address === 'string' ? member.address : '',
        city: member.city || '',
        state: member.state || '',
        postalCode: member.postalCode || '',
        country: member.country || '',
        occupation: member.occupation || '',
        employerName: member.employerName || '',
        status: member.status || '',
        membershipDate: member.membershipDate || '',
        baptismDate: member.baptismDate || '',
        confirmationDate: member.confirmationDate || '',
        notes: member.notes || '',
        branchId: member.branchId || '',
      });
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.firstName) errors.firstName = "First name is required.";
    if (!formData.lastName) errors.lastName = "Last name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone number is required.";
    // Add more validation as needed
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);
    try {
      // Send null for confirmationDate if empty string
      const submissionData = {
        ...formData,
        confirmationDate: formData.confirmationDate === '' ? null : formData.confirmationDate,
      };
      await updateMember(id as string, submissionData);
      router.push(`/dashboard/members/${id}`);
    } catch {
      setFormErrors({ general: "Failed to update member." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        <span className="ml-3 text-gray-500">Loading...</span>
      </div>
    );
  }
  if (error || !member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-red-600 text-lg font-medium mb-2">Member not found or error loading member.</p>
        <Link href="/dashboard/members" className="text-indigo-600 hover:underline">Back to Members</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {/* Sticky Gradient Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-lg py-4 px-6 flex items-center gap-3 backdrop-blur-sm">
        <Link href={`/dashboard/members/${id}`} className="text-white hover:text-indigo-200 flex items-center">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          <span className="font-medium">Back</span>
        </Link>
        <span className="ml-2 text-white text-lg font-semibold flex items-center">
          <UserIcon className="h-6 w-6 mr-2" /> Edit Member
        </span>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto mt-8 mb-12">
        <form onSubmit={handleSubmit} className="bg-white/80 shadow-xl rounded-2xl border border-indigo-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 py-6 border-b border-indigo-50 bg-gradient-to-r from-indigo-50 to-white flex items-center gap-3">
            <IdentificationIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm ${formErrors.firstName ? 'border-red-500' : ''}`}
                autoComplete="given-name"
                required
              />
              {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm ${formErrors.lastName ? 'border-red-500' : ''}`}
                autoComplete="family-name"
                required
              />
              {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer Not to Say</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">Marital Status</label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              >
                <option value="">Select Marital Status</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
                <option value="SEPARATED">Separated</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="px-8 py-6 border-t border-indigo-50 bg-gradient-to-r from-indigo-50 to-white flex items-center gap-3">
            <PhoneIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm ${formErrors.email ? 'border-red-500' : ''}`}
                autoComplete="email"
                required
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm ${formErrors.phoneNumber ? 'border-red-500' : ''}`}
                required
              />
              {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>

          {/* Membership Section */}
          <div className="px-8 py-6 border-t border-indigo-50 bg-gradient-to-r from-indigo-50 to-white flex items-center gap-3">
            <UserGroupIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900">Membership Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Membership Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              >
                <option value="">Select Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="VISITOR">Visitor</option>
                <option value="FIRST_TIME_VISITOR">First Time Visitor</option>
                <option value="RETURNING_VISITOR">Returning Visitor</option>
                <option value="TRANSFERRED_OUT">Transferred Out</option>
                <option value="DECEASED">Deceased</option>
                <option value="EXCOMMUNICATED">Excommunicated</option>
                <option value="PENDING">Pending</option>
                <option value="PROSPECTIVE">Prospective</option>
              </select>
            </div>
            <div>
              <label htmlFor="membershipDate" className="block text-sm font-medium text-gray-700">Membership Date</label>
              <input
                type="date"
                id="membershipDate"
                name="membershipDate"
                value={formData.membershipDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="baptismDate" className="block text-sm font-medium text-gray-700">Baptism Date</label>
              <input
                type="date"
                id="baptismDate"
                name="baptismDate"
                value={formData.baptismDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="branchId" className="block text-sm font-medium text-gray-700">Primary Branch</label>
              <input
                type="text"
                id="branchId"
                name="branchId"
                value={formData.branchId}
                disabled
                aria-readonly="true"
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed shadow-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Branch assignment is managed by admins.</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 px-8 py-6 bg-gradient-to-r from-indigo-50 to-white border-t border-indigo-50 rounded-b-2xl">
            <Link
              href={`/dashboard/members/${id}`}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
          {formErrors.general && <div className="px-8 pb-4 text-red-600 text-sm">{formErrors.general}</div>}
        </form>
      </div>
    </div>
  );
}
