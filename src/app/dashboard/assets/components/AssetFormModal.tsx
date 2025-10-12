'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Asset, CreateAssetInput, UpdateAssetInput, AssetStatus, AssetCondition } from '@/types/asset';
import { GET_ASSET_TYPES } from '@/graphql/queries/assetQueries';

interface AssetFormModalProps {
  asset: Asset | null;
  organisationId: string;
  branchId?: string;
  onClose: () => void;
  onSubmit: (input: CreateAssetInput | UpdateAssetInput) => Promise<void>;
}

const STATUS_OPTIONS = [
  { value: AssetStatus.ACTIVE, label: 'Active' },
  { value: AssetStatus.IN_MAINTENANCE, label: 'In Maintenance' },
  { value: AssetStatus.DAMAGED, label: 'Damaged' },
  { value: AssetStatus.LOST, label: 'Lost' },
];

const CONDITION_OPTIONS = [
  { value: AssetCondition.EXCELLENT, label: 'Excellent' },
  { value: AssetCondition.GOOD, label: 'Good' },
  { value: AssetCondition.FAIR, label: 'Fair' },
  { value: AssetCondition.POOR, label: 'Poor' },
];

export default function AssetFormModal({ 
  asset, 
  organisationId, 
  branchId,
  onClose, 
  onSubmit 
}: AssetFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    assetTypeId: '',
    description: '',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    depreciationRate: '',
    location: '',
    assignedToMemberId: '',
    assignedToDepartment: '',
    status: AssetStatus.ACTIVE,
    condition: AssetCondition.GOOD,
    warrantyExpiryDate: '',
    supplier: '',
    serialNumber: '',
    modelNumber: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch asset types
  const { data: assetTypesData } = useQuery(GET_ASSET_TYPES, {
    variables: { organisationId },
    skip: !organisationId,
  });

  const assetTypes = assetTypesData?.assetTypes || [];

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        assetTypeId: asset.assetTypeId || '',
        description: asset.description || '',
        purchaseDate: asset.purchaseDate 
          ? new Date(asset.purchaseDate).toISOString().split('T')[0] 
          : '',
        purchasePrice: asset.purchasePrice?.toString() || '',
        currentValue: asset.currentValue?.toString() || '',
        depreciationRate: asset.depreciationRate?.toString() || '',
        location: asset.location || '',
        assignedToMemberId: asset.assignedToMemberId || '',
        assignedToDepartment: asset.assignedToDepartment || '',
        status: asset.status as AssetStatus || AssetStatus.ACTIVE,
        condition: asset.condition as AssetCondition || AssetCondition.GOOD,
        warrantyExpiryDate: asset.warrantyExpiryDate 
          ? new Date(asset.warrantyExpiryDate).toISOString().split('T')[0] 
          : '',
        supplier: asset.supplier || '',
        serialNumber: asset.serialNumber || '',
        modelNumber: asset.modelNumber || '',
        notes: asset.notes || '',
      });
    }
  }, [asset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const input: any = {
        name: formData.name,
        assetTypeId: formData.assetTypeId,
        description: formData.description || undefined,
        purchaseDate: formData.purchaseDate || undefined,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
        depreciationRate: formData.depreciationRate ? parseFloat(formData.depreciationRate) : undefined,
        location: formData.location || undefined,
        assignedToMemberId: formData.assignedToMemberId || undefined,
        assignedToDepartment: formData.assignedToDepartment || undefined,
        status: formData.status,
        condition: formData.condition,
        warrantyExpiryDate: formData.warrantyExpiryDate || undefined,
        supplier: formData.supplier || undefined,
        serialNumber: formData.serialNumber || undefined,
        modelNumber: formData.modelNumber || undefined,
        notes: formData.notes || undefined,
      };

      if (asset) {
        input.id = asset.id;
      } else {
        input.organisationId = organisationId;
        if (branchId) {
          input.branchId = branchId;
        }
      }

      await onSubmit(input);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {asset ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Dell Laptop XPS 15"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assetTypeId}
                  onChange={(e) => setFormData({ ...formData, assetTypeId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select asset type</option>
                  {assetTypes.map((type: any) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the asset"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price (GH₵)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Value (GH₵)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Depreciation Rate (% per year)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.depreciationRate}
                  onChange={(e) => setFormData({ ...formData, depreciationRate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Location & Assignment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Main Office, Room 201"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Department
                </label>
                <input
                  type="text"
                  value={formData.assignedToDepartment}
                  onChange={(e) => setFormData({ ...formData, assignedToDepartment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., IT Department"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as AssetCondition })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CONDITION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.warrantyExpiryDate}
                  onChange={(e) => setFormData({ ...formData, warrantyExpiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier/Vendor
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Dell Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SN123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Number
                </label>
                <input
                  type="text"
                  value={formData.modelNumber}
                  onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., XPS-15-9500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes or comments"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !formData.name || !formData.assetTypeId}
            >
              {loading ? 'Saving...' : asset ? 'Update Asset' : 'Create Asset'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
