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

// We'll keep this query but adjust it to match the backend schema
// Currently the backend only supports branchId filtering for stats
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
