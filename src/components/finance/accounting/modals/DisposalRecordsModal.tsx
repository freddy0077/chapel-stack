'use client';

import { useQuery } from '@apollo/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TrashIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GET_ASSET_DISPOSALS } from '@/graphql/queries/assetQueries';

interface DisposalRecordsModalProps {
  open: boolean;
  onClose: () => void;
  organisationId: string;
  branchId: string;
}

export default function DisposalRecordsModal({
  open,
  onClose,
  organisationId,
  branchId,
}: DisposalRecordsModalProps) {
  const { data, loading } = useQuery(GET_ASSET_DISPOSALS, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });

  const disposals = data?.assetDisposals || [];

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
      month: 'short',
      day: 'numeric',
    });
  };

  const getDisposalMethodColor = (method: string) => {
    switch (method) {
      case 'SOLD':
        return 'bg-green-100 text-green-800';
      case 'DONATED':
        return 'bg-blue-100 text-blue-800';
      case 'SCRAPPED':
        return 'bg-red-100 text-red-800';
      case 'TRADED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Asset Disposal Records</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                View history of disposed assets
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse h-32" />
              ))}
            </div>
          ) : disposals.length === 0 ? (
            <div className="text-center py-12">
              <TrashIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No disposal records found</p>
              <p className="text-gray-400 text-sm mt-2">
                Disposed assets will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {disposals.map((disposal: any) => (
                <div
                  key={disposal.id}
                  className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{disposal.asset?.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {disposal.asset?.assetType?.name || 'N/A'}
                      </p>
                    </div>
                    <Badge className={getDisposalMethodColor(disposal.disposalMethod)}>
                      {disposal.disposalMethod}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        Disposal Date
                      </label>
                      <p className="text-sm font-semibold mt-1">
                        {formatDate(disposal.disposalDate)}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <CurrencyDollarIcon className="h-3 w-3" />
                        Sale Price
                      </label>
                      <p className="text-sm font-semibold mt-1">
                        {formatCurrency(disposal.salePrice || 0)}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Book Value at Disposal
                      </label>
                      <p className="text-sm font-semibold mt-1">
                        {formatCurrency(disposal.bookValueAtDisposal || 0)}
                      </p>
                    </div>
                  </div>

                  {disposal.gainLossOnDisposal !== 0 && disposal.gainLossOnDisposal !== null && (
                    <div className="mb-4">
                      <label className="text-xs font-medium text-gray-500">
                        Gain/Loss on Disposal
                      </label>
                      <p className={`text-sm font-semibold mt-1 ${
                        disposal.gainLossOnDisposal > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {disposal.gainLossOnDisposal > 0 ? '+' : ''}
                        {formatCurrency(disposal.gainLossOnDisposal)}
                      </p>
                    </div>
                  )}

                  {disposal.disposalNotes && (
                    <div className="border-t pt-4">
                      <label className="text-xs font-medium text-gray-500">Notes</label>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                        {disposal.disposalNotes}
                      </p>
                    </div>
                  )}

                  {disposal.approvedByMember && (
                    <div className="mt-4 text-xs text-gray-400">
                      Approved by: {disposal.approvedByMember.firstName} {disposal.approvedByMember.lastName} ({disposal.approvedByMember.email})
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
