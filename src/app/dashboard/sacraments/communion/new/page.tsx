"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentArrowUpIcon, CheckCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useSearchMembers } from "@/graphql/hooks/useSearchMembers";
import { useCreateFirstCommunionRecord } from "@/graphql/hooks/useCreateFirstCommunionRecord";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import { useDebounce } from "@/hooks/useDebounce";

export default function NewCommunionRecord() {
  const router = useRouter();
  const { state } = useAuth();
  const user = state.user;
  const { organisationId: orgIdFromFilter, branchId: branchIdFromFilter } = useOrganizationBranchFilter();
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const isSuperAdmin = user?.primaryRole === "super_admin";
  // Only use orgIdFromFilter for super admins. For all others, always use user's organisationId
  const organisationId = isSuperAdmin ? orgIdFromFilter : user?.organisationId;
  const { branches = [], loading: branchesLoading } = useFilteredBranches(isSuperAdmin ? { organisationId } : undefined);
  const branchId = isSuperAdmin ? selectedBranchId : branchIdFromFilter;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    communionDate: "",
    location: "",
    officiant: "",
    catechist: "",
    notes: "",
    certificate: null as File | null
  });
  const [memberSearch, setMemberSearch] = useState("");
  const debouncedMemberSearch = useDebounce(memberSearch, 400);
  const [showDropdown, setShowDropdown] = useState(false);

  const { createFirstCommunionRecord } = useCreateFirstCommunionRecord();

  // Member search hook
  const { data: members, loading: memberLoading, error: memberError } = useSearchMembers(debouncedMemberSearch, organisationId, branchId);

  // When a member is selected from dropdown
  const handleSelectMember = (member: any) => {
    setFormData(prev => ({
      ...prev,
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`
    }));
    setMemberSearch(`${member.firstName} ${member.lastName}`);
    setShowDropdown(false);
  };

  // Clear member selection
  const handleClearMember = () => {
    setFormData(prev => ({ ...prev, memberId: "", memberName: "" }));
    setMemberSearch("");
    setShowDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        certificate: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.memberId) {
      setIsSubmitting(false);
      return;
    }
    if (!formData.communionDate || !formData.location || !formData.officiant) {
      setIsSubmitting(false);
      return;
    }
    if (!branchId) {
      setIsSubmitting(false);
      return;
    }
    if (!organisationId) {
      setIsSubmitting(false);
      return;
    }

    // Mock file upload: In real scenario, upload file and get URL
    let certificateUrl: string | undefined = undefined;
    if (formData.certificate) {
      certificateUrl = `/mock-uploads/${formData.certificate.name}`;
    }

    try {
      await createFirstCommunionRecord({
        variables: {
          input: {
            memberId: formData.memberId,
            branchId,
            organisationId,
            sacramentType: "EUCHARIST_FIRST_COMMUNION",
            dateOfSacrament: formData.communionDate,
            locationOfSacrament: formData.location,
            officiantName: formData.officiant,
            sponsorName: formData.catechist || undefined,
            certificateUrl,
            notes: formData.notes || undefined,
          },
        },
      });
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/sacraments?tab=communion");
      }, 1800);
    } catch {
      setIsSubmitting(false);
    }
  };


  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">Communion Record Saved!</h2>
          <p className="mt-2 text-sm text-gray-500">
            The new first communion record has been added to the system.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => router.push('/dashboard/sacraments?tab=communion')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Sacraments
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
            <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">Saving Communion Record...</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we save the record.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      {/* Sticky header with navigation */}
      <div className="mb-8 sticky top-0 z-10 bg-gradient-to-br from-indigo-50 to-white/80 backdrop-blur border-b border-indigo-100 py-4 px-2 flex items-center gap-2 shadow-sm">
        <Link href="/dashboard/sacraments" className="mr-2 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500">
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New First Communion Record</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Branch Selection Logic */}
          {isSuperAdmin ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch<span className="text-red-500">*</span></label>
              <select
                name="branchId"
                value={selectedBranchId}
                onChange={e => setSelectedBranchId(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                disabled={branchesLoading}
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <input
                type="text"
                value={user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.name : ""}
                className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed sm:text-sm"
                disabled
              />
            </div>
          )}
          {/* Member & Date Card */}
          <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100 mb-6">
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">Member & Communion Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label htmlFor="memberName" className="block text-sm font-medium text-indigo-800 mb-1">Member *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="memberName"
                    id="memberName"
                    autoComplete="off"
                    className={`block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition pr-10 ${formData.memberId ? 'bg-indigo-50' : ''}`}
                    placeholder="Search for a member..."
                    value={memberSearch}
                    onChange={e => {
                      setMemberSearch(e.target.value);
                      setShowDropdown(true);
                      setFormData(prev => ({ ...prev, memberId: "", memberName: "" }));
                    }}
                    onFocus={() => setShowDropdown(true)}
                    required
                  />
                  {formData.memberId && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400"
                      onClick={handleClearMember}
                      tabIndex={-1}
                      aria-label="Clear member selection"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                  {showDropdown && memberSearch && !formData.memberId && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {memberLoading && <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>}
                      {memberError && <div className="px-4 py-2 text-sm text-red-600">Error loading members</div>}
                      {!memberLoading && !memberError && (!members || members.length === 0) && (
                        <div className="px-4 py-2 text-sm text-gray-400">No members found</div>
                      )}
                      {members && members.map((member: any) => (
                        <button
                          key={member.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-100 text-sm flex items-center gap-2"
                          onClick={() => handleSelectMember(member)}
                        >
                          <UserIcon className="w-4 h-4 text-indigo-400 mr-1" />
                          <span className="font-medium">{member.firstName} {member.lastName}</span>
                          {member.email && <span className="text-gray-400 ml-2">{member.email}</span>}
                          <span className="ml-auto text-xs text-gray-400">{member.id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Choose an existing member or add a new one</p>
              </div>
              <div>
                <label htmlFor="communionDate" className="block text-sm font-medium text-indigo-800 mb-1">First Communion Date *</label>
                <input
                  type="date"
                  name="communionDate"
                  id="communionDate"
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={formData.communionDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-indigo-800 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Parish, church, or chapel name"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="officiant" className="block text-sm font-medium text-indigo-800 mb-1">Officiant *</label>
                <input
                  type="text"
                  name="officiant"
                  id="officiant"
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Name of priest or officiant"
                  value={formData.officiant}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="catechist" className="block text-sm font-medium text-indigo-800 mb-1">Catechist</label>
                <input
                  type="text"
                  name="catechist"
                  id="catechist"
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Name of catechist or religious education instructor"
                  value={formData.catechist}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          {/* Certificate Upload Card */}
          <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100 mb-6">
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">Certificate Upload</h3>
            <div className="flex flex-col items-center">
              <label htmlFor="certificate" className="block text-sm font-medium text-indigo-800 mb-1">Certificate (Optional)</label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-indigo-300 px-6 pt-5 pb-6 w-full">
                <div className="space-y-1 text-center w-full">
                  <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-indigo-400" aria-hidden="true" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="certificate"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
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
                  <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  {formData.certificate && (
                    <p className="text-sm text-indigo-600">{formData.certificate.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Notes Card */}
          <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100">
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">Notes</h3>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              placeholder="Any additional information about the first communion"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-3">
            <Link
              href="/dashboard/sacraments"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Save Communion Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
