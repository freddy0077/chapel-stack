"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PhotoIcon,
  TagIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useEventMutations } from "@/graphql/hooks/useEvents";
import {
  EventType,
  EventStatus,
  CreateEventInput,
} from "@/graphql/types/event";
import EventTypeIcon from "./EventTypeIcon";
import { format } from "date-fns";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import ImageUpload from "@/components/ui/ImageUpload";

// Extended interface to include recurring fields
interface ExtendedCreateEventInput extends CreateEventInput {
  isRecurring?: boolean;
  recurrenceType?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  recurrenceInterval?: number;
  recurrenceEndDate?: string;
  recurrenceDaysOfWeek?: string[];
}

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { state } = useAuth();
  const user = state.user;
  const { createEvent, createRecurringEvent, loading } = useEventMutations();
  const { branchId, organisationId } = useOrganisationBranch();

  const [useImageUpload, setUseImageUpload] = useState(true);

  const [formData, setFormData] = useState<ExtendedCreateEventInput>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    eventType: EventType.WORSHIP_SERVICE,
    status: EventStatus.DRAFT,
    capacity: undefined,
    registrationRequired: false,
    registrationDeadline: "",
    isPublic: true,
    requiresApproval: false,
    eventImageUrl: "",
    tags: [],
    organizerName:
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : "",
    organizerEmail: user?.email || "",
    organizerPhone: "",
    isFree: true,
    ticketPrice: undefined,
    currency: "GHS",
    isRecurring: false,
    recurrenceType: "WEEKLY",
    recurrenceInterval: 1,
    recurrenceEndDate: "",
    recurrenceDaysOfWeek: [],
    branchId,
    organisationId,
  });

  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (open && user) {
      setFormData((prev) => ({
        ...prev,
        organizerName:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : "",
        organizerEmail: user?.email || "",
      }));
    }
  }, [open, user]);

  if (!open) return null;

  const handleInputChange = (
    field: keyof ExtendedCreateEventInput,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      handleInputChange("tags", [...(formData.tags || []), tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Event title is required");
      return;
    }

    if (!formData.startDate) {
      setError("Start date is required");
      return;
    }

    if (formData.registrationRequired && formData.registrationDeadline) {
      const deadline = new Date(formData.registrationDeadline);
      const startDate = new Date(formData.startDate);
      if (deadline >= startDate) {
        setError("Registration deadline must be before the event start date");
        return;
      }
    }

    if (
      !formData.isFree &&
      (!formData.ticketPrice || formData.ticketPrice <= 0)
    ) {
      setError("Ticket price is required for paid events");
      return;
    }

    try {
      // Prepare the event data
      const eventData: ExtendedCreateEventInput = {
        ...formData,
        // Convert empty strings to undefined for optional fields
        description: formData.description?.trim() || undefined,
        endDate: formData.endDate || undefined,
        location: formData.location?.trim() || undefined,
        eventImageUrl: formData.eventImageUrl?.trim() || undefined,
        organizerPhone: formData.organizerPhone?.trim() || undefined,
        registrationDeadline: formData.registrationDeadline || undefined,
        capacity: formData.capacity || undefined,
        ticketPrice: formData.isFree ? undefined : (formData.ticketPrice ? parseFloat(formData.ticketPrice.toString()) : undefined),
        tags: formData.tags?.length ? formData.tags : undefined,
      };

      if (eventData.isRecurring) {
        await createRecurringEvent(eventData);
      } else {
        await createEvent(eventData);
      }
      onSuccess?.();
      onClose();

      // Reset form
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        eventType: EventType.WORSHIP_SERVICE,
        status: EventStatus.DRAFT,
        capacity: undefined,
        registrationRequired: false,
        registrationDeadline: "",
        isPublic: true,
        requiresApproval: false,
        eventImageUrl: "",
        tags: [],
        organizerName:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : "",
        organizerEmail: user?.email || "",
        organizerPhone: "",
        isFree: true,
        ticketPrice: undefined,
        currency: "GHS",
        isRecurring: false,
        recurrenceType: "WEEKLY",
        recurrenceInterval: 1,
        recurrenceEndDate: "",
        recurrenceDaysOfWeek: [],
        branchId,
        organisationId,
      });
    } catch (err: any) {
      setError(err.message || "Failed to create event");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 rounded-2xl"></div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <EventTypeIcon
                eventType={formData.eventType}
                size="lg"
                className="text-blue-600"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Event
                </h2>
                <p className="text-sm text-gray-600">
                  Set up a comprehensive event with registration and RSVP
                  capabilities
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Event Information */}
            <div className="bg-white/60 rounded-xl p-6 border border-white/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Sunday Worship Service, Easter Celebration"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this event is about..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) =>
                      handleInputChange(
                        "eventType",
                        e.target.value as EventType,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.values(EventType).map((type) => (
                      <option key={type} value={type}>
                        {type
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value as EventStatus)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.values(EventStatus).map((status) => (
                      <option key={status} value={status}>
                        {status
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="h-4 w-4 inline mr-1 text-emerald-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Main Sanctuary, Fellowship Hall"
                  />
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="bg-white/60 rounded-xl p-6 border border-white/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
                Date & Time
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Recurrence */}
            <div className="bg-white/60 rounded-xl p-6 border border-white/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Recurrence
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isRecurring}
                      onChange={(e) =>
                        handleInputChange("isRecurring", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Is Recurring
                    </span>
                  </label>
                </div>

                {formData.isRecurring && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recurrence Type
                      </label>
                      <select
                        value={formData.recurrenceType}
                        onChange={(e) =>
                          handleInputChange("recurrenceType", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recurrence Interval
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.recurrenceInterval}
                        onChange={(e) =>
                          handleInputChange(
                            "recurrenceInterval",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recurrence End Date
                      </label>
                      <input
                        type="date"
                        value={formData.recurrenceEndDate}
                        onChange={(e) =>
                          handleInputChange("recurrenceEndDate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recurrence Days of Week
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <label key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.recurrenceDaysOfWeek?.includes(
                                day,
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputChange("recurrenceDaysOfWeek", [
                                    ...(formData.recurrenceDaysOfWeek || []),
                                    day,
                                  ]);
                                } else {
                                  handleInputChange(
                                    "recurrenceDaysOfWeek",
                                    formData.recurrenceDaysOfWeek?.filter(
                                      (d) => d !== day,
                                    ) || [],
                                  );
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {day}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Settings */}
            <div className="bg-white/60 rounded-xl p-6 border border-white/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" />
                Registration Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.registrationRequired}
                      onChange={(e) =>
                        handleInputChange(
                          "registrationRequired",
                          e.target.checked,
                        )
                      }
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Require Registration
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requiresApproval}
                      onChange={(e) =>
                        handleInputChange("requiresApproval", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Require Approval
                    </span>
                  </label>
                </div>

                {formData.registrationRequired && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Deadline
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.registrationDeadline}
                        onChange={(e) =>
                          handleInputChange(
                            "registrationDeadline",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.capacity || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "capacity",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white/60 rounded-xl p-6 border border-white/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                Pricing
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={formData.isFree}
                      onChange={() => {
                        handleInputChange("isFree", true);
                        handleInputChange("ticketPrice", undefined);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Free Event
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={!formData.isFree}
                      onChange={() => handleInputChange("isFree", false)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Paid Event
                    </span>
                  </label>
                </div>

                {!formData.isFree && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Price (GHS) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          GHS
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.ticketPrice || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "ticketPrice",
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                          className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                          required={!formData.isFree}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) =>
                          handleInputChange("currency", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="GHS">GHS (₵)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer Information */}
            <div className="bg-white/60 rounded-xl p-6 border border-white/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                Organizer Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    value={formData.organizerName}
                    onChange={(e) =>
                      handleInputChange("organizerName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <EnvelopeIcon className="h-4 w-4 inline mr-1 text-blue-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.organizerEmail}
                    onChange={(e) =>
                      handleInputChange("organizerEmail", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon className="h-4 w-4 inline mr-1 text-green-500" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.organizerPhone}
                    onChange={(e) =>
                      handleInputChange("organizerPhone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-white/60 rounded-xl p-6 border border-white/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                Additional Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) =>
                        handleInputChange("isPublic", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {formData.isPublic ? (
                        <EyeIcon className="h-4 w-4 mr-1 text-green-500" />
                      ) : (
                        <EyeSlashIcon className="h-4 w-4 mr-1 text-red-500" />
                      )}
                      Public Event (visible to all members)
                    </span>
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      <PhotoIcon className="h-4 w-4 inline mr-1 text-purple-500" />
                      Event Image
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseImageUpload(!useImageUpload)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    >
                      {useImageUpload ? (
                        <>
                          <DocumentTextIcon className="h-3.5 w-3.5" />
                          Use URL instead
                        </>
                      ) : (
                        <>
                          <PhotoIcon className="h-3.5 w-3.5" />
                          Upload image instead
                        </>
                      )}
                    </button>
                  </div>
                  
                  {useImageUpload ? (
                    <ImageUpload
                      value={formData.eventImageUrl || null}
                      onChange={(imageUrl) =>
                        handleInputChange("eventImageUrl", imageUrl || "")
                      }
                      placeholder="Upload event image"
                      description="Event cover image"
                      branchId={branchId}
                      organisationId={organisationId}
                      size="lg"
                      maxSizeInMB={10}
                    />
                  ) : (
                    <input
                      type="url"
                      value={formData.eventImageUrl}
                      onChange={(e) =>
                        handleInputChange("eventImageUrl", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/event-image.jpg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TagIcon className="h-4 w-4 inline mr-1 text-orange-500" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Buttons */}
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
                    Creating Event...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
