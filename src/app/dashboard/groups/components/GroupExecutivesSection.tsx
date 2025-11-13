import React, { useState } from "react";
import {
  UserPlusIcon,
  XMarkIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  GroupExecutive,
  GroupExecutiveRole,
  SmallGroup,
} from "../../../../graphql/hooks/useSmallGroups";
import { useGroupExecutiveMutations } from "../../../../graphql/hooks/useGroupExecutives";
import AddGroupExecutiveModal from "./AddGroupExecutiveModal";

interface GroupExecutivesSectionProps {
  group: SmallGroup;
  onUpdate?: () => void;
}

const roleLabels: Record<GroupExecutiveRole, string> = {
  [GroupExecutiveRole.LEADER]: "Leader",
  [GroupExecutiveRole.ASSISTANT_LEADER]: "Assistant Leader",
  [GroupExecutiveRole.SECRETARY]: "Secretary",
  [GroupExecutiveRole.TREASURER]: "Treasurer",
  [GroupExecutiveRole.ORGANIZER]: "Organizer",
  [GroupExecutiveRole.COORDINATOR]: "Coordinator",
  [GroupExecutiveRole.OTHER]: "Other",
};

const roleColors: Record<GroupExecutiveRole, string> = {
  [GroupExecutiveRole.LEADER]: "bg-purple-100 text-purple-800",
  [GroupExecutiveRole.ASSISTANT_LEADER]: "bg-blue-100 text-blue-800",
  [GroupExecutiveRole.SECRETARY]: "bg-green-100 text-green-800",
  [GroupExecutiveRole.TREASURER]: "bg-yellow-100 text-yellow-800",
  [GroupExecutiveRole.ORGANIZER]: "bg-pink-100 text-pink-800",
  [GroupExecutiveRole.COORDINATOR]: "bg-indigo-100 text-indigo-800",
  [GroupExecutiveRole.OTHER]: "bg-gray-100 text-gray-800",
};

export default function GroupExecutivesSection({
  group,
  onUpdate,
}: GroupExecutivesSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { removeGroupExecutive } = useGroupExecutiveMutations();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveExecutive = async (executiveId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this executive from the group?",
      )
    ) {
      return;
    }

    try {
      setRemovingId(executiveId);
      await removeGroupExecutive(executiveId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error removing executive:", error);
      alert("Failed to remove executive. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  const executives = group.executives || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ShieldCheckIcon className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Group Executives
          </h3>
          <span className="ml-2 text-sm text-gray-500">
            ({executives.length})
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <UserPlusIcon className="h-4 w-4 mr-1" />
          Add Executive
        </button>
      </div>

      {executives.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm">No executives assigned yet</p>
          <p className="text-xs mt-1">
            Click "Add Executive" to assign leadership roles
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {executives.map((executive) => {
            const member = executive.member;
            const memberName = member
              ? `${member.firstName} ${member.lastName}`
              : "Unknown Member";
            const memberInitials = member
              ? `${member.firstName?.charAt(0) || ""}${member.lastName?.charAt(0) || ""}`.toUpperCase()
              : "??";

            return (
              <div
                key={executive.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center flex-1">
                  {/* Profile image or initials */}
                  {member?.profileImageUrl ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full flex-shrink-0">
                      <Image
                        className="object-cover"
                        src={member.profileImageUrl}
                        alt={memberName}
                        fill
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-700 flex-shrink-0">
                      {memberInitials}
                    </div>
                  )}

                  {/* Member details */}
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {memberName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          roleColors[executive.role as GroupExecutiveRole] ||
                          roleColors[GroupExecutiveRole.OTHER]
                        }`}
                      >
                        {roleLabels[executive.role as GroupExecutiveRole] ||
                          executive.role}
                      </span>
                      {member?.email && (
                        <span className="text-xs text-gray-500">
                          {member.email}
                        </span>
                      )}
                    </div>
                    {member?.phoneNumber && (
                      <p className="text-xs text-gray-500 mt-1">
                        {member.phoneNumber}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Appointed:{" "}
                      {new Date(executive.appointedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveExecutive(executive.id)}
                  disabled={removingId === executive.id}
                  className="ml-4 p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                  title="Remove executive"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Executive Modal */}
      <AddGroupExecutiveModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        group={group}
        onSuccess={() => {
          setIsAddModalOpen(false);
          if (onUpdate) onUpdate();
        }}
      />
    </div>
  );
}
