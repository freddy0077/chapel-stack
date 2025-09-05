import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  CREATE_MEMBER,
  UPDATE_MEMBER,
  REMOVE_MEMBER,
  GET_MEMBER_BY_ID,
  GET_TOTAL_MEMBERS_COUNT,
  GET_MEMBER_STATISTICS_DETAILED,
  TRANSFER_MEMBER,
  ADD_MEMBER_TO_BRANCH,
  REMOVE_MEMBER_FROM_BRANCH,
  UPDATE_MEMBER_STATUS,
  ASSIGN_RFID_CARD,
  REMOVE_RFID_CARD,
  GET_MEMBER_BY_RFID,
  GET_MEMBER_DASHBOARD_DETAILED,
  UPLOAD_MEMBER_IMAGE,
  UPDATE_COMMUNICATION_PREFS,
  CREATE_MEMBER_RELATIONSHIP,
  UPDATE_MEMBER_RELATIONSHIP,
  DELETE_MEMBER_RELATIONSHIP,
  CREATE_MEMBERSHIP_HISTORY,
  SEARCH_MEMBERS_ENHANCED,
  GENERATE_MEMBER_REPORT,
} from "@/graphql/queries/memberQueries";
import { useOrganisationBranch } from "../../../../hooks/useOrganisationBranch";

// Types for the operations
interface CreateMemberInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  email?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: Date;
  placeOfBirth?: string;
  nationality?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  employerName?: string;
  education?: string;
  status?: string;
  membershipStatus?: string;
  membershipType?: string;
  membershipDate?: Date;
  baptismDate?: Date;
  baptismLocation?: string;
  confirmationDate?: Date;
  salvationDate?: Date;
  statusChangeReason?: string;
  profileImageUrl?: string;
  customFields?: any;
  privacyLevel?: string;
  preferredLanguage?: string;
  notes?: string;
  branchId?: string;
  organisationId?: string;
  spouseId?: string;
  parentId?: string;
  familyId?: string;
  headOfHousehold?: boolean;
  isRegularAttendee?: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  consentDate?: Date;
  consentVersion?: string;
  dataRetentionDate?: Date;
}

interface UpdateMemberInput extends Partial<CreateMemberInput> {
  id: string;
}

interface AssignRfidCardInput {
  memberId: string;
  rfidCardId: string;
}

interface MemberRelationshipInput {
  primaryMemberId: string;
  relatedMemberId: string;
  relationshipType: string;
  isEmergencyContact?: boolean;
  isGuardian?: boolean;
  canPickupChildren?: boolean;
  relationshipStart?: Date;
  relationshipEnd?: Date;
  notes?: string;
}

interface MembershipHistoryInput {
  memberId: string;
  fromStatus: string;
  toStatus: string;
  changeDate: Date;
  reason?: string;
  changedBy: string;
}

interface SearchFilters {
  branchId?: string;
  membershipStatus?: string;
  ageGroup?: string;
  gender?: string;
}

// Hook for creating a new member
export const useCreateMember = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [createMember, { data, loading, error }] = useMutation(CREATE_MEMBER, {
    refetchQueries: [
      "GetMembersList",
      "GetMemberStatisticsDetailed",
      "GetTotalMembersCount",
      "MemberStatisticsEnhanced",
    ],
    awaitRefetchQueries: true,
  });

  const handleCreateMember = async (createMemberInput: CreateMemberInput) => {
    try {
      const result = await createMember({
        variables: {
          createMemberInput: { ...createMemberInput, organisationId, branchId },
        },
      });
      return result.data?.createMember;
    } catch (err) {
      console.error("Error creating member:", err);
      throw err;
    }
  };

  return {
    createMember: handleCreateMember,
    data,
    loading,
    error,
  };
};

// Hook for updating a member
export const useUpdateMember = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [updateMember, { data, loading, error }] = useMutation(UPDATE_MEMBER, {
    refetchQueries: ["GetMembersList", "GetMemberById"],
    awaitRefetchQueries: true,
  });

  const handleUpdateMember = async (
    id: string,
    updateMemberInput: Partial<UpdateMemberInput>,
  ) => {
    try {
      const result = await updateMember({
        variables: {
          id,
          updateMemberInput: {
            id,
            ...updateMemberInput,
            organisationId,
            branchId,
          },
        },
      });
      return result.data?.updateMember;
    } catch (err) {
      console.error("Error updating member:", err);
      throw err;
    }
  };

  return {
    updateMember: handleUpdateMember,
    data,
    loading,
    error,
  };
};

// Hook for getting a single member by ID
export const useMemberById = (id: string, skip = false) => {
  const { organisationId, branchId } = useOrganisationBranch();
  const { data, loading, error, refetch } = useQuery(GET_MEMBER_BY_ID, {
    variables: { id, organisationId, branchId },
    skip: skip || !id,
    errorPolicy: "all",
  });

  return {
    member: data?.member,
    loading,
    error,
    refetch,
  };
};

// Hook for getting member statistics
export const useMemberStatistics = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const { data, loading, error, refetch } = useQuery(
    GET_MEMBER_STATISTICS_DETAILED,
    {
      variables: { organisationId, branchId },
      errorPolicy: "all",
    },
  );

  return {
    statistics: data?.memberStatistics,
    loading,
    error,
    refetch,
  };
};

// Hook for getting members count
export const useMembersCount = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const { data, loading, error, refetch } = useQuery(GET_TOTAL_MEMBERS_COUNT, {
    variables: { organisationId, branchId },
    errorPolicy: "all",
  });

  return {
    count: data?.membersCount,
    loading,
    error,
    refetch,
  };
};

// Hook for removing a member
export const useRemoveMember = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [removeMember, { data, loading, error }] = useMutation(REMOVE_MEMBER, {
    refetchQueries: [
      "GetMembersList",
      "GetMemberStatisticsDetailed",
      "GetTotalMembersCount",
      "MemberStatisticsEnhanced",
    ],
    awaitRefetchQueries: true,
  });

  const handleRemoveMember = async (id: string) => {
    try {
      const result = await removeMember({
        variables: { id, organisationId, branchId },
      });
      return result.data?.removeMember;
    } catch (err) {
      console.error("Error removing member:", err);
      throw err;
    }
  };

  return {
    removeMember: handleRemoveMember,
    data,
    loading,
    error,
  };
};

// Hook for transferring a member between branches
export const useTransferMember = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [transferMember, { data, loading, error }] = useMutation(
    TRANSFER_MEMBER,
    {
      refetchQueries: ["GetMembersList", "GetMemberById"],
      awaitRefetchQueries: true,
    },
  );

  const handleTransferMember = async (
    id: string,
    fromBranchId: string,
    toBranchId: string,
    reason?: string,
  ) => {
    try {
      const result = await transferMember({
        variables: { id, fromBranchId, toBranchId, reason, organisationId },
      });
      return result.data?.transferMember;
    } catch (err) {
      console.error("Error transferring member:", err);
      throw err;
    }
  };

  return {
    transferMember: handleTransferMember,
    data,
    loading,
    error,
  };
};

// Hook for updating member status
export const useUpdateMemberStatus = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [updateMemberStatus, { data, loading, error }] = useMutation(
    UPDATE_MEMBER_STATUS,
    {
      refetchQueries: [
        "GetMembersList",
        "GetMemberById",
        "GetMemberStatisticsDetailed",
        "MemberStatisticsEnhanced",
      ],
      awaitRefetchQueries: true,
    },
  );

  const handleUpdateMemberStatus = async (
    id: string,
    status: string,
    reason?: string,
  ) => {
    try {
      const result = await updateMemberStatus({
        variables: { id, status, reason, organisationId, branchId },
      });
      return result.data?.updateMemberStatus;
    } catch (err) {
      console.error("Error updating member status:", err);
      throw err;
    }
  };

  return {
    updateMemberStatus: handleUpdateMemberStatus,
    data,
    loading,
    error,
  };
};

// Hook for RFID card operations
export const useRfidOperations = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [assignRfidCard, { loading: assignLoading, error: assignError }] =
    useMutation(ASSIGN_RFID_CARD, {
      refetchQueries: ["GetMembersList", "GetMemberById"],
      awaitRefetchQueries: true,
    });

  const [removeRfidCard, { loading: removeLoading, error: removeError }] =
    useMutation(REMOVE_RFID_CARD, {
      refetchQueries: ["GetMembersList", "GetMemberById"],
      awaitRefetchQueries: true,
    });

  const [
    getMemberByRfid,
    { data: rfidData, loading: rfidLoading, error: rfidError },
  ] = useLazyQuery(GET_MEMBER_BY_RFID);

  const handleAssignRfidCard = async (
    assignRfidCardInput: AssignRfidCardInput,
  ) => {
    try {
      const result = await assignRfidCard({
        variables: {
          assignRfidCardInput: {
            ...assignRfidCardInput,
            organisationId,
            branchId,
          },
        },
      });
      return result.data?.assignRfidCardToMember;
    } catch (err) {
      console.error("Error assigning RFID card:", err);
      throw err;
    }
  };

  const handleRemoveRfidCard = async (memberId: string) => {
    try {
      const result = await removeRfidCard({
        variables: { memberId, organisationId, branchId },
      });
      return result.data?.removeRfidCardFromMember;
    } catch (err) {
      console.error("Error removing RFID card:", err);
      throw err;
    }
  };

  const handleGetMemberByRfid = async (rfidCardId: string) => {
    try {
      const result = await getMemberByRfid({
        variables: { rfidCardId, organisationId, branchId },
      });
      return result.data?.memberByRfidCard;
    } catch (err) {
      console.error("Error getting member by RFID:", err);
      throw err;
    }
  };

  return {
    assignRfidCard: handleAssignRfidCard,
    removeRfidCard: handleRemoveRfidCard,
    getMemberByRfid: handleGetMemberByRfid,
    memberByRfid: rfidData?.memberByRfidCard,
    loading: assignLoading || removeLoading || rfidLoading,
    error: assignError || removeError || rfidError,
  };
};

// Hook for member dashboard
export const useMemberDashboard = (memberId: string, skip = false) => {
  const { organisationId, branchId } = useOrganisationBranch();
  const { data, loading, error, refetch } = useQuery(
    GET_MEMBER_DASHBOARD_DETAILED,
    {
      variables: { memberId, organisationId, branchId },
      skip: skip || !memberId,
      errorPolicy: "all",
    },
  );

  return {
    dashboard: data?.memberDashboard,
    loading,
    error,
    refetch,
  };
};

// Hook for uploading member image
export const useUploadMemberImage = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [uploadMemberImage, { data, loading, error }] = useMutation(
    UPLOAD_MEMBER_IMAGE,
    {
      refetchQueries: ["GetMemberById"],
      awaitRefetchQueries: true,
    },
  );

  const handleUploadMemberImage = async (memberId: string, file: File) => {
    try {
      const result = await uploadMemberImage({
        variables: { memberId, organisationId, branchId, file },
      });
      return result.data?.uploadMemberImage;
    } catch (err) {
      console.error("Error uploading member image:", err);
      throw err;
    }
  };

  return {
    uploadMemberImage: handleUploadMemberImage,
    imageUrl: data?.uploadMemberImage,
    loading,
    error,
  };
};

// Hook for enhanced member search
export const useSearchMembers = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [searchMembers, { data, loading, error }] = useLazyQuery(
    SEARCH_MEMBERS_ENHANCED,
  );

  const handleSearchMembers = async (
    query: string,
    filters: SearchFilters = {},
    skip = 0,
    take = 20,
  ) => {
    try {
      const result = await searchMembers({
        variables: {
          query,
          ...filters,
          organisationId,
          branchId,
          skip,
          take,
        },
      });
      return result.data?.searchMembers;
    } catch (err) {
      console.error("Error searching members:", err);
      throw err;
    }
  };

  return {
    searchMembers: handleSearchMembers,
    members: data?.searchMembers,
    loading,
    error,
  };
};

// Hook for communication preferences
export const useCommunicationPrefs = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [updateCommunicationPrefs, { data, loading, error }] = useMutation(
    UPDATE_COMMUNICATION_PREFS,
    {
      refetchQueries: ["GetMemberById"],
      awaitRefetchQueries: true,
    },
  );

  const handleUpdateCommunicationPrefs = async (
    memberId: string,
    preferences: any,
  ) => {
    try {
      const prefsData = JSON.stringify(preferences);
      const result = await updateCommunicationPrefs({
        variables: { memberId, organisationId, branchId, prefsData },
      });
      return result.data?.updateCommunicationPrefs;
    } catch (err) {
      console.error("Error updating communication preferences:", err);
      throw err;
    }
  };

  return {
    updateCommunicationPrefs: handleUpdateCommunicationPrefs,
    data,
    loading,
    error,
  };
};

// Hook for member relationships
export const useMemberRelationships = () => {
  const [createRelationship, { loading: createLoading, error: createError }] =
    useMutation(CREATE_MEMBER_RELATIONSHIP);
  const [updateRelationship, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_MEMBER_RELATIONSHIP);
  const [deleteRelationship, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_MEMBER_RELATIONSHIP);

  const handleCreateRelationship = async (
    relationshipInput: MemberRelationshipInput,
  ) => {
    try {
      const result = await createRelationship({
        variables: { createMemberRelationshipInput: relationshipInput },
      });
      return result.data?.createMemberRelationship;
    } catch (err) {
      console.error("Error creating member relationship:", err);
      throw err;
    }
  };

  const handleUpdateRelationship = async (
    id: string,
    relationshipInput: Partial<MemberRelationshipInput>,
  ) => {
    try {
      const result = await updateRelationship({
        variables: { id, updateMemberRelationshipInput: relationshipInput },
      });
      return result.data?.updateMemberRelationship;
    } catch (err) {
      console.error("Error updating member relationship:", err);
      throw err;
    }
  };

  const handleDeleteRelationship = async (id: string) => {
    try {
      const result = await deleteRelationship({
        variables: { id },
      });
      return result.data?.deleteMemberRelationship;
    } catch (err) {
      console.error("Error deleting member relationship:", err);
      throw err;
    }
  };

  return {
    createRelationship: handleCreateRelationship,
    addMemberRelationship: handleCreateRelationship, // Alias for backward compatibility
    updateRelationship: handleUpdateRelationship,
    deleteRelationship: handleDeleteRelationship,
    loading: createLoading || updateLoading || deleteLoading,
    error: createError || updateError || deleteError,
  };
};

// Hook for membership history
export const useMembershipHistory = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [createMembershipHistory, { data, loading, error }] = useMutation(
    CREATE_MEMBERSHIP_HISTORY,
  );

  const handleCreateMembershipHistory = async (
    historyInput: MembershipHistoryInput,
  ) => {
    try {
      const result = await createMembershipHistory({
        variables: {
          createMembershipHistoryInput: {
            ...historyInput,
            organisationId,
            branchId,
          },
        },
      });
      return result.data?.createMembershipHistoryEntry;
    } catch (err) {
      console.error("Error creating membership history:", err);
      throw err;
    }
  };

  return {
    createMembershipHistory: handleCreateMembershipHistory,
    data,
    loading,
    error,
  };
};

// Hook for generating member reports
export const useMemberReports = () => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [generateReport, { data, loading, error }] = useLazyQuery(
    GENERATE_MEMBER_REPORT,
  );

  const handleGenerateReport = async (reportInput: any) => {
    try {
      const result = await generateReport({
        variables: { input: { ...reportInput, organisationId, branchId } },
      });
      return result.data?.generateMemberReport;
    } catch (err) {
      console.error("Error generating member report:", err);
      throw err;
    }
  };

  return {
    generateReport: handleGenerateReport,
    report: data?.generateMemberReport,
    loading,
    error,
  };
};
