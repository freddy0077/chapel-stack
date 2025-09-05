"use client";

import React from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { AttendanceRecord } from "@/graphql/hooks/useAttendance";

interface AttendanceRecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
  onEdit?: (record: AttendanceRecord) => void;
  onDelete?: (record: AttendanceRecord) => void;
}

const AttendanceRecordDetailModal: React.FC<
  AttendanceRecordDetailModalProps
> = ({ isOpen, onClose, record, onEdit, onDelete }) => {
  if (!record) return null;

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMMM dd, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const getAttendeeDisplayName = () => {
    if (record.member) {
      return `${record.member.firstName} ${record.member.lastName}`;
    }
    return record.visitorName || "Unknown";
  };

  const getEventOrSessionName = () => {
    if (record.session) {
      return record.session.name;
    }
    if (record.event) {
      return record.event.title;
    }
    return "Unknown";
  };

  const getEventOrSessionType = () => {
    if (record.session) {
      return "Session";
    }
    if (record.event) {
      return "Event";
    }
    return "Unknown";
  };

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
                      Attendance Record Details
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      View detailed information about this attendance record
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

                {/* Content */}
                <div className="space-y-6">
                  {/* Attendee Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      Attendee Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {getAttendeeDisplayName()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Type
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.member
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {record.member ? "Member" : "Visitor"}
                        </span>
                      </div>
                      {record.visitorEmail && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <p className="mt-1 text-sm text-gray-900 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                            {record.visitorEmail}
                          </p>
                        </div>
                      )}
                      {record.visitorPhone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <p className="mt-1 text-sm text-gray-900 flex items-center">
                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                            {record.visitorPhone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event/Session Information */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                      {getEventOrSessionType()} Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {getEventOrSessionName()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Type
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.session
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {getEventOrSessionType()}
                        </span>
                      </div>
                      {(record.session?.date || record.event?.startDate) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {record.session?.date || record.event?.startDate}
                          </p>
                        </div>
                      )}
                      {(record.event?.location || record.session?.type) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {record.event ? "Location" : "Type"}
                          </label>
                          <p className="mt-1 text-sm text-gray-900 flex items-center">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                            {record.event?.location || record.session?.type}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attendance Details */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <ClockIcon className="h-5 w-5 text-green-500 mr-2" />
                      Attendance Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Check-in Time
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDateTime(record.checkInTime)}
                        </p>
                      </div>
                      {record.checkOutTime && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Check-out Time
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {formatDateTime(record.checkOutTime)}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Check-in Method
                        </label>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <TagIcon className="h-3 w-3 mr-1" />
                          {record.checkInMethod || "Manual"}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.checkOutTime
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {record.checkOutTime ? "Checked Out" : "Present"}
                        </span>
                      </div>
                    </div>
                    {record.notes && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                          {record.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* System Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      System Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <label className="block font-medium">Record ID</label>
                        <p className="font-mono">{record.id}</p>
                      </div>
                      <div>
                        <label className="block font-medium">Created</label>
                        <p>{formatDateTime(record.createdAt)}</p>
                      </div>
                      {record.updatedAt !== record.createdAt && (
                        <div>
                          <label className="block font-medium">
                            Last Updated
                          </label>
                          <p>{formatDateTime(record.updatedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  {onEdit && (
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => onEdit(record)}
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Record
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => onDelete(record)}
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Record
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AttendanceRecordDetailModal;
