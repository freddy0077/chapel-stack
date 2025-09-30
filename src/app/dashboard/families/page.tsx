'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon,
  DownloadIcon,
  RefreshCwIcon
} from 'lucide-react';
import { FamilyStatistics } from './components/FamilyStatistics';
import { FamilyCard } from './components/FamilyCard';
import { FamilyDetailModal } from './components/FamilyDetailModal';
import { CreateFamilyWizard } from './components/CreateFamilyWizard';
import { useFamilies } from './hooks/useFamilies';
import { useFamilyOperations } from './hooks/useFamilyOperations';
import { Family } from '@/graphql/queries/familyQueries';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/usePagination';

const FAMILIES_PER_PAGE = 12;

export default function FamiliesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    getSkip,
  } = usePagination({
    defaultItemsPerPage: FAMILIES_PER_PAGE,
  });

  // Data fetching
  const { families, totalCount, loading, error, refetch } = useFamilies({
    skip: getSkip(),
    take: itemsPerPage,
  });

  const { removeFamily } = useFamilyOperations();

  // Filter families based on search query
  const filteredFamilies = useMemo(() => {
    if (!searchQuery.trim()) return families;
    
    const query = searchQuery.toLowerCase();
    return families.filter(family => 
      family.name.toLowerCase().includes(query) ||
      family.address?.toLowerCase().includes(query) ||
      family.city?.toLowerCase().includes(query) ||
      family.phoneNumber?.includes(query) ||
      family.members?.some(member => 
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(query)
      )
    );
  }, [families, searchQuery]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleEditFamily = (family: Family) => {
    setSelectedFamily(family);
    setShowCreateModal(true);
  };

  const handleViewFamily = (family: Family) => {
    setSelectedFamily(family);
    setShowDetailModal(true);
  };

  const handleDeleteFamily = async (family: Family) => {
    if (window.confirm(`Are you sure you want to delete "${family.name}"? This action cannot be undone.`)) {
      try {
        await removeFamily(family.id);
        refetch();
      } catch (error) {
        console.error('Failed to delete family:', error);
      }
    }
  };

  const handleCreateFamily = () => {
    setSelectedFamily(null);
    setShowCreateModal(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // TODO: Implement family data export
    console.log('Export families data');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">Error loading families: {error.message}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Family Management</h1>
          <p className="text-gray-600">Manage and organize church families</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreateFamily}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Family
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <FamilyStatistics />

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search families by name, address, phone, or member name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          
          {searchQuery && (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary">
                {filteredFamilies.length} result{filteredFamilies.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchQuery('')}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredFamilies.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No families found' : 'No families yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No families match your search for "${searchQuery}"`
                : 'Get started by creating your first family'
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateFamily}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create First Family
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFamilies.map((family) => (
              <FamilyCard
                key={family.id}
                family={family}
                onEdit={handleEditFamily}
                onDelete={handleDeleteFamily}
                onView={handleViewFamily}
              />
            ))}
          </div>

          {/* Pagination */}
          {!searchQuery && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                totalItems={totalCount}
                itemsPerPageOptions={[6, 12, 24, 48]}
              />
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateFamilyWizard
          family={selectedFamily}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}

      {showDetailModal && selectedFamily && (
        <FamilyDetailModal
          family={selectedFamily}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false);
            setShowCreateModal(true);
          }}
          onDelete={() => {
            setShowDetailModal(false);
            handleDeleteFamily(selectedFamily);
          }}
        />
      )}
    </div>
  );
}
