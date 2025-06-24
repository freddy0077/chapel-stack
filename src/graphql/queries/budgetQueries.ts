import { gql } from "@apollo/client";

export const GET_BUDGETS = gql`
  query GetBudgets($branchId: ID, $fiscalYear: Int) {
    budgets(branchId: $branchId, fiscalYear: $fiscalYear) {
      id
      name
      fiscalYear
      totalAmount
      status
      fundId
      branchId
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_BUDGET = gql`
  query GetBudget($id: ID!) {
    budget(id: $id) {
      id
      name
      fiscalYear
      totalAmount
      status
      fundId
      branchId
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;
