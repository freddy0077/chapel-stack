'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GET_CHART_OF_ACCOUNTS } from '@/graphql/queries/accountQueries';
import { toast } from 'react-hot-toast';

interface AssetAccountMappingModalProps {
  open: boolean;
  onClose: () => void;
  assetTypeName: string;
  assetTypeId: string;
  organisationId: string;
  branchId: string;
  currentMapping?: {
    assetAccountId?: string;
    depreciationExpenseId?: string;
    accumulatedDepId?: string;
  };
  onSave: (mapping: {
    assetAccountId: string;
    depreciationExpenseId: string;
    accumulatedDepId: string;
  }) => void;
}

export default function AssetAccountMappingModal({
  open,
  onClose,
  assetTypeName,
  assetTypeId,
  organisationId,
  branchId,
  currentMapping,
  onSave,
}: AssetAccountMappingModalProps) {
  const [assetAccountId, setAssetAccountId] = useState(currentMapping?.assetAccountId || '');
  const [depreciationExpenseId, setDepreciationExpenseId] = useState(currentMapping?.depreciationExpenseId || '');
  const [accumulatedDepId, setAccumulatedDepId] = useState(currentMapping?.accumulatedDepId || '');

  // Fetch Chart of Accounts
  const { data: accountsData, loading: accountsLoading } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { organisationId, branchId },
    skip: !organisationId || !open,
  });

  const accounts = accountsData?.chartOfAccounts || [];

  // Filter accounts by type
  const assetAccounts = accounts.filter((acc: any) => acc.accountType === 'ASSET');
  const expenseAccounts = accounts.filter((acc: any) => acc.accountType === 'EXPENSE');
  const contraAssetAccounts = accounts.filter((acc: any) => 
    acc.accountType === 'ASSET' && acc.name?.toLowerCase().includes('accumulated')
  );

  useEffect(() => {
    if (currentMapping) {
      setAssetAccountId(currentMapping.assetAccountId || '');
      setDepreciationExpenseId(currentMapping.depreciationExpenseId || '');
      setAccumulatedDepId(currentMapping.accumulatedDepId || '');
    }
  }, [currentMapping]);

  const handleSave = () => {
    // Validation
    if (!assetAccountId) {
      toast.error('Please select an Asset Account');
      return;
    }
    if (!depreciationExpenseId) {
      toast.error('Please select a Depreciation Expense Account');
      return;
    }
    if (!accumulatedDepId) {
      toast.error('Please select an Accumulated Depreciation Account');
      return;
    }

    onSave({
      assetAccountId,
      depreciationExpenseId,
      accumulatedDepId,
    });
  };

  const isComplete = assetAccountId && depreciationExpenseId && accumulatedDepId;

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Asset Account Mapping</h2>
                <p className="text-amber-100 mt-1">
                  Configure accounts for: {assetTypeName}
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
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Why map accounts?</p>
                  <p>
                    Mapping accounts enables automatic journal entry creation when you purchase,
                    depreciate, or dispose of assets. This ensures your financial statements
                    are always accurate and up-to-date.
                  </p>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {accountsLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              </div>
            )}

            {/* Account Selection */}
            {!accountsLoading && (
              <div className="space-y-6">
                {/* Asset Account */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    1. Asset Account (Balance Sheet)
                  </Label>
                  <p className="text-xs text-gray-600 mb-2">
                    The account where the asset value will be recorded when purchased.
                  </p>
                  <Select value={assetAccountId} onValueChange={setAssetAccountId}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200">
                      <SelectValue placeholder="Select Asset Account" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 max-h-60">
                      {assetAccounts.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          No asset accounts found. Please create one first.
                        </div>
                      ) : (
                        assetAccounts.map((account: any) => (
                          <SelectItem
                            key={account.id}
                            value={account.id}
                            className="rounded-lg"
                          >
                            {account.accountCode} - {account.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {assetAccountId && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckIcon className="w-4 h-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>

                {/* Depreciation Expense Account */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    2. Depreciation Expense Account (Income Statement)
                  </Label>
                  <p className="text-xs text-gray-600 mb-2">
                    The expense account where depreciation will be recorded each period.
                  </p>
                  <Select value={depreciationExpenseId} onValueChange={setDepreciationExpenseId}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200">
                      <SelectValue placeholder="Select Depreciation Expense Account" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 max-h-60">
                      {expenseAccounts.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          No expense accounts found. Please create one first.
                        </div>
                      ) : (
                        expenseAccounts.map((account: any) => (
                          <SelectItem
                            key={account.id}
                            value={account.id}
                            className="rounded-lg"
                          >
                            {account.accountCode} - {account.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {depreciationExpenseId && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckIcon className="w-4 h-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>

                {/* Accumulated Depreciation Account */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    3. Accumulated Depreciation Account (Balance Sheet - Contra Asset)
                  </Label>
                  <p className="text-xs text-gray-600 mb-2">
                    The contra-asset account that tracks total depreciation over time.
                  </p>
                  <Select value={accumulatedDepId} onValueChange={setAccumulatedDepId}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200">
                      <SelectValue placeholder="Select Accumulated Depreciation Account" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 max-h-60">
                      {contraAssetAccounts.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          No accumulated depreciation accounts found. Please create one first.
                        </div>
                      ) : (
                        contraAssetAccounts.map((account: any) => (
                          <SelectItem
                            key={account.id}
                            value={account.id}
                            className="rounded-lg"
                          >
                            {account.accountCode} - {account.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {accumulatedDepId && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <CheckIcon className="w-4 h-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>

                {/* Preview */}
                {isComplete && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      ✓ Mapping Complete
                    </h4>
                    <p className="text-sm text-green-700">
                      When you purchase an asset of type "{assetTypeName}", the system will
                      automatically create journal entries using these accounts.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isComplete || accountsLoading}
              className="px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            >
              Save Mapping
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
