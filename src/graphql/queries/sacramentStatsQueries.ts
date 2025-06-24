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
