import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_DATA } from "../queries/dashboardQueries";

export type KpiCard = {
  title: string;
  value: string;
  icon?: string;
  widgetType?: string;
  percentChange?: number;
};

export interface UseFinanceDashboardDataResult {
  kpiCards: KpiCard[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

export const useFinanceDashboardData = (
  branchId: string,
): UseFinanceDashboardDataResult => {
  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_DATA, {
    variables: { branchId, dashboardType: "FINANCE" },
    fetchPolicy: "cache-and-network",
    skip: !branchId,
  });

  return {
    kpiCards: data?.dashboardData?.kpiCards ?? [],
    loading,
    error,
    refetch,
  };
};
