import { gql } from "@apollo/client";

// Use only supported scalar types and argument names
export const GET_TRANSACTIONS = gql`
  query Transactions($type: String, $branchId: String, $organisationId: String) {
    transactions(type: $type, branchId: $branchId, organisationId: $organisationId) {
      id
      type
      category
      amount
      date
      donor
      vendor
      status
      branchId
      organisationId
      createdAt
      updatedAt
    }
  }
`;
