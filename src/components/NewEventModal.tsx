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
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useEventMutations } from "@/graphql/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import EventTypeIcon from "./events/EventTypeIcon";

interface NewEventModalProps {
  open: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
}

export default function NewEventModal({ open, onClose, onEventCreated }: NewEventModalProps) {
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
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto p-8 border border-indigo-100">
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
            <h2 className="text-2xl font-bold text-indigo-900">Create New Event</h2>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-indigo-800 mb-1">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Event title"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-indigo-800 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Describe your event"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-indigo-800 mb-1">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
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
                <label htmlFor="eventType" className="block text-sm font-medium text-indigo-800 mb-1">Event Type</label>
                <select
                  id="eventType"
                  name="eventType"
                  value={form.eventType}
                  onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
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
              <label className="block text-sm font-medium text-indigo-800 mb-1">Requires Registration</label>
              <div className="flex items-center gap-2">
                <input
                  id="requiresRegistration"
                  name="requiresRegistration"
                  type="checkbox"
                  checked={form.requiresRegistration}
                  onChange={e => setForm(f => ({ ...f, requiresRegistration: e.target.checked }))}
                  className="rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                <span>Does this event require registration?</span>
              </div>
            </div>
            {form.requiresRegistration && (
              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium text-indigo-800 mb-1">Max Attendees</label>
                <input
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  value={form.maxAttendees}
                  onChange={e => setForm(f => ({ ...f, maxAttendees: e.target.value }))}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            )}
            {form.requiresRegistration && (
              <div>
                <label htmlFor="registrationDeadline" className="block text-sm font-medium text-indigo-800 mb-1">Registration Deadline</label>
                <input
                  id="registrationDeadline"
                  name="registrationDeadline"
                  type="date"
                  value={form.registrationDeadline}
                  onChange={e => setForm(f => ({ ...f, registrationDeadline: e.target.value }))}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            )}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-indigo-800 mb-1">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="e.g. Main Sanctuary"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-indigo-800 mb-1">Start Date</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-indigo-800 mb-1">End Date</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">Recurring Event</label>
              <div className="flex items-center gap-2">
                <input
                  id="isRecurring"
                  name="isRecurring"
                  type="checkbox"
                  checked={form.isRecurring}
                  onChange={e => setForm(f => ({ ...f, isRecurring: e.target.checked }))}
                  className="rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                <span>Is this event recurring?</span>
              </div>
            </div>
            {form.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Recurrence Type</label>
                <select
                  id="recurrenceType"
                  name="recurrenceType"
                  value={form.recurrenceType}
                  onChange={e => setForm(f => ({ ...f, recurrenceType: e.target.value }))}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            )}
            {form.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Recurrence Interval</label>
                <input
                  id="recurrenceInterval"
                  name="recurrenceInterval"
                  type="number"
                  value={form.recurrenceInterval}
                  onChange={e => setForm(f => ({ ...f, recurrenceInterval: parseInt(e.target.value) }))}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            )}
            {form.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Recurrence End Date</label>
                <input
                  id="recurrenceEndDate"
                  name="recurrenceEndDate"
                  type="date"
                  value={form.recurrenceEndDate}
                  onChange={e => setForm(f => ({ ...f, recurrenceEndDate: e.target.value }))}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            )}
            {form.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Recurrence Days of Week</label>
                <div className="flex flex-wrap gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                    <div key={day} className="flex items-center gap-2">
                      <input
                        id={day}
                        name={day}
                        type="checkbox"
                        checked={form.recurrenceDaysOfWeek.includes(day)}
                        onChange={e => {
                          if (e.target.checked) {
                            setForm(f => ({ ...f, recurrenceDaysOfWeek: [...f.recurrenceDaysOfWeek, day] }));
                          } else {
                            setForm(f => ({ ...f, recurrenceDaysOfWeek: f.recurrenceDaysOfWeek.filter(d => d !== day) }));
                          }
                        }}
                        className="rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      />
                      <span>{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {user?.primaryRole === "super_admin" ? (
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Branch<span className="text-red-500">*</span></label>
                <select
                  name="branchId"
                  value={selectedBranchId}
                  onChange={e => setSelectedBranchId(e.target.value)}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                  disabled={branchesLoading}
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Branch</label>
                <input
                  type="text"
                  value={user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.name : ""}
                  className="block w-full rounded-lg border border-indigo-200 bg-gray-100 px-4 py-3 text-lg shadow-sm cursor-not-allowed"
                  disabled
                />
              </div>
            )}
            {error && <div className="text-red-600 text-sm font-medium mt-2">{error}</div>}
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose} className="min-w-[100px]">Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
                {submitting ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  form.isRecurring ? "Create Recurring Event" : "Create Event"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
