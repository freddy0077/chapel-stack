import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      type
      amount
      date
      description
      reference
      fundId
      branchId
      organisationId
      userId
      metadata
      createdAt
      updatedAt
    }
  }
`;

export function useTransactionMutations() {
  const [createTransaction, { data, loading, error }] = useMutation(CREATE_TRANSACTION);
  return { createTransaction, data, loading, error };
}
