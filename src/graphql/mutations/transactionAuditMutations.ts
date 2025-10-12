import { gql } from '@apollo/client';

export const VOID_TRANSACTION = gql`
  mutation VoidTransaction($input: VoidTransactionInput!) {
    voidTransaction(input: $input) {
      id
      status
      voidedBy
      voidedAt
      voidReason
      amount
      type
      description
      date
    }
  }
`;

export const EDIT_TRANSACTION = gql`
  mutation EditTransaction(
    $transactionId: String!
    $updates: UpdateTransactionInput!
    $reason: String!
  ) {
    editTransaction(
      transactionId: $transactionId
      updates: $updates
      reason: $reason
    ) {
      id
      amount
      description
      date
      type
      fundId
      memberId
      eventId
      reference
      lastModifiedBy
      lastModifiedAt
      version
    }
  }
`;
