import { gql } from "@apollo/client";

export const BRANCH_STATISTICS_FRAGMENT = gql`
  fragment BranchStatisticsFields on BranchStatistics {
    totalMembers
    activeMembers
    inactiveMembers
    newMembersInPeriod
    averageWeeklyAttendance
    totalFamilies
    totalMinistries
    baptismsYTD
    firstCommunionsYTD
    confirmationsYTD
    marriagesYTD
    annualBudget
    ytdIncome
    ytdExpenses
  }
`;

export const GET_BRANCH_STATISTICS = gql`
  query GetBranchStatistics($branchId: String!) {
    branch(id: $branchId) {
      id
      name
      statistics {
        ...BranchStatisticsFields
      }
    }
  }
  ${BRANCH_STATISTICS_FRAGMENT}
`;
