import { gql } from '@apollo/client';

export const CREATE_JOURNAL_ENTRY = gql`
  mutation CreateJournalEntry($input: CreateJournalEntryInput!) {
    createJournalEntry(input: $input) {
      id
      journalEntryNumber
      entryDate
      postingDate
      entryType
      sourceModule
      description
      reference
      memo
      fiscalYear
      fiscalPeriod
      status
      branchId
      organisationId
      lines {
        id
        lineNumber
        accountId
        account {
          id
          accountCode
          accountName
          accountType
        }
        description
        debitAmount
        creditAmount
        currency
      }
      createdAt
      updatedAt
      createdBy
    }
  }
`;

export const CREATE_JOURNAL_ENTRY_WITH_ASSET = gql`
  mutation CreateJournalEntryWithAsset(
    $assetInput: CreateAssetInput!
    $journalInput: CreateJournalEntryInput!
    $postToJournal: Boolean!
  ) {
    createAssetWithJournal(
      assetInput: $assetInput
      journalInput: $journalInput
      postToJournal: $postToJournal
    ) {
      asset {
        id
        name
        assetCode
        purchasePrice
        currentValue
      }
      journalEntry {
        id
        entryNumber
        description
        totalDebit
        totalCredit
      }
    }
  }
`;

export const POST_DEPRECIATION_BATCH = gql`
  mutation PostDepreciationBatch($input: PostDepreciationInput!) {
    postDepreciationBatch(input: $input) {
      success
      entriesCreated
      totalDepreciation
      journalEntries {
        id
        entryNumber
        description
        totalDebit
        totalCredit
      }
      errors
    }
  }
`;

export const CREATE_ASSET_DISPOSAL_ENTRY = gql`
  mutation CreateAssetDisposalEntry($input: AssetDisposalInput!) {
    createAssetDisposalEntry(input: $input) {
      asset {
        id
        name
        status
      }
      journalEntry {
        id
        entryNumber
        description
        totalDebit
        totalCredit
      }
      gainLoss
    }
  }
`;

export interface JournalLineInput {
  lineNumber: number;
  accountId: string;
  description?: string;
  debitAmount: number;
  creditAmount: number;
  currency?: string;
  fundId?: string;
  ministryId?: string;
  memberId?: string;
}

export interface CreateJournalEntryInput {
  entryDate: Date | string;
  postingDate?: Date | string;
  entryType: 'STANDARD' | 'ADJUSTING' | 'CLOSING' | 'REVERSING';
  sourceModule: string; // "ASSET", "TRANSACTION", "CONTRIBUTION", etc.
  sourceTransactionId?: string;
  description: string;
  reference?: string;
  memo?: string;
  fiscalYear: number;
  fiscalPeriod: number; // 1-12
  status?: 'DRAFT' | 'POSTED' | 'VOID';
  lines: JournalLineInput[];
  branchId?: string;
  organisationId: string;
  createdBy?: string;
}

export interface PostDepreciationInput {
  organisationId: string;
  branchId: string;
  userId: string;
  period: string; // e.g., "2025-11" for November 2025
  assetIds?: string[]; // Optional: specific assets, or all if not provided
}

export interface AssetDisposalInput {
  assetId: string;
  disposalDate: Date | string;
  disposalMethod: 'SOLD' | 'SCRAPPED' | 'DONATED' | 'LOST' | 'STOLEN';
  disposalProceeds: number;
  notes?: string;
  organisationId: string;
  branchId: string;
  userId: string;
}
