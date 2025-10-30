import { gql } from '@apollo/client';

/**
 * Finance GraphQL Queries
 * All queries for the branch finances module
 */

// ============================================
// DASHBOARD QUERIES
// ============================================

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats(
    $organisationId: String!
    $branchId: String
    $dateRange: DateRangeInput
  ) {
    transactionStats(
      organisationId: $organisationId
      branchId: $branchId
      dateRange: $dateRange
    ) {
      totalIncome
      totalExpenses
      netBalance
      totalOfferings
      totalTithes
      totalPledges
    }
  }
`;

// Note: Using transactions query as fallback until journal entries are added to schema
export const GET_RECENT_TRANSACTIONS = gql`
  query GetRecentTransactions(
    $organisationId: String!
    $branchId: String
    $take: Int
  ) {
    transactions(
      organisationId: $organisationId
      branchId: $branchId
      paginationInput: { skip: 0, take: $take }
    ) {
      items {
        id
        description
        amount
        date
        type
        reference
      }
    }
  }
`;

// Note: Pending approvals will return empty until backend schema is updated
export const GET_PENDING_APPROVALS = gql`
  query GetPendingApprovals(
    $organisationId: String!
    $branchId: String
  ) {
    transactions(
      organisationId: $organisationId
      branchId: $branchId
      paginationInput: { skip: 0, take: 5 }
    ) {
      items {
        id
        description
        amount
      }
    }
  }
`;

// ============================================
// CHART OF ACCOUNTS QUERIES
export const GET_CHART_OF_ACCOUNTS = gql`
  query GetChartOfAccounts(
    $organisationId: String!
    $branchId: String!
  ) {
    chartOfAccounts(
      input: {
        organisationId: $organisationId
        branchId: $branchId
      }
    ) {
      id
      accountCode
      accountName
      accountType
      accountSubType
      normalBalance
      balance
      isActive
      parentAccountId
      isBankAccount
      bankAccountId
      fundId
      ministryId
      branchId
      organisationId
      createdAt
      updatedAt
    }
  }
`;

// Alias for compatibility
export const GET_ACCOUNTS = GET_CHART_OF_ACCOUNTS;

export const GET_ACCOUNT_BALANCE = gql`
  query GetAccountBalance($accountId: String!, $asOfDate: DateTime) {
    accountBalance(accountId: $accountId, asOfDate: $asOfDate) {
      accountId
      debitTotal
      creditTotal
      balance
    }
  }
`;

export const GET_ACCOUNT_BY_ID = gql`
  query GetAccountById($id: String!) {
    account(id: $id) {
      id
      accountCode
      accountName
      accountType
      accountSubType
      normalBalance
      isActive
      parentAccountId
      isBankAccount
      bankAccountId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACCOUNT_BY_CODE = gql`
  query GetAccountByCode(
    $accountCode: String!
    $organisationId: String!
    $branchId: String!
  ) {
    accountByCode(
      accountCode: $accountCode
      organisationId: $organisationId
      branchId: $branchId
    ) {
      id
      accountCode
      accountName
      accountType
      accountSubType
      normalBalance
      isActive
    }
  }
`;

export const GET_ACCOUNT_HIERARCHY = gql`
  query GetAccountHierarchy($accountId: String!) {
    accountHierarchy(accountId: $accountId)
  }
`;

// ============================================
// JOURNAL ENTRIES QUERIES
// ============================================

export const GET_JOURNAL_ENTRIES = gql`
  query GetJournalEntries(
    $organisationId: String!
    $branchId: String!
    $status: JournalEntryStatus
    $fiscalYear: Int
    $fiscalPeriod: Int
    $sourceModule: String
    $startDate: String
    $endDate: String
    $skip: Int
    $take: Int
  ) {
    journalEntries(
      input: {
        organisationId: $organisationId
        branchId: $branchId
        status: $status
        fiscalYear: $fiscalYear
        fiscalPeriod: $fiscalPeriod
        sourceModule: $sourceModule
        startDate: $startDate
        endDate: $endDate
        skip: $skip
        take: $take
      }
    ) {
      items {
        id
        journalEntryNumber
        entryDate
        postingDate
        entryType
        sourceModule
        sourceTransactionId
        description
        reference
        fiscalYear
        fiscalPeriod
        status
        isReversed
        voidedBy
        voidedAt
        voidReason
        createdBy
        postedBy
        organisationId
        branchId
        createdAt
        updatedAt
        totalDebit
        totalCredit
        version
      }
      totalCount
    }
  }
`;

export const GET_JOURNAL_ENTRY_BY_ID = gql`
  query GetJournalEntryById($id: String!) {
    journalEntry(id: $id) {
      id
      journalEntryNumber
      entryDate
      entryType
      description
      reference
      status
      totalDebit
      totalCredit
      fiscalYear
      fiscalPeriod
      sourceModule
      version
      sourceTransactionId
      isReversed
      organisationId
      branchId
      createdAt
      createdBy
      postingDate
      postedBy
      voidedAt
      voidedBy
      voidReason
      updatedAt
    }
  }
`;

// ============================================
// OFFERING BATCH QUERIES
// ============================================

// Note: offeringBatches returns JSON! in schema, not a structured type
export const GET_OFFERING_BATCHES = gql`
  query GetOfferingBatches(
    $organisationId: String!
    $branchId: String!
    $status: OfferingBatchStatus
    $startDate: String
    $endDate: String
    $skip: Int
    $take: Int
  ) {
    offeringBatches(
      input: {
        organisationId: $organisationId
        branchId: $branchId
        status: $status
        startDate: $startDate
        endDate: $endDate
        skip: $skip
        take: $take
      }
    ) {
      items {
        id
        batchNumber
        batchDate
        serviceName
        serviceId
        offeringType
        cashAmount
        mobileMoneyAmount
        chequeAmount
        foreignCurrencyAmount
        totalAmount
        cashDenominations
        counters
        countedBy
        verifierId
        verifiedBy
        verifiedAt
        verificationNotes
        approvedBy
        approvedAt
        discrepancyAmount
        discrepancyNotes
        status
        isPostedToGL
        journalEntryId
        organisationId
        branchId
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

export const GET_OFFERING_BATCH_BY_ID = gql`
  query GetOfferingBatchById($id: String!) {
    offeringBatch(id: $id) {
      id
      batchNumber
      batchDate
      serviceName
      serviceId
      cashAmount
      mobileMoneyAmount
      chequeAmount
      foreignCurrencyAmount
      totalAmount
      cashDenominations
      counters
      status
      countedBy
      verifiedBy
      approvedBy
      discrepancyAmount
      discrepancyNotes
      postedToGL
      journalEntryId
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// BANK ACCOUNTS QUERIES
// ============================================

export const GET_BANK_ACCOUNTS = gql`
  query GetBankAccounts($organisationId: String!, $branchId: String!) {
    bankAccounts(organisationId: $organisationId, branchId: $branchId) {
      id
      glAccountId
      glAccountCode
      glAccountName
      accountName
      bankName
      accountNumber
      accountType
      currency
      bookBalance
      bankBalance
      difference
      lastReconciled
      status
      isReconciled
      organisationId
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const GET_BANK_ACCOUNT_BY_ID = gql`
  query GetBankAccountById($id: String!) {
    bankAccount(id: $id) {
      id
      glAccountId
      glAccountCode
      glAccountName
      accountName
      bankName
      accountNumber
      accountType
      currency
      bookBalance
      bankBalance
      difference
      lastReconciled
      status
      isReconciled
      createdAt
      updatedAt
    }
  }
`;

export const GET_BANK_ACCOUNT_WITH_GL_BALANCE = gql`
  query GetBankAccountWithGLBalance($id: String!) {
    bankAccount(id: $id) {
      id
      accountName
      bankName
      accountNumber
      bankBalance
      lastReconciled
      status
      glAccountId
      glAccount {
        id
        accountCode
        accountName
        balance
      }
    }
  }
`;

// ============================================
// FISCAL PERIODS QUERIES
// ============================================

export const GET_FISCAL_PERIODS = gql`
  query GetFiscalPeriods(
    $organisationId: String!
    $branchId: String!
    $fiscalYear: Int
  ) {
    fiscalPeriods(
      input: {
        organisationId: $organisationId
        branchId: $branchId
        fiscalYear: $fiscalYear
      }
    ) {
      id
      fiscalYear
      periodNumber
      periodName
      startDate
      endDate
      status
      closedAt
      closedBy
      lockedAt
      lockedBy
      organisationId
      branchId
      createdAt
    }
  }
`;

export const GET_CURRENT_FISCAL_PERIOD = gql`
  query GetCurrentFiscalPeriod($organisationId: String!, $branchId: String!) {
    currentFiscalPeriod(organisationId: $organisationId, branchId: $branchId) {
      id
      fiscalYear
      periodNumber
      periodName
      startDate
      endDate
      status
    }
  }
`;

export const GET_FISCAL_PERIOD = gql`
  query GetFiscalPeriod(
    $fiscalYear: Int!
    $periodNumber: Int!
    $organisationId: String!
    $branchId: String!
  ) {
    fiscalPeriod(
      input: {
        fiscalYear: $fiscalYear
        periodNumber: $periodNumber
        organisationId: $organisationId
        branchId: $branchId
      }
    ) {
      id
      fiscalYear
      periodNumber
      periodName
      startDate
      endDate
      status
      closedAt
      closedBy
      lockedAt
      lockedBy
    }
  }
`;

// ============================================
// FINANCIAL REPORTS QUERIES
// ============================================

// Note: Not available in schema yet
export const GET_TRIAL_BALANCE = gql`
  query GetTrialBalance(
    $organisationId: String!
    $branchId: String!
    $fiscalYear: Int!
    $fiscalPeriod: Int!
  ) {
    __typename
  }
`;

// Note: Not available in schema yet
export const GET_BALANCE_SHEET = gql`
  query GetBalanceSheet(
    $organisationId: String!
    $branchId: String!
    $asOfDate: DateTime!
  ) {
    __typename
  }
`;

// Note: Not available in schema yet
export const GET_INCOME_STATEMENT = gql`
  query GetIncomeStatement(
    $organisationId: String!
    $branchId: String!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    __typename
  }
`;

// Note: Not available in schema yet
export const GET_CASH_FLOW_STATEMENT = gql`
  query GetCashFlowStatement(
    $organisationId: String!
    $branchId: String!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    __typename
  }
`;

// ============================================
// BANK RECONCILIATION QUERIES
// ============================================

export const GET_BANK_RECONCILIATIONS = gql`
  query GetBankReconciliations($bankAccountId: String!) {
    bankReconciliations(bankAccountId: $bankAccountId) {
      id
      bankAccountId
      reconciliationDate
      bankStatementBalance
      bookBalance
      adjustedBalance
      difference
      status
      clearedTransactions
      notes
      reconciledBy
      reconciledAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_BANK_RECONCILIATION = gql`
  query GetBankReconciliation($id: String!) {
    bankReconciliation(id: $id) {
      id
      bankAccountId
      reconciliationDate
      bankStatementBalance
      bookBalance
      adjustedBalance
      difference
      status
      clearedTransactions
      notes
      reconciledBy
      reconciledAt
      createdAt
      updatedAt
    }
  }
`;
