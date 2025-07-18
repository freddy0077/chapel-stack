"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { CREATE_BRANCH } from "../../../../graphql/mutations/branchMutations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NewBranchPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    phoneNumber: "",
    email: "",
    website: "",
    establishedDate: "",
    status: "active"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [createBranch] = useMutation(CREATE_BRANCH);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const input = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        establishedAt: formData.establishedDate ? new Date(formData.establishedDate).toISOString() : undefined,
        isActive: formData.status === 'active',
      };
      const { data } = await createBranch({ variables: { input } });
      if (data?.createBranch) {
        toast.success("Branch created successfully!");
        router.push("/dashboard/branches");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to create branch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center">
          <Link href="/dashboard/branches" className="mr-2 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500">
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New Branch</h1>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Create a new branch or parish in your church network
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-8 grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2">
            {/* Branch Info Card */}
            <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100 mb-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a4 4 0 00-8 0v2m8 0v2a4 4 0 01-8 0V7m8 0a4 4 0 00-8 0"></path></svg>
                Branch Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-indigo-800 mb-1">Branch Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="e.g. Grace Chapel, Downtown"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-indigo-800 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="123 Main St, Suite 100"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-indigo-800 mb-1">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="e.g. Accra"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-indigo-800 mb-1">State/Province <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="e.g. Greater Accra"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-indigo-800 mb-1">ZIP / Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="e.g. 00233"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-indigo-800 mb-1">Country <span className="text-red-500">*</span></label>
                  <select
                    id="country"
                    name="country"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                    <option value="MEX">Mexico</option>
                    <option value="GBR">United Kingdom</option>
                    <option value="FRA">France</option>
                    <option value="DEU">Germany</option>
                    <option value="ITA">Italy</option>
                    <option value="ESP">Spain</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Contact Info Card */}
            <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100 mb-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-indigo-800 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="(123) 456-7890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-indigo-800 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="info@yourbranch.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-indigo-800 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="https://www.example.com"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {/* Status & Established Date Card */}
            <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100">
              <h3 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9"></path><path strokeLinecap="round" strokeLinejoin="round" d="M12 7V4m0 0a2 2 0 012 2v2m-2-2a2 2 0 00-2 2v2m0 9h6"></path></svg>
                Branch Status & Established Date
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="establishedDate" className="block text-sm font-medium text-indigo-800 mb-1">Established Date</label>
                  <input
                    type="date"
                    name="establishedDate"
                    id="establishedDate"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    value={formData.establishedDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-indigo-800 mb-1">Branch Status</label>
                  <select
                    id="status"
                    name="status"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
            <Link
              href="/dashboard/branches"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Branch"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
