'use client';

import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { Asset, AssetStatus, AssetCondition } from '@/types/asset';
import { format } from 'date-fns';

interface AssetCardProps {
  asset: Asset;
  onView: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export default function AssetCard({ asset, onView, onEdit, onDelete }: AssetCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case AssetStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case AssetStatus.IN_MAINTENANCE:
        return 'bg-yellow-100 text-yellow-800';
      case AssetStatus.DISPOSED:
        return 'bg-red-100 text-red-800';
      case AssetStatus.LOST:
        return 'bg-orange-100 text-orange-800';
      case AssetStatus.DAMAGED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case AssetCondition.EXCELLENT:
        return 'bg-green-100 text-green-800';
      case AssetCondition.GOOD:
        return 'bg-blue-100 text-blue-800';
      case AssetCondition.FAIR:
        return 'bg-yellow-100 text-yellow-800';
      case AssetCondition.POOR:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'GH₵0.00';
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const depreciation = asset.purchasePrice && asset.currentValue
    ? ((asset.purchasePrice - asset.currentValue) / asset.purchasePrice) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow hover:shadow-xl transition-all cursor-pointer group"
      onClick={() => onView(asset)}
    >
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden relative">
        {asset.photos && asset.photos.length > 0 ? (
          <img
            src={asset.photos[0]}
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div
              className="text-6xl"
              style={{ color: asset.assetType.color || '#6B7280' }}
            >
              {asset.assetType.icon || '📦'}
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(asset.status)}`}>
            {asset.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Asset Code */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {asset.assetCode}
          </span>
          {asset.condition && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(asset.condition)}`}>
              {asset.condition}
            </span>
          )}
        </div>

        {/* Name and Type */}
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
          {asset.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded"
            style={{ backgroundColor: asset.assetType.color || '#6B7280' }}
          ></span>
          {asset.assetType.name}
        </p>

        {/* Details Grid */}
        <div className="space-y-2 mb-4">
          {/* Purchase Price vs Current Value */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Purchase:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(asset.purchasePrice)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(asset.currentValue)}
            </span>
          </div>
          
          {/* Depreciation */}
          {depreciation > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Depreciation:</span>
              <span className="font-medium text-red-600">
                -{depreciation.toFixed(1)}%
              </span>
            </div>
          )}

          {/* Purchase Date */}
          {asset.purchaseDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4" />
              <span>{format(new Date(asset.purchaseDate), 'MMM dd, yyyy')}</span>
            </div>
          )}

          {/* Location */}
          {asset.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span className="truncate">{asset.location}</span>
            </div>
          )}

          {/* Assigned To */}
          {asset.assignedToMember && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserIcon className="w-4 h-4" />
              <span className="truncate">
                {asset.assignedToMember.firstName} {asset.assignedToMember.lastName}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(asset);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(asset);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(asset);
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            disabled={asset.status === AssetStatus.DISPOSED}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
