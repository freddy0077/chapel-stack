import { gql } from "@apollo/client";

export const CREATE_FUND = gql`
  mutation CreateFund($createFundInput: CreateFundInput!) {
    createFund(createFundInput: $createFundInput) {
      id
      name
      description
      isActive
      organisationId
      branchId
    }
  }
`;
