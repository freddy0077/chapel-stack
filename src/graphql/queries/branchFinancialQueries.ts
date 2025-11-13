import { gql } from "@apollo/client";

export const GET_BRANCH_FINANCIAL_SUMMARY = gql`
  query GetBranchFinancialSummary($branchId: String!) {
    branchFinancialSummary(branchId: $branchId) {
      totalIncome
      totalExpenses
      balance
      incomeChange
      expensesChange
      balanceChange
    }
  }
`;
