'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { 
  GET_ASSETS, 
  CREATE_ASSET, 
  UPDATE_ASSET, 
  DELETE_ASSET,
  RECALCULATE_ASSET_VALUES,
} from '@/graphql/queries/assetQueries';
import { Asset, CreateAssetInput, UpdateAssetInput, AssetFilterInput } from '@/types/asset';
import AssetStatistics from './components/AssetStatistics';
import AssetCard from './components/AssetCard';
import AssetFormModal from './components/AssetFormModal';
import Link from 'next/link';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';

export default function AssetsPage() {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Partial<AssetFilterInput>>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Get organisation and branch context from authenticated user
  const { organisationId, branchId } = useOrganisationBranch();

  // GraphQL queries and mutations
  const { data, loading, refetch } = useQuery(GET_ASSETS, {
    variables: {
      filters: {
        organisationId,
        branchId: branchId || undefined,
        search: search || undefined,
        ...filters,
      },
    },
    skip: !organisationId,
  });

  const [createAsset] = useMutation(CREATE_ASSET, {
    onCompleted: () => {
      toast.success('Asset created successfully!');
      refetch();
      setShowModal(false);
      setSelectedAsset(null);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [updateAsset] = useMutation(UPDATE_ASSET, {
    onCompleted: () => {
      toast.success('Asset updated successfully!');
      refetch();
      setShowModal(false);
      setSelectedAsset(null);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [deleteAsset] = useMutation(DELETE_ASSET, {
    onCompleted: () => {
      toast.success('Asset deleted successfully!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [recalculateValues, { loading: recalculating }] = useMutation(RECALCULATE_ASSET_VALUES, {
    onCompleted: (data) => {
      toast.success(`Recalculated ${data.recalculateAssetValues} asset values!`);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const assets: Asset[] = data?.assets || [];

  const handleCreate = () => {
    setSelectedAsset(null);
    setShowModal(true);
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const handleView = (asset: Asset) => {
    // Navigate to asset detail page
    window.location.href = `/dashboard/assets/${asset.id}`;
  };

  const handleDelete = async (asset: Asset) => {
    if (confirm(`Are you sure you want to delete "${asset.name}"? This action cannot be undone.`)) {
      await deleteAsset({ variables: { id: asset.id } });
    }
  };

  const handleSubmit = async (input: CreateAssetInput | UpdateAssetInput) => {
    if (selectedAsset) {
      await updateAsset({ variables: { input } });
    } else {
      await createAsset({ variables: { input } });
    }
  };

  const handleRecalculate = async () => {
    if (confirm('This will recalculate depreciation for all active assets. Continue?')) {
      await recalculateValues({ variables: { organisationId } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your church assets</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/assets/types"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Asset Types
          </Link>
          <Link
            href="/dashboard/assets/disposal"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Disposal Records
          </Link>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Statistics */}
      <AssetStatistics organisationId={organisationId} branchId={branchId} />

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets by name, code, serial number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Grid View"
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'table' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Table View"
            >
              <TableCellsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Filters"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleRecalculate}
              disabled={recalculating}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="Recalculate Depreciation"
            >
              <ArrowPathIcon className={`w-5 h-5 ${recalculating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="IN_MAINTENANCE">In Maintenance</option>
                    <option value="DISPOSED">Disposed</option>
                    <option value="LOST">Lost</option>
                    <option value="DAMAGED">Damaged</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    value={filters.condition || ''}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value || undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Conditions</option>
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({})}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Asset List */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assets Found</h3>
          <p className="text-gray-600 mb-6">
            {search || Object.keys(filters).length > 0
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first asset'}
          </p>
          {!search && Object.keys(filters).length === 0 && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Asset
            </button>
          )}
        </div>
      ) : (
        <div>
          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {assets.length} asset{assets.length !== 1 ? 's' : ''}
          </div>

          {/* Grid View */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {assets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Table View */}
          {view === 'table' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          </div>
                          <div className="text-xs text-gray-500">{asset.assetCode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{asset.assetType.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{asset.location || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            GH₵{asset.currentValue?.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleView(asset)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(asset)}
                            className="text-gray-600 hover:text-gray-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(asset)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AssetFormModal
            asset={selectedAsset}
            organisationId={organisationId}
            branchId={branchId}
            onClose={() => {
              setShowModal(false);
              setSelectedAsset(null);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
