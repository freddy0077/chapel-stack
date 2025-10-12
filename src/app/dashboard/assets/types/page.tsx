'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  TagIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { 
  GET_ASSET_TYPES, 
  CREATE_ASSET_TYPE, 
  UPDATE_ASSET_TYPE, 
  DELETE_ASSET_TYPE 
} from '@/graphql/queries/assetQueries';
import { AssetType, CreateAssetTypeInput, UpdateAssetTypeInput } from '@/types/asset';
import AssetTypeModal from './components/AssetTypeModal';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';

export default function AssetTypesPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  
  // Get organisation and branch context from authenticated user
  const { organisationId, branchId } = useOrganisationBranch();

  // GraphQL queries and mutations
  const { data, loading, refetch } = useQuery(GET_ASSET_TYPES, {
    variables: { organisationId },
    skip: !organisationId,
  });

  const [createAssetType] = useMutation(CREATE_ASSET_TYPE, {
    onCompleted: () => {
      toast.success('Asset type created successfully!');
      refetch();
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [updateAssetType] = useMutation(UPDATE_ASSET_TYPE, {
    onCompleted: () => {
      toast.success('Asset type updated successfully!');
      refetch();
      setShowModal(false);
      setSelectedType(null);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [deleteAssetType] = useMutation(DELETE_ASSET_TYPE, {
    onCompleted: () => {
      toast.success('Asset type deleted successfully!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const assetTypes: AssetType[] = data?.assetTypes || [];

  const handleCreate = () => {
    setSelectedType(null);
    setShowModal(true);
  };

  const handleEdit = (type: AssetType) => {
    setSelectedType(type);
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      await deleteAssetType({ variables: { id } });
    }
  };

  const handleSubmit = async (input: CreateAssetTypeInput | UpdateAssetTypeInput) => {
    if (selectedType) {
      await updateAssetType({
        variables: {
          input: {
            id: selectedType.id,
            ...input,
          },
        },
      });
    } else {
      await createAssetType({
        variables: {
          input: {
            ...input,
            organisationId,
          },
        },
      });
    }
  };

  const getCategoryBadgeColor = (category?: string) => {
    switch (category) {
      case 'FIXED_ASSET':
        return 'bg-blue-100 text-blue-800';
      case 'CURRENT_ASSET':
        return 'bg-green-100 text-green-800';
      case 'INTANGIBLE_ASSET':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'FIXED_ASSET':
        return 'Fixed Asset';
      case 'CURRENT_ASSET':
        return 'Current Asset';
      case 'INTANGIBLE_ASSET':
        return 'Intangible Asset';
      default:
        return 'Uncategorized';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Types</h1>
          <p className="text-gray-600 mt-1">Manage categories for your church assets</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Asset Type
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TagIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Types</p>
              <p className="text-2xl font-bold text-gray-900">{assetTypes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CubeIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">
                {assetTypes.reduce((sum, type) => sum + (type.assetCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TagIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(assetTypes.map(t => t.category).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Types Grid */}
      {assetTypes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <TagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Asset Types Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first asset type to start organizing your church assets.
          </p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Asset Type
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {assetTypes.map((type) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Icon and Name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: type.color || '#E5E7EB' }}
                      >
                        {type.icon || '📦'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{type.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryBadgeColor(type.category)}`}>
                          {getCategoryLabel(type.category)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {type.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {type.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {type.defaultDepreciationRate !== null && type.defaultDepreciationRate !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Depreciation Rate:</span>
                        <span className="font-medium text-gray-900">
                          {type.defaultDepreciationRate}% / year
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assets:</span>
                      <span className="font-medium text-gray-900">
                        {type.assetCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleEdit(type)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(type.id, type.name)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={(type.assetCount || 0) > 0}
                      title={(type.assetCount || 0) > 0 ? 'Cannot delete type with existing assets' : ''}
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AssetTypeModal
            assetType={selectedType}
            onClose={() => {
              setShowModal(false);
              setSelectedType(null);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
