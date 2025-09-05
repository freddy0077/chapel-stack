import { useQuery } from "@apollo/client";
import { GET_MEMBER_DASHBOARD } from "../queries/memberQueries";

interface DashboardStat {
  groups: number;
  attendance: number;
  giving: string;
}

interface DashboardEvent {
  id: string;
  name: string;
  date: string;
  location: string;
}

interface DashboardGroup {
  id: string;
  name: string;
  role: string;
}

interface DashboardMilestone {
  baptismDate?: string;
  confirmationDate?: string;
}

interface MemberDashboardData {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  membershipStatus: string;
  membershipDate: string;
  stats: DashboardStat;
  upcomingEvents: DashboardEvent[];
  groups: DashboardGroup[];
  milestones: DashboardMilestone;
}

interface MemberDashboardVars {
  memberId: string;
}

interface MemberDashboardResponse {
  memberDashboard: MemberDashboardData;
}

export const useMemberDashboard = (memberId: string) => {
  const { data, loading, error } = useQuery<
    MemberDashboardResponse,
    MemberDashboardVars
  >(GET_MEMBER_DASHBOARD, {
    variables: { memberId },
    skip: !memberId, // Do not run the query if memberId is not available
  });

  return {
    dashboardData: data?.memberDashboard,
    loading,
    error,
  };
};
