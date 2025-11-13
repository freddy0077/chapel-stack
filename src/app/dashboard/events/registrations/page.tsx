"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@tremor/react";
import DashboardHeader from "@/components/DashboardHeader";
import Loading from "@/components/ui/Loading";
import { GET_EVENT_REGISTRATIONS_FILTERED } from "@/graphql/queries/eventQueries";
import { GET_EVENTS } from "@/graphql/queries/eventQueries";
import { format } from "date-fns";

export default function RegistrationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);

  // Fetch all events for filter
  const { data: eventsData } = useQuery(GET_EVENTS);
  const events = eventsData?.events || [];

  // Fetch all registrations
  const { data, loading, error, refetch } = useQuery(GET_EVENT_REGISTRATIONS_FILTERED, {
    variables: { filter: {} },
    fetchPolicy: "cache-and-network",
  });

  const registrations = data?.eventRegistrations || [];

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration: any) => {
      // Event filter
      if (selectedEvent !== "all" && registration.eventId !== selectedEvent) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all" && registration.status !== selectedStatus) {
        return false;
      }

      // Type filter (Member vs Guest)
      if (selectedType === "member" && !registration.memberId) return false;
      if (selectedType === "guest" && registration.memberId) return false;

      // Payment status filter
      if (
        selectedPaymentStatus !== "all" &&
        registration.paymentStatus !== selectedPaymentStatus
      ) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const memberName = registration.member
          ? `${registration.member.firstName} ${registration.member.lastName}`.toLowerCase()
          : "";
        const guestName = registration.guestName?.toLowerCase() || "";
        const guestEmail = registration.guestEmail?.toLowerCase() || "";

        return (
          memberName.includes(searchLower) ||
          guestName.includes(searchLower) ||
          guestEmail.includes(searchLower)
        );
      }

      return true;
    });
  }, [registrations, selectedEvent, selectedStatus, selectedType, selectedPaymentStatus, searchTerm]);

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Phone", "Event", "Type", "Guests", "Status", "Payment Status", "Amount", "Date"];
    const rows = filteredRegistrations.map((reg: any) => [
      reg.member ? `${reg.member.firstName} ${reg.member.lastName}` : reg.guestName,
      reg.member?.email || reg.guestEmail || "",
      reg.member?.phoneNumber || reg.guestPhone || "",
      reg.event?.title || "",
      reg.memberId ? "Member" : "Guest",
      reg.numberOfGuests || 0,
      reg.status || "",
      reg.paymentStatus || "N/A",
      reg.amountPaid || 0,
      format(new Date(reg.registrationDate), "yyyy-MM-dd HH:mm"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event-registrations-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading registrations: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Event Registrations"
        subtitle={`${filteredRegistrations.length} registration${filteredRegistrations.length !== 1 ? "s" : ""} found`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
              {(selectedEvent !== "all" || selectedStatus !== "all" || selectedType !== "all" || selectedPaymentStatus !== "all") && (
                <Badge className="ml-2">Active</Badge>
              )}
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Event Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                {events.map((event: any) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="ATTENDED">Attended</option>
                <option value="NO_SHOW">No Show</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="member">Members Only</option>
                <option value="guest">Guests Only</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payment Statuses</option>
                <option value="completed">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        )}

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((registration: any) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.member
                            ? `${registration.member.firstName} ${registration.member.lastName}`
                            : registration.guestName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.member?.email || registration.guestEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.event?.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(registration.registrationDate), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={registration.memberId ? "blue" : "gray"}>
                          {registration.memberId ? "Member" : "Guest"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.numberOfGuests || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          color={
                            registration.status === "CONFIRMED"
                              ? "green"
                              : registration.status === "PENDING"
                                ? "yellow"
                                : registration.status === "ATTENDED"
                                  ? "emerald"
                                  : "gray"
                          }
                        >
                          {registration.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          color={
                            registration.paymentStatus === "completed"
                              ? "green"
                              : registration.paymentStatus === "pending"
                                ? "yellow"
                                : registration.paymentStatus === "failed"
                                  ? "red"
                                  : "gray"
                          }
                        >
                          {registration.paymentStatus || "N/A"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.amountPaid
                          ? `GHS ${parseFloat(registration.amountPaid).toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedRegistration(registration)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <EyeIcon className="h-5 w-5 inline" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <EnvelopeIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination (placeholder for future) */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </div>
        </div>
      </div>

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <RegistrationDetailsModal
          registration={selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          onRefresh={refetch}
        />
      )}
    </div>
  );
}

// Registration Details Modal Component
interface RegistrationDetailsModalProps {
  registration: any;
  onClose: () => void;
  onRefresh: () => void;
}

function RegistrationDetailsModal({
  registration,
  onClose,
  onRefresh,
}: RegistrationDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Registration Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Registrant Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              👤 Registrant Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">
                    {registration.member
                      ? `${registration.member.firstName} ${registration.member.lastName}`
                      : registration.guestName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <Badge color={registration.memberId ? "blue" : "gray"}>
                    {registration.memberId ? "Church Member" : "Guest"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">
                    {registration.member?.email || registration.guestEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">
                    {registration.member?.phoneNumber || registration.guestPhone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🎟️ Event Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div>
                <p className="text-sm text-gray-600">Event</p>
                <p className="font-medium">{registration.event?.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Number of Guests</p>
                <p className="font-medium">{registration.numberOfGuests || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registration Date</p>
                <p className="font-medium">
                  {format(new Date(registration.registrationDate), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {registration.amountPaid && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💰 Payment Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium">
                      GHS {parseFloat(registration.amountPaid).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge
                      color={
                        registration.paymentStatus === "completed"
                          ? "green"
                          : registration.paymentStatus === "pending"
                            ? "yellow"
                            : "red"
                      }
                    >
                      {registration.paymentStatus}
                    </Badge>
                  </div>
                  {registration.paymentMethod && (
                    <div>
                      <p className="text-sm text-gray-600">Method</p>
                      <p className="font-medium">{registration.paymentMethod}</p>
                    </div>
                  )}
                  {registration.transactionId && (
                    <div>
                      <p className="text-sm text-gray-600">Transaction ID</p>
                      <p className="font-medium text-xs">{registration.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(registration.specialRequests || registration.notes) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📝 Additional Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {registration.specialRequests && (
                  <div>
                    <p className="text-sm text-gray-600">Special Requests</p>
                    <p className="font-medium">{registration.specialRequests}</p>
                  </div>
                )}
                {registration.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-medium">{registration.notes}</p>
                  </div>
                )}
                {registration.registrationSource && (
                  <div>
                    <p className="text-sm text-gray-600">Registration Source</p>
                    <Badge>{registration.registrationSource}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <EnvelopeIcon className="h-5 w-5 inline mr-2" />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
