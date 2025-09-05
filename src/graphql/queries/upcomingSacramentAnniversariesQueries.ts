import { gql } from "@apollo/client";

export const GET_UPCOMING_SACRAMENT_ANNIVERSARIES = gql`
  query GetUpcomingSacramentAnniversaries($limit: Int, $branchId: ID) {
    upcomingSacramentAnniversaries(limit: $limit, branchId: $branchId) {
      name
      sacramentType
      anniversaryType
      date
      isSpecial
      timeUntil
    }
  }
`;
