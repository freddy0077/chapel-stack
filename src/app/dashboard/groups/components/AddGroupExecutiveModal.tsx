import React, { useState, useMemo } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  GroupExecutiveRole,
  SmallGroup,
} from "../../../../graphql/hooks/useSmallGroups";
import { useGroupExecutiveMutations } from "../../../../graphql/hooks/useGroupExecutives";
import { useSearchMembers } from "../../../../graphql/hooks/useSearchMembers";

interface AddGroupExecutiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: SmallGroup;
  onSuccess?: () => void;
}

const roleOptions = [
  { value: GroupExecutiveRole.LEADER, label: "Leader" },
  { value: GroupExecutiveRole.ASSISTANT_LEADER, label: "Assistant Leader" },
  { value: GroupExecutiveRole.SECRETARY, label: "Secretary" },
  { value: GroupExecutiveRole.TREASURER, label: "Treasurer" },
  { value: GroupExecutiveRole.ORGANIZER, label: "Organizer" },
  { value: GroupExecutiveRole.COORDINATOR, label: "Coordinator" },
  { value: GroupExecutiveRole.OTHER, label: "Other" },
];

export default function AddGroupExecutiveModal({
  isOpen,
  onClose,
  group,
  onSuccess,
}: AddGroupExecutiveModalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedRole, setSelectedRole] = useState<GroupExecutiveRole>(
    GroupExecutiveRole.LEADER,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createGroupExecutive } = useGroupExecutiveMutations();
  
  // Get members with search - useSearchMembers returns { data, loading, error }
  const { data: searchResults, loading: searchLoading } = useSearchMembers(
    searchTerm,
    group.organisationId || "",
    group.branchId || undefined,
  );

  // Filter out members who are already executives
  const availableMembers = useMemo(() => {
    const members = searchResults || [];
    const existingExecutiveIds = new Set(
      group.executives?.map((e) => e.memberId) || [],
    );
    return members.filter((m: any) => !existingExecutiveIds.has(m.id));
  }, [searchResults, group.executives]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedMemberId) {
      setError("Please select a member");
      return;
    }

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    try {
      setIsSubmitting(true);
      await createGroupExecutive({
        memberId: selectedMemberId,
        role: selectedRole,
        smallGroupId: group.id,
      });

      // Reset form
      setSelectedMemberId("");
      setSelectedRole(GroupExecutiveRole.LEADER);
      setSearchTerm("");

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Error adding executive:", err);
      setError(
        err.message || "Failed to add executive. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedMemberId("");
      setSelectedRole(GroupExecutiveRole.LEADER);
      setSearchTerm("");
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog as="div" className="relative z-50" open={isOpen} onClose={handleClose}>
      <div className="fixed inset-0 bg-gray-700 bg-opacity-70 transition-opacity" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all">
            {/* Close button */}
            <button
              type="button"
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Header */}
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
              Add Group Executive
            </Dialog.Title>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Executive Role
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as GroupExecutiveRole)
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Member Search */}
              <div>
                <label
                  htmlFor="member-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search Member
                </label>
                <input
                  type="text"
                  id="member-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to search members..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Member Selection */}
              {searchTerm.length >= 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Member
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                    {searchLoading ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : availableMembers.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No members found
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {availableMembers.map((member) => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => setSelectedMemberId(member.id)}
                            className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                              selectedMemberId === member.id
                                ? "bg-indigo-50 border-l-4 border-indigo-600"
                                : ""
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {member.firstName} {member.lastName}
                            </p>
                            {member.email && (
                              <p className="text-xs text-gray-500">
                                {member.email}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Selected Member Display */}
              {selectedMemberId && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md">
                  <p className="text-sm font-medium text-indigo-900">
                    Selected:{" "}
                    {
                      availableMembers.find((m) => m.id === selectedMemberId)
                        ?.firstName
                    }{" "}
                    {
                      availableMembers.find((m) => m.id === selectedMemberId)
                        ?.lastName
                    }
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedMemberId}
                  className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Executive"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
