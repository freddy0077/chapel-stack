import { gql } from "@apollo/client";

// Fragment for transfer request fields
export const TRANSFER_REQUEST_FRAGMENT = gql`
  fragment TransferRequestFields on TransferRequest {
    id
    memberId
    memberName
    sourceBranchId
    sourceBranchName
    destinationBranchId
    destinationBranchName
    requestDate
    status
    reason
    transferData
    approvedDate
    rejectedDate
    rejectionReason
    completedDate
    createdAt
    updatedAt
  }
`;

// Query to get branch transfer requests
export const GET_BRANCH_TRANSFER_REQUESTS = gql`
  query GetBranchTransferRequests(
    $id: String!
    $incomingPaginationInput: PaginationInput
    $outgoingPaginationInput: PaginationInput
  ) {
    branch(id: $id) {
      id
      name
      incomingTransfers(paginationInput: $incomingPaginationInput) {
        items {
          ...TransferRequestFields
        }
        totalCount
        hasNextPage
      }
      outgoingTransfers(paginationInput: $outgoingPaginationInput) {
        items {
          ...TransferRequestFields
        }
        totalCount
        hasNextPage
      }
    }
  }
  ${TRANSFER_REQUEST_FRAGMENT}
`;

// Query to get all transfer requests with filtering
export const GET_TRANSFER_REQUESTS = gql`
  query GetTransferRequests(
    $filterInput: TransferRequestFilterInput
    $paginationInput: PaginationInput
  ) {
    transferRequests(
      filterInput: $filterInput
      paginationInput: $paginationInput
    ) {
      items {
        ...TransferRequestFields
      }
      totalCount
      hasNextPage
    }
  }
  ${TRANSFER_REQUEST_FRAGMENT}
`;

// Mutation to create a transfer request
export const CREATE_TRANSFER_REQUEST = gql`
  mutation CreateTransferRequest($input: CreateTransferRequestInput!) {
    createTransferRequest(input: $input) {
      ...TransferRequestFields
    }
  }
  ${TRANSFER_REQUEST_FRAGMENT}
`;

// Mutation to update a transfer request (approve, reject, complete)
export const UPDATE_TRANSFER_REQUEST = gql`
  mutation UpdateTransferRequest($input: UpdateTransferRequestInput!) {
    updateTransferRequest(input: $input) {
      ...TransferRequestFields
    }
  }
  ${TRANSFER_REQUEST_FRAGMENT}
`;

// Mutation to remove a transfer request
export const REMOVE_TRANSFER_REQUEST = gql`
  mutation RemoveTransferRequest($id: ID!) {
    removeTransferRequest(id: $id)
  }
`;
