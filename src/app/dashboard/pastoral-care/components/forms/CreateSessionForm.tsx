'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeSlashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useCreateCounselingSession } from '@/graphql/hooks/usePastoralCare';

// Validation schema
const createSessionSchema = z.object({
  memberId: z.string().min(1, 'Member is required'),
  counselorId: z.string().min(1, 'Counselor is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  sessionType: z.string().min(1, 'Session type is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').optional(),
  isConfidential: z.boolean().default(false),
  notes: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

type CreateSessionFormData = z.infer<typeof createSessionSchema>;

interface CreateSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedMemberId?: string;
}

const sessionTypes = [
  { value: 'INDIVIDUAL', label: 'Individual Counseling' },
  { value: 'COUPLE', label: 'Couples Counseling' },
  { value: 'FAMILY', label: 'Family Counseling' },
  { value: 'GROUP', label: 'Group Counseling' },
  { value: 'CRISIS', label: 'Crisis Counseling' },
  { value: 'GRIEF', label: 'Grief Counseling' },
  { value: 'ADDICTION', label: 'Addiction Counseling' },
  { value: 'MARRIAGE', label: 'Marriage Counseling' },
  { value: 'YOUTH', label: 'Youth Counseling' },
  { value: 'OTHER', label: 'Other' },
];

const priorities = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'HIGH', label: 'High', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' },
];

const durationOptions = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export default function CreateSessionForm({
  isOpen,
  onClose,
  onSuccess,
  preselectedMemberId,
}: CreateSessionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createCounselingSession } = useCreateCounselingSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      memberId: preselectedMemberId || '',
      priority: 'MEDIUM',
      isConfidential: false,
      duration: 60,
    },
  });

  const watchedPriority = watch('priority');
  const watchedIsConfidential = watch('isConfidential');

  const onSubmit = async (data: CreateSessionFormData) => {
    try {
      setIsSubmitting(true);
      
      await createCounselingSession({
        ...data,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
      });

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create counseling session:', error);
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Schedule Counseling Session
                    </h3>
                    <p className="text-sm text-gray-500">
                      Create a new counseling session appointment
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Member Selection */}
                <div className="sm:col-span-2">
                  <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">
                    <UserIcon className="inline h-4 w-4 mr-1" />
                    Member *
                  </label>
                  <select
                    {...register('memberId')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  >
                    <option value="">Select a member...</option>
                    {/* TODO: Populate with actual members from API */}
                    <option value="member-1">John Doe</option>
                    <option value="member-2">Jane Smith</option>
                  </select>
                  {errors.memberId && (
                    <p className="mt-1 text-sm text-red-600">{errors.memberId.message}</p>
                  )}
                </div>

                {/* Counselor Selection */}
                <div className="sm:col-span-2">
                  <label htmlFor="counselorId" className="block text-sm font-medium text-gray-700">
                    <UserIcon className="inline h-4 w-4 mr-1" />
                    Counselor *
                  </label>
                  <select
                    {...register('counselorId')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  >
                    <option value="">Select a counselor...</option>
                    {/* TODO: Populate with actual counselors from API */}
                    <option value="counselor-1">Dr. Johnson</option>
                    <option value="counselor-2">Pastor Williams</option>
                  </select>
                  {errors.counselorId && (
                    <p className="mt-1 text-sm text-red-600">{errors.counselorId.message}</p>
                  )}
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    <DocumentTextIcon className="inline h-4 w-4 mr-1" />
                    Session Title *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    placeholder="e.g., Marriage Counseling Session, Grief Support"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Session Type */}
                <div>
                  <label htmlFor="sessionType" className="block text-sm font-medium text-gray-700">
                    Session Type *
                  </label>
                  <select
                    {...register('sessionType')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  >
                    <option value="">Select type...</option>
                    {sessionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.sessionType && (
                    <p className="mt-1 text-sm text-red-600">{errors.sessionType.message}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    {...register('priority')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      priorities.find(p => p.value === watchedPriority)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {priorities.find(p => p.value === watchedPriority)?.label || 'Medium'}
                    </span>
                  </div>
                </div>

                {/* Scheduled Date */}
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                    <ClockIcon className="inline h-4 w-4 mr-1" />
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    {...register('scheduledDate')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                  {errors.scheduledDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.scheduledDate.message}</p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <select
                    {...register('duration', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  >
                    {durationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Confidentiality */}
                <div className="sm:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isConfidential')}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isConfidential" className="ml-2 block text-sm text-gray-900">
                      <span className="flex items-center">
                        {watchedIsConfidential ? (
                          <EyeSlashIcon className="h-4 w-4 mr-1 text-purple-600" />
                        ) : (
                          <EyeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        )}
                        Confidential Session
                      </span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Confidential sessions have restricted access and visibility
                  </p>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Brief description of the session purpose and goals..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={2}
                    placeholder="Any additional notes, preparation requirements, or special instructions..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Session'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
