import { gql } from '@apollo/client';

export const GET_EXPENSE_CATEGORIES_QUERY = gql`
  query GetExpenseCategories($organisationId: String) {
    expenseCategories(organisationId: $organisationId) {
      id
      name
      description
      organisationId
    }
  }
`;

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  organisationId?: string;
}
