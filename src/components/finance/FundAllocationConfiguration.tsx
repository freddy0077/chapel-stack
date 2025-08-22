"use client";

import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useFundMappingManager } from '@/graphql/hooks/useFundMapping';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { CreateFundMappingModal } from './CreateFundMappingModal';

interface FundAllocationConfigurationProps {
  className?: string;
}

export default function FundAllocationConfiguration({ className = '' }: FundAllocationConfigurationProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'fund' | 'created'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    configuration,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleCreateDefaults,
    refetch,
    creating,
    updating,
    deleting,
    creatingDefaults,
  } = useFundMappingManager(branchId || '', organisationId || '');

  // Filter and sort mappings
  const filteredMappings = React.useMemo(() => {
    if (!configuration?.mappings) return [];
    
    let filtered = configuration.mappings.filter(mapping => {
      const matchesSearch = 
        mapping.contributionType?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mapping.fund?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterActive === null || mapping.isActive === filterActive;
      
      return matchesSearch && matchesFilter;
    });

    // Sort mappings
    filtered.sort((a, b) => {
      let aValue: string, bValue: string;
      
      switch (sortBy) {
        case 'name':
          aValue = a.contributionType?.name || '';
          bValue = b.contributionType?.name || '';
          break;
        case 'fund':
          aValue = a.fund?.name || '';
          bValue = b.fund?.name || '';
          break;
        case 'created':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        default:
          return 0;
      }
      
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [configuration?.mappings, searchTerm, filterActive, sortBy, sortOrder]);

  const handleCreateDefaults = async () => {
    try {
      await handleCreateDefaults();
      toast.success('Default fund mappings created successfully');
    } catch (error) {
      toast.error('Failed to create default mappings');
    }
  };

  const handleDeleteMapping = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the mapping for "${name}"?`)) return;
    
    try {
      await handleDelete(id);
      toast.success('Fund mapping deleted successfully');
    } catch (error) {
      toast.error('Failed to delete fund mapping');
    }
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
          <span className="text-gray-600">Loading fund allocation configuration...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-red-800 font-semibold">Error Loading Configuration</h3>
            <p className="text-red-600 text-sm mt-1">
              {error.message || 'Failed to load fund allocation configuration'}
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = {
    totalMappings: configuration?.mappings?.length || 0,
    activeMappings: configuration?.mappings?.filter(m => m.isActive)?.length || 0,
    availableTypes: configuration?.availableContributionTypes?.length || 0,
    availableFunds: configuration?.availableFunds?.length || 0,
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-3">
              <Target className="h-8 w-8" />
              <span>Fund Allocation Configuration</span>
            </h2>
            <p className="text-indigo-100 mt-2">
              Configure how contribution types are automatically allocated to funds
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => refetch()}
              disabled={loading}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Mappings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMappings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Mappings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeMappings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Contribution Types</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableTypes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Funds</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableFunds}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search mappings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterActive === null ? 'all' : filterActive ? 'active' : 'inactive'}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterActive(value === 'all' ? null : value === 'active');
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateDefaults}
              disabled={creatingDefaults}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              <span>{creatingDefaults ? 'Creating...' : 'Create Defaults'}</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Mapping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mappings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Contribution Type</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('fund')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Allocated Fund</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('created')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMappings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Target className="h-12 w-12 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">No fund mappings found</h3>
                        <p className="text-gray-500 mt-1">
                          {searchTerm || filterActive !== null 
                            ? 'Try adjusting your search or filter criteria'
                            : 'Get started by creating your first fund mapping'
                          }
                        </p>
                      </div>
                      {!searchTerm && filterActive === null && (
                        <button
                          onClick={handleCreateDefaults}
                          disabled={creatingDefaults}
                          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                          <Zap className="h-4 w-4" />
                          <span>{creatingDefaults ? 'Creating...' : 'Create Default Mappings'}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMappings.map((mapping) => (
                  <tr key={mapping.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {mapping.contributionType?.name}
                        </div>
                        {mapping.contributionType?.description && (
                          <div className="text-sm text-gray-500">
                            {mapping.contributionType.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {mapping.fund?.name}
                        </div>
                        {mapping.fund?.description && (
                          <div className="text-sm text-gray-500">
                            {mapping.fund.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        mapping.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {mapping.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(mapping.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {/* TODO: Open edit modal */}}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit mapping"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMapping(mapping.id, mapping.contributionType?.name || 'Unknown')}
                          disabled={deleting}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete mapping"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {filteredMappings.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredMappings.length} of {stats.totalMappings} fund mappings
            </span>
            <span>
              Last updated: {configuration?.lastUpdated ? new Date(configuration.lastUpdated).toLocaleString() : 'Never'}
            </span>
          </div>
        </div>
      )}
      <CreateFundMappingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        availableContributionTypes={configuration?.availableContributionTypes || []}
        availableFunds={configuration?.availableFunds || []}
        existingMappings={configuration?.mappings || []}
        loading={creating}
      />
    </div>
  );
}
