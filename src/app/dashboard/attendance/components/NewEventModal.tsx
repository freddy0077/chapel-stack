"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useOrganizationBranchFilter } from "@/hooks";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";
import { useAuth } from "@/contexts/AuthContextEnhanced";

export interface NewEventInput {
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  location?: string;
  organisationId?: string;
  branchId?: string;
}

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: NewEventInput) => void;
  loading?: boolean;
  error?: string;
  mode?: "event" | "session";
}

const EVENT_TYPES = [
  { value: "REGULAR_SERVICE", label: "Regular Service" },
  { value: "SPECIAL_EVENT", label: "Special Event" },
  { value: "BIBLE_STUDY", label: "Bible Study" },
  { value: "PRAYER_MEETING", label: "Prayer Meeting" },
  { value: "OTHER", label: "Other" },
];

export default function NewEventModal({
  isOpen,
  onClose,
  onCreate,
  loading,
  error,
  mode = "event",
}: NewEventModalProps) {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId: orgIdFromFilter, branchId: branchIdFromFilter } =
    useOrganizationBranchFilter();
  const [form, setForm] = useState<
    Omit<NewEventInput, "organisationId" | "branchId">
  >({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    type: EVENT_TYPES[0].value,
    location: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Check if user data is loaded and authentication state
  const isUserLoaded = user && user.id && state.isAuthenticated;
  const isAuthLoading = !state.isHydrated;

  // Debug logging to help identify the issue
  console.log('NewEventModal Debug:', {
    isOpen,
    user,
    state,
    isUserLoaded,
    isAuthLoading,
    branchIdFromFilter,
    orgIdFromFilter,
    userBranches: user?.userBranches
  });

  // Branch selection logic
  const isSuperAdmin = user?.primaryRole === "ADMIN";
  const organisationId = orgIdFromFilter;

  const { branches = [], loading: branchesLoading } = useFilteredBranches(
    isSuperAdmin ? { organisationId } : undefined,
  );

  // Determine branchId for event creation - use branchIdFromFilter first, then fallback to user branches
  const branchId = isSuperAdmin
    ? selectedBranchId
    : branchIdFromFilter ||
      (user?.userBranches && user.userBranches.length > 0
        ? user.userBranches[0].branch.id
        : undefined);

  // Get branch name for display - improved logic with better fallbacks
  let branchName = "";
  let branchDisplayText = "";

  if (isAuthLoading) {
    branchDisplayText = "Loading authentication...";
  } else if (!isUserLoaded) {
    branchDisplayText = "User data not available";
  } else if (isSuperAdmin) {
    // For super admin, show selected branch from dropdown
    branchName = branches.find((b) => b.id === selectedBranchId)?.name || "";
    branchDisplayText = branchName || "Select a branch";
  } else {
    // For regular users, show their current branch
    if (user?.userBranches && user.userBranches.length > 0) {
      branchName = user.userBranches[0].branch.name || "";
      branchDisplayText = branchName || "Branch name not available";
    } else {
      branchDisplayText = "No branch assigned";
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!form.name || !form.date || !form.startTime || !form.endTime) {
      setLocalError("Please fill in all required fields.");
      return;
    }
    if (!branchId) {
      setLocalError("No branch selected or available for this user.");
      return;
    }
    if (!organisationId) {
      setLocalError("No organisation found for this user or branch.");
      return;
    }
    onCreate({ ...form, branchId, organisationId });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
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
              <Dialog.Panel className="relative bg-white rounded-lg px-6 pt-6 pb-8 text-left shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    <CalendarIcon className="inline-block w-6 h-6 text-indigo-500 mr-2" />
                    {mode === "event"
                      ? "Create New Attendance Event"
                      : "Create New Attendance Session"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        value={branchDisplayText}
                        className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed sm:text-sm"
                        disabled
                        placeholder="Your branch will appear here"
                      />
                      {isAuthLoading && (
                        <p className="mt-1 text-xs text-blue-500">
                          Loading authentication state...
                        </p>
                      )}
                      {!isAuthLoading && !isUserLoaded && (
                        <p className="mt-1 text-xs text-orange-500">
                          Authentication required. Please refresh the page.
                        </p>
                      )}
                      {isUserLoaded && !branchName && !isSuperAdmin && (
                        <p className="mt-1 text-xs text-red-500">
                          No branch assigned to your account. Please contact
                          your administrator.
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g. Sunday Service"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows={2}
                      placeholder="Brief description (optional)"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {EVENT_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g. Main Sanctuary"
                    />
                  </div>
                  {localError && (
                    <div className="text-red-500 text-sm">{localError}</div>
                  )}
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 rounded-md border border-transparent bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none disabled:opacity-60"
                      disabled={loading}
                    >
                      {loading
                        ? "Creating..."
                        : mode === "event"
                          ? "Create Event"
                          : "Create Session"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
