import { gql } from '@apollo/client';

export const GET_FUNDS_QUERY = gql`
  query GetFunds($organisationId: String!, $branchId: String) {
    funds(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      branchId
    }
  }
`;

export const CREATE_FUND = gql`
  mutation CreateFund($createFundInput: CreateFundInput!) {
    createFund(createFundInput: $createFundInput) {
      id
      name
      description
      organisationId
      branchId
    }
  }
`;

export interface Fund {
  id: string;
  name: string;
  description?: string;
  branchId?: string;
  organisationId?: string;
}

export interface CreateFundInput {
  name: string;
  description?: string;
  organisationId: string;
  branchId?: string;
}
