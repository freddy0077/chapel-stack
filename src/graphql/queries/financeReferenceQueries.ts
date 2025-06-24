import { gql } from "@apollo/client";

export const GET_FUNDS = gql`
  query GetFunds($branchId: ID) {
    funds(branchId: $branchId) {
      id
      name
      description
      isActive
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONTRIBUTION_TYPES = gql`
  query GetContributionTypes($branchId: ID) {
    contributionTypes(branchId: $branchId) {
      id
      name
      description
      isActive
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods($branchId: ID) {
    paymentMethods(branchId: $branchId) {
      id
      name
      description
      isActive
      branchId
      createdAt
      updatedAt
    }
  }
`;
