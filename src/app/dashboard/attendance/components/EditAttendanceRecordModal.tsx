"use client";

import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useMutation } from '@apollo/client';
import { UPDATE_ATTENDANCE_RECORD } from '@/graphql/queries/attendanceQueries';
import { AttendanceRecord } from '@/graphql/hooks/useAttendance';
import { format } from 'date-fns';

interface EditAttendanceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  onSuccess?: (updatedRecord: AttendanceRecord) => void;
}

const EditAttendanceRecordModal: React.FC<EditAttendanceRecordModalProps> = ({
  isOpen,
  onClose,
  record,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    checkInTime: '',
    checkOutTime: '',
    checkInMethod: '',
    notes: '',
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [updateAttendanceRecord] = useMutation(UPDATE_ATTENDANCE_RECORD);

  useEffect(() => {
    if (record) {
      setFormData({
        checkInTime: record.checkInTime ? format(new Date(record.checkInTime), "yyyy-MM-dd'T'HH:mm") : '',
        checkOutTime: record.checkOutTime ? format(new Date(record.checkOutTime), "yyyy-MM-dd'T'HH:mm") : '',
        checkInMethod: record.checkInMethod || '',
        notes: record.notes || '',
        visitorName: record.visitorName || '',
        visitorEmail: record.visitorEmail || '',
        visitorPhone: record.visitorPhone || '',
      });
    }
  }, [record]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const input = {
        checkInTime: formData.checkInTime ? new Date(formData.checkInTime).toISOString() : undefined,
        checkOutTime: formData.checkOutTime ? new Date(formData.checkOutTime).toISOString() : undefined,
        checkInMethod: formData.checkInMethod || undefined,
        notes: formData.notes || undefined,
        visitorName: formData.visitorName || undefined,
        visitorEmail: formData.visitorEmail || undefined,
        visitorPhone: formData.visitorPhone || undefined,
      };

      const { data } = await updateAttendanceRecord({
        variables: {
          id: record.id,
          input,
        },
      });

      if (data?.updateAttendanceRecord) {
        onSuccess?.(data.updateAttendanceRecord);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update attendance record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttendeeDisplayName = () => {
    if (record?.member) {
      return `${record.member.firstName} ${record.member.lastName}`;
    }
    return record?.visitorName || 'Unknown';
  };

  const getEventOrSessionName = () => {
    if (record?.session) {
      return record.session.name;
    }
    if (record?.event) {
      return record.event.title;
    }
    return 'Unknown';
  };

  if (!record) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900"
                    >
                      Edit Attendance Record
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Update attendance information for {getAttendeeDisplayName()}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Context Information */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium text-blue-900">{getEventOrSessionName()}</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-700">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {getAttendeeDisplayName()} • {record.member ? 'Member' : 'Visitor'}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Attendance Times */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700">
                        Check-in Time *
                      </label>
                      <input
                        type="datetime-local"
                        id="checkInTime"
                        name="checkInTime"
                        value={formData.checkInTime}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700">
                        Check-out Time
                      </label>
                      <input
                        type="datetime-local"
                        id="checkOutTime"
                        name="checkOutTime"
                        value={formData.checkOutTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Check-in Method */}
                  <div>
                    <label htmlFor="checkInMethod" className="block text-sm font-medium text-gray-700">
                      Check-in Method
                    </label>
                    <select
                      id="checkInMethod"
                      name="checkInMethod"
                      value={formData.checkInMethod}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select method</option>
                      <option value="manual">Manual Entry</option>
                      <option value="card_scan">Card Scan</option>
                      <option value="mobile_app">Mobile App</option>
                      <option value="qr_code">QR Code</option>
                    </select>
                  </div>

                  {/* Visitor Information (only if visitor) */}
                  {!record.member && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900 flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        Visitor Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            id="visitorName"
                            name="visitorName"
                            value={formData.visitorName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="visitorEmail" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            id="visitorEmail"
                            name="visitorEmail"
                            value={formData.visitorEmail}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="visitorPhone" className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="visitorPhone"
                            name="visitorPhone"
                            value={formData.visitorPhone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Add any additional notes about this attendance record..."
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Update Record
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditAttendanceRecordModal;
