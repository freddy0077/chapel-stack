import { gql } from "@apollo/client";

export const GET_CONTRIBUTIONS_STATS = gql`
  query ContributionsStats($branchId: String!) {
    contributionStats(filter: { branchId: $branchId }) {
      totalAmount
      contributionCount
      percentChangeFromPreviousPeriod
      trendData {
        date
        amount
      }
      fundBreakdown {
        fundName
        amount
      }
    }
  }
`;
