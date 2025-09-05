export interface ModalFormData {
  amount: string;
  date: string;
  note: string;
  category: string;
  fundId: string;
  memberId: string;
  batchEvents: BatchEventItem[];
  paymentMethodId?: string;
  type?: string;
  contributionTypeId?: string;
  eventId?: string;
  reference?: string;
  description?: string;
  batchMode?: boolean;
}

export interface BatchEventItem {
  eventId: string;
  amount: string;
  note?: string;
  included?: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FormMessage {
  type: "success" | "error" | null;
  text: string;
}

export interface TransactionFilters {
  type?: string;
  dateRange: DateRange;
  selectedEvent: string | null;
  selectedFund: string | null;
  searchQuery: string;
}

export interface Fund {
  id: string;
  name: string;
  description?: string;
  branchId?: string;
  organisationId?: string;
  isActive?: boolean;
}

export interface Transaction {
  id: string;
  type: "CONTRIBUTION" | "EXPENSE" | "TRANSFER" | "FUND_ALLOCATION";
  amount: number;
  date: string;
  description?: string;
  reference?: string;
  fundId?: string;
  memberId?: string;
  eventId?: string;
  userId: string;
  organisationId: string;
  branchId: string;
  metadata?: {
    contributionTypeId?: string;
    paymentMethodId?: string;
    memberId?: string;
  };
  fund?: Fund;
  event?: {
    id: string;
    title: string;
    date?: string;
    startDate?: string;
  };
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  totalTithes: number;
  totalPledges: number;
  totalOfferings: number;
  netBalance: number;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface Event {
  id: string;
  title: string;
  name?: string;
  date?: string;
  startDate?: string;
}

export interface ContributionType {
  id: string;
  name: string;
  description?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
}

export interface BranchFinancesState {
  // View state
  activeTab: string;
  mainView: "transactions" | "analytics";
  analyticsTab:
    | "cash-flow"
    | "comparative"
    | "statements"
    | "budget"
    | "donors";

  // Modal state
  showTransactionModal: boolean;
  openModal: string | null;
  selectedTransaction: Transaction | null;
  showTransactionDetailModal: boolean;
  showEditTransactionModal: boolean;
  editingTransaction: Transaction | null;
  showMemberGivingHistory: boolean;
  addFundOpen: boolean;

  // Form state
  modalForm: ModalFormData;
  memberSearch: string;
  selectedMemberId: string | null;
  submitAttempted: boolean;
  formMessage: FormMessage;

  // Filter state
  dateRange: DateRange;
  selectedEvent: string | null;
  selectedFund: string | null;
  searchQuery: string;
  currentPage: number;

  // Export state
  isExportMenuOpen: boolean;
  exportLoading: boolean;

  // Fund state
  fundsRefreshKey: number;
}
