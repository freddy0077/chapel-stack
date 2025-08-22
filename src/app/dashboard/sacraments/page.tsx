"use client";

import { useState, useRef } from "react";
import { SparklesIcon, ChartBarIcon, DocumentArrowDownIcon, BellIcon } from "@heroicons/react/24/outline";
import DashboardHeader from "@/components/DashboardHeader";
import { toast } from "react-hot-toast";

// Import existing modular components
import SacramentActionMenu from "./components/SacramentActionMenu";
import SacramentStatsOverview from "./components/SacramentStatsOverview";
import SacramentTabContentEnhanced from "./components/SacramentTabContentEnhanced";
import SacramentModalManager from "./components/SacramentModalManager";

// Import new Priority 2 components
import SacramentDetailModal from "./components/SacramentDetailModal";
import SacramentAnalytics from "./components/SacramentAnalytics";
import AnniversaryNotifications from "./components/AnniversaryNotifications";
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

  // Modal states for all sacrament types
  const [isBaptismModalOpen, setIsBaptismModalOpen] = useState(false);
  const [isCommunionModalOpen, setIsCommunionModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMarriageModalOpen, setIsMarriageModalOpen] = useState(false);
  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);
  const [isAnointingModalOpen, setIsAnointingModalOpen] = useState(false);
  const [isDiaconateModalOpen, setIsDiaconateModalOpen] = useState(false);
  const [isPriesthoodModalOpen, setIsPriesthoodModalOpen] = useState(false);
  const [isRciaModalOpen, setIsRciaModalOpen] = useState(false);

  // Priority 2 modal states
  const [selectedRecord, setSelectedRecord] = useState<SacramentRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCertificateManager, setShowCertificateManager] = useState(false);
  const [showAnniversaryNotifications, setShowAnniversaryNotifications] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Phase 3: Marriage Analytics modal states
  const [isMarriageAnalyticsOpen, setIsMarriageAnalyticsOpen] = useState(false);
  const [isMemberMarriageHistoryOpen, setIsMemberMarriageHistoryOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Store refetch functions for each sacrament type
  const baptismRefetchRef = useRef<(() => void) | null>(null);
  const communionRefetchRef = useRef<(() => void) | null>(null);
  const confirmationRefetchRef = useRef<(() => void) | null>(null);
  const marriageRefetchRef = useRef<(() => void) | null>(null);
  const reconciliationRefetchRef = useRef<(() => void) | null>(null);
  const anointingRefetchRef = useRef<(() => void) | null>(null);
  const diaconateRefetchRef = useRef<(() => void) | null>(null);
  const priesthoodRefetchRef = useRef<(() => void) | null>(null);
  const rciaRefetchRef = useRef<(() => void) | null>(null);

  // Delete mutation hook
  const [deleteRecord, { loading: deleting }] = useDeleteSacramentalRecord();

  // Handlers for Priority 2 functionality
  const handleViewRecord = (record: SacramentRecord) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleEditRecord = (record: SacramentRecord) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteRecord({
        variables: { id: recordId },
      });
      
      toast.success('Sacrament record deleted successfully');
      
      // Trigger refetch for all sacrament types to ensure UI is updated
      baptismRefetchRef.current?.();
      communionRefetchRef.current?.();
      confirmationRefetchRef.current?.();
      marriageRefetchRef.current?.();
      reconciliationRefetchRef.current?.();
      anointingRefetchRef.current?.();
      diaconateRefetchRef.current?.();
      priesthoodRefetchRef.current?.();
      rciaRefetchRef.current?.();
    } catch (error: any) {
      console.error('Error deleting record:', error);
      toast.error(error.message || 'Failed to delete sacrament record');
    }
  };

  const handleGenerateCertificate = (record: SacramentRecord) => {
    setSelectedRecord(record);
    setShowCertificateManager(true);
  };

  const handleCertificateGenerated = (certificateUrl: string, certificateNumber: string) => {
    // Update the record with the new certificate information
    if (selectedRecord) {
      setSelectedRecord({
        ...selectedRecord,
        certificateUrl,
        certificateNumber,
      });
    }
    setShowCertificateManager(false);
  };

  const handleEditSuccess = () => {
    // Trigger refetch for all sacrament types to ensure UI is updated
    baptismRefetchRef.current?.();
    communionRefetchRef.current?.();
    confirmationRefetchRef.current?.();
    marriageRefetchRef.current?.();
    reconciliationRefetchRef.current?.();
    anointingRefetchRef.current?.();
    diaconateRefetchRef.current?.();
    priesthoodRefetchRef.current?.();
    rciaRefetchRef.current?.();
    
    toast.success('Record updated successfully');
  };

  const handleViewMarriageAnalytics = () => {
    setIsMarriageAnalyticsOpen(true);
  };

  const handleViewMemberMarriageHistory = (memberId: string) => {
    setSelectedMemberId(memberId);
    setIsMemberMarriageHistoryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <DashboardHeader
        title="Sacraments"
        subtitle="Comprehensive sacramental records management with analytics, certificates, and notifications"
        icon={<SparklesIcon className="h-10 w-10 text-white" />}
        action={
          <SacramentActionMenu
            onBaptismClick={() => setIsBaptismModalOpen(true)}
            onCommunionClick={() => setIsCommunionModalOpen(true)}
            onConfirmationClick={() => setIsConfirmationModalOpen(true)}
            onMarriageClick={() => setIsMarriageModalOpen(true)}
            onReconciliationClick={() => setIsReconciliationModalOpen(true)}
            onAnointingClick={() => setIsAnointingModalOpen(true)}
            onDiaconateClick={() => setIsDiaconateModalOpen(true)}
            onPriesthoodClick={() => setIsPriesthoodModalOpen(true)}
            onRciaClick={() => setIsRciaModalOpen(true)}
          />
        }
      />
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview - Always visible */}
        <SacramentStatsOverview period="all" />

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
              <SacramentTabContentEnhanced
                baptismRefetchRef={baptismRefetchRef}
                communionRefetchRef={communionRefetchRef}
                confirmationRefetchRef={confirmationRefetchRef}
                marriageRefetchRef={marriageRefetchRef}
                reconciliationRefetchRef={reconciliationRefetchRef}
                anointingRefetchRef={anointingRefetchRef}
                diaconateRefetchRef={diaconateRefetchRef}
                priesthoodRefetchRef={priesthoodRefetchRef}
                rciaRefetchRef={rciaRefetchRef}
                onViewRecord={handleViewRecord}
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
                onGenerateCertificate={handleGenerateCertificate}
                onViewMarriageAnalytics={handleViewMarriageAnalytics}
                onViewMemberMarriageHistory={handleViewMemberMarriageHistory}
              />
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
        isBaptismModalOpen={isBaptismModalOpen}
        isCommunionModalOpen={isCommunionModalOpen}
        isConfirmationModalOpen={isConfirmationModalOpen}
        isMarriageModalOpen={isMarriageModalOpen}
        isReconciliationModalOpen={isReconciliationModalOpen}
        isAnointingModalOpen={isAnointingModalOpen}
        isDiaconateModalOpen={isDiaconateModalOpen}
        isPriesthoodModalOpen={isPriesthoodModalOpen}
        isRciaModalOpen={isRciaModalOpen}
        setIsBaptismModalOpen={setIsBaptismModalOpen}
        setIsCommunionModalOpen={setIsCommunionModalOpen}
        setIsConfirmationModalOpen={setIsConfirmationModalOpen}
        setIsMarriageModalOpen={setIsMarriageModalOpen}
        setIsReconciliationModalOpen={setIsReconciliationModalOpen}
        setIsAnointingModalOpen={setIsAnointingModalOpen}
        setIsDiaconateModalOpen={setIsDiaconateModalOpen}
        setIsPriesthoodModalOpen={setIsPriesthoodModalOpen}
        setIsRciaModalOpen={setIsRciaModalOpen}
        baptismRefetchRef={baptismRefetchRef}
        communionRefetchRef={communionRefetchRef}
        confirmationRefetchRef={confirmationRefetchRef}
        marriageRefetchRef={marriageRefetchRef}
        reconciliationRefetchRef={reconciliationRefetchRef}
        anointingRefetchRef={anointingRefetchRef}
        diaconateRefetchRef={diaconateRefetchRef}
        priesthoodRefetchRef={priesthoodRefetchRef}
        rciaRefetchRef={rciaRefetchRef}
        isMarriageAnalyticsOpen={isMarriageAnalyticsOpen}
        setIsMarriageAnalyticsOpen={setIsMarriageAnalyticsOpen}
        isMemberMarriageHistoryOpen={isMemberMarriageHistoryOpen}
        setIsMemberMarriageHistoryOpen={setIsMemberMarriageHistoryOpen}
        selectedMemberId={selectedMemberId}
      />

      {/* Detail Modal for Viewing Records */}
      {showDetailModal && selectedRecord && (
        <SacramentDetailModal
          record={selectedRecord}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRecord(null);
          }}
          onEdit={(record) => {
            setSelectedRecord(record);
            setShowDetailModal(false);
            setShowEditModal(true);
          }}
          onDelete={(recordId) => {
            // Handle delete logic here
            console.log('Delete record:', recordId);
            setShowDetailModal(false);
            setSelectedRecord(null);
            // You can add actual delete mutation here
          }}
          onGenerateCertificate={(record) => {
            setSelectedRecord(record);
            setShowDetailModal(false);
            setShowCertificateManager(true);
          }}
        />
      )}

      {/* Edit Modal for Editing Records */}
      {showEditModal && selectedRecord && (
        <SacramentDetailModal
          record={selectedRecord}
          isOpen={showEditModal}
          isEditMode={true}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRecord(null);
          }}
          onEdit={(record) => {
            // Already in edit mode, so just update the record
            setSelectedRecord(record);
          }}
          onDelete={(recordId) => {
            // Handle delete logic here
            console.log('Delete record:', recordId);
            setShowEditModal(false);
            setSelectedRecord(null);
            // You can add actual delete mutation here
          }}
          onGenerateCertificate={(record) => {
            setSelectedRecord(record);
            setShowEditModal(false);
            setShowCertificateManager(true);
          }}
          onSave={() => {
            // Trigger refetch for all sacrament types to ensure UI is updated
            baptismRefetchRef.current?.();
            communionRefetchRef.current?.();
            confirmationRefetchRef.current?.();
            marriageRefetchRef.current?.();
            reconciliationRefetchRef.current?.();
            anointingRefetchRef.current?.();
            diaconateRefetchRef.current?.();
            priesthoodRefetchRef.current?.();
            rciaRefetchRef.current?.();
            setShowEditModal(false);
            setSelectedRecord(null);
            toast.success('Sacrament record updated successfully');
          }}
        />
      )}

      {/* Certificate Manager Modal */}
      {showCertificateManager && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Certificate Management</h3>
              <button
                onClick={() => {
                  setShowCertificateManager(false);
                  setSelectedRecord(null);
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
                  {selectedRecord.sacramentType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} Certificate
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Member: {selectedRecord.memberName || `ID: ${selectedRecord.memberId}`}
                </p>
                <p className="text-sm text-blue-700">
                  Date: {new Date(selectedRecord.dateOfSacrament).toLocaleDateString()}
                </p>
              </div>

              {selectedRecord.certificateUrl ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-600 font-medium">✓ Certificate Available</p>
                  {selectedRecord.certificateNumber && (
                    <p className="text-sm text-gray-600">Certificate #: {selectedRecord.certificateNumber}</p>
                  )}
                  <div className="flex space-x-2">
                    <a
                      href={selectedRecord.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      View Certificate
                    </a>
                    <a
                      href={selectedRecord.certificateUrl}
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
                    onClick={() => {
                      // Placeholder for certificate generation
                      toast.success('Certificate generation feature coming soon!');
                    }}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Generate Certificate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
