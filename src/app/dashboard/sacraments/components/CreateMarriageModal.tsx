"use client";

import { useState, useRef, useEffect, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
  XMarkIcon, 
  DocumentArrowUpIcon, 
  UserIcon, 
  HeartIcon,
  CalendarIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { useCreateMatrimonyRecord } from "@/graphql/hooks/useCreateMatrimonyRecord";
import { useAuth } from "@/contexts/AuthContextEnhanced";
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

interface CreateMarriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateMarriageModal({ isOpen, onClose, onSuccess }: CreateMarriageModalProps) {
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
    groomId: "", 
    groomName: "", 
    brideId: "", 
    brideName: "", 
    marriageDate: "",
    location: "",
    officiant: "",
    witnesses: "",
    notes: "",
    certificate: null as File | null
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { createMatrimonyRecord, loading: mutationLoading, error: mutationError } = useCreateMatrimonyRecord();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        groomId: "", 
        groomName: "", 
        brideId: "", 
        brideName: "", 
        marriageDate: "",
        location: "",
        officiant: "",
        witnesses: "",
        notes: "",
        certificate: null
      });
      setErrorMessage(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Basic validation
    if (!formData.groomId || !formData.brideId) {
      setErrorMessage("Both groom and bride IDs are required.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.marriageDate || !formData.location || !formData.officiant) {
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
      const result = await createMatrimonyRecord({
        variables: {
          input: {
            memberId: formData.groomId, 
            sacramentType: "MATRIMONY",
            dateOfSacrament: formData.marriageDate, // Send as string, not Date object
            locationOfSacrament: formData.location,
            officiantName: formData.officiant,
            groomName: formData.groomName, // Add groom name
            brideName: formData.brideName, // Add bride name
            witness1Name: formData.witnesses?.split(',')[0]?.trim() || null,
            witness2Name: formData.witnesses?.split(',')[1]?.trim() || null,
            certificateNumber: formData.certificate?.name || null, // Use filename as certificate number
            notes: formData.notes || null, // Send notes separately
            branchId,
            organisationId
          }
        }
      });

      console.log('Marriage record creation result:', result); // Debug log

      if (result.data?.createSacramentalRecord) {
        // Call onSuccess immediately to let parent handle success flow
        onSuccess?.();
      } else {
        setErrorMessage("Failed to create marriage record. Please check all required fields.");
      }
    } catch (error) {
      console.error("Error creating marriage record:", error);
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(`Failed to create marriage record: ${errorMessage}`);
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
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <HeartIcon className="h-6 w-6 text-white" />
                      <div>
                        <Dialog.Title as="h3" className="text-lg font-semibold text-white">
                          Create Marriage Record
                        </Dialog.Title>
                        <p className="text-rose-100 text-sm">Sacred union of two hearts in love</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white hover:text-rose-100 transition-colors"
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
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
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

                    {/* Groom and Bride Names */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Groom's ID <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="groomId"
                            value={formData.groomId}
                            onChange={handleChange}
                            placeholder="Groom's ID"
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bride's ID <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="brideId"
                            value={formData.brideId}
                            onChange={handleChange}
                            placeholder="Bride's ID"
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Groom and Bride Names */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Groom's Name
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="groomName"
                            value={formData.groomName}
                            onChange={handleChange}
                            placeholder="Full name of the groom"
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bride's Name
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="brideName"
                            value={formData.brideName}
                            onChange={handleChange}
                            placeholder="Full name of the bride"
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Marriage Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marriage Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          name="marriageDate"
                          value={formData.marriageDate}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
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
                          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
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
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        required
                      />
                    </div>

                    {/* Witnesses */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Witnesses
                      </label>
                      <input
                        type="text"
                        name="witnesses"
                        value={formData.witnesses}
                        onChange={handleChange}
                        placeholder="Names of witnesses"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
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
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
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

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Creating..." : "Create Marriage Record"}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
