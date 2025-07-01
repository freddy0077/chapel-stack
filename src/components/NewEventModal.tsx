"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useEventMutations } from "@/graphql/hooks/useEvents";
import { useAuth } from "@/graphql/hooks/useAuth";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";

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
    startDate: "",
    endDate: "",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  const { createEvent } = useEventMutations();
  const { user } = useAuth();
  const filter = useOrganizationBranchFilter();

  // For SUPER_ADMIN, fetch branches for dropdown
  const { branches, loading: branchesLoading } = useFilteredBranches(
    user?.primaryRole === "super_admin" ? { organisationId: filter.organisationId } : undefined
  );

  // Determine branchId for event creation
  const branchId = user?.primaryRole === "super_admin"
    ? selectedBranchId
    : user?.userBranches && user.userBranches.length > 0
      ? user.userBranches[0].branch.id
      : undefined;

  // Always get organisationId
  const organisationId = user?.organisationId || (user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.organisationId : undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!branchId) {
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
        branchId,
        organisationId
      };
      await createEvent(input);
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
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
