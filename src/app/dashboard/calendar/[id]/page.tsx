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
  LinkIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Divider, Card, Metric, Text, Flex, Badge } from "@tremor/react";
import { useQuery, useMutation } from "@apollo/client";
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
import { toast } from "react-hot-toast";
import { GET_EVENT_REGISTRATIONS } from "@/graphql/queries/eventQueries";
import { APPROVE_REGISTRATION, REJECT_REGISTRATION } from "@/graphql/mutations/eventMutations";
import { useAuth } from "@/contexts/AuthContextEnhanced";

export default function EventDetail() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { event, loading, error, refetch } = useEvent(eventId);
  const { deleteEvent } = useEventMutations();
  const { state: authState } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'management'>('details');

  // Check if user has admin role
  const userRoles = authState.user?.roles || [];
  const canManageEvents = userRoles.some((role: any) => {
    const roleName = typeof role === 'string' ? role : role?.name;
    return roleName === 'ADMIN' || roleName === 'BRANCH_ADMIN';
  });

  // Fetch registrations for management tab
  const { data: registrationsData, loading: registrationsLoading, refetch: refetchRegistrations } = useQuery(
    GET_EVENT_REGISTRATIONS,
    {
      variables: { eventId },
      skip: activeTab !== 'management',
    }
  );

  const [approveRegistration] = useMutation(APPROVE_REGISTRATION);
  const [rejectRegistration] = useMutation(REJECT_REGISTRATION);

  const registrations = registrationsData?.eventRegistrations || [];
  const pendingCount = registrations.filter((r: any) => r.approvalStatus === 'PENDING').length;
  const confirmedCount = registrations.filter((r: any) => r.approvalStatus === 'APPROVED').length;

  // Generate registration link
  const registrationLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/events/register/${eventId}`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(registrationLink);
      setCopySuccess(true);
      toast.success('Registration link copied to clipboard!');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

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
      case EventType.WORSHIP_SERVICE:
        return "blue";
      case EventType.WEDDING:
        return "pink";
      case EventType.FUNERAL:
        return "gray";
      case EventType.BAPTISM:
        return "blue";
      case EventType.GRADUATION:
        return "emerald";
      case EventType.CONFERENCE:
        return "purple";
      case EventType.WORKSHOP:
        return "emerald";
      case EventType.RETREAT:
        return "indigo";
      case EventType.FELLOWSHIP:
        return "amber";
      case EventType.YOUTH_EVENT:
        return "rose";
      case EventType.CHILDREN_EVENT:
        return "pink";
      case EventType.PRAYER_MEETING:
        return "indigo";
      case EventType.BIBLE_STUDY:
        return "purple";
      case EventType.COMMUNITY_SERVICE:
        return "emerald";
      case EventType.FUNDRAISER:
        return "amber";
      case EventType.CELEBRATION:
        return "rose";
      case EventType.MEETING:
        return "amber";
      case EventType.OTHER:
        return "gray";
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
          eventType: event.eventType,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          branchId: event.branchId,
          status: event.status,
          capacity: event.capacity,
          registrationRequired: event.registrationRequired,
          registrationDeadline: event.registrationDeadline,
          isPublic: event.isPublic,
          requiresApproval: event.requiresApproval,
          isFree: event.isFree,
          ticketPrice: event.ticketPrice,
          currency: event.currency,
          organizerName: event.organizerName,
          organizerEmail: event.organizerEmail,
          organizerPhone: event.organizerPhone,
          eventImageUrl: event.eventImageUrl,
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
        <div className="sticky top-0 z-20 bg-white bg-opacity-90 backdrop-blur-md border-b border-gray-100 -mx-6 px-6 py-4 mb-8 flex justify-between items-center">
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
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`${
                activeTab === 'details'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center`}
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Event Details
            </button>
            {canManageEvents && (
              <button
                onClick={() => setActiveTab('management')}
                className={`${
                  activeTab === 'management'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center`}
              >
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Event Management
                {pendingCount > 0 && (
                  <Badge className="ml-2" color="orange">
                    {pendingCount}
                  </Badge>
                )}
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          <>
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
                  getEventTypeColor(event.eventType) === "blue"
                    ? "bg-blue-500"
                    : getEventTypeColor(event.eventType) === "purple"
                      ? "bg-purple-500"
                      : getEventTypeColor(event.eventType) === "amber"
                        ? "bg-amber-500"
                        : getEventTypeColor(event.eventType) === "emerald"
                          ? "bg-emerald-500"
                          : getEventTypeColor(event.eventType) === "indigo"
                            ? "bg-indigo-500"
                            : getEventTypeColor(event.eventType) === "rose"
                              ? "bg-rose-500"
                              : getEventTypeColor(event.eventType) === "pink"
                                ? "bg-pink-500"
                                : "bg-gray-500"
                } 
                bg-opacity-30 backdrop-blur-sm text-xs font-medium border border-white border-opacity-20`}
              >
                {event.eventType?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
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
                {event.registrationRequired && event.isPublic && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs uppercase tracking-wider text-indigo-700 font-medium flex items-center">
                        <LinkIcon className="h-4 w-4 mr-1" />
                        Public Registration Link
                      </div>
                      {copySuccess && (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Copied!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-white px-3 py-2 rounded-lg border border-indigo-200 text-sm text-gray-700 truncate">
                        {registrationLink}
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                        Copy
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-indigo-600">
                      Share this link via email, SMS, or social media for public registration
                    </div>
                  </div>
                )}
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
          </>
        ) : (
          <EventManagementTab
            eventId={eventId}
            registrations={registrations}
            loading={registrationsLoading}
            onApprove={async (id: string) => {
              try {
                await approveRegistration({ variables: { id } });
                toast.success('Registration approved!');
                refetchRegistrations();
              } catch (err: any) {
                toast.error(err.message || 'Failed to approve');
              }
            }}
            onReject={async (id: string, reason: string) => {
              try {
                await rejectRegistration({ variables: { id, reason } });
                toast.success('Registration rejected');
                refetchRegistrations();
              } catch (err: any) {
                toast.error(err.message || 'Failed to reject');
              }
            }}
          />
        )}
      </div>
    </>
  );
}

// Event Management Tab Component
interface EventManagementTabProps {
  eventId: string;
  registrations: any[];
  loading: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

function EventManagementTab({
  eventId,
  registrations,
  loading,
  onApprove,
  onReject,
}: EventManagementTabProps) {
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (loading) {
    return <Loading />;
  }

  const pendingRegistrations = registrations.filter((r) => r.approvalStatus === 'PENDING');
  const confirmedRegistrations = registrations.filter((r) => r.approvalStatus === 'APPROVED');
  const totalRevenue = registrations
    .filter((r) => r.paymentStatus === 'completed')
    .reduce((sum, r) => sum + (parseFloat(r.amountPaid || '0')), 0);

  const handleReject = async () => {
    if (!selectedRegistration || !rejectionReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    await onReject(selectedRegistration.id, rejectionReason);
    setShowRejectModal(false);
    setSelectedRegistration(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards - Matching Event Details Aesthetic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-600 font-medium mb-2">
                Total Registrations
              </div>
              <div className="text-3xl font-bold text-blue-900">{registrations.length}</div>
            </div>
            <div className="rounded-full p-4 bg-blue-100">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 border border-amber-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-600 font-medium mb-2">
                Pending Approvals
              </div>
              <div className="text-3xl font-bold text-amber-900">{pendingRegistrations.length}</div>
            </div>
            <div className="rounded-full p-4 bg-amber-100">
              <ClockIcon className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-green-600 font-medium mb-2">
                Confirmed
              </div>
              <div className="text-3xl font-bold text-green-900">{confirmedRegistrations.length}</div>
            </div>
            <div className="rounded-full p-4 bg-green-100">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-600 font-medium mb-2">
                Revenue
              </div>
              <div className="text-3xl font-bold text-emerald-900">GHS {totalRevenue.toFixed(2)}</div>
            </div>
            <div className="rounded-full p-4 bg-emerald-100">
              <CurrencyDollarIcon className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals - Enhanced Design */}
      {pendingRegistrations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="w-1.5 h-5 bg-amber-500 rounded-full mr-3"></span>
              Pending Approvals
              <span className="ml-3 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                {pendingRegistrations.length}
              </span>
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingRegistrations.map((reg: any) => (
              <div key={reg.id} className="p-6 hover:bg-gray-50/50 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-4 text-white shadow-md">
                      <span className="text-sm font-bold">
                        {reg.member
                          ? `${reg.member.firstName[0]}${reg.member.lastName[0]}`
                          : reg.guestName?.[0] || 'G'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900">
                        {reg.member
                          ? `${reg.member.firstName} ${reg.member.lastName}`
                          : reg.guestName}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                        {reg.member?.email || reg.guestEmail}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-1.5 text-indigo-500" />
                          {format(new Date(reg.registrationDate), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <UserGroupIcon className="h-4 w-4 mr-1.5 text-purple-500" />
                          {reg.numberOfGuests || 0} guests
                        </div>
                        {reg.amountPaid && (
                          <div className="flex items-center text-sm font-medium text-green-600">
                            <CurrencyDollarIcon className="h-4 w-4 mr-1.5" />
                            GHS {parseFloat(reg.amountPaid).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 ml-6">
                    <button
                      onClick={() => onApprove(reg.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 text-sm font-medium flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRegistration(reg);
                        setShowRejectModal(true);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 text-sm font-medium flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Registrations - Enhanced Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/60">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full mr-3"></span>
            All Registrations
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <UserGroupIcon className="h-12 w-12 mb-3 text-gray-300" />
                      <p className="text-gray-500 font-medium">No registrations yet</p>
                      <p className="text-sm text-gray-400 mt-1">Registrations will appear here once people sign up</p>
                    </div>
                  </td>
                </tr>
              ) : (
                registrations.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 text-white shadow-sm">
                          <span className="text-xs font-bold">
                            {reg.member
                              ? `${reg.member.firstName[0]}${reg.member.lastName[0]}`
                              : reg.guestName?.[0] || 'G'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reg.member
                              ? `${reg.member.firstName} ${reg.member.lastName}`
                              : reg.guestName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {reg.member?.email || reg.guestEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          reg.memberId
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {reg.memberId ? 'Member' : 'Guest'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(reg.registrationDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reg.numberOfGuests || 0}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          reg.approvalStatus === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : reg.approvalStatus === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            reg.approvalStatus === 'APPROVED'
                              ? 'bg-green-500'
                              : reg.approvalStatus === 'PENDING'
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                        ></span>
                        {reg.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          reg.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : reg.paymentStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {reg.paymentStatus || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {reg.amountPaid ? `GHS ${parseFloat(reg.amountPaid).toFixed(2)}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal - Enhanced Design */}
      {showRejectModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="rounded-full p-3 bg-red-100 mr-4">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Reject Registration</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 pl-16">
              You are about to reject the registration for{' '}
              <span className="font-semibold text-gray-900">
                {selectedRegistration.member
                  ? `${selectedRegistration.member.firstName} ${selectedRegistration.member.lastName}`
                  : selectedRegistration.guestName}
              </span>
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              placeholder="Please provide a reason for rejection..."
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRegistration(null);
                  setRejectionReason('');
                }}
                className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
