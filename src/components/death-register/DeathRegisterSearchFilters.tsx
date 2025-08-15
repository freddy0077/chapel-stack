'use client';

import React from 'react';
import { Button, Grid } from '@tremor/react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface DeathRegisterSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterYear: string;
  onFilterYearChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  availableYears: string[];
  onAdvancedFilters?: () => void;
}

export const DeathRegisterSearchFilters: React.FC<DeathRegisterSearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterYear,
  onFilterYearChange,
  sortBy,
  onSortByChange,
  availableYears,
  onAdvancedFilters,
}) => {
  return (
    <div className="bg-slate-50 rounded-lg p-4 mb-6">
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or cause..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={filterYear}
          onChange={(e) => onFilterYearChange(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Years</option>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="dateOfDeath">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
        
        <Button
          variant="secondary"
          icon={FunnelIcon}
          className="bg-white border-slate-300 hover:bg-slate-50"
          onClick={onAdvancedFilters}
        >
          Advanced Filters
        </Button>
      </Grid>
    </div>
  );
};
