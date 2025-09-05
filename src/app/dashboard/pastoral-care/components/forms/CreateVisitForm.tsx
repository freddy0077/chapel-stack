"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  XMarkIcon,
  CalendarDaysIcon,
  UserIcon,
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useCreatePastoralVisit } from "@/graphql/hooks/usePastoralCare";

// Validation schema
const createVisitSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  pastorId: z.string().min(1, "Pastor is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  visitType: z.string().min(1, "Visit type is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  location: z.string().optional(),
  notes: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

type CreateVisitFormData = z.infer<typeof createVisitSchema>;

interface CreateVisitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedMemberId?: string;
}

const visitTypes = [
  { value: "PASTORAL_CARE", label: "Pastoral Care" },
  { value: "COUNSELING", label: "Counseling" },
  { value: "HOSPITAL_VISIT", label: "Hospital Visit" },
  { value: "HOME_VISIT", label: "Home Visit" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "EMERGENCY", label: "Emergency" },
  { value: "OTHER", label: "Other" },
];

const priorities = [
  { value: "LOW", label: "Low", color: "bg-gray-100 text-gray-800" },
  { value: "MEDIUM", label: "Medium", color: "bg-blue-100 text-blue-800" },
  { value: "HIGH", label: "High", color: "bg-yellow-100 text-yellow-800" },
  { value: "URGENT", label: "Urgent", color: "bg-red-100 text-red-800" },
];

export default function CreateVisitForm({
  isOpen,
  onClose,
  onSuccess,
  preselectedMemberId,
}: CreateVisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPastoralVisit } = useCreatePastoralVisit();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateVisitFormData>({
    resolver: zodResolver(createVisitSchema),
    defaultValues: {
      memberId: preselectedMemberId || "",
      priority: "MEDIUM",
    },
  });

  const watchedPriority = watch("priority");

  const onSubmit = async (data: CreateVisitFormData) => {
    try {
      setIsSubmitting(true);

      await createPastoralVisit({
        ...data,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create pastoral visit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CalendarDaysIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Schedule Pastoral Visit
                    </h3>
                    <p className="text-sm text-gray-500">
                      Create a new pastoral visit appointment
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Member Selection */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="memberId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <UserIcon className="inline h-4 w-4 mr-1" />
                    Member *
                  </label>
                  <select
                    {...register("memberId")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a member...</option>
                    {/* TODO: Populate with actual members from API */}
                    <option value="member-1">John Doe</option>
                    <option value="member-2">Jane Smith</option>
                  </select>
                  {errors.memberId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.memberId.message}
                    </p>
                  )}
                </div>

                {/* Pastor Selection */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="pastorId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <UserIcon className="inline h-4 w-4 mr-1" />
                    Assigned Pastor *
                  </label>
                  <select
                    {...register("pastorId")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a pastor...</option>
                    {/* TODO: Populate with actual pastors from API */}
                    <option value="pastor-1">Pastor Johnson</option>
                    <option value="pastor-2">Pastor Williams</option>
                  </select>
                  {errors.pastorId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pastorId.message}
                    </p>
                  )}
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <DocumentTextIcon className="inline h-4 w-4 mr-1" />
                    Visit Title *
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    placeholder="e.g., Pastoral Care Visit, Hospital Visit"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Visit Type */}
                <div>
                  <label
                    htmlFor="visitType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Visit Type *
                  </label>
                  <select
                    {...register("visitType")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select type...</option>
                    {visitTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.visitType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.visitType.message}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Priority
                  </label>
                  <select
                    {...register("priority")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        priorities.find((p) => p.value === watchedPriority)
                          ?.color || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {priorities.find((p) => p.value === watchedPriority)
                        ?.label || "Medium"}
                    </span>
                  </div>
                </div>

                {/* Scheduled Date */}
                <div>
                  <label
                    htmlFor="scheduledDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <ClockIcon className="inline h-4 w-4 mr-1" />
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    {...register("scheduledDate")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.scheduledDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.scheduledDate.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <MapPinIcon className="inline h-4 w-4 mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    {...register("location")}
                    placeholder="e.g., Member's home, Hospital room 205"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Brief description of the visit purpose..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={2}
                    placeholder="Any additional notes or special instructions..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Visit"
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
