"use client";

import React, { useState } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useMutation } from '@apollo/client';
import { DELETE_ATTENDANCE_RECORD } from '@/graphql/queries/attendanceQueries';
import { AttendanceRecord } from '@/graphql/hooks/useAttendance';

interface DeleteAttendanceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  onSuccess?: () => void;
}

const DeleteAttendanceRecordModal: React.FC<DeleteAttendanceRecordModalProps> = ({
  isOpen,
  onClose,
  record,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteAttendanceRecord] = useMutation(DELETE_ATTENDANCE_RECORD);

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

  const handleDelete = async () => {
    if (!record) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteAttendanceRecord({
        variables: {
          id: record.id,
        },
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete attendance record');
    } finally {
      setIsDeleting(false);
    }
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Delete Attendance Record
                      </Dialog.Title>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

                {/* Content */}
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete this attendance record? This action cannot be undone.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Attendee: </span>
                        <span className="text-sm text-gray-900">{getAttendeeDisplayName()}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Event/Session: </span>
                        <span className="text-sm text-gray-900">{getEventOrSessionName()}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Check-in: </span>
                        <span className="text-sm text-gray-900">
                          {new Date(record.checkInTime).toLocaleString()}
                        </span>
                      </div>
                      {record.checkOutTime && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Check-out: </span>
                          <span className="text-sm text-gray-900">
                            {new Date(record.checkOutTime).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Warning</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Deleting this attendance record will permanently remove it from the system. 
                            This may affect attendance statistics and reports.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={onClose}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete Record
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteAttendanceRecordModal;
