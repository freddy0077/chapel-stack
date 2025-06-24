"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  UserPlusIcon, 
  UserMinusIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

// Define types for transfer requests
type TransferStatus = 'pending' | 'approved' | 'rejected' | 'completed';
type TransferDataType = 'personal' | 'sacraments' | 'ministries' | 'donation_history';

interface BaseTransferRequest {
  id: string;
  memberId: string;
  memberName: string;
  sourceBranchId: string;
  sourceBranchName: string;
  destinationBranchId: string;
  destinationBranchName: string;
  requestDate: string;
  status: TransferStatus;
  reason: string;
  transferData: TransferDataType[];
}

interface PendingTransferRequest extends BaseTransferRequest {
  status: 'pending';
}

interface ApprovedTransferRequest extends BaseTransferRequest {
  status: 'approved';
  approvedDate: string;
}

interface RejectedTransferRequest extends BaseTransferRequest {
  status: 'rejected';
  rejectedDate: string;
  rejectionReason: string;
}

interface CompletedTransferRequest extends BaseTransferRequest {
  status: 'completed';
  approvedDate: string;
  completedDate: string;
}

type TransferRequest = 
  | PendingTransferRequest 
  | ApprovedTransferRequest 
  | RejectedTransferRequest 
  | CompletedTransferRequest;

// Mock data for transfer requests
const mockTransferRequests: TransferRequest[] = [
  {
    id: "tr-001",
    memberId: "mem-123",
    memberName: "Emma Wilson",
    sourceBranchId: "br-002",
    sourceBranchName: "Sacred Heart Parish",
    destinationBranchId: "br-001",
    destinationBranchName: "St. Mary's Cathedral",
    requestDate: "2025-03-28T09:12:00Z",
    status: "pending",
    reason: "Member has relocated to San Francisco",
    transferData: ["personal", "sacraments", "ministries"]
  },
  {
    id: "tr-002",
    memberId: "mem-456",
    memberName: "Michael Thomas",
    sourceBranchId: "br-001",
    sourceBranchName: "St. Mary's Cathedral",
    destinationBranchId: "br-003",
    destinationBranchName: "St. Joseph's Church",
    requestDate: "2025-03-25T14:30:00Z",
    status: "approved",
    approvedDate: "2025-03-26T10:15:00Z",
    reason: "Member requested transfer to be closer to home",
    transferData: ["personal", "sacraments"]
  },
  {
    id: "tr-003",
    memberId: "mem-789",
    memberName: "Sarah Johnson",
    sourceBranchId: "br-004",
    sourceBranchName: "Holy Trinity Parish",
    destinationBranchId: "br-001",
    destinationBranchName: "St. Mary's Cathedral",
    requestDate: "2025-03-20T11:45:00Z",
    status: "completed",
    approvedDate: "2025-03-21T13:20:00Z",
    completedDate: "2025-03-22T09:00:00Z",
    reason: "Family moved to new location",
    transferData: ["personal", "sacraments", "ministries", "donation_history"]
  },
  {
    id: "tr-004",
    memberId: "mem-101",
    memberName: "David Clark",
    sourceBranchId: "br-001",
    sourceBranchName: "St. Mary's Cathedral",
    destinationBranchId: "br-005",
    destinationBranchName: "Immaculate Conception",
    requestDate: "2025-03-18T16:20:00Z",
    status: "rejected",
    rejectedDate: "2025-03-19T10:30:00Z",
    rejectionReason: "Member has outstanding ministry commitments",
    reason: "Member requested transfer for work relocation",
    transferData: ["personal", "sacraments"]
  }
];

interface MemberTransferPanelProps {
  branchId: string;
  branchName: string;
}

export default function MemberTransferPanel({ branchId, branchName }: MemberTransferPanelProps) {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [isLoading, setIsLoading] = useState(false);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(mockTransferRequests);
  
  // Filter transfer requests based on active tab and branch ID
  const filteredRequests = transferRequests.filter(request => {
    if (activeTab === 'incoming') {
      return request.destinationBranchId === branchId;
    } else {
      return request.sourceBranchId === branchId;
    }
  });
  
  const handleApproveTransfer = async (transferId: string) => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setTransferRequests(prevRequests => 
        prevRequests.map(request => {
          if (request.id === transferId && request.status === 'pending') {
            return {
              ...request,
              status: 'approved' as const,
              approvedDate: new Date().toISOString()
            } as ApprovedTransferRequest;
          }
          return request;
        })
      );
      setIsLoading(false);
    }, 1000);
  };
  
  const handleRejectTransfer = async (transferId: string, rejectionReason: string = "Request rejected") => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setTransferRequests(prevRequests => 
        prevRequests.map(request => {
          if (request.id === transferId && request.status === 'pending') {
            return {
              ...request,
              status: 'rejected' as const,
              rejectedDate: new Date().toISOString(),
              rejectionReason
            } as RejectedTransferRequest;
          }
          return request;
        })
      );
      setIsLoading(false);
    }, 1000);
  };
  
  const handleCompleteTransfer = async (transferId: string) => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setTransferRequests(prevRequests => 
        prevRequests.map(request => {
          if (request.id === transferId && request.status === 'approved') {
            const approvedRequest = request as ApprovedTransferRequest;
            return {
              ...approvedRequest,
              status: 'completed' as const,
              completedDate: new Date().toISOString()
            } as CompletedTransferRequest;
          }
          return request;
        })
      );
      setIsLoading(false);
    }, 1000);
  };
  
  // Type guards for transfer request types
  const isApproved = (transfer: TransferRequest): transfer is ApprovedTransferRequest => {
    return transfer.status === 'approved';
  };

  const isRejected = (transfer: TransferRequest): transfer is RejectedTransferRequest => {
    return transfer.status === 'rejected';
  };

  const isCompleted = (transfer: TransferRequest): transfer is CompletedTransferRequest => {
    return transfer.status === 'completed';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 sm:px-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mr-3">
            <ArrowsRightLeftIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Member Transfers</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage transfer requests to and from {branchName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={() => setTransferRequests([...mockTransferRequests])}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mr-2"
          >
            <ArrowPathIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            Refresh
          </button>
          
          <Link
            href={`/dashboard/branches/${branchId}/transfer/new`}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none transition-colors"
          >
            <UserPlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            New Transfer
          </Link>
        </div>
      </div>
      
      <div>
        <div className="px-5 py-4 sm:px-6">
          <nav className="flex flex-wrap gap-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`${
                activeTab === 'incoming'
                  ? 'bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              } px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm border border-gray-100 dark:border-gray-700`}
            >
              <UserPlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
              Incoming Transfers
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`${
                activeTab === 'outgoing'
                  ? 'bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              } px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm border border-gray-100 dark:border-gray-700`}
            >
              <UserMinusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
              Outgoing Transfers
            </button>
          </nav>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4 sm:p-6">
          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="p-3 mx-auto h-16 w-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                <ArrowsRightLeftIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-900 dark:text-white">No transfer requests</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                There are no {activeTab === 'incoming' ? 'incoming' : 'outgoing'} transfer requests for {branchName} at this time.
              </p>
              <div className="mt-6">
                <Link
                  href={`/dashboard/branches/${branchId}/transfer/new`}
                  className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none transition-colors"
                >
                  <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Transfer Request
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredRequests.map((transfer) => (
                <div key={transfer.id} className="px-4 py-6 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        <Link href={`/dashboard/members/${transfer.memberId}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                          {transfer.memberName}
                        </Link>
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <InformationCircleIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                        {activeTab === 'incoming' 
                          ? `From ${transfer.sourceBranchName} to ${branchName}` 
                          : `From ${branchName} to ${transfer.destinationBranchName}`}
                      </p>
                    </div>
                    <div>
                      {transfer.status === 'pending' && (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 text-sm font-medium text-yellow-800 dark:text-yellow-300 shadow-sm">
                          <ClockIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                          Pending
                        </span>
                      )}
                      {transfer.status === 'approved' && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300 shadow-sm">
                          <CheckIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-blue-500 dark:text-blue-400" />
                          Approved
                        </span>
                      )}
                      {transfer.status === 'completed' && (
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 shadow-sm">
                          <CheckIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-green-500 dark:text-green-400" />
                          Completed
                        </span>
                      )}
                      {transfer.status === 'rejected' && (
                        <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-sm font-medium text-red-800 dark:text-red-300 shadow-sm">
                          <XMarkIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-red-500 dark:text-red-400" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <span className="font-medium text-gray-700 dark:text-gray-300 min-w-28">Request Date:</span> {formatDate(transfer.requestDate)}
                      </div>
                      {isApproved(transfer) && (
                        <div className="flex items-start">
                          <span className="font-medium text-gray-700 dark:text-gray-300 min-w-28">Approved Date:</span> {formatDate(transfer.approvedDate)}
                        </div>
                      )}
                      {isCompleted(transfer) && (
                        <div className="flex items-start">
                          <span className="font-medium text-gray-700 dark:text-gray-300 min-w-28">Completed Date:</span> {formatDate(transfer.completedDate)}
                        </div>
                      )}
                      {isRejected(transfer) && (
                        <div className="flex items-start">
                          <span className="font-medium text-gray-700 dark:text-gray-300 min-w-28">Rejected Date:</span> {formatDate(transfer.rejectedDate)}
                        </div>
                      )}
                      <div className="sm:col-span-2 flex items-start">
                        <span className="font-medium text-gray-700 dark:text-gray-300 min-w-28">Reason:</span> <span>{transfer.reason}</span>
                      </div>
                      {isRejected(transfer) && (
                        <div className="sm:col-span-2 flex items-start">
                          <span className="font-medium text-gray-700 dark:text-gray-300 min-w-28">Rejection Reason:</span> <span>{transfer.rejectionReason}</span>
                        </div>
                      )}
                      <div className="sm:col-span-2 flex items-start">
                        <span className="font-medium text-gray-700 dark:text-gray-300 min-w-28">Data Being Transferred:</span>
                        <div className="flex flex-wrap gap-1">
                          {transfer.transferData.map((item) => (
                            <span key={item} className="capitalize inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:text-indigo-300">
                              {item.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons based on transfer status */}
                  {activeTab === 'incoming' && transfer.status === 'pending' && (
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => handleRejectTransfer(transfer.id)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50 transition-colors"
                      >
                        <XMarkIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveTransfer(transfer.id)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-colors"
                      >
                        <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" />
                        Approve
                      </button>
                    </div>
                  )}
                  
                  {activeTab === 'incoming' && transfer.status === 'approved' && (
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCompleteTransfer(transfer.id)}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none disabled:opacity-50 transition-colors"
                      >
                        <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" />
                        Complete Transfer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
