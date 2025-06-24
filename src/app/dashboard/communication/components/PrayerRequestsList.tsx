"use client";

import { HandRaisedIcon, CalendarIcon, UserCircleIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

// Mock data for prayer requests
export const mockPrayerRequests = [
  {
    id: 1,
    requestorName: "Sarah Johnson",
    content: "Please pray for my mother who is undergoing surgery next week.",
    dateSubmitted: "2025-04-02T14:15:00Z",
    status: "Active",
    isPrivate: false,
    prayerCount: 28
  },
  {
    id: 2,
    requestorName: "David Williams",
    content: "I'm struggling with a difficult decision at work. Prayers for wisdom and guidance appreciated.",
    dateSubmitted: "2025-04-01T09:30:00Z",
    status: "Active",
    isPrivate: true,
    prayerCount: 5
  },
  {
    id: 3,
    requestorName: "Maria Garcia",
    content: "Thanking God for healing my son who was sick last week. Praise report!",
    dateSubmitted: "2025-03-30T16:20:00Z",
    status: "Answered",
    isPrivate: false,
    prayerCount: 42
  },
  {
    id: 4,
    requestorName: "James Smith",
    content: "My family is going through financial hardship. Please pray for provision and opportunities.",
    dateSubmitted: "2025-03-28T11:45:00Z",
    status: "Active",
    isPrivate: false,
    prayerCount: 37
  },
  {
    id: 5,
    requestorName: "Anonymous",
    content: "Struggling with anxiety and depression. Need prayers for peace and healing.",
    dateSubmitted: "2025-03-27T20:10:00Z",
    status: "Active",
    isPrivate: true,
    prayerCount: 18
  },
  {
    id: 6,
    requestorName: "Emily Wilson",
    content: "Prayer for our youth group retreat this weekend - that hearts would be touched and lives changed.",
    dateSubmitted: "2025-03-25T13:55:00Z",
    status: "Answered",
    isPrivate: false,
    prayerCount: 56
  }
];

export interface PrayerRequest {
  id: number;
  requestorName: string;
  content: string;
  dateSubmitted: string;
  status: 'Active' | 'Answered' | 'Archived';
  isPrivate: boolean;
  prayerCount: number;
}

interface PrayerRequestsListProps {
  prayerRequests: PrayerRequest[];
  onViewPrayerRequest: (prayerRequest: PrayerRequest) => void;
}

export default function PrayerRequestsList({ prayerRequests, onViewPrayerRequest }: PrayerRequestsListProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Calculate days since submission
  const getDaysSince = (dateString: string) => {
    const submitted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - submitted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Answered':
        return 'bg-green-100 text-green-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-4 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Prayer Request
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Requestor
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Submitted
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Prayers
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {prayerRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <div className="flex items-center">
                        <HandRaisedIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                        <span className="max-w-md truncate">{request.content}</span>
                        {request.isPrivate && (
                          <LockClosedIcon className="ml-2 h-4 w-4 text-amber-500" aria-hidden="true" />
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <UserCircleIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                        {request.requestorName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                        {formatDate(request.dateSubmitted)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getDaysSince(request.dateSubmitted)} days ago
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="text-center font-medium">{request.prayerCount}</div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => onViewPrayerRequest(request)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View<span className="sr-only">, request from {request.requestorName}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
