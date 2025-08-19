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

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($updateTransactionInput: UpdateTransactionInput!) {
    updateTransaction(updateTransactionInput: $updateTransactionInput) {
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

export const REMOVE_TRANSACTION = gql`
  mutation RemoveTransaction($id: String!) {
    removeTransaction(id: $id) {
      id
    }
  }
`;

export function useTransactionMutations() {
  const [createTransaction, createState] = useMutation(CREATE_TRANSACTION);
  const [updateTransaction, updateState] = useMutation(UPDATE_TRANSACTION);
  const [removeTransaction, removeState] = useMutation(REMOVE_TRANSACTION);
  return {
    createTransaction,
    updateTransaction,
    removeTransaction,
    // expose states for convenience
    createState,
    updateState,
    removeState,
    // legacy fields for existing usages
    data: createState.data,
    loading: createState.loading,
    error: createState.error,
  };
}
