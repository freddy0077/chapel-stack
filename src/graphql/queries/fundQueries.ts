import { gql } from "@apollo/client";

export const GET_FUNDS = gql`
  query GetFunds($branchId: ID) {
    funds(branchId: $branchId) {
      id
      name
      description
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const GET_FUND = gql`
  query GetFund($id: ID!) {
    fund(id: $id) {
      id
      name
      description
      branchId
      createdAt
      updatedAt
    }
  }
`;
