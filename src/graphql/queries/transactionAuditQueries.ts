import { gql } from '@apollo/client';

export const GET_TRANSACTION_AUDIT_HISTORY = gql`
  query GetTransactionAuditHistory($transactionId: String!) {
    transactionAuditHistory(transactionId: $transactionId) {
      id
      action
      performedBy
      performedAt
      previousValues
      newValues
      reason
      ipAddress
    }
  }
`;

export const CAN_EDIT_TRANSACTION = gql`
  query CanEditTransaction($transactionId: String!) {
    canEditTransaction(transactionId: $transactionId)
  }
`;

export const CAN_VOID_TRANSACTION = gql`
  query CanVoidTransaction($transactionId: String!) {
    canVoidTransaction(transactionId: $transactionId)
  }
`;

export const GET_VOIDED_TRANSACTIONS = gql`
  query GetVoidedTransactions(
    $organisationId: String!
    $branchId: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    voidedTransactions(
      organisationId: $organisationId
      branchId: $branchId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      amount
      type
      description
      date
      status
      voidedBy
      voidedAt
      voidReason
      fund {
        id
        name
      }
    }
  }
`;
