"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Divider } from "@tremor/react";
import { useEvent, useEventMutations } from "@/graphql/hooks/useEvents";
import {
  EventType,
  EventStatus,
  EventRegistration,
  EventRegistrationStatus,
} from "@/graphql/types/event";
import Loading from "@/components/ui/Loading";
import EditEventModal from "@/components/EditEventModal";
import { EventNotesModal } from "@/components/events/EventNotesModal";

export default function EventDetail() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { event, loading, error, refetch } = useEvent(eventId);
  const { deleteEvent } = useEventMutations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);

  // Defensive date formatting
  const formatEventDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return format(date, "MMM d, yyyy");
  };
  const formatEventTime = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return format(date, "h:mm a");
  };
  const getEventTimeRange = (
    startDateTime: string | Date | null | undefined,
    endDateTime: string | Date | null | undefined,
  ) => {
    if (!startDateTime || !endDateTime) return "-";
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-";
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  // Helper function to check if event has ended
  const isEventEnded = (endDate: string | Date | null | undefined) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return false;
    return end < new Date();
  };
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case EventType.SERVICE:
        return "blue";
      case EventType.MEETING:
        return "amber";
      case EventType.CONFERENCE:
        return "purple";
      case EventType.WORKSHOP:
        return "emerald";
      case EventType.RETREAT:
        return "indigo";
      case EventType.OUTREACH:
        return "rose";
      case EventType.SOCIAL:
        return "pink";
      default:
        return "gray";
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case EventStatus.PUBLISHED:
        return "green";
      case EventStatus.DRAFT:
        return "yellow";
      case EventStatus.CANCELLED:
        return "red";
      case EventStatus.COMPLETED:
        return "blue";
      default:
        return "gray";
    }
  };
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        setIsDeleting(true);
        await deleteEvent(eventId);
        router.push("/dashboard/calendar");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  if (loading) return <Loading message="Loading event details..." />;
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">
            Error Loading Event
          </h3>
          <p className="mt-2 text-sm text-red-700">
            {error.message || "An unknown error occurred"}
          </p>
          <div className="mt-4">
            <Link
              href="/dashboard/calendar"
              className="inline-flex items-center px-4 py-2 rounded-md bg-white text-red-700 border border-red-300 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Calendar
            </Link>
          </div>
        </div>
      </div>
    );
  }
  if (!event) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800">
            Event Not Found
          </h3>
          <p className="mt-2 text-sm text-yellow-700">
            The event you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <div className="mt-4">
            <Link
              href="/dashboard/calendar"
              className="inline-flex items-center px-4 py-2 rounded-md bg-white text-yellow-700 border border-yellow-300 text-sm font-medium hover:bg-yellow-50 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Calendar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <EditEventModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        event={{
          id: event.id,
          title: event.title,
          description: event.description,
          category: event.category,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          branchId: event.branchId,
        }}
        onEventUpdated={refetch}
      />
      <EventNotesModal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        eventId={event.id}
        eventTitle={event.title}
        existingNotes={event.postEventNotes || ""}
      />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Navigation and Actions Header */}
        <div className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-md border-b border-gray-100 -mx-6 px-6 py-4 mb-8 flex justify-between items-center">
          <Link
            href="/dashboard/calendar"
            className="flex items-center group transition-all duration-300"
          >
            <div className="bg-gray-100 group-hover:bg-indigo-100 rounded-full p-2 mr-3 transition-all duration-300">
              <ArrowLeftIcon className="h-5 w-5 text-gray-500 group-hover:text-indigo-600 transition-all duration-300" />
            </div>
            <span className="text-gray-600 group-hover:text-indigo-600 font-medium transition-all duration-300">
              Back to Calendar
            </span>
          </Link>
          <div className="flex space-x-3">
            {isEventEnded(event.endDate) && (
              <button
                type="button"
                onClick={() => setNotesModalOpen(true)}
                className="flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-green-600 font-medium transition-all duration-300"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                {event.postEventNotes ? "Edit Notes" : "Add Notes"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 font-medium transition-all duration-300"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 font-medium transition-all duration-300 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
        {/* Event Header */}
        <div className="relative mb-8 overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90"></div>
          <div className="relative px-8 py-12 text-white">
            <div className="flex flex-wrap gap-3 mb-4">
              <div
                className={`px-3 py-1 rounded-full ${
                  getStatusColor(event.status) === "green"
                    ? "bg-green-500"
                    : getStatusColor(event.status) === "yellow"
                      ? "bg-yellow-500"
                      : getStatusColor(event.status) === "red"
                        ? "bg-red-500"
                        : getStatusColor(event.status) === "blue"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                } 
                bg-opacity-30 backdrop-blur-sm text-xs font-medium border border-white border-opacity-20`}
              >
                {event.status}
              </div>
              <div
                className={`px-3 py-1 rounded-full ${
                  getEventTypeColor(event.type) === "blue"
                    ? "bg-blue-500"
                    : getEventTypeColor(event.type) === "purple"
                      ? "bg-purple-500"
                      : getEventTypeColor(event.type) === "amber"
                        ? "bg-amber-500"
                        : getEventTypeColor(event.type) === "emerald"
                          ? "bg-emerald-500"
                          : getEventTypeColor(event.type) === "indigo"
                            ? "bg-indigo-500"
                            : getEventTypeColor(event.type) === "rose"
                              ? "bg-rose-500"
                              : getEventTypeColor(event.type) === "pink"
                                ? "bg-pink-500"
                                : "bg-gray-500"
                } 
                bg-opacity-30 backdrop-blur-sm text-xs font-medium border border-white border-opacity-20`}
              >
                {event.type}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
            {event.description && (
              <p className="text-white text-opacity-90 max-w-2xl text-lg">
                {event.description}
              </p>
            )}
          </div>
        </div>
        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-1.5 h-5 bg-indigo-500 rounded-full mr-3"></span>
                  Event Details
                </h3>
                <div className="text-sm text-gray-500">
                  Created {formatEventDate(event.createdAt)}
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl bg-gray-50/70 p-4 flex items-center hover:shadow-md transition-all duration-300">
                    <div className="rounded-full p-3 bg-indigo-100 mr-4">
                      <CalendarIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                        Date
                      </div>
                      <div className="font-medium text-gray-900">
                        {formatEventDate(event.startDate)}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50/70 p-4 flex items-center hover:shadow-md transition-all duration-300">
                    <div className="rounded-full p-3 bg-purple-100 mr-4">
                      <ClockIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                        Time
                      </div>
                      <div className="font-medium text-gray-900">
                        {getEventTimeRange(event.startDate, event.endDate)}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50/70 p-4 flex items-center hover:shadow-md transition-all duration-300">
                    <div className="rounded-full p-3 bg-emerald-100 mr-4">
                      <MapPinIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                        Location
                      </div>
                      <div className="font-medium text-gray-900">
                        {event.location || "No location specified"}
                      </div>
                    </div>
                  </div>
                  {event.capacity && (
                    <div className="rounded-xl bg-gray-50/70 p-4 flex items-center hover:shadow-md transition-all duration-300">
                      <div className="rounded-full p-3 bg-amber-100 mr-4">
                        <UserGroupIcon className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                          Capacity
                        </div>
                        <div className="font-medium text-gray-900">
                          {event.capacity} people
                        </div>
                      </div>
                    </div>
                  )}
                  {event.branch && (
                    <div className="rounded-xl bg-gray-50/70 p-4 flex items-center hover:shadow-md transition-all duration-300">
                      <div className="rounded-full p-3 bg-blue-100 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                          Branch
                        </div>
                        <div className="font-medium text-gray-900">
                          {event.branch.name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/60">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-1.5 h-5 bg-indigo-500 rounded-full mr-3"></span>
                Registration Details
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                <div className="bg-gray-50/70 p-4 rounded-xl">
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Registration Required
                  </div>
                  <div className="font-medium text-gray-900 flex items-center">
                    {event.registrationRequired ? (
                      <>
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Yes
                      </>
                    ) : (
                      <>
                        <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                        No
                      </>
                    )}
                  </div>
                </div>
                {event.registrationRequired && event.registrationDeadline && (
                  <div className="bg-gray-50/70 p-4 rounded-xl">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                      Registration Deadline
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatEventDate(event.registrationDeadline)}
                    </div>
                  </div>
                )}
                {event.isRecurring && (
                  <div className="bg-gray-50/70 p-4 rounded-xl">
                    <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                      Recurring Event
                    </div>
                    <div className="font-medium text-gray-900">
                      Yes - {event.recurrencePattern}
                    </div>
                  </div>
                )}
                <Divider />
                <div className="p-4 rounded-xl">
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Last Updated
                  </div>
                  <div className="font-medium text-gray-900">
                    {formatEventDate(event.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post-Event Notes Section */}
        {event.postEventNotes && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-1.5 h-5 bg-green-500 rounded-full mr-3"></span>
                  Post-Event Notes
                </h3>
                <div className="text-sm text-gray-500 flex items-center">
                  {event.postEventNotesAuthor && (
                    <span className="mr-2">
                      By {event.postEventNotesAuthor.firstName}{" "}
                      {event.postEventNotesAuthor.lastName}
                    </span>
                  )}
                  {event.postEventNotesDate && (
                    <span>on {formatEventDate(event.postEventNotesDate)}</span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {event.postEventNotes}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registrations Section */}
        {event.registrationRequired &&
          event.registrations &&
          event.registrations.length > 0 && (
            <div className="mt-10">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="w-1.5 h-5 bg-indigo-500 rounded-full mr-3"></span>
                    Registrations
                  </h3>
                  <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {event.registrations.length}{" "}
                    {event.registrations.length === 1 ? "person" : "people"}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Member
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Registration Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Check In
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Check Out
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {event.registrations.map(
                        (registration: EventRegistration) => (
                          <tr
                            key={registration.id}
                            className="hover:bg-gray-50/50 transition-colors duration-200"
                          >
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 text-white shadow-sm">
                                  <span className="text-xs font-bold">
                                    {registration.member.firstName[0]}
                                    {registration.member.lastName[0]}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {registration.member.firstName}{" "}
                                    {registration.member.lastName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {registration.member.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  registration.status ===
                                  EventRegistrationStatus.APPROVED
                                    ? "bg-green-100 text-green-800"
                                    : registration.status ===
                                        EventRegistrationStatus.PENDING
                                      ? "bg-amber-100 text-amber-800"
                                      : registration.status ===
                                          EventRegistrationStatus.CANCELLED
                                        ? "bg-red-100 text-red-800"
                                        : registration.status ===
                                            EventRegistrationStatus.ATTENDING
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                    registration.status ===
                                    EventRegistrationStatus.APPROVED
                                      ? "bg-green-500"
                                      : registration.status ===
                                          EventRegistrationStatus.PENDING
                                        ? "bg-amber-500"
                                        : registration.status ===
                                            EventRegistrationStatus.CANCELLED
                                          ? "bg-red-500"
                                          : registration.status ===
                                              EventRegistrationStatus.ATTENDING
                                            ? "bg-blue-500"
                                            : "bg-gray-500"
                                  }`}
                                ></span>
                                {registration.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                              {registration.registrationDate
                                ? formatEventDate(registration.registrationDate)
                                : "-"}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                              {registration.checkInTime
                                ? formatEventTime(registration.checkInTime)
                                : "-"}
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                              {registration.checkOutTime
                                ? formatEventTime(registration.checkOutTime)
                                : "-"}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
}
