"use client";

import { useState, useRef, useEffect, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
  XMarkIcon, 
  DocumentArrowUpIcon, 
  UserIcon, 
  SparklesIcon,
  CalendarIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { useCreateBaptismRecord } from "@/graphql/hooks/useCreateBaptismRecord";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useSearchMembers } from "@/graphql/hooks/useSearchMembers";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const handler = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (handler.current) clearTimeout(handler.current);
    handler.current = setTimeout(() => setDebouncedValue(value), delay);
    return () => handler.current && clearTimeout(handler.current);
  }, [value, delay]);
  return debouncedValue;
}

interface CreateBaptismModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateBaptismModal({ isOpen, onClose, onSuccess }: CreateBaptismModalProps) {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId: orgIdFromFilter, branchId: branchIdFromFilter } = useOrganizationBranchFilter();
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const isSuperAdmin = user?.primaryRole === "super_admin";
  const organisationId = user?.organisationId || orgIdFromFilter;
  const { branches = [], loading: branchesLoading } = useFilteredBranches(isSuperAdmin ? { organisationId } : undefined);
  
  // Improved branch selection logic
  const branchId = useMemo(() => {
    if (isSuperAdmin) {
      return selectedBranchId;
    } else {
      // For non-super admin users, try to get branch from filter, user's branches, or first available branch
      return branchIdFromFilter || 
             user?.userBranches?.[0]?.branch?.id || 
             user?.branchId ||
             branches?.[0]?.id;
    }
  }, [isSuperAdmin, selectedBranchId, branchIdFromFilter, user, branches]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    baptismDate: "",
    location: "",
    officiant: "",
    sponsors: "",
    notes: "",
    certificate: null as File | null
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search term
  const debouncedSearch = useDebounce(memberSearch, 400);
  const { members, loading: searchLoading, error: searchError } = useSearchMembers(
    debouncedSearch,
    organisationId,
    branchId
  );

  const { createBaptismRecord, loading: mutationLoading, error: mutationError } = useCreateBaptismRecord();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        memberId: "",
        baptismDate: "",
        location: "",
        officiant: "",
        sponsors: "",
        notes: "",
        certificate: null
      });
      setMemberSearch("");
      setErrorMessage(null);
      setSuccessMessage(null);
      setShowDropdown(false);
    }
  }, [isOpen]);

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

  const handleMemberSelect = (member: any) => {
    setFormData(prev => ({
      ...prev,
      memberId: member.id
    }));
    setMemberSearch(`${member.firstName} ${member.lastName}`);
    setShowDropdown(false);
  };

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

    try {
      const result = await createBaptismRecord({
        variables: {
          input: {
            memberId: formData.memberId,
            sacramentType: "BAPTISM",
            dateOfSacrament: new Date(formData.baptismDate),
            locationOfSacrament: formData.location,
            officiantName: formData.officiant,
            godparent1Name: formData.sponsors?.split(',')[0]?.trim() || null,
            godparent2Name: formData.sponsors?.split(',')[1]?.trim() || null,
            certificateNumber: formData.certificate || null,
            notes: formData.notes || null,
            branchId,
            organisationId
          }
        }
      });

      if (result.data?.createSacramentalRecord) {
        setSuccessMessage("Baptism record created successfully!");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating baptism record:", error);
      setErrorMessage("Failed to create baptism record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <SparklesIcon className="h-6 w-6 text-white" />
                      <div>
                        <Dialog.Title as="h3" className="text-lg font-semibold text-white">
                          Create Baptism Record
                        </Dialog.Title>
                        <p className="text-blue-100 text-sm">Sacred initiation into the Christian faith</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white hover:text-blue-100 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-4 max-h-96 overflow-y-auto">
                  {errorMessage && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Branch Selection (Super Admin only) */}
                    {isSuperAdmin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Branch <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedBranchId}
                          onChange={(e) => setSelectedBranchId(e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select a branch</option>
                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Member Search */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="Search for a member..."
                          value={memberSearch}
                          onChange={(e) => {
                            setMemberSearch(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      {/* Member Dropdown */}
                      {showDropdown && debouncedSearch && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {searchLoading ? (
                            <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
                          ) : members.length > 0 ? (
                            members.map((member: any) => (
                              <button
                                key={member.id}
                                type="button"
                                onClick={() => handleMemberSelect(member)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100"
                              >
                                <div className="font-medium">{member.firstName} {member.lastName}</div>
                                <div className="text-gray-500">{member.email}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No members found</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Baptism Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Baptism Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          name="baptismDate"
                          value={formData.baptismDate}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Church or venue name"
                          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Officiant */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Officiant <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="officiant"
                        value={formData.officiant}
                        onChange={handleChange}
                        placeholder="Pastor or priest name"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Sponsors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sponsors/Godparents
                      </label>
                      <input
                        type="text"
                        name="sponsors"
                        value={formData.sponsors}
                        onChange={handleChange}
                        placeholder="Names of sponsors or godparents"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Additional notes or comments"
                        rows={3}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Certificate Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certificate
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                          <DocumentArrowUpIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formData.certificate ? formData.certificate.name : "Upload Certificate"}
                          </span>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : "Create Baptism Record"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
