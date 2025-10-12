"use client";

import { useState, useEffect } from "react";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { toast } from "react-hot-toast";

const GET_BRANCH = gql`
  query GetBranch($id: String!) {
    branch(id: $id) {
      id
      name
      address
      city
      state
      country
      postalCode
      phoneNumber
      email
      website
      description
    }
  }
`;

const UPDATE_BRANCH = gql`
  mutation UpdateBranch($id: ID!, $input: UpdateBranchInput!) {
    updateBranch(id: $id, updateBranchInput: $input) {
      id
      name
      description
    }
  }
`;

export default function BranchSettingsEnhanced() {
  const { state } = useAuth();
  
  // Extract branchId from userBranches array (first branch)
  const branchId = state.user?.branchId || state.user?.userBranches?.[0]?.branch?.id;

  const { data, loading, refetch, error } = useQuery(GET_BRANCH, {
    variables: { id: branchId },
    skip: !branchId,
  });

  // Debug logging
  useEffect(() => {
    console.log('Branch Settings Debug:', {
      branchId,
      userBranches: state.user?.userBranches,
      loading,
      error: error?.message,
      data: data?.branch,
    });
  }, [branchId, state.user?.userBranches, loading, error, data]);

  const [updateBranch, { loading: updating }] = useMutation(UPDATE_BRANCH);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phoneNumber: "",
    email: "",
    website: "",
    description: "",
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (data?.branch) {
      setFormData({
        name: data.branch.name || "",
        address: data.branch.address || "",
        city: data.branch.city || "",
        state: data.branch.state || "",
        country: data.branch.country || "",
        postalCode: data.branch.postalCode || "",
        phoneNumber: data.branch.phoneNumber || "",
        email: data.branch.email || "",
        website: data.branch.website || "",
        description: data.branch.description || "",
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBranch({
        variables: {
          id: branchId,
          input: formData,
        },
      });

      setSaveSuccess(true);
      toast.success("Branch settings updated successfully!");
      refetch();

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating branch:", error);
      toast.error("Failed to update branch settings");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!branchId) {
    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No branch assigned
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have a branch assigned to your account.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-red-400 mb-4">⚠️</div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Error loading branch data
        </h3>
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
          <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
          Branch Information
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your branch details, branding, location, and contact information
        </p>
      </div>

      {/* Branch Identity & Branding */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <h4 className="text-base font-semibold leading-6 text-gray-900 mb-6">
          Branch Identity & Branding
        </h4>
        
        {/* Logo Upload Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Branch Logo
          </label>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border-2 border-gray-200">
              {formData.name ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                  <span className="text-3xl font-bold text-white">
                    {formData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Upload Logo
                </button>
                <button
                  type="button"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG or SVG. Max size 2MB. Recommended: 400x400px
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <h5 className="text-sm font-semibold text-gray-900 mb-4">
          Basic Details
        </h5>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Branch Name *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="St. Mary's Cathedral"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Brief description of your branch..."
            />
          </div>
        </div>
      </div>

      {/* Location & Address */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <h4 className="text-base font-semibold leading-6 text-gray-900 mb-4 flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-indigo-600" />
          Location & Address
        </h4>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Street Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="123 Main Street"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State/Province
            </label>
            <input
              type="text"
              name="state"
              id="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700"
            >
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <h4 className="text-base font-semibold leading-6 text-gray-900 mb-4 flex items-center gap-2">
          <PhoneIcon className="h-5 w-5 text-indigo-600" />
          Contact Information
        </h4>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="contact@church.org"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700"
            >
              Website
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GlobeAltIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                name="website"
                id="website"
                value={formData.website}
                onChange={handleChange}
                className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://www.church.org"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-x-6">
        {saveSuccess && (
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Saved successfully!</span>
          </div>
        )}
        <button
          type="submit"
          disabled={updating}
          className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {updating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
