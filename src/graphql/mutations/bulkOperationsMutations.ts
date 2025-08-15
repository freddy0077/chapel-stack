import { gql } from '@apollo/client';

export const BULK_UPDATE_MEMBER_STATUS = gql`
  mutation BulkUpdateMemberStatus($bulkStatusUpdateInput: BulkStatusUpdateInput!) {
    bulkUpdateMemberStatus(bulkStatusUpdateInput: $bulkStatusUpdateInput) {
      successCount
      failureCount
      successfulMemberIds
      errors {
        memberId
        error
        details
      }
      message
    }
  }
`;

export const BULK_ASSIGN_GROUP_TO_MEMBERS = gql`
  mutation BulkAssignGroupToMembers($bulkGroupAssignmentInput: BulkGroupAssignmentInput!) {
    bulkAssignGroupToMembers(bulkGroupAssignmentInput: $bulkGroupAssignmentInput) {
      successCount
      failureCount
      successfulMemberIds
      errors {
        memberId
        error
        details
      }
      message
    }
  }
`;

export const BULK_TRANSFER_MEMBERS = gql`
  mutation BulkTransferMembers($bulkBranchTransferInput: BulkBranchTransferInput!) {
    bulkTransferMembers(bulkBranchTransferInput: $bulkBranchTransferInput) {
      successCount
      failureCount
      successfulMemberIds
      errors {
        memberId
        error
        details
      }
      message
    }
  }
`;

export const BULK_DELETE_MEMBERS = gql`
  mutation BulkDeleteMembers($memberIds: [String!]!, $reason: String) {
    bulkDeleteMembers(memberIds: $memberIds, reason: $reason) {
      successCount
      failureCount
      successfulMemberIds
      errors {
        memberId
        error
        details
      }
      message
    }
  }
`;

export const BULK_EXPORT_MEMBERS = gql`
  mutation BulkExportMembers($bulkExportInput: BulkExportInput!) {
    bulkExportMembers(bulkExportInput: $bulkExportInput) {
      downloadUrl
      filename
      format
      recordCount
      expiresAt
    }
  }
`;

// TypeScript interfaces for the mutations
export interface BulkOperationResult {
  successCount: number;
  failureCount: number;
  successfulMemberIds: string[];
  errors: BulkOperationError[];
  message: string;
}

export interface BulkOperationError {
  memberId: string;
  error: string;
  details?: string;
}

export interface BulkExportResult {
  downloadUrl: string;
  filename: string;
  format: string;
  recordCount: number;
  expiresAt: string;
}

export interface BulkStatusUpdateInput {
  memberIds: string[];
  operation: 'UPDATE_STATUS';
  status: 'ACTIVE' | 'INACTIVE' | 'VISITOR' | 'MEMBER';
  reason?: string;
}

export interface BulkGroupAssignmentInput {
  memberIds: string[];
  operation: 'ASSIGN_GROUP';
  groupId: string;
  groupType: 'ministry' | 'smallGroup';
  reason?: string;
}

export interface BulkBranchTransferInput {
  memberIds: string[];
  operation: 'TRANSFER_BRANCH';
  fromBranchId: string;
  toBranchId: string;
  reason?: string;
}

export interface BulkExportInput {
  memberIds: string[];
  format: 'csv' | 'excel' | 'pdf';
  fields?: string[];
}
