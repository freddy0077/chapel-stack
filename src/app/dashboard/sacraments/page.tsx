"use client";

import { useState, useCallback } from "react";
import { SparklesIcon, ChartBarIcon, DocumentArrowDownIcon, BellIcon } from "@heroicons/react/24/outline";
import DashboardHeader from "@/components/DashboardHeader";
import { toast } from "react-hot-toast";

// Import new hooks
import { useSacramentModals, MODAL_TYPES, SACRAMENT_TYPES } from "@/hooks/useSacramentModals";
import { useSacramentRefetch } from "@/hooks/useSacramentRefetch";
import { useSacramentLoading } from "@/hooks/useSacramentLoading";

// Import error boundary and loading components
import { SacramentErrorBoundary } from "@/components/ErrorBoundary";
import { SacramentStatsSkeleton } from "@/components/ui/SkeletonLoader";

// Import sacrament constants and utilities
import { formatSacramentType } from "@/utils/sacramentHelpers";
import SacramentSearch from "@/components/sacraments/SacramentSearch";
import { SacramentBreadcrumbs } from "@/components/ui/Breadcrumbs";
import { exportSacramentRecords, filterRecordsForExport } from "@/utils/sacramentExport";
import AnniversaryWidget from "@/components/sacraments/AnniversaryWidget";
import AnniversaryNotifications from "@/components/sacraments/AnniversaryNotifications";

// Import existing modular components
import SacramentActionMenu from "./components/SacramentActionMenu";
import SacramentStatsOverview from "./components/SacramentStatsOverview";
import SacramentTabContentEnhanced from "./components/SacramentTabContentEnhanced";
import SacramentModalManager from "./components/SacramentModalManager";

// Import new Priority 2 components
import SacramentDetailModal from "./components/SacramentDetailModal";
import SacramentAnalytics from "./components/SacramentAnalytics";
import CertificateManagementDashboard from "./components/CertificateManagementDashboard";

// Import hooks for edit and delete functionality
import { useDeleteSacramentalRecord } from "@/graphql/hooks/useDeleteSacramentalRecord";

interface SacramentRecord {
  id: string;
  memberId: string;
  sacramentType: string;
  dateOfSacrament: string;
  locationOfSacrament: string;
  officiantName: string;
  officiantId?: string | null;
  godparent1Name?: string | null;
  godparent2Name?: string | null;
  sponsorName?: string | null;
  witness1Name?: string | null;
  witness2Name?: string | null;
  groomName?: string | null;
  brideName?: string | null;
  certificateNumber?: string | null;
  certificateUrl?: string | null;
  notes?: string | null;
  branchId: string;
  organisationId?: string | null;
  createdAt: string;
  updatedAt: string;
  // Additional computed fields for better display
  memberName?: string;
  displayName?: string;
}

const tabs = [
  { id: 'records', name: 'Sacrament Records', icon: SparklesIcon },
  { id: 'analytics', name: 'Analytics & Reports', icon: ChartBarIcon },
  // { id: 'certificates', name: 'Certificate Management', icon: DocumentArrowDownIcon },
  { id: 'notifications', name: 'Anniversary Notifications', icon: BellIcon },
];

export default function SacramentsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState('records');

  // Search and filtering state
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    sacramentType: 'all' as const,
    dateRange: { start: '', end: '' },
    location: '',
    officiant: '',
    hasNotes: null as boolean | null,
    hasCertificate: null as boolean | null,
    sortBy: 'dateOfSacrament' as const,
    sortOrder: 'desc' as const,
  });

  // Anniversary notifications state
  const [isAnniversaryModalOpen, setIsAnniversaryModalOpen] = useState(false);

  // Use new unified hooks
  const modalManager = useSacramentModals();
  const refetchManager = useSacramentRefetch();
  const loadingManager = useSacramentLoading();

  // Delete mutation hook
  const [deleteRecord, { loading: deleting }] = useDeleteSacramentalRecord();

  // Memoized handlers using the new modal management system
  const handleViewRecord = useCallback((record: SacramentRecord) => {
    modalManager.openDetailModal(record);
  }, [modalManager]);

  const handleEditRecord = useCallback((record: SacramentRecord) => {
    modalManager.openEditModal(record);
  }, [modalManager]);

  const handleDeleteRecord = useCallback(async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

    try {
      await loadingManager.withLoading(
        async () => {
          await deleteRecord({
            variables: { id: recordId },
          });
          
          toast.success('Sacrament record deleted successfully');
          
          // Trigger refetch for all sacrament types using unified system
          refetchManager.refetchAll();
        },
        'delete',
        'Deleting sacrament record...',
        recordId
      );
    } catch (error: any) {
      console.error('Error deleting record:', error);
      toast.error(error.message || 'Failed to delete sacrament record');
    }
  }, [deleteRecord, refetchManager, loadingManager]);

  const handleGenerateCertificate = useCallback((record: SacramentRecord) => {
    modalManager.openCertificateModal(record);
  }, [modalManager]);

  const handleCertificateGenerated = useCallback((certificateUrl: string, certificateNumber: string) => {
    // Update the record with the new certificate information
    if (modalManager.selectedRecord) {
      modalManager.setSelectedRecord({
        ...modalManager.selectedRecord,
        certificateUrl,
        certificateNumber,
      });
    }
    modalManager.closeModal(MODAL_TYPES.CERTIFICATE);
  }, [modalManager]);

  const handleEditSuccess = useCallback(() => {
    // Trigger refetch for all sacrament types using unified system
    refetchManager.refetchAll();
    
    toast.success('Record updated successfully');
  }, [refetchManager]);

  const handleViewMarriageAnalytics = useCallback(() => {
    modalManager.openMarriageAnalytics();
  }, [modalManager]);

  const handleViewMemberMarriageHistory = useCallback((memberId: string) => {
    modalManager.openMemberMarriageHistory(memberId);
  }, [modalManager]);

  // Bulk operations handlers
  const handleBulkDelete = useCallback(async (recordIds: string[]) => {
    try {
      await loadingManager.withLoading(
        async () => {
          // Delete each record - in a real implementation, this would be a bulk delete mutation
          for (const recordId of recordIds) {
            await deleteRecord({ variables: { id: recordId } });
          }
          
          toast.success(`${recordIds.length} sacrament record(s) deleted successfully`);
          refetchManager.refetchAll();
        },
        'delete',
        `Deleting ${recordIds.length} records...`
      );
    } catch (error: any) {
      console.error('Bulk delete error:', error);
      toast.error(error.message || 'Failed to delete selected records');
    }
  }, [deleteRecord, refetchManager, loadingManager]);

  const handleBulkExport = useCallback(async (recordIds: string[], format: 'csv' | 'pdf' | 'excel') => {
    try {
      await loadingManager.withLoading(
        async () => {
          // Placeholder for bulk export functionality
          await new Promise(resolve => setTimeout(resolve, 1500));
          toast.success(`${recordIds.length} record(s) exported as ${format.toUpperCase()}`);
        },
        'export',
        `Exporting ${recordIds.length} records as ${format.toUpperCase()}...`
      );
    } catch (error: any) {
      console.error('Bulk export error:', error);
      toast.error(error.message || 'Failed to export selected records');
    }
  }, [loadingManager]);

  return (
    <SacramentErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <DashboardHeader
        title="Sacraments"
        subtitle="Comprehensive sacramental records management with analytics, certificates, and notifications"
        icon={<SparklesIcon className="h-10 w-10 text-white" />}
        action={
          <SacramentActionMenu
            onBaptismClick={() => modalManager.openSacramentModal(SACRAMENT_TYPES.BAPTISM)}
            onCommunionClick={() => modalManager.openSacramentModal(SACRAMENT_TYPES.COMMUNION)}
            onConfirmationClick={() => modalManager.openSacramentModal(SACRAMENT_TYPES.CONFIRMATION)}
            onMarriageClick={() => modalManager.openSacramentModal(SACRAMENT_TYPES.MARRIAGE)}
            onReconciliationClick={() => modalManager.openSacramentModal(SACRAMENT_TYPES.RECONCILIATION)}
            onAnointingClick={() => modalManager.openSacramentModal(SACRAMENT_TYPES.ANOINTING)}
            onDiaconateClick={() => modalManager.openSacramentModal(SACRAMENT_TYPES.DIACONATE)}
            onPriesthoodClick={() => modalManager.openSacramentModal(SACRAMENT_TYPES.PRIESTHOOD)}
            onRciaClick={() => modalManager.openSacramentModal(SACRAMENT_TYPES.RCIA)}
          />
        }
      />
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <SacramentBreadcrumbs currentPage="Records" />
        </div>
        
        {/* Statistics Overview - Always visible */}
        <SacramentStatsOverview period="all" />

        {/* Anniversary Widget */}
        <div className="mt-6">
          <AnniversaryWidget 
            records={[]} // This would be populated with all sacrament records
            onViewAll={() => setIsAnniversaryModalOpen(true)}
          />
        </div>

        {/* Main Tab Navigation */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'records' && (
              <div className="space-y-6">
                {/* Advanced Search and Filtering */}
                <SacramentSearch
                  filters={searchFilters}
                  onFiltersChange={setSearchFilters}
                  totalRecords={0} // This would be calculated from actual data
                  filteredRecords={0} // This would be calculated from filtered data
                  isLoading={loadingManager.globalLoading.isLoading}
                  className="mb-6"
                />
                
                {/* Sacrament Records */}
                <SacramentTabContentEnhanced
                  baptismRefetchRef={refetchManager.baptismRefetchRef}
                  communionRefetchRef={refetchManager.communionRefetchRef}
                  confirmationRefetchRef={refetchManager.confirmationRefetchRef}
                  marriageRefetchRef={refetchManager.marriageRefetchRef}
                  reconciliationRefetchRef={refetchManager.reconciliationRefetchRef}
                  anointingRefetchRef={refetchManager.anointingRefetchRef}
                  diaconateRefetchRef={refetchManager.diaconateRefetchRef}
                  priesthoodRefetchRef={refetchManager.priesthoodRefetchRef}
                  rciaRefetchRef={refetchManager.rciaRefetchRef}
                  onViewRecord={handleViewRecord}
                  onEditRecord={handleEditRecord}
                  onDeleteRecord={handleDeleteRecord}
                  onGenerateCertificate={handleGenerateCertificate}
                  onViewMarriageAnalytics={handleViewMarriageAnalytics}
                  onViewMemberMarriageHistory={handleViewMemberMarriageHistory}
                />
              </div>
            )}

            {activeTab === 'analytics' && (
              <SacramentAnalytics className="mt-0" />
            )}

            {activeTab === 'certificates' && (
              <CertificateManagementDashboard />
            )}

            {activeTab === 'notifications' && (
              <AnniversaryNotifications className="mt-0" />
            )}
          </div>
        </div>
      </div>

      {/* Modal Manager for Creation Modals */}
      <SacramentModalManager
        isBaptismModalOpen={modalManager.isBaptismModalOpen}
        isCommunionModalOpen={modalManager.isCommunionModalOpen}
        isConfirmationModalOpen={modalManager.isConfirmationModalOpen}
        isMarriageModalOpen={modalManager.isMarriageModalOpen}
        isReconciliationModalOpen={modalManager.isReconciliationModalOpen}
        isAnointingModalOpen={modalManager.isAnointingModalOpen}
        isDiaconateModalOpen={modalManager.isDiaconateModalOpen}
        isPriesthoodModalOpen={modalManager.isPriesthoodModalOpen}
        isRciaModalOpen={modalManager.isRciaModalOpen}
        setIsBaptismModalOpen={(open) => open ? modalManager.openSacramentModal(SACRAMENT_TYPES.BAPTISM) : modalManager.closeSacramentModal(SACRAMENT_TYPES.BAPTISM)}
        setIsCommunionModalOpen={(open) => open ? modalManager.openSacramentModal(SACRAMENT_TYPES.COMMUNION) : modalManager.closeSacramentModal(SACRAMENT_TYPES.COMMUNION)}
        setIsConfirmationModalOpen={(open) => open ? modalManager.openSacramentModal(SACRAMENT_TYPES.CONFIRMATION) : modalManager.closeSacramentModal(SACRAMENT_TYPES.CONFIRMATION)}
        setIsMarriageModalOpen={(open) => open ? modalManager.openSacramentModal(SACRAMENT_TYPES.MARRIAGE) : modalManager.closeSacramentModal(SACRAMENT_TYPES.MARRIAGE)}
        setIsReconciliationModalOpen={(open) => open ? modalManager.openSacramentModal(SACRAMENT_TYPES.RECONCILIATION) : modalManager.closeSacramentModal(SACRAMENT_TYPES.RECONCILIATION)}
        setIsAnointingModalOpen={(open) => open ? modalManager.openSacramentModal(SACRAMENT_TYPES.ANOINTING) : modalManager.closeSacramentModal(SACRAMENT_TYPES.ANOINTING)}
        setIsDiaconateModalOpen={(open) => open ? modalManager.openSacramentModal(SACRAMENT_TYPES.DIACONATE) : modalManager.closeSacramentModal(SACRAMENT_TYPES.DIACONATE)}
        setIsPriesthoodModalOpen={(open) => open ? modalManager.openSacramentModal(SACRAMENT_TYPES.PRIESTHOOD) : modalManager.closeSacramentModal(SACRAMENT_TYPES.PRIESTHOOD)}
        setIsRciaModalOpen={(open) => open ? modalManager.openSacramentModal(SACRAMENT_TYPES.RCIA) : modalManager.closeSacramentModal(SACRAMENT_TYPES.RCIA)}
        baptismRefetchRef={refetchManager.baptismRefetchRef}
        communionRefetchRef={refetchManager.communionRefetchRef}
        confirmationRefetchRef={refetchManager.confirmationRefetchRef}
        marriageRefetchRef={refetchManager.marriageRefetchRef}
        reconciliationRefetchRef={refetchManager.reconciliationRefetchRef}
        anointingRefetchRef={refetchManager.anointingRefetchRef}
        diaconateRefetchRef={refetchManager.diaconateRefetchRef}
        priesthoodRefetchRef={refetchManager.priesthoodRefetchRef}
        rciaRefetchRef={refetchManager.rciaRefetchRef}
        isMarriageAnalyticsOpen={modalManager.isMarriageAnalyticsOpen}
        setIsMarriageAnalyticsOpen={(open) => open ? modalManager.openMarriageAnalytics() : modalManager.closeModal(MODAL_TYPES.MARRIAGE_ANALYTICS)}
        isMemberMarriageHistoryOpen={modalManager.isMemberMarriageHistoryOpen}
        setIsMemberMarriageHistoryOpen={(open) => open ? null : modalManager.closeModal(MODAL_TYPES.MEMBER_MARRIAGE_HISTORY)}
        selectedMemberId={modalManager.selectedMemberId}
      />

      {/* Detail Modal for Viewing Records */}
      {modalManager.showDetailModal && modalManager.selectedRecord && (
        <SacramentDetailModal
          record={modalManager.selectedRecord}
          isOpen={modalManager.showDetailModal}
          onClose={() => {
            modalManager.closeModal(MODAL_TYPES.DETAIL);
          }}
          onEdit={(record) => {
            modalManager.setSelectedRecord(record);
            modalManager.closeModal(MODAL_TYPES.DETAIL);
            modalManager.openModal(MODAL_TYPES.EDIT);
          }}
          onDelete={(recordId) => {
            handleDeleteRecord(recordId);
            modalManager.closeModal(MODAL_TYPES.DETAIL);
          }}
          onGenerateCertificate={(record) => {
            modalManager.setSelectedRecord(record);
            modalManager.closeModal(MODAL_TYPES.DETAIL);
            modalManager.openModal(MODAL_TYPES.CERTIFICATE);
          }}
        />
      )}

      {/* Edit Modal for Editing Records */}
      {modalManager.showEditModal && modalManager.selectedRecord && (
        <SacramentDetailModal
          record={modalManager.selectedRecord}
          isOpen={modalManager.showEditModal}
          isEditMode={true}
          onClose={() => {
            modalManager.closeModal(MODAL_TYPES.EDIT);
          }}
          onEdit={(record) => {
            // Already in edit mode, so just update the record
            modalManager.setSelectedRecord(record);
          }}
          onDelete={(recordId) => {
            handleDeleteRecord(recordId);
            modalManager.closeModal(MODAL_TYPES.EDIT);
          }}
          onGenerateCertificate={(record) => {
            modalManager.setSelectedRecord(record);
            modalManager.closeModal(MODAL_TYPES.EDIT);
            modalManager.openModal(MODAL_TYPES.CERTIFICATE);
          }}
          onSave={() => {
            // Trigger refetch for all sacrament types using unified system
            refetchManager.refetchAll();
            modalManager.closeModal(MODAL_TYPES.EDIT);
            toast.success('Sacrament record updated successfully');
          }}
        />
      )}

      {/* Certificate Manager Modal */}
      {modalManager.showCertificateManager && modalManager.selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Certificate Management</h3>
              <button
                onClick={() => {
                  modalManager.closeModal(MODAL_TYPES.CERTIFICATE);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  {formatSacramentType(modalManager.selectedRecord.sacramentType)} Certificate
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Member: {modalManager.selectedRecord.memberName || `ID: ${modalManager.selectedRecord.memberId}`}
                </p>
                <p className="text-sm text-blue-700">
                  Date: {new Date(modalManager.selectedRecord.dateOfSacrament).toLocaleDateString()}
                </p>
              </div>

              {modalManager.selectedRecord.certificateUrl ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-600 font-medium">✓ Certificate Available</p>
                  {modalManager.selectedRecord.certificateNumber && (
                    <p className="text-sm text-gray-600">Certificate #: {modalManager.selectedRecord.certificateNumber}</p>
                  )}
                  <div className="flex space-x-2">
                    <a
                      href={modalManager.selectedRecord.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      View Certificate
                    </a>
                    <a
                      href={modalManager.selectedRecord.certificateUrl}
                      download
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors text-center"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-amber-600 font-medium">⚠ No Certificate Generated</p>
                  <button
                    onClick={async () => {
                      await loadingManager.withLoading(
                        async () => {
                          // Placeholder for certificate generation
                          await new Promise(resolve => setTimeout(resolve, 1000));
                          toast.success('Certificate generation feature coming soon!');
                        },
                        'certificate',
                        'Generating certificate...'
                      );
                    }}
                    disabled={loadingManager.modalLoading.certificate.isLoading}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loadingManager.modalLoading.certificate.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      'Generate Certificate'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Anniversary Notifications Modal */}
      {isAnniversaryModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Anniversary Notifications
              </h3>
              <button
                onClick={() => setIsAnniversaryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <AnniversaryNotifications
              records={[]} // This would be populated with all sacrament records from GraphQL
              onSendNotification={async (notification) => {
                // Handle sending notification (email, SMS, etc.)
                console.log('Sending notification:', notification);
                // In real implementation, call API to send notification
              }}
              onMarkAsSent={async (notificationId) => {
                // Handle marking notification as sent
                console.log('Marking as sent:', notificationId);
              }}
              onDismiss={(notificationId) => {
                // Handle dismissing notification
                console.log('Dismissing:', notificationId);
              }}
            />
          </div>
        </div>
      )}
      </div>
    </SacramentErrorBoundary>
  );
}
