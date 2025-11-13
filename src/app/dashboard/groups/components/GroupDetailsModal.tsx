import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import {
  XMarkIcon,
  UserPlusIcon,
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  UsersIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  SmallGroup,
  useSmallGroupMutations,
} from "../../../../graphql/hooks/useSmallGroups";
import EditGroupModal from "./EditGroupModal";
import GroupExecutivesSection from "./GroupExecutivesSection";

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: SmallGroup | null;
  onUpdate?: () => void;
}

export default function GroupDetailsModal({
  isOpen,
  onClose,
  group,
  onUpdate,
}: GroupDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "executives">(
    "overview",
  );
  const { deleteSmallGroup } = useSmallGroupMutations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!group) return;

    if (
      window.confirm(
        "Are you sure you want to delete this group? This action cannot be undone.",
      )
    ) {
      try {
        setIsDeleting(true);
        await deleteSmallGroup(group.id);
        onClose();
      } catch (error) {
        console.error("Error deleting group:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!group) return null;

  const tabs = [
    {
      id: "overview" as const,
      name: "Overview",
      icon: InformationCircleIcon,
      count: null,
    },
    {
      id: "executives" as const,
      name: "Executives",
      icon: ShieldCheckIcon,
      count: group.executives?.length || 0,
    },
    {
      id: "members" as const,
      name: "Members",
      icon: UsersIcon,
      count: group.members?.length || 0,
    },
  ];

  return (
    <Dialog as="div" className="relative z-50" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 bg-gray-900/75 backdrop-blur-sm transition-opacity" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
            {/* Close button */}
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 backdrop-blur-sm p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              onClick={onClose}
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8">
              <div className="flex items-center gap-4">
                {/* Group avatar */}
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm text-white text-3xl font-bold border-2 border-white/30 shadow-lg">
                  {group.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>

                {/* Group info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl font-bold text-white mb-2 truncate">
                    {group.name}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        group.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : group.status === "INACTIVE"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {group.status}
                    </span>
                    <span className="inline-flex items-center text-white/90 text-sm font-medium">
                      {group.type}
                    </span>
                    {group.ministry && (
                      <span className="inline-flex items-center text-white/80 text-sm">
                        • {group.ministry.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-all border border-white/30"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="flex px-8 -mb-px space-x-8" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
                        ${
                          isActive
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }
                      `}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive
                            ? "text-indigo-500"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {tab.name}
                      {tab.count !== null && (
                        <span
                          className={`ml-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isActive
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="px-8 py-6 max-h-[calc(100vh-400px)] overflow-y-auto">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Description */}
                  {group.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {group.description}
                      </p>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.meetingSchedule && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <CalendarIcon className="h-5 w-5 text-indigo-600" />
                          Meeting Schedule
                        </div>
                        <p className="text-sm text-gray-600">
                          {group.meetingSchedule}
                        </p>
                      </div>
                    )}

                    {group.location && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <MapPinIcon className="h-5 w-5 text-indigo-600" />
                          Location
                        </div>
                        <p className="text-sm text-gray-600">{group.location}</p>
                      </div>
                    )}

                    {group.maximumCapacity && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                          <UsersIcon className="h-5 w-5 text-indigo-600" />
                          Capacity
                        </div>
                        <p className="text-sm text-gray-600">
                          {group.members?.length || 0} / {group.maximumCapacity}{" "}
                          members
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
                        Leadership
                      </div>
                      <p className="text-sm text-gray-600">
                        {group.executives?.length || 0} executive
                        {group.executives?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Quick Stats
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          {group.members?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {group.executives?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Executives
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-600">
                          {group.maximumCapacity || "∞"}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Capacity</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "executives" && (
                <GroupExecutivesSection group={group} onUpdate={onUpdate} />
              )}

              {activeTab === "members" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Group Members
                    </h3>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                      Add Member
                    </button>
                  </div>

                  {group.members && group.members.length > 0 ? (
                    <div className="space-y-2">
                      {group.members.map((groupMember) => {
                        const member = groupMember.member;
                        const memberName = member
                          ? `${member.firstName} ${member.lastName}`
                          : "Unknown Member";
                        const memberInitials = member
                          ? `${member.firstName?.charAt(0) || ""}${member.lastName?.charAt(0) || ""}`.toUpperCase()
                          : "??";

                        return (
                          <div
                            key={groupMember.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {member?.profileImageUrl ? (
                                <div className="relative h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
                                  <Image
                                    className="object-cover"
                                    src={member.profileImageUrl}
                                    alt={memberName}
                                    fill
                                    sizes="40px"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-700 flex-shrink-0">
                                  {memberInitials}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {memberName}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-gray-500">
                                    {groupMember.role}
                                  </span>
                                  {member?.email && (
                                    <>
                                      <span className="text-xs text-gray-400">•</span>
                                      <span className="text-xs text-gray-500">
                                        {member.email}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                groupMember.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {groupMember.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">
                        No members
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by adding members to this group.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Group"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>

      {/* Edit Modal */}
      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        group={group}
        onUpdate={() => {
          setIsEditModalOpen(false);
          if (onUpdate) onUpdate();
        }}
      />
    </Dialog>
  );
}
