"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { 
  CalendarIcon, 
  XMarkIcon, 
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useEventMutations } from "@/graphql/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import EventTypeIcon from "./events/EventTypeIcon";

interface ImprovedEventModalProps {
  open: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
}

export default function ImprovedEventModal({ open, onClose, onEventCreated }: ImprovedEventModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "SERVICE",
    eventType: "SERVICE",
    startDate: "",
    endDate: "",
    location: "",
    requiresRegistration: false,
    maxAttendees: "",
    registrationDeadline: "",
    isRecurring: false,
    recurrenceType: "WEEKLY",
    recurrenceInterval: 1,
    recurrenceEndDate: "",
    recurrenceDaysOfWeek: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  const { createEvent, createRecurringEvent } = useEventMutations();
  const { state } = useAuth();
  const user = state.user;
  const filter = useOrganizationBranchFilter();
  const { organisationId, branchId: defaultBranchId } = useOrganisationBranch();

  // For SUPER_ADMIN, fetch branches for dropdown
  const { branches, loading: branchesLoading } = useFilteredBranches(
    user?.primaryRole === "super_admin" ? { organisationId } : undefined
  );

  // Determine branchId for event creation - super admin can select, others use default
  const eventBranchId = user?.primaryRole === "super_admin" 
    ? selectedBranchId || defaultBranchId 
    : defaultBranchId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!eventBranchId) {
        setError("No branch selected or available for this user.");
        setSubmitting(false);
        return;
      }
      if (!organisationId) {
        setError("No organisation found for this user or branch.");
        setSubmitting(false);
        return;
      }
      const input = {
        ...form,
        branchId: eventBranchId,
        organisationId,
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : undefined,
        registrationDeadline: form.registrationDeadline || undefined,
      };
      
      if (form.isRecurring) {
        const recurringInput = {
          ...input,
          recurrenceType: form.recurrenceType,
          recurrenceInterval: form.recurrenceInterval,
          recurrenceEndDate: form.recurrenceEndDate,
          recurrenceDaysOfWeek: form.recurrenceDaysOfWeek,
        };
        try {
          const result = await createRecurringEvent(recurringInput);
        } catch (error) {
          console.error('Error creating recurring event:', error);
          throw error;
        }
      } else {
        try {
          const result = await createEvent(input);
        } catch (error) {
          console.error('Error creating single event:', error);
          throw error;
        }
      }
      setSubmitting(false);
      onClose();
      if (onEventCreated) onEventCreated();
    } catch {
      setError("Failed to create event. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        
        <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl max-h-[90vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-white/20 rounded-full p-3">
                  <CalendarIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <Dialog.Title className="text-2xl font-bold text-white">
                    Create New Event
                  </Dialog.Title>
                  <p className="text-indigo-100 text-sm mt-1">
                    Plan and organize your church events with ease
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 rounded-lg p-2 mr-3">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg px-4 py-3 transition-colors"
                      placeholder="e.g. Sunday Morning Service"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 transition-colors resize-none"
                      placeholder="Describe your event and what attendees can expect..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        <TagIcon className="h-4 w-4 inline mr-1" />
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 transition-colors"
                        required
                      >
                        <option value="SERVICE">Service</option>
                        <option value="MEETING">Meeting</option>
                        <option value="CONFERENCE">Conference</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="RETREAT">Retreat</option>
                        <option value="OUTREACH">Outreach</option>
                        <option value="SOCIAL">Social</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <EventTypeIcon eventType={form.eventType as any} className="h-4 w-4 mr-1" />
                          Event Type
                        </div>
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={form.eventType}
                        onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 transition-colors"
                        required
                      >
                        <option value="SERVICE">Service</option>
                        <option value="MEETING">Meeting</option>
                        <option value="CONFERENCE">Conference</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="RETREAT">Retreat</option>
                        <option value="OUTREACH">Outreach</option>
                        <option value="SOCIAL">Social</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPinIcon className="h-4 w-4 inline mr-1" />
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 transition-colors"
                      placeholder="e.g. Main Sanctuary, Fellowship Hall, Online"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 rounded-lg p-2 mr-3">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      required
                      value={form.startDate}
                      onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      required
                      value={form.endDate}
                      onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Registration Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 rounded-lg p-2 mr-3">
                    <UserGroupIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Registration Settings</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-green-100">
                    <input
                      id="requiresRegistration"
                      name="requiresRegistration"
                      type="checkbox"
                      checked={form.requiresRegistration}
                      onChange={e => setForm(f => ({ ...f, requiresRegistration: e.target.checked }))}
                      className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors"
                    />
                    <div className="flex-1">
                      <label htmlFor="requiresRegistration" className="text-sm font-medium text-gray-700 flex items-center">
                        <SparklesIcon className="h-4 w-4 mr-1 text-green-600" />
                        Require Registration
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Enable this if people need to register to attend this event. Great for planning refreshments and seating!
                      </p>
                    </div>
                  </div>

                  {form.requiresRegistration && (
                    <div className="ml-8 space-y-4 border-l-4 border-green-200 pl-6 bg-white/50 rounded-r-lg py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
                            Max Attendees
                          </label>
                          <input
                            id="maxAttendees"
                            name="maxAttendees"
                            type="number"
                            min="1"
                            value={form.maxAttendees}
                            onChange={e => setForm(f => ({ ...f, maxAttendees: e.target.value }))}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-3 transition-colors"
                            placeholder="Leave blank for unlimited"
                          />
                          <p className="text-xs text-gray-500 mt-1">Set a capacity limit for the event</p>
                        </div>
                        <div>
                          <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                            Registration Deadline
                          </label>
                          <input
                            id="registrationDeadline"
                            name="registrationDeadline"
                            type="datetime-local"
                            value={form.registrationDeadline}
                            onChange={e => setForm(f => ({ ...f, registrationDeadline: e.target.value }))}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 px-4 py-3 transition-colors"
                          />
                          <p className="text-xs text-gray-500 mt-1">When to stop accepting registrations</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recurring Event Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 rounded-lg p-2 mr-3">
                    <Cog6ToothIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Recurring Settings</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-purple-100">
                    <input
                      id="isRecurring"
                      name="isRecurring"
                      type="checkbox"
                      checked={form.isRecurring}
                      onChange={e => setForm(f => ({ ...f, isRecurring: e.target.checked }))}
                      className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors"
                    />
                    <div className="flex-1">
                      <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                        Recurring Event
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Create multiple instances of this event automatically (e.g., weekly services)
                      </p>
                    </div>
                  </div>

                  {form.isRecurring && (
                    <div className="ml-8 space-y-4 border-l-4 border-purple-200 pl-6 bg-white/50 rounded-r-lg py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence Type</label>
                          <select
                            id="recurrenceType"
                            name="recurrenceType"
                            value={form.recurrenceType}
                            onChange={e => setForm(f => ({ ...f, recurrenceType: e.target.value }))}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 transition-colors"
                          >
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                            <option value="YEARLY">Yearly</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Interval</label>
                          <input
                            id="recurrenceInterval"
                            name="recurrenceInterval"
                            type="number"
                            min="1"
                            value={form.recurrenceInterval}
                            onChange={e => setForm(f => ({ ...f, recurrenceInterval: parseInt(e.target.value) }))}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          id="recurrenceEndDate"
                          name="recurrenceEndDate"
                          type="date"
                          value={form.recurrenceEndDate}
                          onChange={e => setForm(f => ({ ...f, recurrenceEndDate: e.target.value }))}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-4 py-3 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                        <div className="flex flex-wrap gap-2">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                            <label key={day} className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.recurrenceDaysOfWeek.includes(day)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setForm(f => ({ ...f, recurrenceDaysOfWeek: [...f.recurrenceDaysOfWeek, day] }));
                                  } else {
                                    setForm(f => ({ ...f, recurrenceDaysOfWeek: f.recurrenceDaysOfWeek.filter(d => d !== day) }));
                                  }
                                }}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors"
                              />
                              <span className="text-sm text-gray-700">{day.slice(0, 3)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Branch Selection for Super Admin */}
              {user?.primaryRole === "super_admin" && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center mb-6">
                    <div className="bg-yellow-100 rounded-lg p-2 mr-3">
                      <TagIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Branch Assignment</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="branchId"
                      value={selectedBranchId}
                      onChange={e => setSelectedBranchId(e.target.value)}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 px-4 py-3 transition-colors"
                      required
                    >
                      <option value="">Select a branch...</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500 flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1 text-red-500" />
              <span className="text-red-500">*</span> Required fields
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center space-x-2 transition-all transform hover:scale-105 shadow-lg"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Create Event</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
