import { useMutation } from '@apollo/client';
import {
  BULK_UPDATE_MEMBER_STATUS,
  BULK_ASSIGN_GROUP_TO_MEMBERS,
  BULK_TRANSFER_MEMBERS,
  BULK_DELETE_MEMBERS,
  BULK_EXPORT_MEMBERS,
  BulkOperationResult,
  BulkExportResult,
  BulkStatusUpdateInput,
  BulkGroupAssignmentInput,
  BulkBranchTransferInput,
  BulkExportInput,
} from '../mutations/bulkOperationsMutations';
import { GET_MEMBERS } from '../queries/memberQueries';

export const useBulkOperations = () => {
  const [bulkUpdateStatusMutation, { loading: updateStatusLoading }] = useMutation<
    { bulkUpdateMemberStatus: BulkOperationResult },
    { bulkStatusUpdateInput: BulkStatusUpdateInput }
  >(BULK_UPDATE_MEMBER_STATUS, {
    refetchQueries: [{ query: GET_MEMBERS }],
  });

  const [bulkAssignGroupMutation, { loading: assignGroupLoading }] = useMutation<
    { bulkAssignGroupToMembers: BulkOperationResult },
    { bulkGroupAssignmentInput: BulkGroupAssignmentInput }
  >(BULK_ASSIGN_GROUP_TO_MEMBERS, {
    refetchQueries: [{ query: GET_MEMBERS }],
  });

  const [bulkTransferMutation, { loading: transferLoading }] = useMutation<
    { bulkTransferMembers: BulkOperationResult },
    { bulkBranchTransferInput: BulkBranchTransferInput }
  >(BULK_TRANSFER_MEMBERS, {
    refetchQueries: [{ query: GET_MEMBERS }],
  });

  const [bulkDeleteMutation, { loading: deleteLoading }] = useMutation<
    { bulkDeleteMembers: BulkOperationResult },
    { memberIds: string[]; reason?: string }
  >(BULK_DELETE_MEMBERS, {
    refetchQueries: [{ query: GET_MEMBERS }],
  });

  const [bulkExportMutation, { loading: exportLoading }] = useMutation<
    { bulkExportMembers: BulkExportResult },
    { bulkExportInput: BulkExportInput }
  >(BULK_EXPORT_MEMBERS);

  const bulkUpdateStatus = async (
    memberIds: string[],
    status: 'ACTIVE' | 'INACTIVE' | 'VISITOR' | 'MEMBER',
    reason?: string
  ): Promise<BulkOperationResult> => {
    const { data } = await bulkUpdateStatusMutation({
      variables: {
        bulkStatusUpdateInput: {
          memberIds,
          operation: 'UPDATE_STATUS',
          status,
          reason,
        },
      },
    });
    return data!.bulkUpdateMemberStatus;
  };

  const bulkAssignGroup = async (
    memberIds: string[],
    groupId: string,
    groupType: 'ministry' | 'smallGroup',
    reason?: string
  ): Promise<BulkOperationResult> => {
    const { data } = await bulkAssignGroupMutation({
      variables: {
        bulkGroupAssignmentInput: {
          memberIds,
          operation: 'ASSIGN_GROUP',
          groupId,
          groupType,
          reason,
        },
      },
    });
    return data!.bulkAssignGroupToMembers;
  };

  const bulkTransfer = async (
    memberIds: string[],
    fromBranchId: string,
    toBranchId: string,
    reason?: string
  ): Promise<BulkOperationResult> => {
    const { data } = await bulkTransferMutation({
      variables: {
        bulkBranchTransferInput: {
          memberIds,
          operation: 'TRANSFER_BRANCH',
          fromBranchId,
          toBranchId,
          reason,
        },
      },
    });
    return data!.bulkTransferMembers;
  };

  const bulkDelete = async (
    memberIds: string[],
    reason?: string
  ): Promise<BulkOperationResult> => {
    const { data } = await bulkDeleteMutation({
      variables: {
        memberIds,
        reason,
      },
    });
    return data!.bulkDeleteMembers;
  };

  const bulkExport = async (
    memberIds: string[],
    format: 'csv' | 'excel' | 'pdf',
    fields?: string[]
  ): Promise<BulkExportResult> => {
    const { data } = await bulkExportMutation({
      variables: {
        bulkExportInput: {
          memberIds,
          format,
          fields,
        },
      },
    });
    return data!.bulkExportMembers;
  };

  return {
    bulkUpdateStatus,
    bulkAssignGroup,
    bulkTransfer,
    bulkDelete,
    bulkExport,
    loading: {
      updateStatus: updateStatusLoading,
      assignGroup: assignGroupLoading,
      transfer: transferLoading,
      delete: deleteLoading,
      export: exportLoading,
    },
  };
};
