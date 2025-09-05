"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  XMarkIcon,
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  BellIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useCreateFollowUpReminder } from "@/graphql/hooks/usePastoralCare";

// Validation schema
const createReminderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  followUpType: z.enum([
    "FOLLOW_UP_VISIT",
    "PHONE_CALL",
    "EMAIL",
    "PRAYER_REQUEST",
    "COUNSELING_SESSION",
    "PASTORAL_VISIT",
    "OTHER",
  ]),
  dueDate: z.string().min(1, "Due date is required"),
  reminderDate: z.string().optional(),
  memberId: z.string().min(1, "Member selection is required"),
  assignedToId: z.string().min(1, "Assignment is required"),
  notes: z.string().optional(),
  actionRequired: z.string().optional(),
});

type CreateReminderFormData = z.infer<typeof createReminderSchema>;

interface CreateReminderFormProps {
  onClose: () => void;
  onCreateReminder?: (reminder: any) => void;
  prefilledData?: Partial<CreateReminderFormData>;
}

const followUpTypes = [
  { value: "FOLLOW_UP_VISIT", label: "Follow-up Visit", icon: "🏠" },
  { value: "PHONE_CALL", label: "Phone Call", icon: "📞" },
  { value: "EMAIL", label: "Email", icon: "📧" },
  { value: "PRAYER_REQUEST", label: "Prayer Request", icon: "🙏" },
  { value: "COUNSELING_SESSION", label: "Counseling Session", icon: "💬" },
  { value: "PASTORAL_VISIT", label: "Pastoral Visit", icon: "⛪" },
  { value: "OTHER", label: "Other", icon: "📋" },
];

export default function CreateReminderForm({
  onClose,
  onCreateReminder,
  prefilledData,
}: CreateReminderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createFollowUpReminder, loading } = useCreateFollowUpReminder();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateReminderFormData>({
    resolver: zodResolver(createReminderSchema),
    defaultValues: {
      followUpType: "FOLLOW_UP_VISIT",
      ...prefilledData,
    },
  });

  const selectedFollowUpType = watch("followUpType");
  const dueDate = watch("dueDate");

  // Auto-set reminder date to 1 day before due date if not set
  React.useEffect(() => {
    if (dueDate && !watch("reminderDate")) {
      const due = new Date(dueDate);
      const reminder = new Date(due);
      reminder.setDate(reminder.getDate() - 1);
      setValue("reminderDate", reminder.toISOString().slice(0, 16));
    }
  }, [dueDate, setValue, watch]);

  const onSubmit = async (data: CreateReminderFormData) => {
    setIsSubmitting(true);
    try {
      const createInput = {
        title: data.title,
        description: data.description,
        followUpType: data.followUpType,
        dueDate: data.dueDate,
        reminderDate: data.reminderDate,
        memberId: data.memberId,
        assignedToId: data.assignedToId,
        notes: data.notes,
        // Note: organisationId and branchId should be handled by the backend from user context
      };

      const newReminder = await createFollowUpReminder(createInput);

      if (onCreateReminder && newReminder) {
        onCreateReminder(newReminder);
      }

      onClose();
    } catch (error) {
      console.error("Error creating follow-up reminder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = followUpTypes.find(
    (type) => type.value === selectedFollowUpType,
  );

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
              <BellIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Create Follow-up Reminder
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
                Reminder Title *
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter reminder title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Follow-up Type */}
            <div>
              <label
                htmlFor="followUpType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Follow-up Type *
              </label>
              <select
                {...register("followUpType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {followUpTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {selectedType && (
                <p className="mt-1 text-sm text-gray-500">
                  Selected: {selectedType.icon} {selectedType.label}
                </p>
              )}
            </div>

            {/* Due Date and Reminder Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                  Due Date & Time *
                </label>
                <input
                  {...register("dueDate")}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reminderDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <BellIcon className="h-4 w-4 inline mr-1" />
                  Reminder Date & Time
                </label>
                <input
                  {...register("reminderDate")}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  When to send the reminder notification
                </p>
              </div>
            </div>

            {/* Member and Assigned To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="memberId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Member *
                </label>
                <input
                  {...register("memberId")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter member ID or select member"
                />
                {errors.memberId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.memberId.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  The member this reminder is about
                </p>
              </div>

              <div>
                <label
                  htmlFor="assignedToId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Assigned To *
                </label>
                <input
                  {...register("assignedToId")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter pastor/staff ID"
                />
                {errors.assignedToId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.assignedToId.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Who should handle this reminder
                </p>
              </div>
            </div>

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
                placeholder="Enter reminder description or context"
              />
            </div>

            {/* Action Required */}
            <div>
              <label
                htmlFor="actionRequired"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Action Required
              </label>
              <textarea
                {...register("actionRequired")}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What specific action needs to be taken?"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Notes
              </label>
              <textarea
                {...register("notes")}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Any additional notes or context"
              />
            </div>

            {/* Preview */}
            {selectedType && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Reminder Preview
                </h4>
                <div className="text-sm text-blue-800">
                  <p>
                    <strong>Type:</strong> {selectedType.icon}{" "}
                    {selectedType.label}
                  </p>
                  {dueDate && (
                    <p>
                      <strong>Due:</strong>{" "}
                      {new Date(dueDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}

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
                    Creating...
                  </>
                ) : (
                  <>
                    <BellIcon className="h-4 w-4 mr-2" />
                    Create Reminder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
