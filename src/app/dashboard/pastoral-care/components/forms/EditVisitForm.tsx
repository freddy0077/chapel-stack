'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  XMarkIcon,
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useUpdatePastoralVisit } from '@/graphql/hooks/usePastoralCare';
import { PastoralVisit } from '@/graphql/hooks/usePastoralCare';

// Validation schema
const editVisitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  visitType: z.enum(['HOME_VISIT', 'HOSPITAL_VISIT', 'OFFICE_VISIT', 'PHONE_CALL', 'OTHER']),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']),
  memberId: z.string().min(1, 'Member selection is required'),
  pastorId: z.string().min(1, 'Pastor assignment is required'),
  notes: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

type EditVisitFormData = z.infer<typeof editVisitSchema>;

interface EditVisitFormProps {
  visit: PastoralVisit;
  onClose: () => void;
  onUpdateVisit?: (visit: PastoralVisit) => void;
}

const visitTypes = [
  { value: 'HOME_VISIT', label: 'Home Visit' },
  { value: 'HOSPITAL_VISIT', label: 'Hospital Visit' },
  { value: 'OFFICE_VISIT', label: 'Office Visit' },
  { value: 'PHONE_CALL', label: 'Phone Call' },
  { value: 'OTHER', label: 'Other' },
];

const visitStatuses = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'RESCHEDULED', label: 'Rescheduled', color: 'bg-yellow-100 text-yellow-800' },
];

const priorityLevels = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' },
];

export default function EditVisitForm({ visit, onClose, onUpdateVisit }: EditVisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePastoralVisit, loading } = useUpdatePastoralVisit();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EditVisitFormData>({
    resolver: zodResolver(editVisitSchema),
  });

  // Pre-populate form with existing visit data
  useEffect(() => {
    if (visit) {
      setValue('title', visit.title);
      setValue('description', visit.description || '');
      setValue('visitType', visit.visitType as any);
      setValue('scheduledDate', new Date(visit.scheduledDate).toISOString().slice(0, 16));
      setValue('status', visit.status as any);
      setValue('memberId', visit.memberId);
      setValue('pastorId', visit.pastorId);
      setValue('notes', visit.notes || '');
      // Note: priority field might not exist in current schema, defaulting to MEDIUM
    }
  }, [visit, setValue]);

  const onSubmit = async (data: EditVisitFormData) => {
    setIsSubmitting(true);
    try {
      const updateInput = {
        id: visit.id,
        title: data.title,
        description: data.description,
        visitType: data.visitType,
        scheduledDate: data.scheduledDate,
        status: data.status,
        memberId: data.memberId,
        pastorId: data.pastorId,
        notes: data.notes,
      };

      const updatedVisit = await updatePastoralVisit(updateInput);
      
      if (onUpdateVisit && updatedVisit) {
        onUpdateVisit(updatedVisit);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating pastoral visit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedStatus = watch('status');
  const selectedPriority = watch('priority');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Edit Pastoral Visit
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Visit Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter visit title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Visit Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="visitType" className="block text-sm font-medium text-gray-700 mb-1">
                  Visit Type *
                </label>
                <select
                  {...register('visitType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {visitTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.visitType && (
                  <p className="mt-1 text-sm text-red-600">{errors.visitType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {visitStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {selectedStatus && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    visitStatuses.find(s => s.value === selectedStatus)?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {visitStatuses.find(s => s.value === selectedStatus)?.label}
                  </span>
                )}
              </div>
            </div>

            {/* Scheduled Date */}
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
                <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                Scheduled Date & Time *
              </label>
              <input
                {...register('scheduledDate')}
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.scheduledDate && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduledDate.message}</p>
              )}
            </div>

            {/* Member and Pastor (read-only for now, would need member/pastor search) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Member
                </label>
                <input
                  type="text"
                  value={visit.memberId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Member assignment cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pastor
                </label>
                <input
                  type="text"
                  value={visit.pastorId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Pastor assignment cannot be changed</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter visit description or purpose"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter any additional notes or observations"
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
                  'Update Visit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
