"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useBranchEvents } from "@/graphql/hooks/useEvents";
import { useEventRegistrationRSVP } from "@/graphql/hooks/useEventRegistrationRSVP";
import Loading from "@/components/ui/Loading";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  attendeeCount: number;
  imageUrl?: string;
  rsvpStatus?: "GOING" | "INTERESTED" | "NOT_GOING" | null;
}

// Mock data - fallback if backend is unavailable
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Sunday Service",
    description: "Join us for our weekly Sunday service with worship and teaching",
    startDate: "2025-11-16T09:00:00",
    endDate: "2025-11-16T11:00:00",
    location: "Main Auditorium",
    category: "Service",
    attendeeCount: 250,
    imageUrl: "/events/sunday-service.jpg",
    rsvpStatus: "GOING",
  },
  {
    id: "2",
    title: "Youth Fellowship",
    description: "Fun activities and fellowship for young adults",
    startDate: "2025-11-17T18:00:00",
    endDate: "2025-11-17T20:00:00",
    location: "Youth Hall",
    category: "Fellowship",
    attendeeCount: 45,
    imageUrl: "/events/youth-fellowship.jpg",
    rsvpStatus: null,
  },
  {
    id: "3",
    title: "Bible Study",
    description: "Deep dive into scripture with our pastoral team",
    startDate: "2025-11-19T19:00:00",
    endDate: "2025-11-19T20:30:00",
    location: "Conference Room",
    category: "Study",
    attendeeCount: 30,
    imageUrl: "/events/bible-study.jpg",
    rsvpStatus: "INTERESTED",
  },
  {
    id: "4",
    title: "Prayer Night",
    description: "Join us for an evening of prayer and intercession",
    startDate: "2025-11-21T19:30:00",
    endDate: "2025-11-21T21:00:00",
    location: "Prayer Room",
    category: "Prayer",
    attendeeCount: 20,
    imageUrl: "/events/prayer-night.jpg",
    rsvpStatus: null,
  },
];

function MemberEventsContent() {
  const { user, organisation } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch events from backend
  const branchId = organisation?.branchId || user?.branchId;
  const { events: backendEvents, loading: eventsLoading, error: eventsError } = useBranchEvents(branchId);
  const { createRSVP, updateRSVP, deleteRSVP, loading: rsvpLoading } = useEventRegistrationRSVP();

  // Use backend events or fallback to mock data
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  // Update events when backend data is available
  useEffect(() => {
    // Ensure backendEvents is an array before using it
    const safeBackendEvents = Array.isArray(backendEvents) ? backendEvents : [];
    if (safeBackendEvents.length > 0) {
      setEvents(safeBackendEvents);
    }
  }, [backendEvents]);

  if (!user) {
    return <Loading message="Loading events..." />;
  }

  if (eventsLoading) {
    return <Loading message="Loading events..." />;
  }

  if (eventsError) {
    console.error("Events error:", eventsError);
  }

  const categories = [
    "All",
    "Service",
    "Fellowship",
    "Study",
    "Prayer",
    "Training",
    "Social",
  ];

  // Ensure events is always an array before filtering
  const safeEvents = Array.isArray(events) ? events : [];
  const filteredEvents = safeEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRSVP = async (eventId: string, status: "GOING" | "INTERESTED" | "NOT_GOING" | null) => {
    try {
      // Call GraphQL mutation to update RSVP
      if (status) {
        // Map UI status to backend RSVPStatus enum
        const statusMap: Record<string, string> = {
          GOING: "YES",
          INTERESTED: "MAYBE",
          NOT_GOING: "NO",
        };
        const mapped = statusMap[status] as any;
        // Create or update RSVP; backend can upsert based on member context
        await createRSVP({
          eventId,
          status: mapped, // RSVPStatus enum expected by backend
          numberOfGuests: 1,
        } as any);
      } else {
        // If clearing RSVP, optimistically update UI (backend delete not wired with id here)
        // Optionally, you could fetch existing RSVP and call deleteRSVP(id, eventId)
      }

      // Update local state optimistically
      setEvents(
        safeEvents.map((event) =>
          event.id === eventId ? { ...event, rsvpStatus: status } : event
        )
      );
    } catch (error) {
      console.error("Error updating RSVP:", error);
      // Show error to user
      alert("Failed to update RSVP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Events</h1>
          <p className="text-gray-600">
            Discover and join upcoming church events
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
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredEvents.length}</span>{" "}
            event{filteredEvents.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                onSelect={setSelectedEvent}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
            <ExclamationTriangleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find events
            </p>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onRSVP={handleRSVP}
          />
        )}
      </div>
    </div>
  );
}

function EventCard({
  event,
  onRSVP,
  onSelect,
}: {
  event: Event;
  onRSVP: (eventId: string, status: "GOING" | "INTERESTED" | "NOT_GOING" | null) => void;
  onSelect: (event: Event) => void;
}) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const rsvpOptions: Array<{
    status: "GOING" | "INTERESTED" | "NOT_GOING";
    label: string;
    color: string;
  }> = [
    { status: "GOING", label: "Going", color: "green" },
    { status: "INTERESTED", label: "Interested", color: "blue" },
    { status: "NOT_GOING", label: "Not Going", color: "red" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-blue-100 overflow-hidden transition">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        {event.imageUrl && (
          <div className="relative w-full md:w-48 h-48 md:h-auto">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {event.category}
                </span>
                {event.rsvpStatus && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.rsvpStatus === "GOING"
                        ? "bg-green-100 text-green-700"
                        : event.rsvpStatus === "INTERESTED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {event.rsvpStatus === "GOING"
                      ? "✓ Going"
                      : event.rsvpStatus === "INTERESTED"
                        ? "★ Interested"
                        : "✗ Not Going"}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {event.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">{event.description}</p>
            </div>
            <button
              onClick={() => onSelect(event)}
              className="text-blue-500 hover:text-blue-700 font-semibold text-sm whitespace-nowrap ml-4"
            >
              Details →
            </button>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-gray-200">
            <DetailItem
              icon={<CalendarIcon className="w-5 h-5" />}
              label="Date"
              value={formattedDate}
            />
            <DetailItem
              icon={<ClockIcon className="w-5 h-5" />}
              label="Time"
              value={formattedTime}
            />
            <DetailItem
              icon={<MapPinIcon className="w-5 h-5" />}
              label="Location"
              value={event.location}
            />
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-2 mb-6">
            <UserGroupIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{event.attendeeCount}</span> people
              attending
            </span>
          </div>

          {/* RSVP Buttons */}
          <div className="flex flex-wrap gap-2">
            {rsvpOptions.map((option) => (
              <button
                key={option.status}
                onClick={() =>
                  onRSVP(
                    event.id,
                    event.rsvpStatus === option.status ? null : option.status
                  )
                }
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  event.rsvpStatus === option.status
                    ? `bg-${option.color}-500 text-white`
                    : `bg-${option.color}-100 text-${option.color}-700 hover:bg-${option.color}-200`
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-blue-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-semibold uppercase">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

function EventDetailModal({
  event,
  onClose,
  onRSVP,
}: {
  event: Event;
  onClose: () => void;
  onRSVP: (eventId: string, status: "GOING" | "INTERESTED" | "NOT_GOING" | null) => void;
}) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{event.title}</h2>
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
          {event.imageUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About this event</h3>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailBox
              icon={<CalendarIcon className="w-5 h-5" />}
              label="Date"
              value={startDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <DetailBox
              icon={<ClockIcon className="w-5 h-5" />}
              label="Time"
              value={`${startDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })} - ${endDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
            />
            <DetailBox
              icon={<MapPinIcon className="w-5 h-5" />}
              label="Location"
              value={event.location}
            />
            <DetailBox
              icon={<UserGroupIcon className="w-5 h-5" />}
              label="Attendees"
              value={`${event.attendeeCount} people`}
            />
          </div>

          {/* RSVP Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your RSVP</h3>
            <div className="flex gap-3">
              <button
                onClick={() => onRSVP(event.id, "GOING")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                  event.rsvpStatus === "GOING"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                ✓ I'm Going
              </button>
              <button
                onClick={() => onRSVP(event.id, "INTERESTED")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                  event.rsvpStatus === "INTERESTED"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                ★ Interested
              </button>
              <button
                onClick={() => onRSVP(event.id, "NOT_GOING")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                  event.rsvpStatus === "NOT_GOING"
                    ? "bg-red-500 text-white"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                ✗ Not Going
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemberEventsPage() {
  return (
    <Suspense fallback={<Loading message="Loading events..." />}>
      <MemberEventsContent />
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
