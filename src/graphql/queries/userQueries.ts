import { gql } from '@apollo/client';

// Fetches dashboard data, including KPI cards (e.g., total members) for an organisation
export const GET_SECURITY_OVERVIEW = gql`
  query GetSecurityOverview($organisationId: String!) {
    dashboardData(dashboardType: ADMIN, organisationId: $organisationId) {
      kpiCards {
        title
        value
      }
    }
  }
`;

// There is no direct roles count query; recommend backend addition for this.
// As a workaround, roles can be aggregated from users client-side if needed.
