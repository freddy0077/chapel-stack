import { gql } from '@apollo/client';

export const GET_SACRAMENT_STATS = gql`
  query GetSacramentStats($period: String, $branchId: ID) {
    sacramentStats(period: $period, branchId: $branchId) {
      sacramentType
      count
      trend
      percentage
      period
    }
  }
`;

// Updated query to match the actual backend implementation
export const GET_FILTERED_SACRAMENT_STATS = gql`
  query GetFilteredSacramentStats($period: String, $branchId: ID) {
    sacramentStats(period: $period, branchId: $branchId) {
      sacramentType
      count
      trend
      percentage
      period
    }
  }
`;
