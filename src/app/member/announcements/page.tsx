"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useMessages } from "@/graphql/hooks/useMessages";
import Loading from "@/components/ui/Loading";
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrashIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: string;
  createdAt: string;
  readAt?: string;
  imageUrl?: string;
}

// Mock data - fallback if backend is unavailable
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Church Picnic This Saturday!",
    content:
      "Join us for a fun-filled day at the park. Bring your family and friends. We'll have games, food, and fellowship. Meet at 10 AM at Central Park.",
    priority: "HIGH",
    category: "Event",
    createdAt: "2025-11-08T10:00:00",
    readAt: "2025-11-08T11:30:00",
    imageUrl: "/announcements/picnic.jpg",
  },
  {
    id: "2",
    title: "New Bible Study Series Starting",
    content:
      "We're starting a new Bible study series on the Book of Romans. Join us every Wednesday at 7 PM in the Conference Room. All are welcome!",
    priority: "MEDIUM",
    category: "Study",
    createdAt: "2025-11-07T14:00:00",
    readAt: "2025-11-07T15:45:00",
  },
  {
    id: "3",
    title: "Volunteer Opportunity: Community Outreach",
    content:
      "We need volunteers for our community outreach program. Help us serve the less fortunate in our community. Contact James Boateng for more details.",
    priority: "MEDIUM",
    category: "Service",
    createdAt: "2025-11-06T09:00:00",
  },
  {
    id: "4",
    title: "Prayer Request: Sister Mary's Recovery",
    content:
      "Please join us in prayer for Sister Mary who is recovering from surgery. Let's lift her up in prayer during this time of healing.",
    priority: "HIGH",
    category: "Prayer",
    createdAt: "2025-11-05T16:00:00",
  },
  {
    id: "5",
    title: "Thanksgiving Service - November 28",
    content:
      "Mark your calendars for our special Thanksgiving service on November 28. We'll have special music and a time of gratitude.",
    priority: "LOW",
    category: "Event",
    createdAt: "2025-11-04T11:00:00",
  },
];

function MemberAnnouncementsContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<
    "All" | "HIGH" | "MEDIUM" | "LOW"
  >("All");

  // Fetch announcements from backend
  const { messages = [], loading: messagesLoading } = useMessages();
  
  // Use backend announcements or fallback to mock data
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    messages.length > 0 ? messages : MOCK_ANNOUNCEMENTS
  );
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  if (!user) {
    return <Loading message="Loading announcements..." />;
  }

  if (messagesLoading) {
    return <Loading message="Loading announcements..." />;
  }

  const priorities = ["All", "HIGH", "MEDIUM", "LOW"];

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      selectedPriority === "All" || announcement.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const unreadCount = announcements.filter((a) => !a.readAt).length;

  const handleMarkAsRead = (announcementId: string) => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === announcementId
          ? { ...a, readAt: new Date().toISOString() }
          : a
      )
    );
    // TODO: Call GraphQL mutation
  };

  const handleDelete = (announcementId: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== announcementId));
    // TODO: Call GraphQL mutation
  };

  const handleArchive = (announcementId: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== announcementId));
    // TODO: Call GraphQL mutation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-blue-900">Announcements</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Stay updated with the latest church announcements
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Priority Filters */}
          <div className="flex flex-wrap gap-2">
            {priorities.map((priority) => (
              <button
                key={priority}
                onClick={() =>
                  setSelectedPriority(
                    priority as "All" | "HIGH" | "MEDIUM" | "LOW"
                  )
                }
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedPriority === priority
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {priority === "HIGH"
                  ? "🔴 High"
                  : priority === "MEDIUM"
                    ? "🟡 Medium"
                    : priority === "LOW"
                      ? "🟢 Low"
                      : "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredAnnouncements.length}</span>{" "}
            announcement{filteredAnnouncements.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Announcements List */}
        {filteredAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onSelect={setSelectedAnnouncement}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
            <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No announcements found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MemberAnnouncementsPage() {
  return (
    <Suspense fallback={<Loading message="Loading announcements..." />}>
      <MemberAnnouncementsContent />
    </Suspense>
  );
}

function AnnouncementCard({
  announcement,
  onMarkAsRead,
  onDelete,
  onArchive,
  onSelect,
}: {
  announcement: Announcement;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onSelect: (announcement: Announcement) => void;
}) {
  const createdDate = new Date(announcement.createdAt);
  const formattedDate = createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const priorityColor =
    announcement.priority === "HIGH"
      ? "red"
      : announcement.priority === "MEDIUM"
        ? "yellow"
        : "green";

  const isUnread = !announcement.readAt;

  return (
    <div
      className={`rounded-2xl shadow-lg border transition cursor-pointer ${
        isUnread
          ? "bg-blue-50 border-blue-200 hover:shadow-xl"
          : "bg-white border-gray-200 hover:shadow-lg"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 bg-${priorityColor}-100 text-${priorityColor}-700 rounded-full text-xs font-semibold`}
              >
                {announcement.priority === "HIGH"
                  ? "🔴 High"
                  : announcement.priority === "MEDIUM"
                    ? "🟡 Medium"
                    : "🟢 Low"}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {announcement.category}
              </span>
              {isUnread && (
                <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">
                  New
                </span>
              )}
            </div>
            <h3
              className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600"
              onClick={() => onSelect(announcement)}
            >
              {announcement.title}
            </h3>
            <p className="text-gray-600 line-clamp-2 mb-3">
              {announcement.content}
            </p>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onSelect(announcement)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold transition text-sm"
          >
            Read More
          </button>
          {isUnread && (
            <button
              onClick={() => onMarkAsRead(announcement.id)}
              className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg font-semibold transition text-sm flex items-center gap-2"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Mark as Read
            </button>
          )}
          <button
            onClick={() => onArchive(announcement.id)}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg font-semibold transition text-sm flex items-center gap-2"
          >
            <ArchiveBoxIcon className="w-4 h-4" />
            Archive
          </button>
          <button
            onClick={() => onDelete(announcement.id)}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition text-sm flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
