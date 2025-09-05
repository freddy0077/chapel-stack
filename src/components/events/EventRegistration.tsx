"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useEventRegistrationMutations } from "@/graphql/hooks/useEventRegistrationRSVP";
import { Event, CreateEventRegistrationInput } from "@/graphql/types/event";
import EventTypeIcon from "./EventTypeIcon";
import { format } from "date-fns";

interface EventRegistrationProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  event: Event | null;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({
  open,
  onClose,
  onSuccess,
  event,
}) => {
  const { state } = useAuth();
  const user = state.user;
  const { createRegistration, loading } = useEventRegistrationMutations();

  const [isGuest, setIsGuest] = useState(!user);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    numberOfGuests: 1,
    specialRequests: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);

  if (!open || !event) return null;

  const isDeadlinePassed =
    event.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline);
  const isCapacityFull =
    event.capacity && (event.eventRegistrations?.length || 0) >= event.capacity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!event.registrationRequired) {
      setError("This event does not require registration");
      return;
    }

    if (isDeadlinePassed) {
      setError("Registration deadline has passed");
      return;
    }

    if (isCapacityFull) {
      setError("Event is at full capacity");
      return;
    }

    try {
      const registrationInput: CreateEventRegistrationInput = {
        eventId: event.id,
        numberOfGuests: formData.numberOfGuests,
        specialRequests: formData.specialRequests || undefined,
        notes: formData.notes || undefined,
        registrationSource: "web",
      };

      if (isGuest) {
        if (!formData.guestName || !formData.guestEmail) {
          setError("Guest name and email are required");
          return;
        }
        registrationInput.guestName = formData.guestName;
        registrationInput.guestEmail = formData.guestEmail;
        registrationInput.guestPhone = formData.guestPhone || undefined;
      } else {
        if (!user?.id) {
          setError("You must be logged in to register");
          return;
        }
        registrationInput.memberId = user.id;
      }

      await createRegistration(registrationInput);
      toast.success("Registration successful!");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
                  Event Registration
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
                <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">Date:</span>
                <span className="ml-2">
                  {format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">Time:</span>
                <span className="ml-2">
                  {format(new Date(event.startDate), "h:mm a")} -{" "}
                  {format(new Date(event.endDate || event.startDate), "h:mm a")}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2 text-emerald-500" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{event.location}</span>
                </div>
              )}
              {event.capacity && (
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="font-medium">Capacity:</span>
                  <span className="ml-2">
                    {event.eventRegistrations?.length || 0} / {event.capacity}{" "}
                    registered
                  </span>
                </div>
              )}
              {!event.isFree && event.ticketPrice && (
                <div className="flex items-center text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span className="font-medium">Price:</span>
                  <span className="ml-2">
                    {event.currency || "$"}
                    {event.ticketPrice}
                  </span>
                </div>
              )}
              {event.registrationDeadline && (
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="font-medium">Registration Deadline:</span>
                  <span className="ml-2">
                    {format(
                      new Date(event.registrationDeadline),
                      "MMMM d, yyyy h:mm a",
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Registration Status Checks */}
          {isDeadlinePassed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm font-medium">
                Registration deadline has passed
              </p>
            </div>
          )}

          {isCapacityFull && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm font-medium">
                Event is at full capacity
              </p>
            </div>
          )}

          {!event.registrationRequired && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm font-medium">
                This event does not require registration
              </p>
            </div>
          )}

          {/* Registration Form */}
          {event.registrationRequired &&
            !isDeadlinePassed &&
            !isCapacityFull && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Member/Guest Toggle */}
                {user && (
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registrationType"
                        checked={!isGuest}
                        onChange={() => setIsGuest(false)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Register as Member
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="registrationType"
                        checked={isGuest}
                        onChange={() => setIsGuest(true)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Register as Guest
                      </span>
                    </label>
                  </div>
                )}

                {/* Guest Information */}
                {isGuest && (
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
                          value={formData.guestName}
                          onChange={(e) =>
                            handleInputChange("guestName", e.target.value)
                          }
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
                            value={formData.guestEmail}
                            onChange={(e) =>
                              handleInputChange("guestEmail", e.target.value)
                            }
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
                            value={formData.guestPhone}
                            onChange={(e) =>
                              handleInputChange("guestPhone", e.target.value)
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserGroupIcon className="h-5 w-5 inline mr-2 text-blue-600" />
                    Number of Attendees (including yourself)
                  </label>
                  <select
                    value={formData.numberOfGuests}
                    onChange={(e) =>
                      handleInputChange(
                        "numberOfGuests",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DocumentTextIcon className="h-5 w-5 inline mr-2 text-blue-600" />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) =>
                      handleInputChange("specialRequests", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dietary restrictions, accessibility needs, etc..."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2 text-blue-600" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional information..."
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
                        Registering...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </div>
              </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
