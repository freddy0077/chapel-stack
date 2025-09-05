"use client";

import React, { useState } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useEventRSVPMutations } from "@/graphql/hooks/useEventRegistrationRSVP";
import { Event, RSVPStatus, CreateEventRSVPInput } from "@/graphql/types/event";
import EventTypeIcon from "./EventTypeIcon";
import { format } from "date-fns";

interface EventRSVPProps {
  event: Event;
  onClose: () => void;
  onSuccess: () => void;
}

const EventRSVP: React.FC<EventRSVPProps> = ({ event, onClose, onSuccess }) => {
  const { state } = useAuth();
  const user = state.user;
  const { createRSVP, loading } = useEventRSVPMutations();

  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>(RSVPStatus.YES);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [isGuestRSVP, setIsGuestRSVP] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const rsvpInput: CreateEventRSVPInput = {
        eventId: event.id,
        status: rsvpStatus,
        numberOfGuests,
        message: message || undefined,
        rsvpSource: "web",
      };

      if (isGuestRSVP) {
        if (!guestName || !guestEmail) {
          setError("Guest name and email are required");
          return;
        }
        rsvpInput.guestName = guestName;
        rsvpInput.guestEmail = guestEmail;
        rsvpInput.guestPhone = guestPhone || undefined;
      } else {
        if (!user?.id) {
          setError("You must be logged in to RSVP");
          return;
        }
        rsvpInput.memberId = user.id;
      }

      await createRSVP(rsvpInput);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to submit RSVP");
    }
  };

  const getRSVPStatusIcon = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.YES:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case RSVPStatus.NO:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case RSVPStatus.MAYBE:
        return <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRSVPStatusColor = (status: RSVPStatus) => {
    switch (status) {
      case RSVPStatus.YES:
        return "border-green-300 bg-green-50 text-green-800";
      case RSVPStatus.NO:
        return "border-red-300 bg-red-50 text-red-800";
      case RSVPStatus.MAYBE:
        return "border-yellow-300 bg-yellow-50 text-yellow-800";
      default:
        return "border-gray-300 bg-gray-50 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 rounded-2xl"></div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <EventTypeIcon
                eventType={event.eventType}
                size="lg"
                className="text-blue-600"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  RSVP for Event
                </h2>
                <p className="text-sm text-gray-600">{event.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Event Details */}
          <div className="bg-white/60 rounded-xl p-4 mb-6 border border-white/30">
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Date:</span>
                <span className="ml-2">
                  {format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Time:</span>
                <span className="ml-2">
                  {format(new Date(event.startDate), "h:mm a")} -{" "}
                  {format(new Date(event.endDate || event.startDate), "h:mm a")}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* RSVP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member/Guest Toggle */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="rsvpType"
                  checked={!isGuestRSVP}
                  onChange={() => setIsGuestRSVP(false)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  RSVP as Member
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="rsvpType"
                  checked={isGuestRSVP}
                  onChange={() => setIsGuestRSVP(true)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  RSVP as Guest
                </span>
              </label>
            </div>

            {/* Guest Information */}
            {isGuestRSVP && (
              <div className="bg-white/60 rounded-xl p-4 border border-white/30 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Guest Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RSVP Status Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Response
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.values(RSVPStatus).map((status) => (
                  <label
                    key={status}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      rsvpStatus === status
                        ? getRSVPStatusColor(status)
                        : "border-gray-200 bg-white/60 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rsvpStatus"
                      value={status}
                      checked={rsvpStatus === status}
                      onChange={(e) =>
                        setRsvpStatus(e.target.value as RSVPStatus)
                      }
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      {getRSVPStatusIcon(status)}
                      <span className="font-medium capitalize">
                        {status === RSVPStatus.YES
                          ? "Yes, I'll attend"
                          : status === RSVPStatus.NO
                            ? "No, I can't attend"
                            : "Maybe, I'm not sure"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Number of Guests */}
            {rsvpStatus === RSVPStatus.YES && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserGroupIcon className="h-5 w-5 inline mr-2 text-blue-600" />
                  Number of Attendees (including yourself)
                </label>
                <select
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "person" : "people"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2 text-blue-600" />
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional comments or special requirements..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit RSVP"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRSVP;
