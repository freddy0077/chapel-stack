import { gql } from '@apollo/client';

export const GET_CHART_OF_ACCOUNTS = gql`
  query GetChartOfAccounts($input: GetChartOfAccountsInput!) {
    chartOfAccounts(input: $input) {
      id
      accountCode
      accountName
      description
      accountType
      accountSubType
      parentAccountId
      isActive
      balance
      normalBalance
      isSystemAccount
      currency
      organisationId
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACCOUNT_BY_ID = gql`
  query GetAccountById($id: ID!) {
    account(id: $id) {
      id
      accountCode
      accountName
      description
      accountType
      accountSubType
      parentAccountId
      isActive
      balance
      normalBalance
      isSystemAccount
      currency
      organisationId
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACCOUNTS_BY_TYPE = gql`
  query GetAccountsByType($organisationId: ID!, $branchId: ID, $accountType: String!) {
    accountsByType(organisationId: $organisationId, branchId: $branchId, accountType: $accountType) {
      id
      accountCode
      accountName
      description
      accountType
      accountSubType
      balance
      isActive
    }
  }
`;
