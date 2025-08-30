import React, { useState, useCallback, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { SACRAMENT_TYPES, type SacramentType } from '@/constants/sacramentTypes';
import { formatSacramentType, getSacramentDisplayName } from '@/utils/sacramentHelpers';

interface SearchFilters {
  searchTerm: string;
  sacramentType: SacramentType | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  location: string;
  officiant: string;
  hasNotes: boolean | null;
  hasCertificate: boolean | null;
  sortBy: 'dateOfSacrament' | 'memberName' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

interface SacramentSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalRecords: number;
  filteredRecords: number;
  isLoading?: boolean;
  className?: string;
}

const defaultFilters: SearchFilters = {
  searchTerm: '',
  sacramentType: 'all',
  dateRange: { start: '', end: '' },
  location: '',
  officiant: '',
  hasNotes: null,
  hasCertificate: null,
  sortBy: 'dateOfSacrament',
  sortOrder: 'desc',
};

/**
 * Advanced search and filtering component for sacrament records
 */
export const SacramentSearch: React.FC<SacramentSearchProps> = ({
  filters,
  onFiltersChange,
  totalRecords,
  filteredRecords,
  isLoading = false,
  className = '',
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }, [filters, onFiltersChange]);

  const handleDateRangeChange = useCallback((key: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [key]: value,
      },
    });
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    onFiltersChange(defaultFilters);
    setShowAdvancedFilters(false);
  }, [onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm !== '' ||
      filters.sacramentType !== 'all' ||
      filters.dateRange.start !== '' ||
      filters.dateRange.end !== '' ||
      filters.location !== '' ||
      filters.officiant !== '' ||
      filters.hasNotes !== null ||
      filters.hasCertificate !== null
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.sacramentType !== 'all') count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.location) count++;
    if (filters.officiant) count++;
    if (filters.hasNotes !== null) count++;
    if (filters.hasCertificate !== null) count++;
    return count;
  }, [filters]);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by member name, location, officiant, or notes..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Quick Sacrament Type Filter */}
          <select
            value={filters.sacramentType}
            onChange={(e) => handleFilterChange('sacramentType', e.target.value)}
            className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Sacraments</option>
            {Object.values(SACRAMENT_TYPES).map((type) => (
              <option key={type} value={type}>
                {getSacramentDisplayName(type)}
              </option>
            ))}
          </select>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              showAdvancedFilters || hasActiveFilters
                ? 'text-indigo-700 bg-indigo-50 border-indigo-300'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>

        {/* Results Summary */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredRecords.toLocaleString()} of {totalRecords.toLocaleString()} records
            {hasActiveFilters && (
              <span className="ml-2 text-indigo-600">
                (filtered)
              </span>
            )}
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span>Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="dateOfSacrament">Sacrament Date</option>
              <option value="memberName">Member Name</option>
              <option value="createdAt">Date Created</option>
              <option value="updatedAt">Last Updated</option>
            </select>
            <button
              onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <CalendarIcon className="inline h-4 w-4 mr-1" />
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <MapPinIcon className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Filter by location..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Officiant Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <UserIcon className="inline h-4 w-4 mr-1" />
                Officiant
              </label>
              <input
                type="text"
                value={filters.officiant}
                onChange={(e) => handleFilterChange('officiant', e.target.value)}
                placeholder="Filter by officiant..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Has Notes Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <select
                value={filters.hasNotes === null ? 'all' : filters.hasNotes.toString()}
                onChange={(e) => {
                  const value = e.target.value === 'all' ? null : e.target.value === 'true';
                  handleFilterChange('hasNotes', value);
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Records</option>
                <option value="true">With Notes</option>
                <option value="false">Without Notes</option>
              </select>
            </div>

            {/* Has Certificate Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Certificate</label>
              <select
                value={filters.hasCertificate === null ? 'all' : filters.hasCertificate.toString()}
                onChange={(e) => {
                  const value = e.target.value === 'all' ? null : e.target.value === 'true';
                  handleFilterChange('hasCertificate', value);
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Records</option>
                <option value="true">With Certificate</option>
                <option value="false">Without Certificate</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span>Searching records...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SacramentSearch;
