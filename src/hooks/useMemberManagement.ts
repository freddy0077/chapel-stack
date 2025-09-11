import { useMutation, useQuery } from "@apollo/client";
import {
  DEACTIVATE_MEMBER,
  REACTIVATE_MEMBER,
  PERMANENTLY_DELETE_MEMBER,
  UPLOAD_AFFIDAVIT,
  GET_FAMILIES,
  GET_FAMILY,
  GET_FAMILY_STATISTICS,
  GET_MEMBERS_WITH_VIEW_OPTIONS,
  GET_MEMBERS_WITH_DEACTIVATED,
  BULK_UPDATE_MEMBER_STATUS,
  BULK_TRANSFER_MEMBERS,
  BULK_DEACTIVATE_MEMBERS,
  BULK_ASSIGN_RFID_CARDS,
  BULK_EXPORT_MEMBERS,
  BULK_ADD_TO_GROUP,
  BULK_REMOVE_FROM_GROUP,
  BULK_ADD_TO_MINISTRY,
  BULK_REMOVE_FROM_MINISTRY,
} from "../graphql/queries/memberQueries";

// Hook for deactivating a member
export const useDeactivateMember = () => {
  return useMutation(DEACTIVATE_MEMBER, {
    onCompleted: (data) => {},
    onError: (error) => {},
    refetchQueries: ["GetMembersWithDeactivated", "GetMemberStatistics"],
  });
};

// Hook for reactivating a member
export const useReactivateMember = () => {
  return useMutation(REACTIVATE_MEMBER, {
    onCompleted: (data) => {},
    onError: (error) => {},
    refetchQueries: ["GetMembersWithDeactivated", "GetMemberStatistics"],
  });
};

// Hook for permanently deleting a member (super admin only)
export const usePermanentlyDeleteMember = () => {
  return useMutation(PERMANENTLY_DELETE_MEMBER, {
    onCompleted: (data) => {},
    onError: (error) => {},
    refetchQueries: ["GetMembersWithDeactivated", "GetMemberStatistics"],
  });
};

// Hook for uploading affidavit
export const useUploadAffidavit = () => {
  return useMutation(UPLOAD_AFFIDAVIT, {
    onCompleted: (data) => {},
    onError: (error) => {},
    refetchQueries: ["GetSingleMember"],
  });
};

// Hook for getting families with search and pagination
export const useFamilies = (input: any) => {
  return useQuery(GET_FAMILIES, {
    variables: { input },
    errorPolicy: "all",
  });
};

// Hook for getting a single family
export const useFamily = (familyId: string) => {
  return useQuery(GET_FAMILY, {
    variables: { familyId },
    skip: !familyId,
    errorPolicy: "all",
  });
};

// Hook for getting family statistics
export const useFamilyStatistics = (
  organisationId?: string,
  branchId?: string,
) => {
  return useQuery(GET_FAMILY_STATISTICS, {
    variables: { organisationId, branchId },
    errorPolicy: "all",
  });
};

// Hook for getting members with different view options
export const useMembersWithViewOptions = (input: any) => {
  return useQuery(GET_MEMBERS_WITH_VIEW_OPTIONS, {
    variables: { input },
    errorPolicy: "all",
  });
};

// Hook for getting members with deactivated filter
export const useMembersWithDeactivated = (
  organisationId?: string,
  branchId?: string,
  skip?: number,
  take?: number,
  search?: string,
  includeDeactivated?: boolean,
) => {
  return useQuery(GET_MEMBERS_WITH_DEACTIVATED, {
    variables: {
      organisationId,
      branchId,
      skip,
      take,
      search,
      includeDeactivated,
    },
    errorPolicy: "all",
  });
};

// Hook for bulk updating member status
export const useBulkUpdateMemberStatus = () => {
  return useMutation(BULK_UPDATE_MEMBER_STATUS, {
    onCompleted: (data) => {},
    onError: (error) => {},
    refetchQueries: [
      "GetMembersList",
      "GetMembersWithDeactivated", 
      "GetMemberStatistics",
      "GetMemberStatisticsDetailed",
      "GetTotalMembersCount",
      "MemberStatisticsEnhanced"
    ],
    awaitRefetchQueries: true,
  });
};

// Hook for bulk transferring members
export const useBulkTransferMembers = () => {
  return useMutation(BULK_TRANSFER_MEMBERS, {
    onCompleted: (data) => {},
    onError: (error) => {},
    refetchQueries: [
      "GetMembersList",
      "GetMembersWithDeactivated", 
      "GetMemberStatistics",
      "GetMemberStatisticsDetailed",
      "GetTotalMembersCount",
      "MemberStatisticsEnhanced"
    ],
    awaitRefetchQueries: true,
  });
};

// Hook for bulk deactivating members
export const useBulkDeactivateMembers = () => {
  return useMutation(BULK_DEACTIVATE_MEMBERS, {
    onCompleted: (data) => {},
    onError: (error) => {},
    refetchQueries: [
      "GetMembersList",
      "GetMembersWithDeactivated", 
      "GetMemberStatistics",
      "GetMemberStatisticsDetailed",
      "GetTotalMembersCount",
      "MemberStatisticsEnhanced"
    ],
    awaitRefetchQueries: true,
  });
};

// Hook for bulk assigning RFID cards
export const useBulkAssignRfidCards = () => {
  return useMutation(BULK_ASSIGN_RFID_CARDS, {
    onCompleted: (data) => {},
    onError: (error) => {},
    refetchQueries: ["GetMembersWithCardsAllFields"],
  });
};

// Hook for bulk exporting members
export const useBulkExportMembers = () => {
  return useMutation(BULK_EXPORT_MEMBERS, {
    onCompleted: (data) => {},
    onError: (error) => {},
  });
};

// Hook for bulk adding members to a group
export const useBulkAddToGroup = () => {
  return useMutation(BULK_ADD_TO_GROUP, {
    refetchQueries: [
      "GetMembersList",
      "GetMembersWithDeactivated", 
      "GetMemberStatistics",
      "GetMemberStatisticsDetailed",
      "GetTotalMembersCount",
      "MemberStatisticsEnhanced"
    ],
    awaitRefetchQueries: true,
  });
};

// Hook for bulk removing members from a group
export const useBulkRemoveFromGroup = () => {
  return useMutation(BULK_REMOVE_FROM_GROUP, {
    refetchQueries: [
      "GetMembersList",
      "GetMembersWithDeactivated", 
      "GetMemberStatistics",
      "GetMemberStatisticsDetailed",
      "GetTotalMembersCount",
      "MemberStatisticsEnhanced"
    ],
    awaitRefetchQueries: true,
  });
};

// Hook for bulk adding members to a ministry
export const useBulkAddToMinistry = () => {
  return useMutation(BULK_ADD_TO_MINISTRY, {
    refetchQueries: [
      "GetMembersList",
      "GetMembersWithDeactivated", 
      "GetMemberStatistics",
      "GetMemberStatisticsDetailed",
      "GetTotalMembersCount",
      "MemberStatisticsEnhanced"
    ],
    awaitRefetchQueries: true,
  });
};

// Hook for bulk removing members from a ministry
export const useBulkRemoveFromMinistry = () => {
  return useMutation(BULK_REMOVE_FROM_MINISTRY, {
    refetchQueries: [
      "GetMembersList",
      "GetMembersWithDeactivated", 
      "GetMemberStatistics",
      "GetMemberStatisticsDetailed",
      "GetTotalMembersCount",
      "MemberStatisticsEnhanced"
    ],
    awaitRefetchQueries: true,
  });
};

// Combined hook for all member management operations
export const useMemberManagement = () => {
  const [deactivateMember, { loading: deactivating }] = useDeactivateMember();
  const [reactivateMember, { loading: reactivating }] = useReactivateMember();
  const [permanentlyDeleteMember, { loading: deleting }] =
    usePermanentlyDeleteMember();
  const [uploadAffidavit, { loading: uploading }] = useUploadAffidavit();
  const [bulkUpdateMemberStatus, { loading: bulkUpdateStatusLoading }] =
    useBulkUpdateMemberStatus();
  const [bulkTransferMembers, { loading: bulkTransferMembersLoading }] =
    useBulkTransferMembers();
  const [bulkDeactivateMembers, { loading: bulkDeactivateMembersLoading }] =
    useBulkDeactivateMembers();
  const [bulkAssignRfidCards, { loading: bulkAssignRfidCardsLoading }] =
    useBulkAssignRfidCards();
  const [bulkExportMembers, { loading: bulkExportMembersLoading }] =
    useBulkExportMembers();
  const [bulkAddToGroup, { loading: bulkAddToGroupLoading }] =
    useBulkAddToGroup();
  const [bulkRemoveFromGroup, { loading: bulkRemoveFromGroupLoading }] =
    useBulkRemoveFromGroup();
  const [bulkAddToMinistry, { loading: bulkAddToMinistryLoading }] =
    useBulkAddToMinistry();
  const [bulkRemoveFromMinistry, { loading: bulkRemoveFromMinistryLoading }] =
    useBulkRemoveFromMinistry();

  return {
    deactivateMember,
    reactivateMember,
    permanentlyDeleteMember,
    uploadAffidavit,
    bulkUpdateMemberStatus,
    bulkTransferMembers,
    bulkDeactivateMembers,
    bulkAssignRfidCards,
    bulkExportMembers,
    bulkAddToGroup,
    bulkRemoveFromGroup,
    bulkAddToMinistry,
    bulkRemoveFromMinistry,
    loading: {
      deactivating,
      reactivating,
      deleting,
      uploading,
      bulkUpdateStatusLoading,
      bulkTransferMembersLoading,
      bulkDeactivateMembersLoading,
      bulkAssignRfidCardsLoading,
      bulkExportMembersLoading,
      bulkAddToGroupLoading,
      bulkRemoveFromGroupLoading,
      bulkAddToMinistryLoading,
      bulkRemoveFromMinistryLoading,
    },
  };
};

// Types for the hooks
export interface FamilyQueryInput {
  organisationId?: string;
  branchId?: string;
  search?: string;
  skip?: number;
  take?: number;
  includeDeactivatedMembers?: boolean;
}

export interface MemberViewOptionsInput {
  viewMode?: "LIST" | "CARD" | "TABLE" | "GRID";
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
  organisationId?: string;
  branchId?: string;
  status?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  skip?: number;
  take?: number;
  includeDeactivated?: boolean;
}

export interface DeactivateMemberInput {
  memberId: string;
  reason: string;
}

export interface UploadAffidavitInput {
  memberId: string;
  file: File;
  reason: string;
}
