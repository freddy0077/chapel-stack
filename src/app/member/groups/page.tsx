"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useMemberGroupMemberships } from "@/graphql/hooks/useMemberGroupMemberships";
import { useSmallGroups } from "@/graphql/hooks/useSmallGroups";
import Loading from "@/components/ui/Loading";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  UserMinusIcon,
  CalendarIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface Group {
  id: string;
  name: string;
  description: string;
  leader: string;
  memberCount: number;
  nextMeeting?: string;
  meetingLocation?: string;
  imageUrl?: string;
  category: string;
  isMember: boolean;
}

// Mock data - fallback if backend is unavailable
const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    name: "Choir",
    description: "Join our vibrant choir and praise God through music",
    leader: "John Mensah",
    memberCount: 35,
    nextMeeting: "2025-11-15T18:00:00",
    meetingLocation: "Music Hall",
    imageUrl: "/groups/choir.jpg",
    category: "Music",
    isMember: true,
  },
  {
    id: "2",
    name: "Bible Study",
    description: "Deep dive into scripture with our pastoral team",
    leader: "Rev. Sarah Osei",
    memberCount: 28,
    nextMeeting: "2025-11-19T19:00:00",
    meetingLocation: "Conference Room",
    imageUrl: "/groups/bible-study.jpg",
    category: "Study",
    isMember: true,
  },
  {
    id: "3",
    name: "Youth Fellowship",
    description: "Fun activities and fellowship for young adults",
    leader: "David Owusu",
    memberCount: 45,
    nextMeeting: "2025-11-17T18:00:00",
    meetingLocation: "Youth Hall",
    imageUrl: "/groups/youth-fellowship.jpg",
    category: "Fellowship",
    isMember: false,
  },
  {
    id: "4",
    name: "Prayer Warriors",
    description: "Join us for an evening of prayer and intercession",
    leader: "Mama Ama",
    memberCount: 20,
    nextMeeting: "2025-11-21T19:30:00",
    meetingLocation: "Prayer Room",
    imageUrl: "/groups/prayer-warriors.jpg",
    category: "Prayer",
    isMember: false,
  },
  {
    id: "5",
    name: "Outreach Team",
    description: "Serve the community and share the gospel",
    leader: "James Boateng",
    memberCount: 15,
    nextMeeting: "2025-11-22T09:00:00",
    meetingLocation: "Community Center",
    imageUrl: "/groups/outreach.jpg",
    category: "Service",
    isMember: false,
  },
];

function MemberGroupsContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"my-groups" | "available">(
    "my-groups"
  );
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Fetch groups from backend
  const { memberGroups = [], loading: myGroupsLoading } = useMemberGroupMemberships(user?.id);
  const { groups: allGroups = [], loading: allGroupsLoading } = useSmallGroups();

  // Combine data - mark groups user is member of
  const memberGroupIds = new Set(Array.isArray(memberGroups) ? memberGroups.map((g: any) => g.id) : []);
  const groups = MOCK_GROUPS.map((g: any) => ({
    ...g,
    isMember: memberGroupIds.has(g.id),
  }));

  if (!user) {
    return <Loading message="Loading groups..." />;
  }

  if (myGroupsLoading || allGroupsLoading) {
    return <Loading message="Loading groups..." />;
  }

  const myGroups = groups.filter((g) => g.isMember);
  const availableGroups = groups.filter((g) => !g.isMember);

  const displayGroups =
    activeTab === "my-groups" ? myGroups : availableGroups;

  const filteredGroups = displayGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinGroup = async (groupId: string) => {
    try {
      // Call GraphQL mutation to join group
      // TODO: Import and use joinGroupMutation
      console.log("Joining group:", groupId);
      
      // Optimistic update
      const updatedGroups = groups.map((g) =>
        g.id === groupId ? { ...g, isMember: true, memberCount: g.memberCount + 1 } : g
      );
      // Note: In a real implementation, we would update state here
    } catch (error) {
      console.error("Error joining group:", error);
      alert("Failed to join group. Please try again.");
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      // Call GraphQL mutation to leave group
      // TODO: Import and use leaveGroupMutation
      console.log("Leaving group:", groupId);
      
      // Optimistic update
      const updatedGroups = groups.map((g) =>
        g.id === groupId ? { ...g, isMember: false, memberCount: g.memberCount - 1 } : g
      );
      // Note: In a real implementation, we would update state here
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("Failed to leave group. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Groups</h1>
          <p className="text-gray-600">
            Join groups and ministries to connect with other members
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("my-groups")}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === "my-groups"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-blue-600"
            }`}
          >
            My Groups ({myGroups.length})
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              activeTab === "available"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-blue-600"
            }`}
          >
            Available Groups ({availableGroups.length})
          </button>
        </div>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isMember={group.isMember}
                onJoin={() => handleJoinGroup(group.id)}
                onLeave={() => handleLeaveGroup(group.id)}
                onSelect={setSelectedGroup}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
            <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No groups found
            </h3>
            <p className="text-gray-600">
              {activeTab === "my-groups"
                ? "You haven't joined any groups yet. Explore available groups to get started!"
                : "No available groups match your search."}
            </p>
          </div>
        )}

        {/* Group Detail Modal */}
        {selectedGroup && (
          <GroupDetailModal
            group={selectedGroup}
            isMember={selectedGroup.isMember}
            onClose={() => setSelectedGroup(null)}
            onJoin={() => {
              handleJoinGroup(selectedGroup.id);
              setSelectedGroup({
                ...selectedGroup,
                isMember: true,
                memberCount: selectedGroup.memberCount + 1,
              });
            }}
            onLeave={() => {
              handleLeaveGroup(selectedGroup.id);
              setSelectedGroup({
                ...selectedGroup,
                isMember: false,
                memberCount: selectedGroup.memberCount - 1,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

function GroupCard({
  group,
  isMember,
  onJoin,
  onLeave,
  onSelect,
}: {
  group: Group;
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onSelect: (group: Group) => void;
}) {
  const nextMeetingDate = group.nextMeeting
    ? new Date(group.nextMeeting).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-blue-100 overflow-hidden transition group cursor-pointer">
      {/* Image */}
      {group.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-gray-200">
          <Image
            src={group.imageUrl}
            alt={group.name}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute top-3 right-3 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">
            {group.category}
          </span>
          {isMember && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
              <CheckCircleIcon className="w-3 h-3" />
              Member
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {group.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {group.description}
        </p>

        {/* Group Info */}
        <div className="space-y-2 mb-4 py-4 border-y border-gray-200">
          <InfoRow
            icon={<UserGroupIcon className="w-4 h-4" />}
            label="Members"
            value={`${group.memberCount} people`}
          />
          {group.nextMeeting && (
            <InfoRow
              icon={<CalendarIcon className="w-4 h-4" />}
              label="Next Meeting"
              value={nextMeetingDate || "TBA"}
            />
          )}
          {group.meetingLocation && (
            <InfoRow
              icon={<MapPinIcon className="w-4 h-4" />}
              label="Location"
              value={group.meetingLocation}
            />
          )}
        </div>

        {/* Leader */}
        <p className="text-sm text-gray-600 mb-4">
          Led by <span className="font-semibold text-gray-900">{group.leader}</span>
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onSelect(group)}
            className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold transition"
          >
            Details
          </button>
          {isMember ? (
            <button
              onClick={onLeave}
              className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <UserMinusIcon className="w-4 h-4" />
              Leave
            </button>
          ) : (
            <button
              onClick={onJoin}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <UserPlusIcon className="w-4 h-4" />
              Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-gray-500">{icon}</div>
      <span className="text-gray-600">{label}:</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function GroupDetailModal({
  group,
  isMember,
  onClose,
  onJoin,
  onLeave,
}: {
  group: Group;
  isMember: boolean;
  onClose: () => void;
  onJoin: () => void;
  onLeave: () => void;
}) {
  const nextMeetingDate = group.nextMeeting
    ? new Date(group.nextMeeting).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const nextMeetingTime = group.nextMeeting
    ? new Date(group.nextMeeting).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{group.name}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {group.imageUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={group.imageUrl}
                alt={group.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About this group</h3>
            <p className="text-gray-600">{group.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailBox
              icon={<UserGroupIcon className="w-5 h-5" />}
              label="Members"
              value={`${group.memberCount} people`}
            />
            <DetailBox
              icon={<UserGroupIcon className="w-5 h-5" />}
              label="Leader"
              value={group.leader}
            />
            {nextMeetingDate && (
              <DetailBox
                icon={<CalendarIcon className="w-5 h-5" />}
                label="Next Meeting"
                value={nextMeetingDate}
              />
            )}
            {nextMeetingTime && (
              <DetailBox
                icon={<CalendarIcon className="w-5 h-5" />}
                label="Time"
                value={nextMeetingTime}
              />
            )}
            {group.meetingLocation && (
              <DetailBox
                icon={<MapPinIcon className="w-5 h-5" />}
                label="Location"
                value={group.meetingLocation}
              />
            )}
            <DetailBox
              icon={<UserGroupIcon className="w-5 h-5" />}
              label="Category"
              value={group.category}
            />
          </div>

          {/* Action Section */}
          <div className="border-t border-gray-200 pt-6">
            {isMember ? (
              <div className="space-y-3">
                <p className="text-sm text-green-600 font-semibold flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  You are a member of this group
                </p>
                <button
                  onClick={onLeave}
                  className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <UserMinusIcon className="w-5 h-5" />
                  Leave Group
                </button>
              </div>
            ) : (
              <button
                onClick={onJoin}
                className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <UserPlusIcon className="w-5 h-5" />
                Join Group
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemberGroupsPage() {
  return (
    <Suspense fallback={<Loading message="Loading groups..." />}>
      <MemberGroupsContent />
    </Suspense>
  );
}

function DetailBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-blue-500">{icon}</div>
        <p className="text-xs text-gray-500 font-semibold uppercase">{label}</p>
      </div>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}
