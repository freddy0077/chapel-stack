'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckIcon, ExclamationTriangleIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GET_CHART_OF_ACCOUNTS } from '@/graphql/queries/accountQueries';
import { GET_ASSET_TYPES } from '@/graphql/queries/assetQueries';
import { CREATE_JOURNAL_ENTRY } from '@/graphql/mutations/journalMutations';
import { Asset, CreateAssetInput } from '@/types/asset';
import AssetJournalService from '@/services/assetJournalService';
import { toast } from 'react-hot-toast';

interface AssetFormWithJournalModalProps {
  open: boolean;
  onClose: () => void;
  asset?: Asset | null;
  organisationId: string;
  branchId: string;
  userId: string;
  onSubmit: (input: CreateAssetInput, postToJournal: boolean, journalData?: any) => void;
}

export default function AssetFormWithJournalModal({
  open,
  onClose,
  asset,
  organisationId,
  branchId,
  userId,
  onSubmit,
}: AssetFormWithJournalModalProps) {
  const [postToJournal, setPostToJournal] = useState(true);
  const [cashAccountId, setCashAccountId] = useState('');
  const [assetAccountId, setAssetAccountId] = useState('');
  const [showJournalPreview, setShowJournalPreview] = useState(false);

  // Fetch Chart of Accounts
  const { data: accountsData, loading: accountsLoading } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: { 
      input: {
        organisationId, 
        branchId 
      }
    },
    skip: !organisationId || !open || !postToJournal,
  });

  // Fetch Asset Types
  const { data: assetTypesData, loading: assetTypesLoading } = useQuery(GET_ASSET_TYPES, {
    variables: { organisationId },
    skip: !organisationId || !open,
  });

  const accounts = accountsData?.chartOfAccounts || [];
  const cashAccounts = accounts.filter((acc: any) => 
    acc.accountType === 'ASSET' && 
    (acc.accountName?.toLowerCase().includes('cash') || acc.accountName?.toLowerCase().includes('bank'))
  );
  const assetAccounts = accounts.filter((acc: any) => acc.accountType === 'ASSET');
  const assetTypes = assetTypesData?.assetTypes || [];

  // Debug logging
  useEffect(() => {
    if (open && postToJournal) {
      console.log('AssetFormWithJournalModal Debug:', {
        accountsLoading,
        assetTypesLoading,
        totalAccounts: accounts.length,
        cashAccounts: cashAccounts.length,
        assetAccounts: assetAccounts.length,
        assetTypes: assetTypes.length,
        organisationId,
        branchId,
      });
    }
  }, [open, postToJournal, accounts, cashAccounts, assetAccounts, accountsLoading, organisationId, branchId]);

  // Form state with all required fields
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    assetTypeId: asset?.assetTypeId || '',
    purchasePrice: asset?.purchasePrice || 0,
    purchaseDate: asset?.purchaseDate ? new Date(asset.purchaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: asset?.description || '',
  });

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name) {
      toast.error('Please enter asset name');
      return;
    }
    if (!formData.assetTypeId) {
      toast.error('Please select asset type');
      return;
    }
    if (!formData.purchasePrice || formData.purchasePrice <= 0) {
      toast.error('Please enter a valid purchase price');
      return;
    }

    if (postToJournal) {
      if (!cashAccountId) {
        toast.error('Please select a Cash/Bank account');
        return;
      }
      if (!assetAccountId) {
        toast.error('Please select an Asset account');
        return;
      }
    }

    // Create complete input with required fields
    // Send date as YYYY-MM-DD format (class-validator @IsDateString expects this)
    const purchaseDate = formData.purchaseDate || new Date().toISOString().split('T')[0];

    // For updates, only include id and fields to update (no organisationId/branchId)
    // For creates, include organisationId and branchId
    const assetInput: any = asset ? {
      id: asset.id, // Required for updates
      name: formData.name,
      assetTypeId: formData.assetTypeId,
      purchasePrice: formData.purchasePrice,
      purchaseDate: purchaseDate as any,
      description: formData.description || undefined,
    } : {
      name: formData.name,
      assetTypeId: formData.assetTypeId,
      purchasePrice: formData.purchasePrice,
      purchaseDate: purchaseDate as any,
      description: formData.description || undefined,
      organisationId, // Only for creates
      branchId: branchId || undefined, // Only for creates
    };

    // Create journal entry data
    const journalData = postToJournal ? {
      cashAccountId,
      assetAccountId,
    } : undefined;

    // Call parent onSubmit with complete data
    onSubmit(assetInput, postToJournal, journalData);
  };

  // Generate journal preview
  const journalPreview = postToJournal && cashAccountId && assetAccountId ? 
    AssetJournalService.createAssetPurchaseEntry(
      { ...formData, assetCode: 'PREVIEW' } as Asset,
      cashAccountId,
      assetAccountId,
      organisationId,
      branchId,
      userId
    ) : null;

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {asset ? 'Edit Asset' : 'Add New Asset'}
                </h2>
                <p className="text-amber-100 mt-1">
                  {postToJournal ? 'With automatic journal posting' : 'Asset details only'}
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
            {/* Asset Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Asset Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sound System"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetTypeId">Asset Type *</Label>
                {assetTypesLoading ? (
                  <div className="h-12 flex items-center justify-center border rounded-md">
                    <span className="text-sm text-gray-500">Loading asset types...</span>
                  </div>
                ) : assetTypes.length === 0 ? (
                  <div className="h-12 flex items-center justify-center border rounded-md bg-yellow-50">
                    <span className="text-sm text-yellow-700">No asset types found</span>
                  </div>
                ) : (
                  <Select value={formData.assetTypeId} onValueChange={(value) => setFormData({ ...formData, assetTypeId: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {assetTypes.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about the asset"
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price (GH₵) *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Journal Posting Section */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="postToJournal"
                  checked={postToJournal}
                  onCheckedChange={(checked) => setPostToJournal(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="postToJournal" className="text-base font-semibold cursor-pointer">
                    Post to Journal Automatically
                  </Label>
                  <p className="text-sm text-gray-600">
                    Create journal entry for this asset purchase
                  </p>
                </div>
                <BanknotesIcon className="w-6 h-6 text-amber-600" />
              </div>

              {postToJournal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pl-8"
                >
                  {/* Info Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Automatic Journal Entry</p>
                        <p>
                          The system will create a journal entry debiting the Asset account
                          and crediting the Cash/Bank account for GH₵ {formData.purchasePrice?.toLocaleString() || '0'}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cash/Bank Account *</Label>
                      {accountsLoading ? (
                        <div className="h-12 flex items-center justify-center border rounded-md">
                          <span className="text-sm text-gray-500">Loading accounts...</span>
                        </div>
                      ) : cashAccounts.length === 0 ? (
                        <div className="h-12 flex items-center justify-center border rounded-md bg-yellow-50">
                          <span className="text-sm text-yellow-700">No cash/bank accounts found</span>
                        </div>
                      ) : (
                        <Select value={cashAccountId} onValueChange={setCashAccountId}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {cashAccounts.map((account: any) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.accountCode} - {account.accountName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Asset Account *</Label>
                      {accountsLoading ? (
                        <div className="h-12 flex items-center justify-center border rounded-md">
                          <span className="text-sm text-gray-500">Loading accounts...</span>
                        </div>
                      ) : assetAccounts.length === 0 ? (
                        <div className="h-12 flex items-center justify-center border rounded-md bg-yellow-50">
                          <span className="text-sm text-yellow-700">No asset accounts found</span>
                        </div>
                      ) : (
                        <Select value={assetAccountId} onValueChange={setAssetAccountId}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {assetAccounts.map((account: any) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.accountCode} - {account.accountName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* Journal Preview */}
                  {journalPreview && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">Journal Entry Preview</h4>
                        <button
                          onClick={() => setShowJournalPreview(!showJournalPreview)}
                          className="text-sm text-amber-600 hover:text-amber-700"
                        >
                          {showJournalPreview ? 'Hide' : 'Show'} Details
                        </button>
                      </div>

                      {showJournalPreview && (
                        <div className="text-sm space-y-2 font-mono">
                          <div className="grid grid-cols-3 gap-2 font-semibold border-b pb-2">
                            <div>Account</div>
                            <div className="text-right">Debit</div>
                            <div className="text-right">Credit</div>
                          </div>
                          {journalPreview.lines.map((line, idx) => (
                            <div key={idx} className="grid grid-cols-3 gap-2">
                              <div className="text-gray-700">{line.description}</div>
                              <div className="text-right">
                                {line.debit > 0 ? AssetJournalService.formatCurrency(line.debit) : '-'}
                              </div>
                              <div className="text-right">
                                {line.credit > 0 ? AssetJournalService.formatCurrency(line.credit) : '-'}
                              </div>
                            </div>
                          ))}
                          <div className="grid grid-cols-3 gap-2 font-semibold border-t pt-2">
                            <div>Total</div>
                            <div className="text-right">
                              {AssetJournalService.formatCurrency(
                                journalPreview.lines.reduce((sum, l) => sum + l.debit, 0)
                              )}
                            </div>
                            <div className="text-right">
                              {AssetJournalService.formatCurrency(
                                journalPreview.lines.reduce((sum, l) => sum + l.credit, 0)
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
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
              onClick={handleSubmit}
              className="px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            >
              {postToJournal ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Save & Post to Journal
                </>
              ) : (
                'Save Asset'
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
