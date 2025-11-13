"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { CalendarIcon, XMarkIcon, PhotoIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useEventMutations } from "@/graphql/hooks/useEvents";
import { EventStatus, EventType } from "@/graphql/types/event";
import ImageUpload from "@/components/ui/ImageUpload";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";

interface EditEventModalProps {
  open: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    description: string;
    eventType: string;
    startDate: string;
    endDate: string;
    location: string;
    branchId: string;
    status?: string;
    capacity?: number;
    registrationRequired?: boolean;
    registrationDeadline?: string;
    isPublic?: boolean;
    requiresApproval?: boolean;
    isFree?: boolean;
    ticketPrice?: number;
    currency?: string;
    organizerName?: string;
    organizerEmail?: string;
    organizerPhone?: string;
    eventImageUrl?: string;
  };
  onEventUpdated?: () => void;
}

export default function EditEventModal({
  open,
  onClose,
  event,
  onEventUpdated,
}: EditEventModalProps) {
  const { updateEvent } = useEventMutations();
  const { branchId, organisationId } = useOrganisationBranch();
  const [useImageUpload, setUseImageUpload] = useState(true);
  
  const [form, setForm] = useState({
    title: event.title || "",
    description: event.description || "",
    eventType: event.eventType || EventType.WORSHIP_SERVICE,
    startDate: "",
    endDate: "",
    location: event.location || "",
    branchId: event.branchId || "",
    status: event.status || EventStatus.DRAFT,
    capacity: event.capacity || null,
    registrationRequired: event.registrationRequired || false,
    registrationDeadline: "",
    isPublic: event.isPublic !== undefined ? event.isPublic : true,
    requiresApproval: event.requiresApproval || false,
    isFree: event.isFree !== undefined ? event.isFree : true,
    ticketPrice: event.ticketPrice || null,
    currency: event.currency || "GHS",
    organizerName: event.organizerName || "",
    organizerEmail: event.organizerEmail || "",
    organizerPhone: event.organizerPhone || "",
    eventImageUrl: event.eventImageUrl || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Helper to format ISO string to YYYY-MM-DD
    const formatDate = (iso: string) => (iso ? iso.split("T")[0] : "");
    // Helper to format ISO string to YYYY-MM-DDTHH:mm for datetime-local
    const formatDateTime = (iso: string) => {
      if (!iso) return "";
      const date = new Date(iso);
      if (isNaN(date.getTime())) return "";
      // Format to YYYY-MM-DDTHH:mm
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    setForm({
      title: event.title || "",
      description: event.description || "",
      eventType: event.eventType || EventType.WORSHIP_SERVICE,
      startDate: formatDate(event.startDate),
      endDate: formatDate(event.endDate),
      location: event.location || "",
      branchId: event.branchId || "",
      status: event.status || EventStatus.DRAFT,
      capacity: event.capacity || null,
      registrationRequired: event.registrationRequired || false,
      registrationDeadline: formatDateTime(event.registrationDeadline || ""),
      isPublic: event.isPublic !== undefined ? event.isPublic : true,
      requiresApproval: event.requiresApproval || false,
      isFree: event.isFree !== undefined ? event.isFree : true,
      ticketPrice: event.ticketPrice || null,
      currency: event.currency || "GHS",
      organizerName: event.organizerName || "",
      organizerEmail: event.organizerEmail || "",
      organizerPhone: event.organizerPhone || "",
      eventImageUrl: event.eventImageUrl || "",
    });
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Only include fields allowed by UpdateEventInput
      const input: any = {
        id: event.id,
        title: form.title,
        description: form.description || undefined,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        location: form.location || undefined,
        eventType: form.eventType,
        branchId: form.branchId || undefined,
        status: form.status,
        capacity: form.capacity || undefined,
        registrationRequired: form.registrationRequired,
        registrationDeadline: form.registrationDeadline || undefined,
        isPublic: form.isPublic,
        requiresApproval: form.requiresApproval,
        isFree: form.isFree,
        ticketPrice: form.ticketPrice || undefined,
        currency: form.currency,
        organizerName: form.organizerName || undefined,
        organizerEmail: form.organizerEmail || undefined,
        organizerPhone: form.organizerPhone || undefined,
        eventImageUrl: form.eventImageUrl || undefined,
      };
      await updateEvent(input);
      setSubmitting(false);
      onClose();
      if (onEventUpdated) onEventUpdated();
    } catch {
      setError("Failed to update event. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-auto p-8 border border-indigo-100 max-h-[90vh] overflow-y-auto">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-full">
              <CalendarIcon className="h-7 w-7 text-white" />
            </span>
            <h2 className="text-2xl font-bold text-indigo-900">Edit Event</h2>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Event title"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Describe your event"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="eventType"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Event Type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={form.eventType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, eventType: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  required
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
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="e.g. Main Sanctuary"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                required
              >
                <option value={EventStatus.DRAFT}>Draft</option>
                <option value={EventStatus.PUBLISHED}>Published</option>
                <option value={EventStatus.COMPLETED}>Completed</option>
                <option value={EventStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            {/* Registration Settings */}
            <div className="border-t border-indigo-100 pt-4 mt-2">
              <h3 className="text-md font-semibold text-indigo-900 mb-3">Registration Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.registrationRequired}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, registrationRequired: e.target.checked }))
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Registration Required</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPublic}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isPublic: e.target.checked }))
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Public Event</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.requiresApproval}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, requiresApproval: e.target.checked }))
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Requires Approval</span>
                  </label>
                </div>

                {form.registrationRequired && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="capacity"
                        className="block text-sm font-medium text-indigo-800 mb-1"
                      >
                        Capacity (Optional)
                      </label>
                      <input
                        id="capacity"
                        name="capacity"
                        type="number"
                        min="1"
                        value={form.capacity || ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, capacity: e.target.value ? parseInt(e.target.value) : null }))
                        }
                        className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                        placeholder="Max attendees"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="registrationDeadline"
                        className="block text-sm font-medium text-indigo-800 mb-1"
                      >
                        Registration Deadline (Optional)
                      </label>
                      <input
                        id="registrationDeadline"
                        name="registrationDeadline"
                        type="datetime-local"
                        value={form.registrationDeadline}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, registrationDeadline: e.target.value }))
                        }
                        className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Settings */}
            <div className="border-t border-indigo-100 pt-4 mt-2">
              <h3 className="text-md font-semibold text-indigo-900 mb-3">Pricing</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFree}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isFree: e.target.checked, ticketPrice: e.target.checked ? null : f.ticketPrice }))
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Free Event</span>
                </label>

                {!form.isFree && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="ticketPrice"
                        className="block text-sm font-medium text-indigo-800 mb-1"
                      >
                        Ticket Price (GHS)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          GHS
                        </span>
                        <input
                          id="ticketPrice"
                          name="ticketPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.ticketPrice || ""}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, ticketPrice: e.target.value ? parseFloat(e.target.value) : null }))
                          }
                          className="block w-full rounded-lg border border-indigo-200 bg-white pl-16 pr-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="currency"
                        className="block text-sm font-medium text-indigo-800 mb-1"
                      >
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={form.currency}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, currency: e.target.value }))
                        }
                        className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
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
            <div className="border-t border-indigo-100 pt-4 mt-2">
              <h3 className="text-md font-semibold text-indigo-900 mb-3">Organizer Information (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="organizerName"
                    className="block text-sm font-medium text-indigo-800 mb-1"
                  >
                    Organizer Name
                  </label>
                  <input
                    id="organizerName"
                    name="organizerName"
                    type="text"
                    value={form.organizerName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, organizerName: e.target.value }))
                    }
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="organizerEmail"
                      className="block text-sm font-medium text-indigo-800 mb-1"
                    >
                      Organizer Email
                    </label>
                    <input
                      id="organizerEmail"
                      name="organizerEmail"
                      type="email"
                      value={form.organizerEmail}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, organizerEmail: e.target.value }))
                      }
                      className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      placeholder="organizer@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="organizerPhone"
                      className="block text-sm font-medium text-indigo-800 mb-1"
                    >
                      Organizer Phone
                    </label>
                    <input
                      id="organizerPhone"
                      name="organizerPhone"
                      type="tel"
                      value={form.organizerPhone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, organizerPhone: e.target.value }))
                      }
                      className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Image */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-indigo-800">
                  <PhotoIcon className="h-4 w-4 inline mr-1" />
                  Event Image (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setUseImageUpload(!useImageUpload)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
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
                  value={form.eventImageUrl || null}
                  onChange={(imageUrl) =>
                    setForm((f) => ({ ...f, eventImageUrl: imageUrl || "" }))
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
                  id="eventImageUrl"
                  name="eventImageUrl"
                  type="url"
                  value={form.eventImageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, eventImageUrl: e.target.value }))
                  }
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="https://example.com/image.jpg"
                />
              )}
            </div>
            {error && (
              <div className="text-red-600 text-sm font-medium mt-2">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
              >
                {submitting ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                ) : (
                  "Update Event"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
