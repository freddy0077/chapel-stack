"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  XMarkIcon,
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useUpdateCounselingSession } from "@/graphql/hooks/usePastoralCare";
import { CounselingSession } from "@/graphql/hooks/usePastoralCare";

// Validation schema
const editSessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  sessionType: z.enum([
    "INDIVIDUAL",
    "COUPLE",
    "FAMILY",
    "GROUP",
    "CRISIS",
    "FOLLOW_UP",
  ]),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "RESCHEDULED"]),
  memberId: z.string().min(1, "Member selection is required"),
  counselorId: z.string().min(1, "Counselor assignment is required"),
  notes: z.string().optional(),
  isConfidential: z.boolean().default(false),
  duration: z.number().min(15).max(480).default(60),
});

type EditSessionFormData = z.infer<typeof editSessionSchema>;

interface EditSessionFormProps {
  session: CounselingSession;
  onClose: () => void;
  onUpdateSession?: (session: CounselingSession) => void;
}

const sessionTypes = [
  { value: "INDIVIDUAL", label: "Individual Counseling" },
  { value: "COUPLE", label: "Couple Counseling" },
  { value: "FAMILY", label: "Family Counseling" },
  { value: "GROUP", label: "Group Counseling" },
  { value: "CRISIS", label: "Crisis Intervention" },
  { value: "FOLLOW_UP", label: "Follow-up Session" },
];

const sessionStatuses = [
  {
    value: "SCHEDULED",
    label: "Scheduled",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-green-100 text-green-800",
  },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
  {
    value: "RESCHEDULED",
    label: "Rescheduled",
    color: "bg-yellow-100 text-yellow-800",
  },
];

const durationOptions = [
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

export default function EditSessionForm({
  session,
  onClose,
  onUpdateSession,
}: EditSessionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateCounselingSession, loading } = useUpdateCounselingSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EditSessionFormData>({
    resolver: zodResolver(editSessionSchema),
  });

  // Pre-populate form with existing session data
  useEffect(() => {
    if (session) {
      setValue("title", session.title);
      setValue("description", session.description || "");
      setValue("sessionType", session.sessionType as any);
      setValue(
        "scheduledDate",
        new Date(session.scheduledDate).toISOString().slice(0, 16),
      );
      setValue("status", session.status as any);
      setValue("memberId", session.memberId);
      setValue("counselorId", session.counselorId);
      setValue("notes", session.notes || "");
      // Note: isConfidential and duration might not exist in current schema
      setValue("isConfidential", false);
      setValue("duration", 60);
    }
  }, [session, setValue]);

  const onSubmit = async (data: EditSessionFormData) => {
    setIsSubmitting(true);
    try {
      const updateInput = {
        id: session.id,
        title: data.title,
        description: data.description,
        sessionType: data.sessionType,
        scheduledDate: data.scheduledDate,
        status: data.status,
        memberId: data.memberId,
        counselorId: data.counselorId,
        notes: data.notes,
      };

      const updatedSession = await updateCounselingSession(updateInput);

      if (onUpdateSession && updatedSession) {
        onUpdateSession(updatedSession);
      }

      onClose();
    } catch (error) {
      console.error("Error updating counseling session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedStatus = watch("status");
  const isConfidential = watch("isConfidential");
  const duration = watch("duration");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Edit Counseling Session
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Session Title *
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter session title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Session Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="sessionType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Session Type *
                </label>
                <select
                  {...register("sessionType")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {sessionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.sessionType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sessionType.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status *
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {sessionStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {selectedStatus && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      sessionStatuses.find((s) => s.value === selectedStatus)
                        ?.color || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {
                      sessionStatuses.find((s) => s.value === selectedStatus)
                        ?.label
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Scheduled Date and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                  Scheduled Date & Time *
                </label>
                <input
                  {...register("scheduledDate")}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.scheduledDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.scheduledDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  Duration
                </label>
                <select
                  {...register("duration", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Member and Counselor (read-only for now) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Member
                </label>
                <input
                  type="text"
                  value={session.memberId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Member assignment cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Counselor
                </label>
                <input
                  type="text"
                  value={session.counselorId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Counselor assignment cannot be changed
                </p>
              </div>
            </div>

            {/* Confidentiality Setting */}
            <div className="flex items-center">
              <input
                {...register("isConfidential")}
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 flex items-center">
                <EyeSlashIcon className="h-4 w-4 mr-1 text-gray-500" />
                Mark as confidential session
              </label>
            </div>
            {isConfidential && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                  This session will be marked as confidential and access will be
                  restricted.
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter session description or focus areas"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Session Notes
              </label>
              <textarea
                {...register("notes")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter session notes, observations, or follow-up actions"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting || loading ? (
                  <>
                    <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Session"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
