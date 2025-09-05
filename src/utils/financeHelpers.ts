import { DateRange, TransactionFilters } from "@/types/finance";

/**
 * Format currency amount for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Format date for input fields
 */
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Get today's date formatted for input
 */
export const getTodayForInput = (): string => {
  return formatDateForInput(new Date());
};

/**
 * Validate required form fields
 */
export const validateTransactionForm = (
  form: any,
): { isValid: boolean; message: string } => {
  if (!form.amount || !form.date || !form.fundId) {
    return {
      isValid: false,
      message: "Please fill in all required fields (Amount, Date, Fund).",
    };
  }

  const amount = parseFloat(form.amount);
  if (isNaN(amount) || amount <= 0) {
    return {
      isValid: false,
      message: "Please enter a valid amount greater than 0.",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Get transaction type from modal type
 */
export const getTransactionTypeFromModal = (modalType: string): string => {
  switch (modalType) {
    case "Expense":
      return "EXPENSE";
    case "Transfer":
      return "TRANSFER";
    case "Fund Allocation":
      return "FUND_ALLOCATION";
    default:
      return "CONTRIBUTION";
  }
};

/**
 * Get display name for transaction type
 */
export const getTransactionTypeDisplayName = (type: string): string => {
  switch (type) {
    case "CONTRIBUTION":
      return "Income";
    case "EXPENSE":
      return "Expense";
    case "TRANSFER":
      return "Transfer";
    case "FUND_ALLOCATION":
      return "Fund Allocation";
    default:
      return type;
  }
};

/**
 * Calculate financial health status
 */
export const calculateFinancialHealth = (
  balance: number,
  monthlyExpenses: number,
): {
  status: string;
  color: string;
  icon: string;
} => {
  const ratio = monthlyExpenses > 0 ? balance / monthlyExpenses : 0;

  if (ratio >= 6) {
    return {
      status: "Excellent",
      color: "bg-green-100 text-green-800",
      icon: "💰",
    };
  } else if (ratio >= 3) {
    return {
      status: "Good",
      color: "bg-blue-100 text-blue-800",
      icon: "📈",
    };
  } else if (ratio >= 1) {
    return {
      status: "Fair",
      color: "bg-yellow-100 text-yellow-800",
      icon: "⚠️",
    };
  } else {
    return {
      status: "Poor",
      color: "bg-red-100 text-red-800",
      icon: "🚨",
    };
  }
};

/**
 * Build transaction filters for GraphQL queries
 */
export const buildTransactionFilters = (
  filters: TransactionFilters,
  organisationId: string,
  branchId: string,
) => {
  return {
    organisationId,
    branchId,
    type:
      filters.type === "all"
        ? undefined
        : filters.type === "contribution"
          ? "CONTRIBUTION"
          : filters.type === "expense"
            ? "EXPENSE"
            : filters.type === "transfer"
              ? "TRANSFER"
              : filters.type === "fund_allocation"
                ? "FUND_ALLOCATION"
                : undefined,
    startDate: filters.dateRange.startDate || undefined,
    endDate: filters.dateRange.endDate || undefined,
    eventId: filters.selectedEvent || undefined,
    fundId: filters.selectedFund || undefined,
    searchTerm: filters.searchQuery || undefined,
  };
};

/**
 * Reset form to initial state
 */
export const getInitialModalForm = () => ({
  amount: "",
  date: getTodayForInput(),
  note: "",
  category: "",
  fundId: "",
  memberId: "",
  batchEvents: [],
  paymentMethodId: "",
  type: "",
  contributionTypeId: "",
  eventId: "",
  reference: "",
  description: "",
  batchMode: false,
});

/**
 * Generate confirmation message for transaction deletion
 */
export const getDeleteConfirmationMessage = (transaction: any): string => {
  return `Are you sure you want to delete this ${transaction.type.toLowerCase()} transaction of ${formatCurrency(transaction.amount)}?`;
};

/**
 * Filter transactions by search query
 */
export const filterTransactionsBySearch = (
  transactions: any[],
  searchQuery: string,
) => {
  if (!searchQuery) return transactions;

  const query = searchQuery.toLowerCase();
  return transactions.filter(
    (tx) =>
      (tx.description && tx.description.toLowerCase().includes(query)) ||
      tx.type.toLowerCase().includes(query) ||
      tx.amount.toString().includes(query) ||
      (tx.reference && tx.reference.toLowerCase().includes(query)),
  );
};

/**
 * Get export filename with timestamp
 */
export const getExportFilename = (type: "excel" | "csv"): string => {
  const timestamp = new Date().toISOString().split("T")[0];
  const extension = type === "excel" ? "xlsx" : "csv";
  return `transactions_${timestamp}.${extension}`;
};

/**
 * Validate batch events for offering
 */
export const validateBatchEvents = (
  batchEvents: any[],
): { isValid: boolean; message: string } => {
  const validEvents = batchEvents.filter(
    (item) =>
      item.included &&
      item.amount &&
      !isNaN(Number(item.amount)) &&
      Number(item.amount) > 0,
  );

  if (validEvents.length === 0) {
    return {
      isValid: false,
      message: "Please include at least one event with a valid amount.",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Calculate transaction statistics
 */
export const calculateTransactionStats = (transactions: any[]) => {
  return transactions.reduce(
    (stats, tx) => {
      switch (tx.type) {
        case "CONTRIBUTION":
          stats.totalIncome += tx.amount;
          // Add specific contribution type calculations if needed
          break;
        case "EXPENSE":
          stats.totalExpenses += tx.amount;
          break;
        default:
          break;
      }
      return stats;
    },
    {
      totalIncome: 0,
      totalExpenses: 0,
      totalTithes: 0,
      totalPledges: 0,
      totalOfferings: 0,
      netBalance: 0,
    },
  );
};
