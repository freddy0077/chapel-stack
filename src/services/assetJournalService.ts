/**
 * Asset Journal Integration Service
 * 
 * Handles automatic journal entry creation for asset transactions:
 * - Asset purchases
 * - Asset disposals
 * - Depreciation posting
 */

import { Asset } from '@/types/asset';

export interface AssetAccountMapping {
  assetTypeId: string;
  assetAccountId: string;           // Balance Sheet - Asset account
  depreciationExpenseId: string;    // Income Statement - Depreciation Expense
  accumulatedDepId: string;         // Balance Sheet - Accumulated Depreciation (Contra Asset)
}

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

export interface JournalEntryInput {
  entryDate: Date | string;
  postingDate?: Date | string;
  entryType: 'STANDARD' | 'ADJUSTING' | 'CLOSING' | 'REVERSING';
  sourceModule: string;
  sourceTransactionId?: string;
  description: string;
  reference?: string;
  memo?: string;
  fiscalYear: number;
  fiscalPeriod: number;
  status?: 'DRAFT' | 'POSTED' | 'VOID';
  lines: JournalLineInput[];
  branchId?: string;
  organisationId: string;
  createdBy?: string;
}

/**
 * Asset Journal Service
 */
export class AssetJournalService {
  /**
   * Create journal entry for asset purchase
   * 
   * Journal Entry:
   * DR: Asset Account (Balance Sheet)
   * CR: Cash/Bank Account (Balance Sheet)
   */
  static createAssetPurchaseEntry(
    asset: Asset,
    cashAccountId: string,
    assetAccountId: string,
    organisationId: string,
    branchId: string,
    userId: string
  ): JournalEntryInput {
    const purchaseDate = asset.purchaseDate ? new Date(asset.purchaseDate) : new Date();
    const amount = asset.purchasePrice || 0;

    return {
      entryDate: purchaseDate,
      postingDate: purchaseDate,
      entryType: 'STANDARD',
      sourceModule: 'ASSET',
      sourceTransactionId: asset.id,
      description: `Asset Purchase: ${asset.name} (${asset.assetCode})`,
      reference: asset.assetCode,
      memo: `Purchase of ${asset.name}`,
      fiscalYear: purchaseDate.getFullYear(),
      fiscalPeriod: purchaseDate.getMonth() + 1,
      status: 'POSTED',
      organisationId,
      branchId,
      createdBy: userId,
      lines: [
        {
          lineNumber: 1,
          accountId: assetAccountId,
          debitAmount: amount,
          creditAmount: 0,
          description: `Purchase of ${asset.name}`,
          currency: 'GHS',
        },
        {
          lineNumber: 2,
          accountId: cashAccountId,
          debitAmount: 0,
          creditAmount: amount,
          description: `Payment for ${asset.name}`,
          currency: 'GHS',
        },
      ],
    };
  }

  /**
   * Create journal entry for depreciation
   * 
   * Journal Entry:
   * DR: Depreciation Expense (Income Statement)
   * CR: Accumulated Depreciation (Balance Sheet - Contra Asset)
   */
  static createDepreciationEntry(
    asset: Asset,
    depreciatedAmount: number,
    depreciationExpenseId: string,
    accumulatedDepId: string,
    period: string, // "2025-11"
    organisationId: string,
    branchId: string,
    userId: string
  ): JournalEntryInput {
    const [year, month] = period.split('-').map(Number);
    const entryDate = new Date(year, month - 1, 1);

    return {
      entryDate,
      postingDate: entryDate,
      entryType: 'STANDARD',
      sourceModule: 'ASSET',
      sourceTransactionId: asset.id,
      description: `Depreciation - ${period}: ${asset.name}`,
      reference: `DEP-${asset.assetCode}-${period}`,
      memo: `Monthly depreciation for ${asset.name}`,
      fiscalYear: year,
      fiscalPeriod: month,
      status: 'POSTED',
      organisationId,
      branchId,
      createdBy: userId,
      lines: [
        {
          lineNumber: 1,
          accountId: depreciationExpenseId,
          debitAmount: depreciatedAmount,
          creditAmount: 0,
          description: `Depreciation expense for ${asset.name}`,
          currency: 'GHS',
        },
        {
          lineNumber: 2,
          accountId: accumulatedDepId,
          debitAmount: 0,
          creditAmount: depreciatedAmount,
          description: `Accumulated depreciation for ${asset.name}`,
          currency: 'GHS',
        },
      ],
    };
  }

  /**
   * Create journal entry for asset disposal
   * 
   * Journal Entry (if sold):
   * DR: Cash (if proceeds received)
   * DR: Accumulated Depreciation
   * DR/CR: Loss/Gain on Disposal
   * CR: Asset Account
   */
  static createAssetDisposalEntry(
    asset: Asset,
    disposalProceeds: number,
    cashAccountId: string,
    assetAccountId: string,
    accumulatedDepId: string,
    gainLossAccountId: string,
    organisationId: string,
    branchId: string,
    userId: string
  ): JournalEntryInput {
    const purchaseValue = asset.purchasePrice || asset.currentValue || 0;
    const accumulatedDep = (asset.purchasePrice || 0) - (asset.currentValue || 0);
    const bookValue = purchaseValue - accumulatedDep;
    const gainLoss = disposalProceeds - bookValue;

    const disposalDate = new Date();
    let lineNumber = 1;
    const lines: JournalLineInput[] = [];

    // Cash received (if any)
    if (disposalProceeds > 0) {
      lines.push({
        lineNumber: lineNumber++,
        accountId: cashAccountId,
        debitAmount: disposalProceeds,
        creditAmount: 0,
        description: `Proceeds from disposal of ${asset.name}`,
        currency: 'GHS',
      });
    }
    
    // Accumulated Depreciation
    lines.push({
      lineNumber: lineNumber++,
      accountId: accumulatedDepId,
      debitAmount: accumulatedDep,
      creditAmount: 0,
      description: `Remove accumulated depreciation for ${asset.name}`,
      currency: 'GHS',
    });
    
    // Gain or Loss on Disposal
    if (gainLoss !== 0) {
      lines.push({
        lineNumber: lineNumber++,
        accountId: gainLossAccountId,
        debitAmount: gainLoss < 0 ? Math.abs(gainLoss) : 0,
        creditAmount: gainLoss > 0 ? gainLoss : 0,
        description: `${gainLoss > 0 ? 'Gain' : 'Loss'} on disposal of ${asset.name}`,
        currency: 'GHS',
      });
    }
    
    // Remove Asset
    lines.push({
      lineNumber: lineNumber++,
      accountId: assetAccountId,
      debitAmount: 0,
      creditAmount: purchaseValue,
      description: `Disposal of ${asset.name}`,
      currency: 'GHS',
    });

    return {
      entryDate: disposalDate,
      postingDate: disposalDate,
      entryType: 'STANDARD',
      sourceModule: 'ASSET',
      sourceTransactionId: asset.id,
      description: `Asset Disposal: ${asset.name} (${asset.assetCode})`,
      reference: `DISP-${asset.assetCode}`,
      memo: `Disposal of ${asset.name}`,
      fiscalYear: disposalDate.getFullYear(),
      fiscalPeriod: disposalDate.getMonth() + 1,
      status: 'POSTED',
      organisationId,
      branchId,
      createdBy: userId,
      lines,
    };
  }

  /**
   * Calculate monthly depreciation for an asset
   */
  static calculateMonthlyDepreciation(asset: Asset): number {
    if (!asset.purchasePrice || !asset.depreciationRate) {
      return 0;
    }

    // Straight-line depreciation
    const annualDepreciation = asset.purchasePrice * (asset.depreciationRate / 100);
    const monthlyDepreciation = annualDepreciation / 12;

    return Math.round(monthlyDepreciation * 100) / 100; // Round to 2 decimals
  }

  /**
   * Validate journal entry before posting
   */
  static validateJournalEntry(entry: JournalEntryInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if lines exist
    if (!entry.lines || entry.lines.length === 0) {
      errors.push('Journal entry must have at least one line');
    }

    // Check if debits equal credits
    const totalDebits = entry.lines.reduce((sum, line) => sum + line.debitAmount, 0);
    const totalCredits = entry.lines.reduce((sum, line) => sum + line.creditAmount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      errors.push(`Debits (${totalDebits}) must equal Credits (${totalCredits})`);
    }

    // Check for valid account IDs
    entry.lines.forEach((line, index) => {
      if (!line.accountId) {
        errors.push(`Line ${index + 1}: Account ID is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Get default account IDs for asset transactions
   * This should be configured per organization
   */
  static getDefaultAccountIds() {
    return {
      // These should be fetched from organization settings
      // For now, return placeholder structure
      cashAccountId: '', // To be configured
      assetAccountId: '', // To be configured per asset type
      depreciationExpenseId: '', // To be configured per asset type
      accumulatedDepId: '', // To be configured per asset type
      gainLossAccountId: '', // To be configured
    };
  }
}

export default AssetJournalService;
