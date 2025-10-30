import { gql } from '@apollo/client';

/**
 * Finance GraphQL Mutations
 * All mutations for the branch finances module
 */

// ============================================
// CHART OF ACCOUNTS MUTATIONS
// ============================================

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
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
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: String!, $input: UpdateAccountInput!) {
    updateAccount(id: $id, input: $input) {
      id
      accountCode
      accountName
      accountType
      accountSubType
      normalBalance
      isActive
      parentAccountId
    }
  }
`;

export const DEACTIVATE_ACCOUNT = gql`
  mutation DeactivateAccount($id: String!) {
    deactivateAccount(id: $id) {
      id
      isActive
    }
  }
`;

// ============================================
// JOURNAL ENTRY MUTATIONS
// ============================================

export const CREATE_JOURNAL_ENTRY = gql`
  mutation CreateJournalEntry($input: CreateJournalEntryInput!) {
    createJournalEntry(input: $input) {
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
      organisationId
      branchId
      createdAt
    }
  }
`;

export const POST_JOURNAL_ENTRY = gql`
  mutation PostJournalEntry($id: String!, $version: Int) {
    postJournalEntry(id: $id, version: $version) {
      id
      status
      postedAt
      postedBy
      version
    }
  }
`;

export const VOID_JOURNAL_ENTRY = gql`
  mutation VoidJournalEntry($input: VoidJournalEntryInput!, $version: Int) {
    voidJournalEntry(input: $input, version: $version) {
      id
      status
      voidedAt
      voidedBy
      voidReason
      version
    }
  }
`;

export const REVERSE_JOURNAL_ENTRY = gql`
  mutation ReverseJournalEntry($input: ReverseJournalEntryInput!) {
    reverseJournalEntry(input: $input) {
      id
      journalEntryNumber
      entryDate
      description
      status
      totalDebit
      totalCredit
    }
  }
`;

// ============================================
// OFFERING BATCH MUTATIONS
// ============================================

export const CREATE_OFFERING_BATCH = gql`
  mutation CreateOfferingBatch($input: CreateOfferingBatchInput!) {
    createOfferingBatch(input: $input) {
      id
      batchNumber
      batchDate
      serviceName
      cashAmount
      mobileMoneyAmount
      chequeAmount
      foreignCurrencyAmount
      totalAmount
      status
      countedBy
    }
  }
`;

export const VERIFY_OFFERING_BATCH = gql`
  mutation VerifyOfferingBatch($input: VerifyOfferingBatchInput!) {
    verifyOfferingBatch(input: $input) {
      id
      status
      verifiedBy
      verifiedAt
      discrepancyAmount
      discrepancyNotes
      depositDate
      depositSlipNumber
    }
  }
`;

export const APPROVE_OFFERING_BATCH = gql`
  mutation ApproveOfferingBatch($id: String!, $version: Int) {
    approveOfferingBatch(id: $id, version: $version) {
      id
      status
      approvedBy
      version
    }
  }
`;

export const POST_OFFERING_TO_GL = gql`
  mutation PostOfferingToGL($input: PostOfferingToGLInput!, $version: Int) {
    postOfferingToGL(input: $input, version: $version) {
      id
      status
      isPostedToGL
      journalEntryId
      version
    }
  }
`;

// ============================================
// BANK ACCOUNT MUTATIONS
// ============================================

export const CREATE_BANK_ACCOUNT = gql`
  mutation CreateBankAccount($input: CreateBankAccountInput!) {
    createBankAccount(input: $input) {
      id
      glAccountId
      accountName
      bankName
      accountNumber
      accountType
      currency
      bookBalance
      bankBalance
      status
    }
  }
`;

export const UPDATE_BANK_BALANCE = gql`
  mutation UpdateBankBalance($id: String!, $bankBalance: Float!) {
    updateBankBalance(id: $id, bankBalance: $bankBalance) {
      id
      bankBalance
      bookBalance
    }
  }
`;

export const UPDATE_BANK_ACCOUNT = gql`
  mutation UpdateBankAccount($id: String!, $input: UpdateBankAccountInput!) {
    updateBankAccount(id: $id, input: $input) {
      id
      accountName
      bankName
      accountNumber
      accountType
      currency
      status
    }
  }
`;

export const DEACTIVATE_BANK_ACCOUNT = gql`
  mutation DeactivateBankAccount($id: String!) {
    deactivateBankAccount(id: $id) {
      id
      status
    }
  }
`;

// ============================================
// BANK RECONCILIATION MUTATIONS
// ============================================

export const SAVE_BANK_RECONCILIATION = gql`
  mutation SaveBankReconciliation($input: SaveBankReconciliationInput!) {
    saveBankReconciliation(input: $input) {
      id
      bankAccountId
      reconciliationDate
      bankStatementBalance
      bookBalance
      adjustedBalance
      difference
      status
      preparedBy
      version
    }
  }
`;

export const SUBMIT_BANK_RECONCILIATION_FOR_REVIEW = gql`
  mutation SubmitBankReconciliationForReview($id: String!) {
    submitBankReconciliationForReview(id: $id) {
      id
      status
    }
  }
`;

export const APPROVE_BANK_RECONCILIATION = gql`
  mutation ApproveBankReconciliation($id: String!) {
    approveBankReconciliation(id: $id) {
      id
      status
      approvedBy
      approvedAt
    }
  }
`;

export const REJECT_BANK_RECONCILIATION = gql`
  mutation RejectBankReconciliation($id: String!, $reason: String!) {
    rejectBankReconciliation(id: $id, reason: $reason) {
      id
      status
      reviewedBy
      reviewedAt
      notes
    }
  }
`;

export const VOID_BANK_RECONCILIATION = gql`
  mutation VoidBankReconciliation($id: String!, $reason: String!) {
    voidBankReconciliation(id: $id, reason: $reason) {
      id
      status
      notes
    }
  }
`;

// ============================================
// FISCAL PERIOD MUTATIONS
// ============================================

export const CREATE_FISCAL_YEAR = gql`
  mutation CreateFiscalYear($input: CreateFiscalYearInput!) {
    createFiscalYear(input: $input) {
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

export const CLOSE_FISCAL_PERIOD = gql`
  mutation CloseFiscalPeriod($input: CloseFiscalPeriodInput!) {
    closeFiscalPeriod(input: $input) {
      id
      status
      closedAt
      closedBy
    }
  }
`;

export const REOPEN_FISCAL_PERIOD = gql`
  mutation ReopenFiscalPeriod($input: CloseFiscalPeriodInput!) {
    reopenFiscalPeriod(input: $input) {
      id
      status
    }
  }
`;

export const LOCK_FISCAL_PERIOD = gql`
  mutation LockFiscalPeriod($input: CloseFiscalPeriodInput!) {
    lockFiscalPeriod(input: $input) {
      id
      status
      lockedAt
      lockedBy
    }
  }
`;
