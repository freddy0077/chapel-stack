import { gql } from '@apollo/client';

export const GET_BUDGETS_QUERY = gql`
  query GetBudgets($organisationId: String!) {
    budgets(organisationId: $organisationId) {
      id
      name
      description
      fiscalYear
      startDate
      endDate
      totalAmount
      totalSpent
      status
      notes
      fundId
      ministryId
      branchId
      organisationId
    }
  }
`;

export const GET_BUDGET_QUERY = gql`
  query GetBudget($id: String!) {
    budget(id: $id) {
      id
      name
      description
      fiscalYear
      startDate
      endDate
      totalAmount
      totalSpent
      status
      notes
      fundId
      ministryId
      branchId
      organisationId
    }
  }
`;

export const CREATE_BUDGET_MUTATION = gql`
  mutation CreateBudget($createBudgetInput: CreateBudgetInput!) {
    createBudget(createBudgetInput: $createBudgetInput) {
      id
      name
      description
      fiscalYear
      startDate
      endDate
      totalAmount
      totalSpent
      status
      notes
      fundId
      ministryId
      branchId
      organisationId
    }
  }
`;

export const UPDATE_BUDGET_MUTATION = gql`
  mutation UpdateBudget($updateBudgetInput: UpdateBudgetInput!) {
    updateBudget(updateBudgetInput: $updateBudgetInput) {
      id
      name
      description
      fiscalYear
      startDate
      endDate
      totalAmount
      totalSpent
      status
      notes
      fundId
      ministryId
      branchId
      organisationId
    }
  }
`;

export const DELETE_BUDGET_MUTATION = gql`
  mutation DeleteBudget($id: String!) {
    deleteBudget(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_BUDGET_ITEM_MUTATION = gql`
  mutation CreateBudgetItem($input: CreateBudgetItemInput!) {
    createBudgetItem(input: $input) {
      id
      name
      description
      amount
      budgetId
      expenseCategoryId
      
      expenseCategory {
        id
        name
      }
    }
  }
`;

export const UPDATE_BUDGET_ITEM_MUTATION = gql`
  mutation UpdateBudgetItem($id: ID!, $input: UpdateBudgetItemInput!) {
    updateBudgetItem(id: $id, input: $input) {
      id
      name
      description
      amount
      expenseCategoryId
      
      expenseCategory {
        id
        name
      }
    }
  }
`;

export const DELETE_BUDGET_ITEM_MUTATION = gql`
  mutation DeleteBudgetItem($id: ID!) {
    deleteBudgetItem(id: $id)
  }
`;

// TypeScript interfaces
export interface Budget {
  id: string;
  name: string;
  description?: string;
  fiscalYear: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  totalSpent: number;
  status: string;
  notes?: string;
  fundId: string;
  ministryId?: string;
  branchId?: string;
  organisationId?: string;
}

export interface CreateBudgetInput {
  name: string;
  description?: string;
  fiscalYear: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  notes?: string;
  fundId: string;
  ministryId?: string;
  branchId?: string;
  organisationId: string;
}

export interface UpdateBudgetInput {
  id: string;
  name?: string;
  description?: string;
  fiscalYear?: number;
  startDate?: string;
  endDate?: string;
  totalAmount?: number;
  status?: string;
  notes?: string;
  fundId?: string;
  ministryId?: string;
  branchId?: string;
  organisationId?: string;
}

export interface CreateBudgetItemInput {
  name: string;
  description?: string;
  amount: number;
  budgetId?: string;
  expenseCategoryId?: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  description?: string;
  amount: number;
  budgetId: string;
  expenseCategoryId?: string;
  expenseCategory?: {
    id: string;
    name: string;
  };
}
