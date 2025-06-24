import { useQuery, gql } from '@apollo/client';

export const ADMIN_DASHBOARD_STATS = gql`
  query AdminDashboardStats {
    adminDashboardStats {
      totalMembers
      activeMembers
      inactiveMembers
      totalBranches
      newMembersThisMonth
      totalSermons
      totalMediaItems
      emailsSentThisMonth
      smsSentThisMonth
      pendingOnboardingSteps
      totalFormSubmissions
      recentMembers(limit: 5) {
        id
        firstName
        lastName
        createdAt
      }
    }
  }
`;

export function useAdminDashboardStats() {
  return useQuery(ADMIN_DASHBOARD_STATS);
}
