import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_DATA } from "../queries/dashboardQueries";

export interface KpiCard {
  title: string;
  value: string;
  icon?: string;
  widgetType?: string;
}

export function useDashboardData(
  branchId?: string,
  dashboardType: string = "ADMIN",
) {
  const skip = !branchId;
  return useQuery(GET_DASHBOARD_DATA, {
    variables: { branchId, dashboardType },
    fetchPolicy: "cache-and-network",
    skip,
  });
}
