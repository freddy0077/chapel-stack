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
  CubeIcon,
  CheckCircleIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { 
  GET_ASSETS, 
  CREATE_ASSET, 
  UPDATE_ASSET, 
  DELETE_ASSET,
  RECALCULATE_ASSET_VALUES,
  GET_ASSET_STATISTICS,
} from '@/graphql/queries/assetQueries';
import { Asset, CreateAssetInput, UpdateAssetInput, AssetFilterInput, AssetStatistics as AssetStatsType } from '@/types/asset';
import AssetCard from '@/app/dashboard/assets/components/AssetCard';
import AssetFormModal from '@/app/dashboard/assets/components/AssetFormModal';
import AssetFormWithJournalModal from './modals/AssetFormWithJournalModal';
import AssetAccountMappingModal from './modals/AssetAccountMappingModal';
import PostDepreciationModal from './modals/PostDepreciationModal';
import AssetDetailModal from './modals/AssetDetailModal';
import AssetTypesModal from './modals/AssetTypesModal';
import DisposalRecordsModal from './modals/DisposalRecordsModal';
import AssetJournalService from '@/services/assetJournalService';
import { CREATE_JOURNAL_ENTRY } from '@/graphql/mutations/journalMutations';

interface AssetManagementProps {
  organisationId: string;
  branchId: string;
  userId: string;
  onPostToJournal?: (entries: any[]) => void;
  onNavigateToJournal?: () => void;
}

export default function AssetManagement({
  organisationId,
  branchId,
  userId,
  onPostToJournal,
}: AssetManagementProps) {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Partial<AssetFilterInput>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showAccountMapping, setShowAccountMapping] = useState(false);
  const [selectedAssetTypeForMapping, setSelectedAssetTypeForMapping] = useState<{id: string; name: string} | null>(null);
  const [showDepreciationModal, setShowDepreciationModal] = useState(false);
  const [showAssetDetailModal, setShowAssetDetailModal] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  const [showAssetTypesModal, setShowAssetTypesModal] = useState(false);
  const [showDisposalModal, setShowDisposalModal] = useState(false);

  // GraphQL queries
  const { data: statsData, loading: statsLoading } = useQuery(GET_ASSET_STATISTICS, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });

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

  // Mutations
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

  const [createJournalEntry] = useMutation(CREATE_JOURNAL_ENTRY, {
    onCompleted: (data) => {
      console.log('Journal entry created:', data.createJournalEntry);
    },
    onError: (error) => {
      toast.error(`Journal entry error: ${error.message}`);
    },
  });

  const assets: Asset[] = data?.assets || [];
  const stats: AssetStatsType | undefined = statsData?.assetStatistics;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleCreate = () => {
    setSelectedAsset(null);
    setShowModal(true);
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowModal(true);
  };

  const handleView = (asset: Asset) => {
    setViewingAsset(asset);
    setShowAssetDetailModal(true);
  };

  const handleDelete = async (asset: Asset) => {
    if (confirm(`Are you sure you want to delete "${asset.name}"? This action cannot be undone.`)) {
      await deleteAsset({ variables: { id: asset.id } });
    }
  };

  const handleSubmit = async (input: CreateAssetInput | UpdateAssetInput, postToJournal = false, journalData?: any) => {
    try {
      let createdAsset: any;
      
      if (selectedAsset) {
        const result = await updateAsset({ variables: { input } });
        createdAsset = result.data?.updateAsset;
      } else {
        const result = await createAsset({ variables: { input } });
        createdAsset = result.data?.createAsset;
      }

      // If postToJournal is enabled and we have journal data, create journal entry
      if (postToJournal && journalData && createdAsset) {
        const journalEntry = AssetJournalService.createAssetPurchaseEntry(
          createdAsset,
          journalData.cashAccountId,
          journalData.assetAccountId,
          organisationId,
          branchId,
          userId
        );

        // Validate journal entry
        const validation = AssetJournalService.validateJournalEntry(journalEntry);
        if (!validation.valid) {
          toast.error(`Journal entry validation failed: ${validation.errors.join(', ')}`);
          return;
        }

        // Create journal entry
        await createJournalEntry({
          variables: {
            input: journalEntry,
          },
        });

        toast.success('Asset created and posted to journal successfully!');
        
        // Navigate to journal tab if callback provided
        if (onNavigateToJournal) {
          onNavigateToJournal();
        }
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleRecalculate = async () => {
    if (confirm('This will recalculate depreciation for all active assets. Continue?')) {
      await recalculateValues({ variables: { organisationId } });
    }
  };

  // Statistics Cards
  const statisticsCards = stats ? [
    {
      title: 'Total Assets',
      value: stats.totalAssets,
      icon: CubeIcon,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Assets',
      value: stats.activeAssets,
      icon: CheckCircleIcon,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'In Maintenance',
      value: stats.inMaintenanceAssets,
      icon: WrenchScrewdriverIcon,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Disposed',
      value: stats.disposedAssets,
      icon: TrashIcon,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      title: 'Current Value',
      value: formatCurrency(stats.totalValue),
      icon: CurrencyDollarIcon,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      subtitle: `Purchase: ${formatCurrency(stats.totalPurchaseValue)}`,
    },
    {
      title: 'Total Depreciation',
      value: formatCurrency(stats.totalDepreciation),
      icon: ArrowTrendingDownIcon,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      subtitle: stats.totalPurchaseValue > 0 
        ? `${((stats.totalDepreciation / stats.totalPurchaseValue) * 100).toFixed(1)}% of purchase value`
        : undefined,
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Asset Management</h2>
          <p className="text-muted-foreground">Track and manage your organization's fixed assets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAssetTypesModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Asset Types
          </button>
          <button
            onClick={() => setShowDisposalModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Disposal Records
          </button>
          <button
            onClick={() => setShowDepreciationModal(true)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <ArrowTrendingDownIcon className="w-5 h-5" />
            Post Depreciation
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Statistics */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statisticsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${
                view === 'grid' 
                  ? 'bg-amber-100 text-amber-600' 
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
                  ? 'bg-amber-100 text-amber-600' 
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
                  ? 'bg-amber-100 text-amber-600' 
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors"
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
                            {formatCurrency(asset.currentValue || 0)}
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
                            className="text-amber-600 hover:text-amber-900 mr-3"
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

      {/* Asset Form Modal with Journal Integration */}
      <AnimatePresence>
        {showModal && (
          <AssetFormWithJournalModal
            open={showModal}
            asset={selectedAsset}
            organisationId={organisationId}
            branchId={branchId}
            userId={userId}
            onClose={() => {
              setShowModal(false);
              setSelectedAsset(null);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>

      {/* Account Mapping Modal */}
      <AnimatePresence>
        {showAccountMapping && selectedAssetTypeForMapping && (
          <AssetAccountMappingModal
            open={showAccountMapping}
            onClose={() => {
              setShowAccountMapping(false);
              setSelectedAssetTypeForMapping(null);
            }}
            assetTypeName={selectedAssetTypeForMapping.name}
            assetTypeId={selectedAssetTypeForMapping.id}
            organisationId={organisationId}
            branchId={branchId}
            onSave={(mapping) => {
              // TODO: Save mapping to database
              console.log('Saving account mapping:', mapping);
              toast.success('Account mapping saved successfully!');
              setShowAccountMapping(false);
              setSelectedAssetTypeForMapping(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Post Depreciation Modal */}
      <AnimatePresence>
        {showDepreciationModal && (
          <PostDepreciationModal
            open={showDepreciationModal}
            onClose={() => setShowDepreciationModal(false)}
            organisationId={organisationId}
            branchId={branchId}
            userId={userId}
            onSuccess={() => {
              refetch(); // Refresh asset list
              if (onNavigateToJournal) {
                onNavigateToJournal(); // Navigate to journal tab
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Asset Detail Modal */}
      <AnimatePresence>
        {showAssetDetailModal && viewingAsset && (
          <AssetDetailModal
            open={showAssetDetailModal}
            onClose={() => {
              setShowAssetDetailModal(false);
              setViewingAsset(null);
            }}
            asset={viewingAsset}
            onEdit={() => {
              setShowAssetDetailModal(false);
              handleEdit(viewingAsset);
            }}
            organisationId={organisationId}
            branchId={branchId}
            onDisposed={() => {
              refetch();
            }}
          />
        )}
      </AnimatePresence>

      {/* Asset Types Modal */}
      <AnimatePresence>
        {showAssetTypesModal && (
          <AssetTypesModal
            open={showAssetTypesModal}
            onClose={() => setShowAssetTypesModal(false)}
            organisationId={organisationId}
            branchId={branchId}
          />
        )}
      </AnimatePresence>

      {/* Disposal Records Modal */}
      <AnimatePresence>
        {showDisposalModal && (
          <DisposalRecordsModal
            open={showDisposalModal}
            onClose={() => setShowDisposalModal(false)}
            organisationId={organisationId}
            branchId={branchId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
