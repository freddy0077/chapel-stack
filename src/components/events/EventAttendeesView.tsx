import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import {
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { GET_EVENT_REGISTRATIONS_FILTERED } from "../../graphql/queries/eventQueries";
import { GET_EVENT_REGISTRATION_STATS } from "../../graphql/mutations/eventMutations";
import { EventRegistrationStatus } from "../../graphql/types/event";
import { Badge } from "@tremor/react";

interface EventAttendeesViewProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  onClose: () => void;
}

const EventAttendeesView: React.FC<EventAttendeesViewProps> = ({
  eventId,
  eventTitle,
  eventDate,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    EventRegistrationStatus | "ALL"
  >("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch event registrations
  const {
    data: registrationsData,
    loading,
    error,
    refetch,
  } = useQuery(GET_EVENT_REGISTRATIONS_FILTERED, {
    variables: { filter: { eventId } },
    fetchPolicy: "cache-and-network",
  });

  // Fetch event registration stats
  const { data: statsData } = useQuery(GET_EVENT_REGISTRATION_STATS, {
    variables: { eventId },
    fetchPolicy: "cache-and-network",
  });

  const registrations = registrationsData?.eventRegistrations || [];
  const stats = statsData?.eventRegistrationStats
    ? JSON.parse(statsData.eventRegistrationStats)
    : null;

  // Filter and search registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      // Status filter
      if (statusFilter !== "ALL" && registration.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const memberName = registration.member
          ? `${registration.member.firstName} ${registration.member.lastName}`.toLowerCase()
          : "";
        const guestName = registration.guestName?.toLowerCase() || "";

        return (
          memberName.includes(searchLower) ||
          guestName.includes(searchLower) ||
          registration.guestEmail?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [registrations, statusFilter, searchTerm]);

  const getStatusColor = (status: EventRegistrationStatus) => {
    switch (status) {
      case EventRegistrationStatus.REGISTERED:
        return "bg-blue-100 text-blue-800";
      case EventRegistrationStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case EventRegistrationStatus.ATTENDED:
        return "bg-emerald-100 text-emerald-800";
      case EventRegistrationStatus.NO_SHOW:
        return "bg-red-100 text-red-800";
      case EventRegistrationStatus.CANCELLED:
        return "bg-gray-100 text-gray-800";
      case EventRegistrationStatus.WAITLISTED:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: EventRegistrationStatus) => {
    switch (status) {
      case EventRegistrationStatus.ATTENDED:
        return <CheckCircleIcon className="h-4 w-4 text-emerald-600" />;
      case EventRegistrationStatus.NO_SHOW:
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case EventRegistrationStatus.WAITLISTED:
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      default:
        return <UserGroupIcon className="h-4 w-4 text-blue-600" />;
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Status",
      "Registration Date",
      "Check-in Time",
      "Guests",
      "Special Requests",
    ];
    const csvData = filteredRegistrations.map((reg) => [
      reg.member
        ? `${reg.member.firstName} ${reg.member.lastName}`
        : reg.guestName || "",
      reg.member?.email || reg.guestEmail || "",
      reg.guestPhone || "",
      reg.status,
      format(new Date(reg.registrationDate), "yyyy-MM-dd HH:mm"),
      reg.checkInTime
        ? format(new Date(reg.checkInTime), "yyyy-MM-dd HH:mm")
        : "",
      reg.numberOfGuests?.toString() || "0",
      reg.specialRequests || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle.replace(/[^a-zA-Z0-9]/g, "_")}_attendees.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{eventTitle}</h2>
              <p className="text-blue-100">
                {format(new Date(eventDate), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <span className="sr-only">Close</span>✕
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.attended}
                </div>
                <div className="text-sm text-gray-600">Attended</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.waitlisted}
                </div>
                <div className="text-sm text-gray-600">Waitlisted</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.noShow}
                </div>
                <div className="text-sm text-gray-600">No Show</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalGuests}
                </div>
                <div className="text-sm text-gray-600">Guests</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {stats.checkedIn}
                </div>
                <div className="text-sm text-gray-600">Checked In</div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="px-6 py-4 border-b bg-white">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FunnelIcon className="h-4 w-4 inline mr-2" />
                Filters
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <DocumentArrowDownIcon className="h-4 w-4 inline mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as EventRegistrationStatus | "ALL",
                      )
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value={EventRegistrationStatus.REGISTERED}>
                      Registered
                    </option>
                    <option value={EventRegistrationStatus.CONFIRMED}>
                      Confirmed
                    </option>
                    <option value={EventRegistrationStatus.ATTENDED}>
                      Attended
                    </option>
                    <option value={EventRegistrationStatus.NO_SHOW}>
                      No Show
                    </option>
                    <option value={EventRegistrationStatus.CANCELLED}>
                      Cancelled
                    </option>
                    <option value={EventRegistrationStatus.WAITLISTED}>
                      Waitlisted
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attendees List */}
        <div className="flex-1 overflow-y-auto">
          {error ? (
            <div className="p-6 text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600">
                Error loading attendees: {error.message}
              </p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center">
              <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Attendees Found
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "ALL"
                  ? "No attendees match your current filters."
                  : "No one has registered for this event yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(registration.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {registration.member
                              ? `${registration.member.firstName} ${registration.member.lastName}`
                              : registration.guestName || "Unknown"}
                          </p>
                          {!registration.member && (
                            <Badge color="gray" size="xs">
                              Guest
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {registration.member?.email ||
                              registration.guestEmail ||
                              "No email"}
                          </p>
                          {registration.numberOfGuests > 0 && (
                            <p className="text-sm text-gray-500">
                              <UserPlusIcon className="h-3 w-3 inline mr-1" />+
                              {registration.numberOfGuests} guests
                            </p>
                          )}
                        </div>
                        {registration.checkInTime && (
                          <p className="text-xs text-green-600 mt-1">
                            Checked in:{" "}
                            {format(
                              new Date(registration.checkInTime),
                              "MMM d, h:mm a",
                            )}
                          </p>
                        )}
                        {registration.specialRequests && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            "{registration.specialRequests}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={getStatusColor(registration.status)}
                        size="sm"
                      >
                        {registration.status.replace("_", " ")}
                      </Badge>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Registered:{" "}
                          {format(
                            new Date(registration.registrationDate),
                            "MMM d",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {filteredRegistrations.length} of {registrations.length}{" "}
              attendees
            </span>
            <button
              onClick={() => refetch()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAttendeesView;
