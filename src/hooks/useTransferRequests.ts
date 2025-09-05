import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_BRANCH_TRANSFER_REQUESTS,
  CREATE_TRANSFER_REQUEST,
  UPDATE_TRANSFER_REQUEST,
  REMOVE_TRANSFER_REQUEST,
} from "../graphql/transferRequests";

export type TransferStatus = "pending" | "approved" | "rejected" | "completed";
export type TransferDataType =
  | "PERSONAL"
  | "SACRAMENTS"
  | "MINISTRIES"
  | "DONATION_HISTORY";

export interface TransferRequest {
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
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTransferRequests {
  items: TransferRequest[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface BranchTransferData {
  branch: {
    id: string;
    name: string;
    incomingTransfers: PaginatedTransferRequests;
    outgoingTransfers: PaginatedTransferRequests;
  };
}

export interface UseTransferRequestsProps {
  branchId: string;
  incomingPageSize?: number;
  outgoingPageSize?: number;
}

export function useTransferRequests({
  branchId,
  incomingPageSize = 10,
  outgoingPageSize = 10,
}: UseTransferRequestsProps) {
  const [incomingPage, setIncomingPage] = useState(0);
  const [outgoingPage, setOutgoingPage] = useState(0);

  // Query for branch transfer requests
  const {
    data,
    loading: loadingTransfers,
    error: transfersError,
    refetch: refetchTransfers,
  } = useQuery<{ branch: BranchTransferData["branch"] }>(
    GET_BRANCH_TRANSFER_REQUESTS,
    {
      variables: {
        id: branchId,
        incomingPaginationInput: {
          skip: incomingPage * incomingPageSize,
          take: incomingPageSize,
        },
        outgoingPaginationInput: {
          skip: outgoingPage * outgoingPageSize,
          take: outgoingPageSize,
        },
      },
      fetchPolicy: "cache-and-network",
    },
  );

  // Create transfer request mutation
  const [createTransferRequest, { loading: creatingTransfer }] = useMutation(
    CREATE_TRANSFER_REQUEST,
    {
      onCompleted: () => {
        refetchTransfers();
      },
    },
  );

  // Update transfer request mutation (approve, reject, complete)
  const [updateTransferRequest, { loading: updatingTransfer }] = useMutation(
    UPDATE_TRANSFER_REQUEST,
    {
      onCompleted: () => {
        refetchTransfers();
      },
    },
  );

  // Remove transfer request mutation
  const [removeTransferRequest, { loading: removingTransfer }] = useMutation(
    REMOVE_TRANSFER_REQUEST,
    {
      onCompleted: () => {
        refetchTransfers();
      },
    },
  );

  // Helper functions for transfer actions
  const approveTransfer = async (transferId: string) => {
    await updateTransferRequest({
      variables: {
        input: {
          id: transferId,
          status: "APPROVED",
        },
      },
    });
  };

  const rejectTransfer = async (
    transferId: string,
    rejectionReason: string,
  ) => {
    await updateTransferRequest({
      variables: {
        input: {
          id: transferId,
          status: "REJECTED",
          rejectionReason,
        },
      },
    });
  };

  const completeTransfer = async (transferId: string) => {
    await updateTransferRequest({
      variables: {
        input: {
          id: transferId,
          status: "COMPLETED",
        },
      },
    });
  };

  const createTransfer = async (input: {
    memberId: string;
    sourceBranchId: string;
    destinationBranchId: string;
    reason: string;
    transferData: TransferDataType[];
  }) => {
    // Make sure transferData values are uppercase
    const formattedInput = {
      ...input,
      transferData: input.transferData.map((type) => {
        // If the type is already uppercase, return it as is
        if (
          type === "PERSONAL" ||
          type === "SACRAMENTS" ||
          type === "MINISTRIES" ||
          type === "DONATION_HISTORY"
        ) {
          return type;
        }
        // Otherwise convert to uppercase format
        return type.toUpperCase() as TransferDataType;
      }),
    };

    await createTransferRequest({
      variables: {
        input: formattedInput,
      },
    });
  };

  const deleteTransfer = async (transferId: string) => {
    await removeTransferRequest({
      variables: {
        id: transferId,
      },
    });
  };

  // Pagination controls
  const nextIncomingPage = () => {
    if (data?.branch?.incomingTransfers?.hasNextPage) {
      setIncomingPage((prev) => prev + 1);
    }
  };

  const prevIncomingPage = () => {
    if (incomingPage > 0) {
      setIncomingPage((prev) => prev - 1);
    }
  };

  const nextOutgoingPage = () => {
    if (data?.branch?.outgoingTransfers?.hasNextPage) {
      setOutgoingPage((prev) => prev + 1);
    }
  };

  const prevOutgoingPage = () => {
    if (outgoingPage > 0) {
      setOutgoingPage((prev) => prev - 1);
    }
  };

  return {
    incomingTransfers: data?.branch?.incomingTransfers?.items || [],
    outgoingTransfers: data?.branch?.outgoingTransfers?.items || [],
    incomingTransfersMeta: {
      totalCount: data?.branch?.incomingTransfers?.totalCount || 0,
      hasNextPage: data?.branch?.incomingTransfers?.hasNextPage || false,
      currentPage: incomingPage,
    },
    outgoingTransfersMeta: {
      totalCount: data?.branch?.outgoingTransfers?.totalCount || 0,
      hasNextPage: data?.branch?.outgoingTransfers?.hasNextPage || false,
      currentPage: outgoingPage,
    },
    loading:
      loadingTransfers ||
      creatingTransfer ||
      updatingTransfer ||
      removingTransfer,
    error: transfersError,
    actions: {
      approveTransfer,
      rejectTransfer,
      completeTransfer,
      createTransfer,
      deleteTransfer,
    },
    pagination: {
      nextIncomingPage,
      prevIncomingPage,
      nextOutgoingPage,
      prevOutgoingPage,
    },
    refetch: refetchTransfers,
  };
}
