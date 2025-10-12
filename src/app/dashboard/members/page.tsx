"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useLazyQuery, useApolloClient } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  AdjustmentsHorizontalIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";

// Components
import MemberList from "./components/MemberList";
import MemberStats from "./components/MemberStats";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import AddMemberModal from "./components/AddMemberModal";
import MemberDetailModal from "./components/MemberDetailModal";
import EditMemberModal from "./components/EditMemberModal";
import AddSacramentModal from "./components/AddSacramentModal";
import BulkActionsBar from "./components/BulkActionsBar";
import ViewModeToggle from "./components/ViewModeToggle";
import BulkActionSelectionDialog from "./components/BulkActionSelectionDialog";
import ExportModal, { ExportOptions } from "./components/ExportModal";
import ImportMembersModal from "../../../components/members/ImportMembersModal";
import FamilyRelationshipModal from "./components/FamilyRelationshipModal";
import StatusSelectionModal from "./components/StatusSelectionModal";

// Hooks
import { useMembers } from "./hooks/useMembers";
import {
  useMemberStatistics,
  useSearchMembers,
  useUpdateMember,
  useRemoveMember,
  useTransferMember,
  useUpdateMemberStatus,
  useRfidOperations,
} from "./hooks/useMemberOperations";
import { useOrganisationBranch } from "../../../hooks/useOrganisationBranch";
import { useMemberManagement } from "../../../hooks/useMemberManagement";
import { GET_ALL_SMALL_GROUPS } from "@/graphql/queries/groupQueries";
import { LIST_MINISTRIES } from "@/graphql/queries/ministryQueries";
import { GET_MEMBER } from "@/graphql/queries/memberQueries";

// Types
import {
  ViewMode,
  MemberFilters,
  Member,
  BulkActionType,
} from "./types/member.types";

const MembersPage: React.FC = () => {
  // Apollo Client for cache management
  const apolloClient = useApolloClient();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [filters, setFilters] = useState<MemberFilters>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSacramentModal, setShowSacramentModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showMemberDetailModal, setShowMemberDetailModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showFamilyRelationshipModal, setShowFamilyRelationshipModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectionDialogData, setSelectionDialogData] = useState<{
    actionType: BulkActionType | null;
    options: { id: string; name: string }[];
    title: string;
    label: string;
  }>({ actionType: null, options: [], title: "", label: "" });

  // Organisation and branch context
  const { organisationId, branchId } = useOrganisationBranch();

  // Members data with enhanced filtering
  const {
    members,
    loading,
    error,
    pageInfo,
    refetch,
    loadMore,
    goToNextPage,
    goToPreviousPage,
  } = useMembers({
    search: searchQuery,
    filters: {
      ...filters,
      organisationId,
      branchId,
    },
    pageSize: 20,
  });

  // Member operations hooks
  const { statistics, loading: statsLoading, refetch: refetchStatistics } = useMemberStatistics(
    branchId,
    organisationId,
  );
  const {
    searchMembers,
    members: searchResults,
    loading: searchLoading,
  } = useSearchMembers();
  const { updateMember, loading: updateLoading } = useUpdateMember();
  const { removeMember, loading: removeLoading } = useRemoveMember();
  const { transferMember, loading: transferLoading } = useTransferMember();
  const { updateMemberStatus, loading: statusUpdateLoading } =
    useUpdateMemberStatus();
  const {
    assignRfidCard,
    removeRfidCard,
    getMemberByRfid,
    loading: rfidLoading,
  } = useRfidOperations();
  const {
    bulkUpdateMemberStatus,
    bulkDeactivateMembers,
    bulkExportMembers,
    bulkAddToGroup,
    bulkRemoveFromGroup,
    bulkAddToMinistry,
    bulkRemoveFromMinistry,
    loading: bulkLoading,
  } = useMemberManagement();

  // Group and Ministry queries
  const { data: groupsData } = useQuery(GET_ALL_SMALL_GROUPS, {
    variables: {
      filters: {
        organisationId,
        branchId,
      },
    },
    skip: !organisationId || !branchId,
  });
  const { data: ministriesData } = useQuery(LIST_MINISTRIES, {
    variables: {
      filters: {
        organisationId,
        branchId,
      },
    },
    skip: !organisationId || !branchId,
  });

  // Lazy query to fetch full member details on demand for the detail modal
  const [
    fetchMember,
    {
      data: memberDetailData,
      loading: memberDetailLoading,
      error: memberDetailError,
    },
  ] = useLazyQuery(GET_MEMBER);

  // Computed values
  const isLoading = loading || statsLoading;

  // Member management functions
  const handleUpdateMember = async (id: string, memberData: any) => {
    try {
      await updateMember(id, memberData);
      // Refresh both member list and statistics in real-time
      await Promise.all([
        refetch?.(),
        refetchStatistics?.()
      ]);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  // Open Edit modal with a member
  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setShowEditMemberModal(true);
  };

  // Open Family Relationship modal with a member
  const handleManageFamily = (member: Member) => {
    setSelectedMember(member);
    setShowFamilyRelationshipModal(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await removeMember(id);
        // Refresh both member list and statistics in real-time
        await Promise.all([
          refetch?.(),
          refetchStatistics?.()
        ]);
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  const handleTransferMember = async (
    id: string,
    fromBranchId: string,
    toBranchId: string,
    reason?: string,
  ) => {
    try {
      await transferMember(id, fromBranchId, toBranchId, reason);
      // Refresh data
      refetch?.();
    } catch (error) {
      console.error("Error transferring member:", error);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: string,
    reason?: string,
  ) => {
    try {
      await updateMemberStatus(id, status, reason);
      // Refresh data
      refetch?.();
    } catch (error) {
      console.error("Error updating member status:", error);
    }
  };

  const handleRfidAssign = async (memberId: string, rfidCardId: string) => {
    try {
      await assignRfidCard({ memberId, rfidCardId });
      // Refresh data
      refetch?.();
    } catch (error) {
      console.error("Error assigning RFID card:", error);
    }
  };

  const handleRfidRemove = async (memberId: string) => {
    try {
      await removeRfidCard(memberId);
      // Refresh data
      refetch?.();
    } catch (error) {
      console.error("Error removing RFID card:", error);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      try {
        await searchMembers(query, {
          branchId,
          ...filters,
        });
      } catch (error) {
        console.error("Error searching members:", error);
      }
    }
  };

  // Search effect - trigger search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const selectedCount = selectedMembers.length;
  const hasSelection = selectedCount > 0;

  // Handlers
  const handleFilterChange = (newFilters: Partial<MemberFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setSelectedMembers([]); // Clear selection on filter change
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleSelectAll = () => {
    if (selectedCount === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map((member) => member.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedMembers([]);
  };

  const handleBulkAction = async (actionType: BulkActionType, data?: any) => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member.");
      return;
    }

    try {
      switch (actionType) {
        case "recordSacrament":
          setShowSacramentModal(true);
          break;
        case "addToGroup":
          setSelectionDialogData({
            actionType,
            options:
              groupsData?.smallGroups.map((g: any) => ({
                id: g.id,
                name: g.name,
              })) || [],
            title: "Add Members to Group",
            label: "Select a group",
          });
          setIsSelectionDialogOpen(true);
          break;
        case "removeFromGroup":
          // Filter groups to only show those where selected members are actually members
          const memberGroupIds = new Set<string>();
          
          // Collect all group IDs that the selected members belong to
          groupsData?.smallGroups.forEach((group: any) => {
            const hasSelectedMember = group.members?.some((member: any) => 
              selectedMembers.includes(member.memberId) && member.status === 'ACTIVE'
            );
            if (hasSelectedMember) {
              memberGroupIds.add(group.id);
            }
          });
          
          // Filter to only groups where selected members are active members
          const memberGroups = groupsData?.smallGroups
            .filter((g: any) => memberGroupIds.has(g.id))
            .map((g: any) => ({
              id: g.id,
              name: g.name,
            })) || [];
          
          if (memberGroups.length === 0) {
            toast.error("Selected members are not in any groups");
            return;
          }
          
          setSelectionDialogData({
            actionType,
            options: memberGroups,
            title: "Remove Members from Group",
            label: "Select a group",
          });
          setIsSelectionDialogOpen(true);
          break;
        case "addToMinistry":
          setSelectionDialogData({
            actionType,
            options:
              ministriesData?.ministries.map((m: any) => ({
                id: m.id,
                name: m.name,
              })) || [],
            title: "Add Members to Ministry",
            label: "Select a ministry",
          });
          setIsSelectionDialogOpen(true);
          break;
        case "removeFromMinistry":
          // Filter ministries to only show those where selected members are actually members
          const memberMinistryIds = new Set<string>();
          
          // Collect all ministry IDs that the selected members belong to
          ministriesData?.ministries.forEach((ministry: any) => {
            const hasSelectedMember = ministry.members?.some((member: any) => 
              selectedMembers.includes(member.memberId) && member.status === 'ACTIVE'
            );
            if (hasSelectedMember) {
              memberMinistryIds.add(ministry.id);
            }
          });
          
          // Filter to only ministries where selected members are active members
          const memberMinistries = ministriesData?.ministries
            .filter((m: any) => memberMinistryIds.has(m.id))
            .map((m: any) => ({
              id: m.id,
              name: m.name,
            })) || [];
          
          if (memberMinistries.length === 0) {
            toast.error("Selected members are not in any ministries");
            return;
          }
          
          setSelectionDialogData({
            actionType,
            options: memberMinistries,
            title: "Remove Members from Ministry",
            label: "Select a ministry",
          });
          setIsSelectionDialogOpen(true);
          break;
        case "updateStatus":
          const newStatus = data?.newStatus;
          if (!newStatus) {
            toast.error("Please select a new status.");
            return;
          }
          await bulkUpdateMemberStatus({
            variables: {
              bulkUpdateStatusInput: {
                memberIds: selectedMembers,
                status: newStatus,
              },
            },
          });
          break;
        case "export": {
          const result = await bulkExportMembers({
            variables: {
              bulkExportInput: {
                memberIds: selectedMembers,
                format: data?.format || "CSV",
              },
            },
          });

          const exportContent: string | undefined =
            result?.data?.bulkExportMembers;
          if (exportContent) {
            try {
              // The backend now returns CSV content directly as a string
              const format = data?.format || "CSV";
              const mimeType =
                format === "PDF"
                  ? "application/pdf"
                  : "text/csv;charset=utf-8;";
              const blob = new Blob([exportContent], { type: mimeType });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              const extension = format.toLowerCase();
              link.href = url;
              link.download = `members-export-${new Date().toISOString().split("T")[0]}.${extension}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              toast.success(
                `Successfully exported ${selectedMembers.length} members`,
              );
            } catch (error) {
              console.error("Error processing export content:", error);
              toast.error("Failed to process export data");
            }
          } else {
            toast.error("Export failed: No data returned");
          }
          break;
        }
        case "deactivate":
          try {
            await bulkDeactivateMembers({
              variables: {
                bulkDeactivateInput: { memberIds: selectedMembers },
              },
            });
            
            // Immediately refresh both member list and statistics after deactivation
            toast.success("Members deactivated successfully!");
            
            // Clear selections first
            setSelectedMembers([]);
            
            // Force a complete cache reset and refetch all queries
            try {
              // Reset the entire Apollo cache - this will refetch all active queries
              await apolloClient.resetStore();
            } catch (refetchError) {
              // Fallback to manual refetch
              try {
                await Promise.all([
                  refetch?.(),
                  refetchStatistics?.()
                ]);
              } catch (manualRefetchError) {
                // Force a page reload as last resort
                window.location.reload();
              }
            }
            
            return; // Early return to avoid duplicate refetch
          } catch (error) {
            toast.error("Failed to deactivate members");
          }
        default:
          toast.error("This bulk action is not yet implemented.");
      }

      if (["updateStatus", "export"].includes(actionType)) {
        toast.success("Bulk action completed successfully!");
        // Refresh both member list and statistics in real-time
        await Promise.all([
          refetch?.(),
          refetchStatistics?.()
        ]);
        setSelectedMembers([]);
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred.");
    }
  };

  const handleSelectionConfirm = async (selectedId: string) => {
    if (!selectionDialogData.actionType) return;

    try {
      switch (selectionDialogData.actionType) {
        case "addToGroup":
          await bulkAddToGroup({
            variables: {
              bulkAddToGroupInput: {
                memberIds: selectedMembers,
                groupId: selectedId,
              },
            },
          });
          break;
        case "removeFromGroup":
          await bulkRemoveFromGroup({
            variables: {
              bulkRemoveFromGroupInput: {
                memberIds: selectedMembers,
                groupId: selectedId,
              },
            },
          });
          break;
        case "addToMinistry":
          await bulkAddToMinistry({
            variables: {
              bulkAddToMinistryInput: {
                memberIds: selectedMembers,
                ministryId: selectedId,
              },
            },
          });
          break;
        case "removeFromMinistry":
          await bulkRemoveFromMinistry({
            variables: {
              bulkRemoveFromMinistryInput: {
                memberIds: selectedMembers,
                ministryId: selectedId,
              },
            },
          });
          break;
      }
      toast.success("Bulk action completed successfully!");
      // Refresh both member list and statistics in real-time
      await Promise.all([
        refetch?.(),
        refetchStatistics?.()
      ]);
      setSelectedMembers([]);
    } catch (e: any) {
      toast.error(e.message || "An error occurred during the bulk action.");
    } finally {
      setIsSelectionDialogOpen(false);
    }
  };

  const handleExport = async (exportOptions: ExportOptions) => {
    try {
      let exportInput: any;

      switch (exportOptions.scope) {
        case "selected":
          exportInput = {
            memberIds: selectedMembers,
            format: exportOptions.format,
            fields: exportOptions.fields,
            includeHeaders: exportOptions.includeHeaders,
            includeImages: exportOptions.includeImages,
          };
          break;
        case "filtered":
          exportInput = {
            filters: {
              ...filters,
              organisationId,
              branchId,
            },
            format: exportOptions.format,
            fields: exportOptions.fields,
            includeHeaders: exportOptions.includeHeaders,
            includeImages: exportOptions.includeImages,
          };
          break;
        case "all":
          exportInput = {
            filters: {
              organisationId,
              branchId,
            },
            format: exportOptions.format,
            fields: exportOptions.fields,
            includeHeaders: exportOptions.includeHeaders,
            includeImages: exportOptions.includeImages,
          };
          break;
      }

      // Use the existing bulk export function for now, but we'll need to update it
      const result = await bulkExportMembers({
        variables: {
          bulkExportInput: exportInput,
        },
      });

      const exportContent: string | undefined = result?.data?.bulkExportMembers;
      if (exportContent) {
        try {
          // The backend now returns export content directly as a string
          const format = exportOptions.format;
          const mimeType =
            format === "PDF" ? "application/pdf" : "text/csv;charset=utf-8;";
          const blob = new Blob([exportContent], { type: mimeType });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          const extension = format.toLowerCase();

          // Generate filename based on export scope
          let filename = "";
          switch (exportOptions.scope) {
            case "selected":
              filename = `members-export-selected-${selectedMembers.length}-${new Date().toISOString().split("T")[0]}.${extension}`;
              break;
            case "filtered":
              filename = `members-export-filtered-${new Date().toISOString().split("T")[0]}.${extension}`;
              break;
            case "all":
              filename = `members-export-all-${new Date().toISOString().split("T")[0]}.${extension}`;
              break;
          }

          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Show success message based on scope
          const scopeText =
            exportOptions.scope === "selected"
              ? `${selectedMembers.length} selected members`
              : exportOptions.scope === "filtered"
                ? "filtered members"
                : "all members";
          toast.success(`Successfully exported ${scopeText}`);
        } catch (error) {
          console.error("Error processing export content:", error);
          toast.error("Failed to process export data");
        }
      } else {
        toast.error("Export failed: No data returned");
      }
    } catch (e: any) {
      toast.error(e.message || "Export failed. Please try again.");
    }
  };

  const handleViewMember = (member: Member) => {
    // Open modal immediately with existing lightweight data
    setSelectedMember(member);
    setShowMemberDetailModal(true);
    // Fetch full details in the background
    if (member?.id) {
      fetchMember({ variables: { memberId: member.id } });
    }
  };

  // When full member details arrive, update the selected member in state
  useEffect(() => {
    if (memberDetailData?.member) {
      setSelectedMember(memberDetailData.member);
    }
  }, [memberDetailData]);

  // Optionally surface errors from the detail fetch
  useEffect(() => {
    if (memberDetailError) {
      console.error("Error fetching member details:", memberDetailError);
    }
  }, [memberDetailError]);

  const handleImportSuccess = async (result: any) => {
    toast.success(`Import completed: ${result.successCount} members imported successfully!`);
    // Refresh both member list and statistics in real-time after import
    await Promise.all([
      refetch?.(),
      refetchStatistics?.()
    ]);
    setShowImportModal(false);
  };

  const handleStatusSelection = async (status: string) => {
    try {
      await handleBulkAction("updateStatus", { newStatus: status });
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating member status:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Members
            </h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-7xl">
        {/* Header */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40"
          variants={itemVariants}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Members
                </h1>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <span>{pageInfo.totalCount} total</span>
                  {Object.keys(filters).some(
                    (key) => filters[key as keyof MemberFilters],
                  ) && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Filtered
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <ViewModeToggle
                  currentMode={viewMode}
                  onModeChange={setViewMode}
                />

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    showFilterPanel ||
                    Object.keys(filters).some(
                      (key) => filters[key as keyof MemberFilters],
                    )
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FunnelIcon className="w-5 h-5" />
                </button>

                {/* Import Button */}
                <button
                  onClick={() => setShowImportModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <DocumentArrowUpIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Import</span>
                </button>

                {/* Export Button */}
                <button
                  onClick={() => setShowExportModal(true)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                {/* Add Member Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Member</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={itemVariants}>
          <MemberStats
            totalMembers={pageInfo.totalCount}
            isLoading={isLoading}
            statistics={statistics}
          />
        </motion.div>

        {/* Main Content */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Filters */}
            <AnimatePresence>
              {showFilterPanel && (
                <motion.div
                  initial={{ opacity: 0, x: -300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  className="lg:w-80 flex-shrink-0"
                >
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={handleFilterChange}
                    members={members}
                    statistics={statistics}
                    onClose={() => setShowFilterPanel(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Area */}
            <motion.div className="flex-1 space-y-6" variants={itemVariants}>
              {/* Search and Actions Bar */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search members..."
                  loading={searchLoading}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    Filters
                    {Object.keys(filters).some(
                      (key) => filters[key as keyof MemberFilters],
                    ) && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                        {Object.values(filters).filter(Boolean).length}
                      </span>
                    )}
                  </button>

                  <ViewModeToggle
                    currentMode={viewMode}
                    onModeChange={setViewMode}
                  />
                </div>
              </motion.div>

              {/* Bulk Actions Bar */}
              <AnimatePresence>
                {hasSelection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <BulkActionsBar
                      selectedCount={selectedCount}
                      onClearSelection={handleClearSelection}
                      onBulkAction={handleBulkAction}
                      onShowStatusModal={() => setShowStatusModal(true)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Member List */}
              <motion.div variants={itemVariants}>
                <MemberList
                  members={members}
                  loading={isLoading}
                  viewMode={viewMode}
                  selectedMembers={selectedMembers}
                  onSelectMember={handleSelectMember}
                  onSelectAll={handleSelectAll}
                  onViewMember={handleViewMember}
                  onEditMember={handleEditMember}
                  onManageFamily={handleManageFamily}
                  totalCount={pageInfo.totalCount}
                  onLoadMore={loadMore}
                  hasNextPage={pageInfo.hasNextPage}
                  hasPreviousPage={pageInfo.hasPreviousPage}
                  onNextPage={goToNextPage}
                  onPreviousPage={goToPreviousPage}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showAddModal && (
            <AddMemberModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onSuccess={() => {
                refetch();
                setShowAddModal(false);
              }}
              organisationId={organisationId}
              branchId={branchId}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSacramentModal && (
            <AddSacramentModal
              isOpen={showSacramentModal}
              onClose={() => setShowSacramentModal(false)}
              selectedMemberIds={selectedMembers}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMemberDetailModal && selectedMember && (
            <MemberDetailModal
              isOpen={showMemberDetailModal}
              onClose={() => setShowMemberDetailModal(false)}
              member={selectedMember}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditMemberModal && selectedMember && (
            <EditMemberModal
              isOpen={showEditMemberModal}
              onClose={() => setShowEditMemberModal(false)}
              member={selectedMember}
              onSuccess={() => {
                refetch?.();
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFamilyRelationshipModal && selectedMember && (
            <FamilyRelationshipModal
              isOpen={showFamilyRelationshipModal}
              onClose={() => setShowFamilyRelationshipModal(false)}
              member={selectedMember}
              onSuccess={() => {
                refetch?.();
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSelectionDialogOpen && (
            <BulkActionSelectionDialog
              isOpen={isSelectionDialogOpen}
              onClose={() => setIsSelectionDialogOpen(false)}
              onConfirm={handleSelectionConfirm}
              title={selectionDialogData.title}
              label={selectionDialogData.label}
              options={selectionDialogData.options}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showImportModal && (
            <ImportMembersModal
              isOpen={showImportModal}
              onClose={() => setShowImportModal(false)}
              onSuccess={handleImportSuccess}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showExportModal && (
            <ExportModal
              isOpen={showExportModal}
              onClose={() => setShowExportModal(false)}
              onExport={handleExport}
              filters={filters}
              selectedCount={selectedMembers.length}
              totalFilteredCount={pageInfo.totalCount}
              loading={bulkLoading.bulkExportMembersLoading}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStatusModal && (
            <StatusSelectionModal
              isOpen={showStatusModal}
              onClose={() => setShowStatusModal(false)}
              onConfirm={handleStatusSelection}
              selectedCount={selectedMembers.length}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MembersPage;
