'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Asset } from '@/types/asset';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CubeIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  TagIcon,
  MapPinIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { DISPOSE_ASSET } from '@/graphql/queries/assetQueries';
import { toast } from 'react-hot-toast';

interface AssetDetailModalProps {
  open: boolean;
  onClose: () => void;
  asset: Asset;
  onEdit: () => void;
  organisationId: string;
  branchId: string;
  onDisposed?: () => void;
}

export default function AssetDetailModal({
  open,
  onClose,
  asset,
  onEdit,
  organisationId,
  branchId,
  onDisposed,
}: AssetDetailModalProps) {
  const [showDisposeForm, setShowDisposeForm] = useState(false);
  const [disposalData, setDisposalData] = useState({
    disposalDate: new Date().toISOString().split('T')[0],
    disposalMethod: 'SOLD',
    disposalReason: '',
    salePrice: 0,
    buyerRecipient: '',
    disposalNotes: '',
  });

  const [disposeAsset, { loading: disposing }] = useMutation(DISPOSE_ASSET, {
    onCompleted: () => {
      toast.success('Asset disposed successfully!');
      setShowDisposeForm(false);
      onDisposed?.();
      onClose();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleDispose = async () => {
    if (!disposalData.disposalDate) {
      toast.error('Please select a disposal date');
      return;
    }

    if (!disposalData.disposalMethod) {
      toast.error('Please select a disposal method');
      return;
    }

    if (disposalData.disposalMethod === 'SOLD' && !disposalData.salePrice) {
      toast.error('Please enter sale price for sold assets');
      return;
    }

    // Convert YYYY-MM-DD to ISO 8601 format for backend validation
    const disposalDateISO = new Date(disposalData.disposalDate).toISOString();

    const input = {
      assetId: asset.id,
      disposalDate: disposalDateISO,
      disposalMethod: disposalData.disposalMethod,
      disposalReason: disposalData.disposalReason || undefined,
      salePrice: disposalData.salePrice || undefined,
      buyerRecipient: disposalData.buyerRecipient || undefined,
      disposalNotes: disposalData.disposalNotes || undefined,
      bookValueAtDisposal: asset.currentValue,
      organisationId,
      branchId: branchId || undefined,
    };

    await disposeAsset({ variables: { input } });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'IN_MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DISPOSED':
        return 'bg-red-100 text-red-800';
      case 'RETIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <CubeIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl">{asset.name}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">{asset.assetType?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onEdit} variant="outline" size="sm">
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {asset.status !== 'DISPOSED' && !showDisposeForm && (
                <Button 
                  onClick={() => setShowDisposeForm(true)} 
                  variant="destructive" 
                  size="sm"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Dispose
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Disposal Form */}
          {showDisposeForm && (
            <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                  <TrashIcon className="h-5 w-5" />
                  Dispose Asset
                </h3>
                <button
                  onClick={() => setShowDisposeForm(false)}
                  className="p-1 hover:bg-red-200 rounded transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-red-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="disposalDate">Disposal Date *</Label>
                    <Input
                      id="disposalDate"
                      type="date"
                      value={disposalData.disposalDate}
                      onChange={(e) => setDisposalData({ ...disposalData, disposalDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="disposalMethod">Disposal Method *</Label>
                    <Select 
                      value={disposalData.disposalMethod} 
                      onValueChange={(value) => setDisposalData({ ...disposalData, disposalMethod: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOLD">Sold</SelectItem>
                        <SelectItem value="DONATED">Donated</SelectItem>
                        <SelectItem value="SCRAPPED">Scrapped</SelectItem>
                        <SelectItem value="LOST">Lost</SelectItem>
                        <SelectItem value="STOLEN">Stolen</SelectItem>
                        <SelectItem value="DAMAGED">Damaged Beyond Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {disposalData.disposalMethod === 'SOLD' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salePrice">Sale Price (GH₵) *</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={disposalData.salePrice}
                        onChange={(e) => setDisposalData({ ...disposalData, salePrice: parseFloat(e.target.value) || 0 })}
                        className="mt-1"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="buyerRecipient">Buyer Name</Label>
                      <Input
                        id="buyerRecipient"
                        type="text"
                        value={disposalData.buyerRecipient}
                        onChange={(e) => setDisposalData({ ...disposalData, buyerRecipient: e.target.value })}
                        className="mt-1"
                        placeholder="Enter buyer name"
                      />
                    </div>
                  </div>
                )}

                {(disposalData.disposalMethod === 'DONATED') && (
                  <div>
                    <Label htmlFor="buyerRecipient">Recipient</Label>
                    <Input
                      id="buyerRecipient"
                      type="text"
                      value={disposalData.buyerRecipient}
                      onChange={(e) => setDisposalData({ ...disposalData, buyerRecipient: e.target.value })}
                      className="mt-1"
                      placeholder="Enter recipient name"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="disposalReason">Reason for Disposal</Label>
                  <Input
                    id="disposalReason"
                    type="text"
                    value={disposalData.disposalReason}
                    onChange={(e) => setDisposalData({ ...disposalData, disposalReason: e.target.value })}
                    className="mt-1"
                    placeholder="e.g., End of useful life, damaged, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="disposalNotes">Additional Notes</Label>
                  <Textarea
                    id="disposalNotes"
                    value={disposalData.disposalNotes}
                    onChange={(e) => setDisposalData({ ...disposalData, disposalNotes: e.target.value })}
                    className="mt-1"
                    placeholder="Any additional information about the disposal..."
                    rows={3}
                  />
                </div>

                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-gray-600 mb-2">Current Book Value:</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(asset.currentValue || 0)}</p>
                  {disposalData.disposalMethod === 'SOLD' && disposalData.salePrice > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Estimated Gain/Loss:</p>
                      <p className={`text-lg font-semibold ${
                        (disposalData.salePrice - (asset.currentValue || 0)) >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {(disposalData.salePrice - (asset.currentValue || 0)) >= 0 ? '+' : ''}
                        {formatCurrency(disposalData.salePrice - (asset.currentValue || 0))}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleDispose}
                    disabled={disposing}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {disposing ? 'Processing...' : 'Confirm Disposal'}
                  </Button>
                  <Button
                    onClick={() => setShowDisposeForm(false)}
                    variant="outline"
                    disabled={disposing}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Status Badge */}
          <div>
            <Badge className={getStatusColor(asset.status)}>
              {asset.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Asset Code
                </label>
                <p className="text-lg font-semibold mt-1">{asset.assetCode || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Purchase Date
                </label>
                <p className="text-lg font-semibold mt-1">{formatDate(asset.purchaseDate)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Location
                </label>
                <p className="text-lg font-semibold mt-1">{asset.location || 'N/A'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  Purchase Price
                </label>
                <p className="text-lg font-semibold mt-1">{formatCurrency(asset.purchasePrice || 0)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Current Value</label>
                <p className="text-lg font-semibold mt-1">{formatCurrency(asset.currentValue)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Depreciation Rate</label>
                <p className="text-lg font-semibold mt-1 text-red-600">
                  {asset.depreciationRate ? `${asset.depreciationRate}% per year` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Depreciation Information */}
          {asset.depreciationRate && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Depreciation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Annual Depreciation Rate</label>
                  <p className="text-base font-semibold mt-1">{asset.depreciationRate}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Value</label>
                  <p className="text-base font-semibold mt-1">{formatCurrency(asset.currentValue || 0)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {asset.description && (
            <div className="border-t pt-6">
              <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                <DocumentTextIcon className="h-4 w-4" />
                Description
              </label>
              <p className="text-gray-700 whitespace-pre-wrap">{asset.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500">Created</label>
                <p className="font-medium">{formatDate(asset.createdAt)}</p>
              </div>
              <div>
                <label className="text-gray-500">Last Updated</label>
                <p className="font-medium">{formatDate(asset.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
