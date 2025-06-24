import { gql } from "@apollo/client";

export const CREATE_EXPENSE = gql`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      amount
      date
      description
      receiptNumber
      invoiceNumber
      expenseCategoryId
      fundId
      paymentMethodId
      vendorId
      vendorName
      vendorContact
      budgetId
      branchId
      createdAt
      updatedAt
    }
  }
`;
