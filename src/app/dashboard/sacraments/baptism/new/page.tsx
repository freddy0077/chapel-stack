"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, DocumentArrowUpIcon, UserIcon, TagIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useCreateBaptismRecord } from "@/graphql/hooks/useCreateBaptismRecord";
import { useAuth } from "@/graphql/hooks/useAuth";
import { useSearchMembers } from "@/graphql/hooks/useSearchMembers";

function MemberSearchDropdown({ query, onSelect }: { query: string; onSelect: (member: any) => void }) {
  const { members, loading, error } = useSearchMembers(query, 8);
  return (
    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
      {loading && <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>}
      {error && <div className="px-4 py-2 text-sm text-red-600">Error loading members</div>}
      {!loading && !error && members.length === 0 && (
        <div className="px-4 py-2 text-sm text-gray-400">No members found</div>
      )}
      {members.map(member => (
        <button
          key={member.id}
          type="button"
          className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-100 text-sm flex items-center gap-2"
          onClick={() => onSelect(member)}
        >
          <span className="font-medium">{member.firstName} {member.lastName}</span>
          {member.email && <span className="text-gray-400 ml-2">{member.email}</span>}
          <span className="ml-auto text-xs text-gray-400">{member.id}</span>
        </button>
      ))}
    </div>
  );
}

export default function NewBaptismRecord() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "", // will be set from search/autocomplete
    baptismDate: "",
    location: "",
    officiant: "",
    sponsors: "",
    notes: "",
    certificate: null as File | null
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        certificate: e.target.files![0]
      }));
    }
  };
  
  const { createBaptismRecord, loading: mutationLoading, error: mutationError } = useCreateBaptismRecord();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Basic validation
    if (!formData.memberId) {
      setErrorMessage("Member ID is required. Please select a member.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.baptismDate || !formData.location || !formData.officiant) {
      setErrorMessage("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Mock file upload: In real scenario, upload file and get URL
    let certificateUrl: string | undefined = undefined;
    if (formData.certificate) {
      // TODO: Implement file upload and get the URL
      certificateUrl = `/mock-uploads/${formData.certificate.name}`;
    }

    // Parse sponsors/godparents
    const sponsorsArr = formData.sponsors.split(",").map(s => s.trim()).filter(Boolean);
    const godparent1Name = sponsorsArr[0] || "";
    const godparent2Name = sponsorsArr[1] || "";

    // Get branchId from user context
    const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;

    try {
      const { data } = await createBaptismRecord({
        variables: {
          input: {
            memberId: formData.memberId,
            branchId,
            sacramentType: "BAPTISM",
            dateOfSacrament: formData.baptismDate,
            locationOfSacrament: formData.location,
            officiantName: formData.officiant,
            godparent1Name,
            godparent2Name,
            certificateUrl,
            notes: formData.notes || undefined,
          },
        },
      });
      setIsSubmitting(false);
      router.push("/dashboard/sacraments?tab=baptism");
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to create baptism record.");
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="py-8 px-2 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      {/* Sticky Page Header */}
      <div className="sticky top-0 z-10 bg-white pb-4 mb-8 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/sacraments" className="rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 shadow-sm border border-gray-200">
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Baptism Record</h1>
            <p className="text-sm text-gray-500 mt-0.5">Create a new baptism record for a church member</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Member Selection Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
  <UserIcon className="w-5 h-5 text-indigo-400" aria-hidden="true" />
  Member
</h2>
          <label htmlFor="memberSearch" className="block text-sm font-medium text-gray-700 mb-1">
            Search or select a member <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="memberSearch"
              id="memberSearch"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-full"
              placeholder="Type member name, email, or number..."
              value={memberSearch}
              onChange={e => {
                setMemberSearch(e.target.value);
                setShowDropdown(true);
                setFormData(prev => ({ ...prev, memberId: "" }));
              }}
              autoComplete="off"
              onFocus={() => memberSearch && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {/* Autocomplete Dropdown */}
            {showDropdown && memberSearch && (
              <MemberSearchDropdown
                query={memberSearch}
                onSelect={member => {
                  setFormData(prev => ({ ...prev, memberId: member.id }));
                  setMemberSearch(`${member.firstName} ${member.lastName}`);
                  setShowDropdown(false);
                }}
              />
            )}
          </div>
          <p className="mt-1 text-xs text-gray-400">Start typing to search for a member. Select from the list to fill the form.</p>
          {formData.memberId && (
            <div className="mt-1 text-xs text-green-600">Selected member ID: {formData.memberId}</div>
          )}
        </div>

        {/* Baptism Details Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="baptismDate" className="block text-sm font-medium text-gray-700 mb-1">Baptism Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="baptismDate"
              id="baptismDate"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.baptismDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="location"
              id="location"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Church or baptism location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="officiant" className="block text-sm font-medium text-gray-700 mb-1">Officiant <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="officiant"
              id="officiant"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Name of officiant"
              value={formData.officiant}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="sponsors" className="block text-sm font-medium text-gray-700 mb-1">Sponsors / Godparents</label>
            <input
              type="text"
              name="sponsors"
              id="sponsors"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Names of sponsors or godparents (comma separated)"
              value={formData.sponsors}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Certificate Upload Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
  <DocumentArrowUpIcon className="w-5 h-5 text-indigo-400" aria-hidden="true" />
  Certificate Upload
</h2>
          <label htmlFor="certificate" className="block text-sm font-medium text-gray-700 mb-2">
            Certificate (Optional)
          </label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-6 pt-5 pb-6">
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" aria-hidden="true" />
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
            <span className="text-sm text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</span>
            {formData.certificate && (
              <span className="mt-2 block text-sm text-indigo-700">{formData.certificate.name}</span>
            )}
          </div>
        </div>

        {/* Notes Card */}
        <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-indigo-400" aria-hidden="true" />
            Notes
          </h2>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any additional information about the baptism"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        {/* Error/Status */}
        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 border border-red-200">
            {errorMessage}
          </div>
        )}
        {mutationError && !errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 border border-red-200">
            {mutationError.message}
          </div>
        )}
        {/* Actions */}
        <div className="flex justify-end gap-3 sticky bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent py-4 z-10">
          <Link
            href="/dashboard/sacraments"
            className="rounded-lg border border-gray-300 bg-white py-2 px-5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || mutationLoading}
            className="inline-flex justify-center rounded-lg border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {(isSubmitting || mutationLoading) ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Baptism Record"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
