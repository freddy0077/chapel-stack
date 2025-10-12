'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AssetType, CreateAssetTypeInput, UpdateAssetTypeInput } from '@/types/asset';

interface AssetTypeModalProps {
  assetType: AssetType | null;
  onClose: () => void;
  onSubmit: (input: CreateAssetTypeInput | UpdateAssetTypeInput) => Promise<void>;
}

const ASSET_CATEGORIES = [
  { value: 'FIXED_ASSET', label: 'Fixed Asset' },
  { value: 'CURRENT_ASSET', label: 'Current Asset' },
  { value: 'INTANGIBLE_ASSET', label: 'Intangible Asset' },
];

const COMMON_ICONS = ['📦', '💻', '🚗', '🎸', '🪑', '🖨️', '📱', '🏢', '🔧', '📚', '🎨', '⚡'];
const COMMON_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

export default function AssetTypeModal({ assetType, onClose, onSubmit }: AssetTypeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultDepreciationRate: '',
    category: '',
    icon: '📦',
    color: '#3B82F6',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assetType) {
      setFormData({
        name: assetType.name || '',
        description: assetType.description || '',
        defaultDepreciationRate: assetType.defaultDepreciationRate?.toString() || '',
        category: assetType.category || '',
        icon: assetType.icon || '📦',
        color: assetType.color || '#3B82F6',
      });
    }
  }, [assetType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const input: any = {
        name: formData.name,
        description: formData.description || undefined,
        defaultDepreciationRate: formData.defaultDepreciationRate 
          ? parseFloat(formData.defaultDepreciationRate) 
          : undefined,
        category: formData.category || undefined,
        icon: formData.icon,
        color: formData.color,
      };

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
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {assetType ? 'Edit Asset Type' : 'Create Asset Type'}
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Electronics, Furniture, Vehicles"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of this asset type"
              rows={3}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {ASSET_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Default Depreciation Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Depreciation Rate (% per year)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.defaultDepreciationRate}
              onChange={(e) => setFormData({ ...formData, defaultDepreciationRate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 10"
            />
            <p className="text-sm text-gray-500 mt-1">
              Optional: Default depreciation rate for assets of this type
            </p>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COMMON_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-3 text-2xl border-2 rounded-lg hover:border-blue-500 transition-colors ${
                    formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
              placeholder="Or enter custom emoji"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {COMMON_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`h-10 rounded-lg border-2 transition-all ${
                    formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: formData.color }}
              >
                {formData.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {formData.name || 'Asset Type Name'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.description || 'Description will appear here'}
                </p>
              </div>
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
              disabled={loading || !formData.name}
            >
              {loading ? 'Saving...' : assetType ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
