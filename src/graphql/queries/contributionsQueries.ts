import { gql } from "@apollo/client";

export const GET_CONTRIBUTIONS_STATS = gql`
  query ContributionsStats($branchId: String!) {
    contributions(organisationId: $branchId) {
      id
      amount
      date
      contributionTypeId
      fundId
    }
  }
`;
