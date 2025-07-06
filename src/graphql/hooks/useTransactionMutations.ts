import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($createTransactionInput: CreateTransactionInput!) {
    createTransaction(createTransactionInput: $createTransactionInput) {
      id
      organisationId
      branchId
      fundId
      userId
      type
      amount
      date
      description
      reference
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
