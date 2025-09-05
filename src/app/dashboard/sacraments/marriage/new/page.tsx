"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  DocumentArrowUpIcon,
  PhotoIcon,
  CheckCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useSearchMembers } from "@/graphql/hooks/useSearchMembers";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useCreateMatrimonyRecord } from "@/graphql/hooks/useCreateMatrimonyRecord";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";

function MemberSearchDropdown({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (member: unknown) => void;
}) {
  const { members, loading, error } = useSearchMembers(query, 8);
  return (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
      {loading && <div className="p-2 text-gray-500">Searching...</div>}
      {error && <div className="p-2 text-red-500">Error loading members</div>}
      {!loading && !error && members.length === 0 && (
        <div className="p-2 text-gray-500">No members found</div>
      )}
      {members.map((member: unknown) => (
        <button
          key={member.id}
          type="button"
          className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-100"
          onClick={() => onSelect(member)}
        >
          <span className="inline-flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-indigo-400" />
            {member.firstName} {member.lastName}
            {member.email && (
              <span className="ml-2 text-xs text-gray-400">{member.email}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function NewMarriageRecord() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    spouse1Id: "",
    spouse1Name: "",
    spouse2Id: "",
    spouse2Name: "",
    weddingDate: "",
    location: "",
    officiant: "",
    witnesses: "",
    anniversaryReminder: true,
    notes: "",
    certificate: null as File | null,
    photo: null as File | null,
  });
  const [memberSearch1, setMemberSearch1] = useState("");
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [memberSearch2, setMemberSearch2] = useState("");
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { state } = useAuth();
  const user = state.user;
  const { organisationId: orgIdFromFilter, branchId: branchIdFromFilter } =
    useOrganizationBranchFilter();
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const isSuperAdmin = user?.primaryRole === "super_admin";
  const organisationId = orgIdFromFilter;
  const { branches = [], loading: branchesLoading } = useFilteredBranches(
    isSuperAdmin ? { organisationId } : undefined,
  );
  const branchId = isSuperAdmin ? selectedBranchId : branchIdFromFilter;
  const { createMatrimonyRecord } = useCreateMatrimonyRecord();

  // Handlers for spouse 1
  const handleSpouse1Input = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      spouse1Name: e.target.value,
      spouse1Id: "",
    }));
    setMemberSearch1(e.target.value);
    setShowDropdown1(true);
  };
  const handleSelectSpouse1 = (member: unknown) => {
    setFormData((prev) => ({
      ...prev,
      spouse1Name: `${member.firstName} ${member.lastName}`,
      spouse1Id: member.id,
    }));
    setMemberSearch1(`${member.firstName} ${member.lastName}`);
    setShowDropdown1(false);
  };
  const handleClearSpouse1 = () => {
    setFormData((prev) => ({ ...prev, spouse1Id: "", spouse1Name: "" }));
    setMemberSearch1("");
    setShowDropdown1(false);
  };

  // Handlers for spouse 2
  const handleSpouse2Input = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      spouse2Name: e.target.value,
      spouse2Id: "",
    }));
    setMemberSearch2(e.target.value);
    setShowDropdown2(true);
  };
  const handleSelectSpouse2 = (member: unknown) => {
    setFormData((prev) => ({
      ...prev,
      spouse2Name: `${member.firstName} ${member.lastName}`,
      spouse2Id: member.id,
    }));
    setMemberSearch2(`${member.firstName} ${member.lastName}`);
    setShowDropdown2(false);
  };
  const handleClearSpouse2 = () => {
    setFormData((prev) => ({ ...prev, spouse2Id: "", spouse2Name: "" }));
    setMemberSearch2("");
    setShowDropdown2(false);
  };

  // File/photo change handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, certificate: e.target.files![0] }));
    }
  };
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  // Checkbox handler
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Submit handler (mocked)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    if (
      !formData.spouse1Id ||
      !formData.spouse2Id ||
      !formData.weddingDate ||
      !formData.location ||
      !formData.officiant
    ) {
      setErrorMessage(
        "Please fill all required fields and select both spouses from the dropdown.",
      );
      setIsSubmitting(false);
      return;
    }
    if (!branchId) {
      setErrorMessage("No branch selected or available for this user.");
      setIsSubmitting(false);
      return;
    }
    if (!organisationId) {
      setErrorMessage("No organisation found for this user or branch.");
      setIsSubmitting(false);
      return;
    }
    // Prepare witnesses
    let witness1Name = "";
    let witness2Name = "";
    if (formData.witnesses) {
      const parts = formData.witnesses
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean);
      witness1Name = parts[0] || "";
      witness2Name = parts[1] || "";
    }
    // Prepare certificateUrl (mocked for now)
    let certificateUrl = "";
    if (formData.certificate) {
      // TODO: integrate real file upload and get URL
      certificateUrl = formData.certificate.name;
    }
    try {
      await createMatrimonyRecord({
        variables: {
          input: {
            sacramentType: "MATRIMONY",
            memberId: formData.spouse1Id, // Main member
            dateOfSacrament: formData.weddingDate,
            locationOfSacrament: formData.location,
            officiantName: formData.officiant,
            witness1Name,
            witness2Name,
            certificateNumber: formData.certificate
              ? formData.certificate.name
              : "",
            certificateUrl,
            notes: formData.notes,
            branchId,
            organisationId,
          },
        },
      });
      setIsSubmitting(false);
      setShowSuccess(true);
      // Optionally redirect after a delay
      // setTimeout(() => router.push("/dashboard/sacraments?tab=marriage"), 1800);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Failed to create marriage record.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-16">
      {/* Sticky Gradient Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 shadow backdrop-blur-md bg-opacity-90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2">
          <Link
            href="/dashboard/sacraments"
            className="rounded-md bg-white/80 p-1 text-indigo-700 hover:text-indigo-900 hover:bg-white"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight ml-2">
            New Marriage Record
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card: Marriage Details */}
        <div className="bg-white/90 rounded-2xl shadow-lg border border-indigo-100 mb-8 p-6 md:p-8">
          <h2 className="text-lg font-semibold text-indigo-900 mb-4">
            Marriage Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Branch Selection Logic */}
            {isSuperAdmin ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch<span className="text-red-500">*</span>
                </label>
                <select
                  name="branchId"
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                  disabled={branchesLoading}
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={
                    user?.userBranches && user.userBranches.length > 0
                      ? user.userBranches[0].branch.name
                      : ""
                  }
                  className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed sm:text-sm"
                  disabled
                />
              </div>
            )}
            {/* Spouse 1 Search */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="spouse1Name"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Spouse 1 *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="spouse1Name"
                    id="spouse1Name"
                    autoComplete="off"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="Search for a member..."
                    value={formData.spouse1Name}
                    onChange={handleSpouse1Input}
                    required
                    onFocus={() => setShowDropdown1(true)}
                  />
                  {showDropdown1 && memberSearch1 && (
                    <MemberSearchDropdown
                      query={memberSearch1}
                      onSelect={handleSelectSpouse1}
                    />
                  )}
                  {formData.spouse1Id && (
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-xs text-indigo-500 underline"
                      onClick={handleClearSpouse1}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="spouse2Name"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Spouse 2 *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="spouse2Name"
                    id="spouse2Name"
                    autoComplete="off"
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="Search for a member..."
                    value={formData.spouse2Name}
                    onChange={handleSpouse2Input}
                    required
                    onFocus={() => setShowDropdown2(true)}
                  />
                  {showDropdown2 && memberSearch2 && (
                    <MemberSearchDropdown
                      query={memberSearch2}
                      onSelect={handleSelectSpouse2}
                    />
                  )}
                  {formData.spouse2Id && (
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-xs text-indigo-500 underline"
                      onClick={handleClearSpouse2}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Wedding Date */}
            <div>
              <label
                htmlFor="weddingDate"
                className="block text-sm font-medium text-gray-700"
              >
                Wedding Date *
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="weddingDate"
                  id="weddingDate"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.weddingDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      weddingDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Church or location where marriage ceremony was performed"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            {/* Officiant */}
            <div>
              <label
                htmlFor="officiant"
                className="block text-sm font-medium text-gray-700"
              >
                Officiant *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="officiant"
                  id="officiant"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Name of pastor or priest who performed the ceremony"
                  value={formData.officiant}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      officiant: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            {/* Witnesses */}
            <div>
              <label
                htmlFor="witnesses"
                className="block text-sm font-medium text-gray-700"
              >
                Witnesses
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="witnesses"
                  id="witnesses"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Names of witnesses (comma separated)"
                  value={formData.witnesses}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      witnesses: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            {/* Anniversary Reminder */}
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="anniversaryReminder"
                  name="anniversaryReminder"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={formData.anniversaryReminder}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="anniversaryReminder"
                  className="font-medium text-gray-700"
                >
                  Send Anniversary Reminders
                </label>
                <p className="text-gray-500">
                  Send annual reminders for this marriage anniversary
                </p>
              </div>
            </div>
            {/* Certificate Upload */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="certificate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Marriage Certificate (Optional)
                </label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon
                      className="mx-auto h-12 w-12 text-gray-400"
                      aria-hidden="true"
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="certificate"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload certificate</span>
                        <input
                          id="certificate"
                          name="certificate"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG up to 10MB
                    </p>
                    {formData.certificate && (
                      <p className="text-sm text-indigo-600">
                        {formData.certificate.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Wedding Photo (Optional)
                </label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-400"
                      aria-hidden="true"
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="photo"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload photo</span>
                        <input
                          id="photo"
                          name="photo"
                          type="file"
                          className="sr-only"
                          accept=".jpg,.jpeg,.png"
                          onChange={handlePhotoChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                    {formData.photo && (
                      <p className="text-sm text-indigo-600">
                        {formData.photo.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Any additional information about the marriage"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </div>
            </div>
            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-md bg-red-50 p-3 text-red-700 border border-red-200 text-sm">
                {errorMessage}
              </div>
            )}
            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-5">
              <Link
                href="/dashboard/sacraments"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                ) : (
                  "Save Marriage Record"
                )}
              </button>
            </div>
          </form>
        </div>
        {/* Success Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <CheckCircleIcon className="h-14 w-14 text-green-500 mb-4" />
              <div className="text-xl font-semibold text-green-700 mb-2">
                Marriage Record Created!
              </div>
              <p className="text-gray-600 mb-6">
                The new marriage record has been saved successfully.
              </p>
              <button
                onClick={() =>
                  router.push("/dashboard/sacraments?tab=marriage")
                }
                className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Return to Sacraments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
