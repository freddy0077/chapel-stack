"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@tremor/react";
import DashboardHeader from "@/components/DashboardHeader";
import Loading from "@/components/ui/Loading";
import { GET_EVENT_REGISTRATIONS_FILTERED } from "@/graphql/queries/eventQueries";
import { APPROVE_REGISTRATION, REJECT_REGISTRATION } from "@/graphql/mutations/eventMutations";
import { format } from "date-fns";

export default function PendingApprovalsPage() {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);

  // Fetch pending registrations
  const { data, loading, error, refetch } = useQuery(GET_EVENT_REGISTRATIONS_FILTERED, {
    variables: { filter: { approvalStatus: "PENDING" } },
    fetchPolicy: "cache-and-network",
  });

  const [approveRegistration, { loading: approving }] = useMutation(APPROVE_REGISTRATION);
  const [rejectRegistration, { loading: rejecting }] = useMutation(REJECT_REGISTRATION);

  const pendingRegistrations = data?.eventRegistrations || [];

  const handleApprove = async (registrationId: string) => {
    try {
      await approveRegistration({
        variables: { id: registrationId },
      });
      toast.success("Registration approved successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to approve registration");
    }
  };

  const handleReject = async () => {
    if (!selectedRegistration) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await rejectRegistration({
        variables: {
          id: selectedRegistration.id,
          reason: rejectionReason,
        },
      });
      toast.success("Registration rejected");
      setShowRejectModal(false);
      setSelectedRegistration(null);
      setRejectionReason("");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to reject registration");
    }
  };

  const openRejectModal = (registration: any) => {
    setSelectedRegistration(registration);
    setShowRejectModal(true);
  };

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading pending approvals: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Pending Approvals"
        subtitle={`${pendingRegistrations.length} registration${pendingRegistrations.length !== 1 ? "s" : ""} awaiting approval`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pendingRegistrations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-600">
              There are no pending registrations requiring approval.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRegistrations.map((registration: any) => (
              <div
                key={registration.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Left side - Registration Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <ClockIcon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {registration.member
                              ? `${registration.member.firstName} ${registration.member.lastName}`
                              : registration.guestName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {registration.event?.title}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {/* Contact Info */}
                        <div className="flex items-center text-sm text-gray-600">
                          <EnvelopeIcon className="h-4 w-4 mr-2" />
                          {registration.member?.email || registration.guestEmail || "N/A"}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          {registration.member?.phoneNumber || registration.guestPhone || "N/A"}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <UserIcon className="h-4 w-4 mr-2" />
                          {registration.numberOfGuests || 0} guest{registration.numberOfGuests !== 1 ? "s" : ""}
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge color={registration.memberId ? "blue" : "gray"}>
                            {registration.memberId ? "Member" : "Guest"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Registered {format(new Date(registration.registrationDate), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>

                        {registration.specialRequests && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Special Requests:
                            </p>
                            <p className="text-sm text-gray-600">
                              {registration.specialRequests}
                            </p>
                          </div>
                        )}

                        {registration.amountPaid && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              Payment: <span className="font-semibold text-green-600">
                                GHS {parseFloat(registration.amountPaid).toFixed(2)}
                              </span>
                              {registration.paymentStatus && (
                                <Badge className="ml-2" color={
                                  registration.paymentStatus === "completed" ? "green" : "yellow"
                                }>
                                  {registration.paymentStatus}
                                </Badge>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => handleApprove(registration.id)}
                        disabled={approving}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        {approving ? "Approving..." : "Approve"}
                      </button>
                      <button
                        onClick={() => openRejectModal(registration)}
                        disabled={rejecting}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Reject Registration
                </h3>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                You are about to reject the registration for{" "}
                <span className="font-semibold">
                  {selectedRegistration.member
                    ? `${selectedRegistration.member.firstName} ${selectedRegistration.member.lastName}`
                    : selectedRegistration.guestName}
                </span>
                . Please provide a reason that will be sent to the registrant.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Event is at full capacity, Registration deadline has passed, etc."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedRegistration(null);
                    setRejectionReason("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={rejecting || !rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rejecting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
