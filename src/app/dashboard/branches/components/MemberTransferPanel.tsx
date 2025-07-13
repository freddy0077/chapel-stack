"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  UserPlusIcon, 
  UserMinusIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { useTransferRequests, TransferStatus, TransferDataType, TransferRequest } from "../../../../hooks/useTransferRequests";
import { usePermissions } from "../../../../hooks/usePermissions";
import NewTransferModal from './NewTransferModal';
import toast from "react-hot-toast";

// Define types for transfer requests
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

interface MemberTransferPanelProps {
  branchId: string;
  branchName: string;
}

export default function MemberTransferPanel({ branchId, branchName }: MemberTransferPanelProps) {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [showBatchApproveModal, setShowBatchApproveModal] = useState(false);
  const [selectedTransfers, setSelectedTransfers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTransfers, setProcessingTransfers] = useState<Record<string, boolean>>({});
  
  // Get permissions
  const { isBranchAdmin, isSuperAdmin } = usePermissions();
  const canManageTransfers = isBranchAdmin || isSuperAdmin;
  
  // Use our custom hook instead of mock data
  const {
    incomingTransfers,
    outgoingTransfers,
    incomingTransfersMeta,
    outgoingTransfersMeta,
    loading,
    error,
    actions,
    pagination
  } = useTransferRequests({ branchId });

  // Reset selected transfers when data changes
  useEffect(() => {
    setSelectedTransfers([]);
  }, [incomingTransfers, outgoingTransfers]);
  
  // Filter transfer requests based on active tab
  const transferRequests = activeTab === 'incoming' ? incomingTransfers : outgoingTransfers;
  
  const handleApproveTransfer = async (transferId: string) => {
    try {
      setProcessingTransfers(prev => ({ ...prev, [transferId]: true }));
      await actions.approveTransfer(transferId);
      toast.success("Transfer request approved successfully");
    } catch (error) {
      console.error("Error approving transfer:", error);
      toast.error("Failed to approve transfer request");
    } finally {
      setProcessingTransfers(prev => ({ ...prev, [transferId]: false }));
    }
  };
  
  const openRejectionModal = (transferId: string) => {
    setSelectedTransferId(transferId);
    setRejectionReason('');
    setShowRejectionModal(true);
  };
  
  const handleRejectTransfer = async () => {
    if (!selectedTransferId || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    try {
      setIsProcessing(true);
      await actions.rejectTransfer(selectedTransferId, rejectionReason);
      toast.success("Transfer request rejected");
      setShowRejectionModal(false);
      setSelectedTransferId(null);
      setRejectionReason('');
    } catch (error) {
      console.error("Error rejecting transfer:", error);
      toast.error("Failed to reject transfer request");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCompleteTransfer = async (transferId: string) => {
    try {
      setProcessingTransfers(prev => ({ ...prev, [transferId]: true }));
      await actions.completeTransfer(transferId);
      toast.success("Transfer completed successfully");
    } catch (error) {
      console.error("Error completing transfer:", error);
      toast.error("Failed to complete transfer");
    } finally {
      setProcessingTransfers(prev => ({ ...prev, [transferId]: false }));
    }
  };
  
  // Batch approval functionality
  const toggleTransferSelection = (transferId: string, event: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    // Stop propagation to prevent other click handlers from firing
    if (event) {
      event.stopPropagation();
    }
    
    setSelectedTransfers(prev => {
      const isSelected = prev.includes(transferId);
      if (isSelected) {
        return prev.filter(id => id !== transferId);
      } else {
        return [...prev, transferId];
      }
    });
  };
  
  const handleRowClick = (transfer: TransferRequest) => {
    if (activeTab === 'incoming' && isPending(transfer)) {
      toggleTransferSelection(transfer.id, null);
    }
  };
  
  const handleBatchApprove = async () => {
    try {
      setIsProcessing(true);
      const results = await Promise.allSettled(
        selectedTransfers.map(id => actions.approveTransfer(id))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (failed === 0) {
        toast.success(`Successfully approved ${successful} transfer requests`);
      } else if (successful === 0) {
        toast.error(`Failed to approve ${failed} transfer requests`);
      } else {
        toast.success(`Approved ${successful} transfers, ${failed} failed`);
      }
      
      setSelectedTransfers([]);
      setShowBatchApproveModal(false);
    } catch (error) {
      console.error("Error in batch approval:", error);
      toast.error("Failed to process batch approval");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Pagination helpers
  const hasPrevPage = activeTab === 'incoming' 
    ? pagination.incomingCurrentPage > 1 
    : pagination.outgoingCurrentPage > 1;
    
  const hasNextPage = activeTab === 'incoming' 
    ? incomingTransfersMeta.hasNextPage 
    : outgoingTransfersMeta.hasNextPage;
    
  const currentPage = activeTab === 'incoming'
    ? pagination.incomingCurrentPage
    : pagination.outgoingCurrentPage;
    
  const totalPages = activeTab === 'incoming'
    ? Math.ceil(incomingTransfersMeta.totalCount / pagination.pageSize) || 1
    : Math.ceil(outgoingTransfersMeta.totalCount / pagination.pageSize) || 1;
    
  const handlePrevPage = () => {
    if (!hasPrevPage) return;
    
    if (activeTab === 'incoming') {
      pagination.setIncomingCurrentPage(pagination.incomingCurrentPage - 1);
    } else {
      pagination.setOutgoingCurrentPage(pagination.outgoingCurrentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (activeTab === 'incoming') {
      pagination.setIncomingCurrentPage(pagination.incomingCurrentPage + 1);
    } else {
      pagination.setOutgoingCurrentPage(pagination.outgoingCurrentPage + 1);
    }
  };
  
  // Type guards for transfer request types
  const isApproved = (transfer: TransferRequest): boolean => {
    return transfer.status.toUpperCase() === 'APPROVED';
  };
  
  const isPending = (transfer: TransferRequest): boolean => {
    return transfer.status.toUpperCase() === 'PENDING';
  };
  
  const isRejected = (transfer: TransferRequest): boolean => {
    return transfer.status.toUpperCase() === 'REJECTED';
  };
  
  const isCompleted = (transfer: TransferRequest): boolean => {
    return transfer.status.toUpperCase() === 'COMPLETED';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Tab navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => {
              setActiveTab('incoming');
              setSelectedTransfers([]);
            }}
            className={`${
              activeTab === 'incoming'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          >
            <div className="flex items-center justify-center">
              <ArrowsRightLeftIcon className="mr-2 h-5 w-5" />
              Incoming Transfers
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('outgoing');
              setSelectedTransfers([]);
            }}
            className={`${
              activeTab === 'outgoing'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
            } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
          >
            <div className="flex items-center justify-center">
              <ArrowsRightLeftIcon className="mr-2 h-5 w-5" />
              Outgoing Transfers
            </div>
          </button>
        </nav>
      </div>
      
      {/* Panel content */}
      <div className="px-4 py-5 sm:p-6">
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <ArrowPathIcon className="animate-spin h-8 w-8 text-indigo-500" />
            <span className="ml-2 text-gray-500 dark:text-gray-400">Loading transfers...</span>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Error loading transfer requests
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                  <p>Please try again later or contact support if the problem persists.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Batch approval button */}
        {activeTab === 'incoming' && !loading && !error && transferRequests.length > 0 && canManageTransfers && (
          <div className="mb-4">
            {selectedTransfers.length > 0 ? (
              <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {selectedTransfers.length} transfer{selectedTransfers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedTransfers([])}
                    className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowBatchApproveModal(true)}
                    disabled={selectedTransfers.length === 0 || isProcessing}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                  >
                    <CheckIcon className="-ml-0.5 mr-2 h-4 w-4" />
                    Batch Approve ({selectedTransfers.length})
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                Select transfers using the checkboxes to enable batch approval
              </div>
            )}
          </div>
        )}
        
        {/* Content */}
        {!loading && !error && (
          <div>
            {transferRequests.length === 0 ? (
              <div className="text-center py-12">
                <UserMinusIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transfer requests</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  There are no {activeTab === 'incoming' ? 'incoming' : 'outgoing'} transfer requests for {branchName} at this time.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowNewTransferModal(true)}
                    className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none transition-colors"
                  >
                    <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Transfer Request
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {transferRequests.map((transfer) => (
                  <div 
                    key={transfer.id} 
                    onClick={() => handleRowClick(transfer)}
                    className={`px-4 py-6 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      selectedTransfers.includes(transfer.id) ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500' : ''
                    } ${activeTab === 'incoming' && isPending(transfer) ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {activeTab === 'incoming' && isPending(transfer) && canManageTransfers && (
                          <div className="mr-3" onClick={(e) => e.stopPropagation()}>
                            <div className="relative flex items-start">
                              <div className="flex h-6 items-center">
                                <input
                                  id={`transfer-checkbox-${transfer.id}`}
                                  type="checkbox"
                                  checked={selectedTransfers.includes(transfer.id)}
                                  onChange={(e) => toggleTransferSelection(transfer.id, e)}
                                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                  aria-label={`Select transfer for ${transfer.memberName}`}
                                />
                              </div>
                            </div>
                          </div>
                        )}
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
                      </div>
                      <div>
                        {isPending(transfer) && (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 text-sm font-medium text-yellow-800 dark:text-yellow-300 shadow-sm">
                            <ClockIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                            Pending
                          </span>
                        )}
                        {isApproved(transfer) && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300 shadow-sm">
                            <CheckIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-blue-500 dark:text-blue-400" />
                            Approved
                          </span>
                        )}
                        {isCompleted(transfer) && (
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 shadow-sm">
                            <CheckIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-green-500 dark:text-green-400" />
                            Completed
                          </span>
                        )}
                        {isRejected(transfer) && (
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
                    {activeTab === 'incoming' && isPending(transfer) && canManageTransfers && (
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => openRejectionModal(transfer.id)}
                          disabled={isProcessing}
                          className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50"
                        >
                          <XMarkIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveTransfer(transfer.id)}
                          disabled={isProcessing || processingTransfers[transfer.id]}
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                        >
                          {processingTransfers[transfer.id] ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckIcon className="-ml-0.5 mr-1 h-4 w-4" aria-hidden="true" />
                              Approve
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    {activeTab === 'incoming' && isApproved(transfer) && canManageTransfers && (
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleCompleteTransfer(transfer.id)}
                          disabled={isProcessing || processingTransfers[transfer.id]}
                          className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none disabled:opacity-50"
                        >
                          {processingTransfers[transfer.id] ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                              Complete Transfer
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Pagination */}
        <div className="px-4 py-4 sm:px-6">
          <nav className="flex justify-between">
            <button
              onClick={handlePrevPage}
              disabled={!hasPrevPage}
              className={`${
                hasPrevPage
                  ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              } inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none transition-colors`}
            >
              Previous
            </button>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className={`${
                hasNextPage
                  ? 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              } inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none transition-colors`}
            >
              Next
            </button>
          </nav>
        </div>
        
        {/* Rejection Modal */}
        {showRejectionModal && selectedTransferId && (
          <div className="fixed inset-0 z-50 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              
              <div 
                className="inline-block align-middle bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full relative z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                      <XMarkIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Reject Transfer Request
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Please provide a reason for rejecting this transfer request. This will be visible to the member and the source branch.
                        </p>
                        <div className="mt-4">
                          <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Rejection Reason
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="rejectionReason"
                              name="rejectionReason"
                              rows={4}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Enter reason for rejection..."
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRejectTransfer();
                    }}
                    disabled={!rejectionReason.trim() || isProcessing}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Reject</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRejectionModal(false);
                      setSelectedTransferId(null);
                      setRejectionReason('');
                    }}
                    disabled={isProcessing}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Batch Approve Modal */}
        {showBatchApproveModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </div>
              
              <div 
                className="inline-block align-middle bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full relative z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                      <CheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Batch Approve Transfer Requests
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Are you sure you want to approve the selected transfer requests?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBatchApprove();
                    }}
                    disabled={isProcessing}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Approve All</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBatchApproveModal(false);
                      setSelectedTransfers([]);
                    }}
                    disabled={isProcessing}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* New Transfer Modal */}
        <NewTransferModal
          isOpen={showNewTransferModal}
          onClose={() => setShowNewTransferModal(false)}
          currentBranchId={branchId}
          onSuccess={() => pagination.reset()}
        />
      </div>
    </div>
  );
}
