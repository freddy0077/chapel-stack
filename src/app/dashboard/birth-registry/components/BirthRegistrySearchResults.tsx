'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  AlertTriangle,
  Sparkles,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BirthRegistryFilters } from './BirthRegistryFilters';

interface BirthRegistrySearchResultsProps {
  filters: BirthRegistryFilters;
  totalResults: number;
  loading: boolean;
  searchTime?: number;
  onClearSearch?: () => void;
}

const BirthRegistrySearchResults: React.FC<BirthRegistrySearchResultsProps> = ({
  filters,
  totalResults,
  loading,
  searchTime,
  onClearSearch,
}) => {
  // Check if any search filters are active
  const hasSearchFilters = Boolean(
    filters.search ||
    filters.childName ||
    filters.parentName ||
    filters.hospitalName ||
    filters.certificateNumber
  );

  // Check if any other filters are active
  const hasOtherFilters = Boolean(
    filters.gender ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.baptismPlanned !== undefined ||
    filters.placeOfBirth ||
    filters.hasDocuments !== undefined
  );

  const hasAnyFilters = hasSearchFilters || hasOtherFilters;

  // Get active search terms
  const getActiveSearchTerms = () => {
    const terms: string[] = [];
    if (filters.search) terms.push(`"${filters.search}"`);
    if (filters.childName) terms.push(`Child: "${filters.childName}"`);
    if (filters.parentName) terms.push(`Parent: "${filters.parentName}"`);
    if (filters.hospitalName) terms.push(`Hospital: "${filters.hospitalName}"`);
    if (filters.certificateNumber) terms.push(`Cert: "${filters.certificateNumber}"`);
    return terms;
  };

  const activeSearchTerms = getActiveSearchTerms();

  if (!hasAnyFilters && !loading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-4"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span className="text-sm text-blue-700 font-medium">Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {totalResults === 0 ? 'No results found' : `${totalResults} result${totalResults !== 1 ? 's' : ''} found`}
                  </span>
                  {searchTime && (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Clock className="h-3 w-3" />
                      <span>{searchTime}ms</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!loading && onClearSearch && hasAnyFilters && (
              <button
                onClick={onClearSearch}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Active Search Terms */}
          {activeSearchTerms.length > 0 && !loading && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-blue-700 font-medium">Searching for:</span>
              {activeSearchTerms.map((term, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 text-xs"
                >
                  {term}
                </Badge>
              ))}
              {filters.exactMatch && (
                <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                  Exact Match
                </Badge>
              )}
              {filters.caseSensitive && (
                <Badge variant="outline" className="border-blue-300 text-blue-700 text-xs">
                  Case Sensitive
                </Badge>
              )}
            </div>
          )}

          {/* No Results Message */}
          {totalResults === 0 && !loading && hasSearchFilters && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium mb-1">No matching records found</p>
                  <div className="text-yellow-700 text-xs space-y-1">
                    <p>Try these suggestions:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li>Check spelling of names or locations</li>
                      <li>Use partial names for broader results</li>
                      <li>Try different search terms</li>
                      <li>Remove some filters to expand results</li>
                      {filters.exactMatch && <li>Disable "Exact Match" for partial matching</li>}
                      {filters.caseSensitive && <li>Disable "Case Sensitive" for flexible matching</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Success Message */}
          {totalResults > 0 && !loading && hasSearchFilters && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-800">
                  Found <span className="font-semibold">{totalResults}</span> matching record{totalResults !== 1 ? 's' : ''} 
                  {activeSearchTerms.length > 0 && (
                    <span> for your search criteria</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BirthRegistrySearchResults;
