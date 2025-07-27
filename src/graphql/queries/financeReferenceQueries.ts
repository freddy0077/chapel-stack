import { gql } from "@apollo/client";

export const GET_FUNDS = gql`
  query GetFunds($organisationId: String!, $branchId: String) {
    funds(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      branchId
    }
  }
`;

export const GET_CONTRIBUTION_TYPES = gql`
  query GetContributionTypes {
    contributionTypes {
      id
      name
      description
    }
  }
`;

export const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    paymentMethods {
      id
      name
      description
    }
  }
`;
