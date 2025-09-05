'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  DocumentTextIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
// Note: Using border-t border-gray-200 instead of Separator component for now

export interface BirthRegistryFilters {
  search?: string;
  childName?: string;
  parentName?: string;
  hospitalName?: string;
  certificateNumber?: string;
  exactMatch?: boolean;
  caseSensitive?: boolean;
  gender?: 'MALE' | 'FEMALE';
  dateFrom?: string;
  dateTo?: string;
  baptismPlanned?: boolean;
  placeOfBirth?: string;
  hasDocuments?: boolean;
  skip?: number;
  take?: number;
}

interface BirthRegistryFiltersProps {
  filters: BirthRegistryFilters;
  onFiltersChange: (filters: BirthRegistryFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
  totalCount?: number;
  loading?: boolean;
}

const BirthRegistryFiltersComponent: React.FC<BirthRegistryFiltersProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
  totalCount = 0,
  loading = false,
}) => {
  const [localFilters, setLocalFilters] = useState<BirthRegistryFilters>(filters);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Apply filters
  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: BirthRegistryFilters = {
      skip: filters.skip,
      take: filters.take,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Update individual filter
  const updateFilter = (key: keyof BirthRegistryFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  // Clear advanced search fields
  const clearAdvancedSearch = () => {
    setLocalFilters(prev => ({
      ...prev,
      childName: undefined,
      parentName: undefined,
      hospitalName: undefined,
      certificateNumber: undefined,
      exactMatch: undefined,
      caseSensitive: undefined,
    }));
  };

  // Get current year and previous years for date filters
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Count active filters
  const activeFiltersCount = Object.entries(localFilters).filter(([key, value]) => 
    key !== 'skip' && key !== 'take' && value !== undefined && value !== ''
  ).length;

  // Get quick date ranges
  const getQuickDateRange = (range: string) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (range) {
      case 'thisMonth':
        return {
          dateFrom: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
          dateTo: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0],
        };
      case 'thisYear':
        return {
          dateFrom: new Date(currentYear, 0, 1).toISOString().split('T')[0],
          dateTo: new Date(currentYear, 11, 31).toISOString().split('T')[0],
        };
      case 'lastYear':
        return {
          dateFrom: new Date(currentYear - 1, 0, 1).toISOString().split('T')[0],
          dateTo: new Date(currentYear - 1, 11, 31).toISOString().split('T')[0],
        };
      default:
        return { dateFrom: undefined, dateTo: undefined };
    }
  };

  const handleQuickDateRange = (range: string) => {
    const dateRange = getQuickDateRange(range);
    setLocalFilters(prev => ({
      ...prev,
      ...dateRange,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onToggle}
          className={`flex items-center gap-2 transition-all duration-300 ${
            isOpen || activeFiltersCount > 0
              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              : 'hover:bg-gray-50'
          }`}
        >
          <FunnelIcon className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {totalCount > 0 && (
          <div className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${totalCount} record${totalCount !== 1 ? 's' : ''} found`}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardContent className="p-6 space-y-6">
                {/* Enhanced Search */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MagnifyingGlassIcon className="h-5 w-5 text-blue-600" />
                      <label className="text-sm font-semibold text-gray-800">Smart Search</label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                      className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      {showAdvancedSearch ? 'Simple Search' : 'Advanced Search'}
                    </Button>
                  </div>

                  {/* Main Search Input */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by child name, parent name, hospital, location..."
                      value={localFilters.search || ''}
                      onChange={(e) => updateFilter('search', e.target.value)}
                      className="pl-10 pr-4 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                    />
                    {localFilters.search && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateFilter('search', '')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </Button>
                    )}
                  </div>

                  {/* Search Suggestions */}
                  {localFilters.search && localFilters.search.length > 0 && (
                    <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-medium">Search Tips:</span>
                      </div>
                      <ul className="space-y-1">
                        <li>• Search by child's first or last name</li>
                        <li>• Search by parent's name (mother or father)</li>
                        <li>• Search by hospital or birth location</li>
                        <li>• Use partial names for broader results</li>
                      </ul>
                    </div>
                  )}

                  {/* Advanced Search Options */}
                  <AnimatePresence>
                    {showAdvancedSearch && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4 border-t border-gray-200 pt-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Child Name Search */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600">Child Name</label>
                            <Input
                              placeholder="Search child's name..."
                              value={localFilters.childName || ''}
                              onChange={(e) => updateFilter('childName', e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>

                          {/* Parent Name Search */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600">Parent Name</label>
                            <Input
                              placeholder="Search parent's name..."
                              value={localFilters.parentName || ''}
                              onChange={(e) => updateFilter('parentName', e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>

                          {/* Hospital/Location Search */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600">Hospital/Location</label>
                            <Input
                              placeholder="Search hospital or location..."
                              value={localFilters.hospitalName || ''}
                              onChange={(e) => updateFilter('hospitalName', e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>

                          {/* Birth Certificate Number */}
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600">Certificate Number</label>
                            <Input
                              placeholder="Search certificate number..."
                              value={localFilters.certificateNumber || ''}
                              onChange={(e) => updateFilter('certificateNumber', e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>

                        {/* Search Options */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-xs text-gray-600">
                              <input
                                type="checkbox"
                                checked={localFilters.exactMatch || false}
                                onChange={(e) => updateFilter('exactMatch', e.target.checked)}
                                className="rounded border-gray-300"
                              />
                              Exact match
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-600">
                              <input
                                type="checkbox"
                                checked={localFilters.caseSensitive || false}
                                onChange={(e) => updateFilter('caseSensitive', e.target.checked)}
                                className="rounded border-gray-300"
                              />
                              Case sensitive
                            </label>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearAdvancedSearch}
                            className="text-xs h-7"
                          >
                            Clear Advanced
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-t border-gray-200" />

                {/* Quick Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Gender Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="h-4 w-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Gender</label>
                    </div>
                    <Select
                      value={localFilters.gender || 'all'}
                      onValueChange={(value) => updateFilter('gender', value === 'all' ? undefined : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All genders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All genders</SelectItem>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Birth Location Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Birth Location</label>
                    </div>
                    <Select
                      value={localFilters.placeOfBirth || 'all'}
                      onValueChange={(value) => updateFilter('placeOfBirth', value === 'all' ? undefined : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All locations</SelectItem>
                        <SelectItem value="Hospital">Hospital</SelectItem>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Clinic">Clinic</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Baptism Status Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Baptism Status</label>
                    </div>
                    <Select
                      value={localFilters.baptismPlanned === undefined ? 'all' : localFilters.baptismPlanned.toString()}
                      onValueChange={(value) => updateFilter('baptismPlanned', value === 'all' ? undefined : value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="true">Baptism Planned</SelectItem>
                        <SelectItem value="false">No Baptism Plan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Documents Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Documents</label>
                    </div>
                    <Select
                      value={localFilters.hasDocuments === undefined ? 'all' : localFilters.hasDocuments.toString()}
                      onValueChange={(value) => updateFilter('hasDocuments', value === 'all' ? undefined : value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All records" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All records</SelectItem>
                        <SelectItem value="true">Has Documents</SelectItem>
                        <SelectItem value="false">No Documents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Date Range Filters */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <label className="text-sm font-medium text-gray-700">Date Range</label>
                  </div>

                  {/* Quick Date Range Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickDateRange('thisMonth')}
                      className="text-xs"
                    >
                      This Month
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickDateRange('thisYear')}
                      className="text-xs"
                    >
                      This Year
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickDateRange('lastYear')}
                      className="text-xs"
                    >
                      Last Year
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickDateRange('clear')}
                      className="text-xs"
                    >
                      Clear Dates
                    </Button>
                  </div>

                  {/* Custom Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600">From Date</label>
                      <Input
                        type="date"
                        value={localFilters.dateFrom || ''}
                        onChange={(e) => updateFilter('dateFrom', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600">To Date</label>
                      <Input
                        type="date"
                        value={localFilters.dateTo || ''}
                        onChange={(e) => updateFilter('dateTo', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    disabled={activeFiltersCount === 0}
                    className="flex items-center gap-2"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Clear All
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <FunnelIcon className="h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {localFilters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{localFilters.search}"
              <button
                onClick={() => updateFilter('search', '')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {localFilters.gender && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Gender: {localFilters.gender}
              <button
                onClick={() => updateFilter('gender', '')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {localFilters.placeOfBirth && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {localFilters.placeOfBirth}
              <button
                onClick={() => updateFilter('placeOfBirth', '')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {localFilters.baptismPlanned !== undefined && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Baptism: {localFilters.baptismPlanned ? 'Planned' : 'Not Planned'}
              <button
                onClick={() => updateFilter('baptismPlanned', undefined)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(localFilters.dateFrom || localFilters.dateTo) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {localFilters.dateFrom || '...'} to {localFilters.dateTo || '...'}
              <button
                onClick={() => {
                  updateFilter('dateFrom', '');
                  updateFilter('dateTo', '');
                }}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BirthRegistryFiltersComponent;
