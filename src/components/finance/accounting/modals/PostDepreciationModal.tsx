'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  CheckIcon, 
  ExclamationTriangleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GET_ASSETS } from '@/graphql/queries/assetQueries';
import { CREATE_JOURNAL_ENTRY } from '@/graphql/mutations/journalMutations';
import { Asset } from '@/types/asset';
import AssetJournalService from '@/services/assetJournalService';
import { toast } from 'react-hot-toast';

interface PostDepreciationModalProps {
  open: boolean;
  onClose: () => void;
  organisationId: string;
  branchId: string;
  userId: string;
  onSuccess: () => void;
}

interface DepreciationSummary {
  asset: Asset;
  monthlyDepreciation: number;
  depreciationExpenseId: string;
  accumulatedDepId: string;
}

export default function PostDepreciationModal({
  open,
  onClose,
  organisationId,
  branchId,
  userId,
  onSuccess,
}: PostDepreciationModalProps) {
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isPosting, setIsPosting] = useState(false);
  const [depreciationSummaries, setDepreciationSummaries] = useState<DepreciationSummary[]>([]);

  // Fetch active assets
  const { data: assetsData, loading: assetsLoading } = useQuery(GET_ASSETS, {
    variables: {
      filters: {
        organisationId,
        branchId,
        status: 'ACTIVE',
      },
    },
    skip: !organisationId || !open,
  });

  const [createJournalEntry] = useMutation(CREATE_JOURNAL_ENTRY);

  const assets: Asset[] = assetsData?.assets || [];

  // Calculate depreciation for all assets
  useEffect(() => {
    if (assets.length > 0) {
      const summaries: DepreciationSummary[] = assets
        .filter(asset => asset.depreciationRate && asset.depreciationRate > 0)
        .map(asset => ({
          asset,
          monthlyDepreciation: AssetJournalService.calculateMonthlyDepreciation(asset),
          // TODO: Get these from asset type mapping
          depreciationExpenseId: '', // Will be configured per asset type
          accumulatedDepId: '', // Will be configured per asset type
        }))
        .filter(summary => summary.monthlyDepreciation > 0);

      setDepreciationSummaries(summaries);
    }
  }, [assets]);

  const totalDepreciation = depreciationSummaries.reduce(
    (sum, s) => sum + s.monthlyDepreciation,
    0
  );

  const handlePostDepreciation = async () => {
    if (depreciationSummaries.length === 0) {
      toast.error('No assets with depreciation found');
      return;
    }

    setIsPosting(true);

    try {
      let successCount = 0;
      const errors: string[] = [];

      // Create journal entry for each asset
      for (const summary of depreciationSummaries) {
        try {
          // TODO: Get account IDs from asset type mapping
          // For now, using placeholder logic
          const depreciationExpenseId = summary.depreciationExpenseId || 'EXPENSE_ACCOUNT_ID';
          const accumulatedDepId = summary.accumulatedDepId || 'ACCUMULATED_DEP_ID';

          const journalEntry = AssetJournalService.createDepreciationEntry(
            summary.asset,
            summary.monthlyDepreciation,
            depreciationExpenseId,
            accumulatedDepId,
            period,
            organisationId,
            branchId,
            userId
          );

          // Validate
          const validation = AssetJournalService.validateJournalEntry(journalEntry);
          if (!validation.valid) {
            errors.push(`${summary.asset.name}: ${validation.errors.join(', ')}`);
            continue;
          }

          // Create journal entry
          await createJournalEntry({
            variables: {
              input: journalEntry,
            },
          });

          successCount++;
        } catch (error: any) {
          errors.push(`${summary.asset.name}: ${error.message}`);
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully posted depreciation for ${successCount} asset(s)!`
        );
        onSuccess();
        onClose();
      }

      if (errors.length > 0) {
        toast.error(`Failed for ${errors.length} asset(s). Check console for details.`);
        console.error('Depreciation posting errors:', errors);
      }
    } catch (error: any) {
      toast.error(`Error posting depreciation: ${error.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Post Monthly Depreciation</h2>
                <p className="text-orange-100 mt-1">
                  Create journal entries for asset depreciation
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Period Selection */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-blue-900 mb-2 block">
                    Depreciation Period
                  </Label>
                  <Input
                    type="month"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="max-w-xs"
                  />
                  <p className="text-xs text-blue-700 mt-2">
                    Select the month for which you want to post depreciation
                  </p>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {assetsLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            )}

            {/* Depreciation Summary */}
            {!assetsLoading && depreciationSummaries.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Assets to Depreciate ({depreciationSummaries.length})
                  </h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Depreciation</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {AssetJournalService.formatCurrency(totalDepreciation)}
                    </p>
                  </div>
                </div>

                {/* Asset List */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Asset
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Purchase Value
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Rate
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Monthly Depreciation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {depreciationSummaries.map((summary, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {summary.asset.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {summary.asset.assetCode}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                            {AssetJournalService.formatCurrency(
                              summary.asset.purchasePrice || 0
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                            {summary.asset.depreciationRate}%
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-semibold text-orange-600">
                              {AssetJournalService.formatCurrency(
                                summary.monthlyDepreciation
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-right text-lg font-bold text-orange-600">
                          {AssetJournalService.formatCurrency(totalDepreciation)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Journal Entry Preview */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-gray-900">Journal Entries to be Created</h4>
                  <p className="text-sm text-gray-600">
                    {depreciationSummaries.length} journal entry(ies) will be created:
                  </p>
                  <div className="text-sm font-mono space-y-1 text-gray-700">
                    <div>DR: Depreciation Expense → {AssetJournalService.formatCurrency(totalDepreciation)}</div>
                    <div>CR: Accumulated Depreciation → {AssetJournalService.formatCurrency(totalDepreciation)}</div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Important</p>
                      <p>
                        This will create journal entries and update asset values. 
                        Make sure you haven't already posted depreciation for this period.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Assets */}
            {!assetsLoading && depreciationSummaries.length === 0 && (
              <div className="text-center py-12">
                <CurrencyDollarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Assets to Depreciate
                </h3>
                <p className="text-gray-600">
                  No active assets with depreciation rates found.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isPosting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePostDepreciation}
              disabled={isPosting || depreciationSummaries.length === 0}
              className="px-6 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
            >
              {isPosting ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Post Depreciation ({depreciationSummaries.length} assets)
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
