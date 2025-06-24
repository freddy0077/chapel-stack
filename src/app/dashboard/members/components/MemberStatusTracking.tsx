"use client";

import { useState } from "react";
import { 
  ClockIcon, 
  ChevronRightIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  QuestionMarkCircleIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

export type StatusChangeType = {
  id: string;
  previousStatus: MemberStatusType;
  newStatus: MemberStatusType;
  date: string;
  reason?: string;
  changedBy?: string;
};

export type MemberStatusType = 
  | "Active" 
  | "Inactive" 
  | "Visitor" 
  | "Former Member" 
  | "Transferred" 
  | "Deceased" 
  | "On Hold";

type MemberStatusTrackingProps = {
  memberId: number;
  currentStatus: MemberStatusType;
  statusHistory: StatusChangeType[];
  isEditable?: boolean;
  onStatusChange?: (newStatus: MemberStatusType, reason: string) => void;
};

const getStatusColor = (status: MemberStatusType) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-yellow-100 text-yellow-800";
    case "Visitor":
      return "bg-blue-100 text-blue-800";
    case "Former Member":
      return "bg-gray-100 text-gray-800";
    case "Transferred":
      return "bg-purple-100 text-purple-800";
    case "Deceased":
      return "bg-gray-100 text-gray-700";
    case "On Hold":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: MemberStatusType) => {
  switch (status) {
    case "Active":
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case "Inactive":
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    case "Visitor":
      return <UserCircleIcon className="h-5 w-5 text-blue-500" />;
    case "Former Member":
      return <XCircleIcon className="h-5 w-5 text-gray-500" />;
    case "Transferred":
      return <ChevronRightIcon className="h-5 w-5 text-purple-500" />;
    case "Deceased":
      return <XCircleIcon className="h-5 w-5 text-gray-500" />;
    case "On Hold":
      return <QuestionMarkCircleIcon className="h-5 w-5 text-orange-500" />;
    default:
      return <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />;
  }
};

const statusDescriptions: Record<MemberStatusType, string> = {
  "Active": "Currently participating in church activities and services",
  "Inactive": "Has not attended services or activities in the last 3 months",
  "Visitor": "Attending services but not yet a registered member",
  "Former Member": "Previously a member but has officially left the church",
  "Transferred": "Has been transferred to another branch or church",
  "Deceased": "Member has passed away",
  "On Hold": "Membership temporarily suspended"
};

export default function MemberStatusTracking({
  // memberId is in prop type but not used in component logic
  currentStatus,
  statusHistory,
  isEditable = false,
  onStatusChange
}: MemberStatusTrackingProps) {
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [newStatus, setNewStatus] = useState<MemberStatusType>(currentStatus);
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (onStatusChange && newStatus !== currentStatus) {
      onStatusChange(newStatus, reason);
      setShowChangeForm(false);
      setReason("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Membership Status</h3>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="mr-3">
            {getStatusIcon(currentStatus)}
          </div>
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
              {currentStatus}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              {statusDescriptions[currentStatus]}
            </p>
          </div>
          {isEditable && onStatusChange && !showChangeForm && (
            <button
              type="button"
              onClick={() => setShowChangeForm(true)}
              className="ml-auto inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Change Status
            </button>
          )}
        </div>

        {showChangeForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Update Member Status</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <select
                  id="status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as MemberStatusType)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {Object.keys(statusDescriptions).map((status) => (
                    <option key={status} value={status} disabled={status === currentStatus}>
                      {status}
                    </option>
                  ))}
                </select>
                {newStatus !== currentStatus && (
                  <p className="mt-1 text-xs text-gray-500">
                    {statusDescriptions[newStatus]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="status-reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Change
                </label>
                <textarea
                  id="status-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Explain why the status is being changed"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowChangeForm(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={newStatus === currentStatus || !reason}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status History Timeline */}
        {statusHistory.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mt-6 mb-3">Status History</h4>
            <div className="flow-root">
              <ul className="-mb-8">
                {statusHistory.map((statusChange, idx) => (
                  <li key={statusChange.id}>
                    <div className="relative pb-8">
                      {idx !== statusHistory.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-gray-100">
                            {getStatusIcon(statusChange.newStatus)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Changed from{" "}
                              <span className={`font-medium ${getStatusColor(statusChange.previousStatus)}`}>
                                {statusChange.previousStatus}
                              </span>{" "}
                              to{" "}
                              <span className={`font-medium ${getStatusColor(statusChange.newStatus)}`}>
                                {statusChange.newStatus}
                              </span>
                              {statusChange.reason && (
                                <span className="text-sm text-gray-500 block mt-1">
                                  Reason: {statusChange.reason}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={statusChange.date}>
                              {new Date(statusChange.date).toLocaleDateString()}
                            </time>
                            {statusChange.changedBy && (
                              <p className="text-xs text-gray-400">by {statusChange.changedBy}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
