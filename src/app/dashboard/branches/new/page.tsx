"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_BRANCH } from "@/graphql/mutations/branchMutations";
import { CREATE_BRANCH_ADMIN } from "@/graphql/mutations/branchAdminMutations";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import toast from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// Ghana regions for dropdown
const ghanaRegions = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
];

export default function NewBranchPage() {
  const router = useRouter();
  const { organisationId } = useOrganizationBranchFilter();
  const [branchId, setBranchId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  // Branch details state
  const [branchData, setBranchData] = useState({
    branchName: "",
    address: "",
    status: "active",
    establishedDate: "",
    city: "",
    state: "",
    country: "Ghana",
    phone: "",
  });

  // Admin details state
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Loading and error states
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [primaryError, setPrimaryError] = useState<string | null>(null);
  const [primarySaved, setPrimarySaved] = useState(false);

  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSaved, setAdminSaved] = useState(false);

  // GraphQL mutations
  const [createBranch] = useMutation(CREATE_BRANCH);
  const [createBranchAdmin] = useMutation(CREATE_BRANCH_ADMIN);

  // Handle branch form changes
  const handleBranchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setBranchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle admin form changes
  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save branch details
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrimaryLoading(true);
    setPrimaryError(null);

    const input = {
      name: branchData.branchName,
      address: branchData.address,
      city: branchData.city,
      state: branchData.state,
      country: branchData.country,
      phoneNumber: branchData.phone,
      email: null,
      website: null,
      establishedAt: branchData.establishedDate
        ? new Date(branchData.establishedDate).toISOString()
        : undefined,
      isActive: branchData.status === "active",
      organisationId: String(organisationId || ""),
    };

    try {
      const { data } = await createBranch({ variables: { input } });
      if (data) {
        setBranchId(data.createBranch.id);
        setPrimarySaved(true);
        toast.success("Branch information saved successfully!");
        setActiveStep(2);
      } else {
        setPrimaryError("Failed to create branch. Please try again.");
      }
    } catch (error: any) {
      setPrimaryError(
        error.message || "An error occurred while creating the branch.",
      );
      toast.error("Failed to save branch information.");
    } finally {
      setPrimaryLoading(false);
    }
  };

  // Save admin details
  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (adminData.password !== adminData.confirmPassword) {
      setAdminError("Passwords do not match.");
      return;
    }

    setAdminLoading(true);
    setAdminError(null);

    const input = {
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      password: adminData.password,
      branchId,
      organisationId,
    };

    try {
      const { data } = await createBranchAdmin({ variables: { input } });
      if (data) {
        setAdminSaved(true);
        toast.success("Branch admin created successfully!");

        // Redirect to branches list after admin is created
        setTimeout(() => {
          router.push("/dashboard/branches");
        }, 1500);
      } else {
        setAdminError("Failed to create branch admin. Please try again.");
      }
    } catch (error: any) {
      setAdminError(
        error.message || "An error occurred while creating the branch admin.",
      );
      toast.error("Failed to create branch admin.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <Link
              href="/dashboard/branches"
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Branches
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create New Branch
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              Set up a new branch location for your organization
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="w-full flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep === 1 ? "bg-indigo-600 text-white" : primarySaved ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {primarySaved ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  <span>1</span>
                )}
              </div>
              <div
                className={`h-1 flex-1 ${primarySaved ? "bg-green-500" : "bg-gray-200"}`}
              ></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep === 2 ? "bg-indigo-600 text-white" : adminSaved ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {adminSaved ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  <span>2</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <div
              className={`font-medium ${activeStep === 1 ? "text-indigo-600" : primarySaved ? "text-green-500" : "text-gray-500"}`}
            >
              Branch Details
            </div>
            <div
              className={`font-medium ${activeStep === 2 ? "text-indigo-600" : adminSaved ? "text-green-500" : "text-gray-500"}`}
            >
              Admin Setup
            </div>
          </div>
        </div>

        {/* Branch Information Form */}
        <div
          className={`transition-all duration-300 ${activeStep === 1 ? "block" : "hidden"}`}
        >
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <BuildingOffice2Icon className="h-6 w-6 text-indigo-500 mr-3" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Branch Information
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter the details for your new branch location
              </p>
            </div>
            <form onSubmit={handleSaveBranch}>
              <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <label
                    htmlFor="branchName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="branchName"
                      id="branchName"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="e.g. Grace Chapel, Downtown"
                      value={branchData.branchName}
                      onChange={handleBranchChange}
                      required
                      disabled={primarySaved}
                    />
                    {primarySaved && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="123 Main St, Suite 100"
                      value={branchData.address}
                      onChange={handleBranchChange}
                      disabled={primarySaved}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="e.g. Accra"
                      value={branchData.city}
                      onChange={handleBranchChange}
                      required
                      disabled={primarySaved}
                    />
                    {primarySaved && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Region <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <select
                      name="state"
                      id="state"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all appearance-none"
                      value={branchData.state}
                      onChange={handleBranchChange}
                      required
                      disabled={primarySaved}
                    >
                      <option value="">Select Region</option>
                      {ghanaRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {primarySaved ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <select
                      name="status"
                      id="status"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all appearance-none"
                      value={branchData.status}
                      onChange={handleBranchChange}
                      required
                      disabled={primarySaved}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {primarySaved ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="establishedDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Established Date
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="date"
                      name="establishedDate"
                      id="establishedDate"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      value={branchData.establishedDate}
                      onChange={handleBranchChange}
                      disabled={primarySaved}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="e.g. +233 24 000 0000"
                      value={branchData.phone}
                      onChange={handleBranchChange}
                      disabled={primarySaved}
                    />
                  </div>
                </div>
              </div>
              {primaryError && (
                <div className="px-6 py-2 text-sm text-red-600 bg-red-50 rounded-md mx-6 mb-4">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {primaryError}
                  </div>
                </div>
              )}
              <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <button
                  type="submit"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    primarySaved
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  disabled={primaryLoading || primarySaved}
                >
                  {primaryLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  ) : primarySaved ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    "Continue to Admin Setup"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Admin Setup Form */}
        <div
          className={`transition-all duration-300 ${activeStep === 2 ? "block" : "hidden"}`}
        >
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <UserCircleIcon className="h-6 w-6 text-indigo-500 mr-3" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Branch Admin
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Create an administrator account for this branch
              </p>
            </div>
            <form onSubmit={handleSaveAdmin}>
              <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="John"
                      value={adminData.firstName}
                      onChange={handleAdminChange}
                      required
                      disabled={!branchId || adminSaved}
                    />
                    {adminSaved && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="Doe"
                      value={adminData.lastName}
                      onChange={handleAdminChange}
                      required
                      disabled={!branchId || adminSaved}
                    />
                    {adminSaved && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="admin@example.com"
                      value={adminData.email}
                      onChange={handleAdminChange}
                      required
                      disabled={!branchId || adminSaved}
                    />
                    {adminSaved && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="••••••••"
                      value={adminData.password}
                      onChange={handleAdminChange}
                      required
                      disabled={!branchId || adminSaved}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="••••••••"
                      value={adminData.confirmPassword}
                      onChange={handleAdminChange}
                      required
                      disabled={!branchId || adminSaved}
                    />
                  </div>
                </div>
              </div>
              {adminError && (
                <div className="px-6 py-2 text-sm text-red-600 bg-red-50 rounded-md mx-6 mb-4">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {adminError}
                  </div>
                </div>
              )}
              <div className="px-6 py-4 bg-gray-50 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={adminSaved}
                >
                  Back to Branch Details
                </button>
                <button
                  type="submit"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    adminSaved
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={!branchId || adminLoading || adminSaved}
                >
                  {adminLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  ) : adminSaved ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    "Create Branch & Admin"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
