import { KpiCard } from "../../../graphql/hooks/useFinanceDashboardData";

export interface FinanceOverviewKpis {
  totalDonations: string;
  totalExpenses: string;
  currentBalance: string;
  budgetProgress: number;
  monthlyChange: string;
}

/**
 * Maps KPI cards from the finance dashboard API to the props expected by the FinancialOverview component.
 */
export function mapKpiCardsToOverview(
  kpiCards: KpiCard[],
): FinanceOverviewKpis {
  const result: FinanceOverviewKpis = {
    totalDonations: "-",
    totalExpenses: "-",
    currentBalance: "-",
    budgetProgress: 0,
    monthlyChange: "-",
  };

  kpiCards.forEach((kpi) => {
    switch (kpi.title?.toLowerCase()) {
      case "total donations":
        result.totalDonations = kpi.value;
        break;
      case "total expenses":
        result.totalExpenses = kpi.value;
        break;
      case "current balance":
        result.currentBalance = kpi.value;
        break;
      case "budget progress":
        result.budgetProgress =
          typeof kpi.value === "number"
            ? kpi.value
            : parseFloat(kpi.value.replace("%", ""));
        break;
      case "monthly change":
        result.monthlyChange = kpi.value;
        break;
      default:
        break;
    }
  });

  return result;
}
