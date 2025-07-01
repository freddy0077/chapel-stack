"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { usePrayerRequestMutations } from "../../../../graphql/hooks/usePrayerRequestMutations";
import { useOrganizationBranchFilter } from "../../../../graphql/hooks/useOrganizationBranchFilter";
import { useAuth } from "../../../../graphql/hooks/useAuth";
import { humanizeError } from '../../../../utils/humanizeError';
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";

interface NewPrayerRequestModalProps {
  open: boolean;
  onClose: () => void;
  afterCreate?: () => void;
}

export default function NewPrayerRequestModal({ open, onClose, afterCreate }: NewPrayerRequestModalProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createPrayerRequest } = usePrayerRequestMutations();
  const { organisationId, branchId } = useOrganizationBranchFilter();
  const { user } = useAuth();
  const isSuperAdmin = user?.primaryRole === 'super_admin';
  const [selectedBranchId, setSelectedBranchId] = useState(branchId);
  // Fetch branches for super_admins only
  const { branches = [], loading: branchesLoading } = useFilteredBranches(isSuperAdmin ? { organisationId } : undefined);

  // If user is super_admin, allow branch selection
  const showBranchSelect = isSuperAdmin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createPrayerRequest({
        variables: {
          data: {
            requestText: content,
            organisationId,
            branchId: showBranchSelect ? selectedBranchId : branchId,
            status: "Active",
          },
        },
      });
      setContent("");
      if (afterCreate) afterCreate();
      onClose();
    } catch (err: any) {
      setError(humanizeError(err?.message || err?.toString() || "Failed to create prayer request. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    New Prayer Request hh
                  </Dialog.Title>
                  <form onSubmit={handleSubmit}>
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 mb-4"
                      rows={4}
                      placeholder="Enter your prayer request..."
                      required
                    />
                    {showBranchSelect && (
                      <div className="mb-4">
                        <label htmlFor="branch-select" className="block text-sm font-medium text-gray-700 mb-1">
                          Branch
                        </label>
                        <select
                          id="branch-select"
                          className="w-full border border-gray-300 rounded-md p-2"
                          value={selectedBranchId}
                          onChange={e => setSelectedBranchId(e.target.value)}
                          required
                          disabled={branchesLoading}
                        >
                          <option value="">{branchesLoading ? "Loading branches..." : "Select branch"}</option>
                          {branches.map((b: any) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        onClick={onClose}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                        disabled={submitting || !content.trim()}
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
