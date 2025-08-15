'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { MemberListProps, ViewMode } from '../types/member.types';
import MemberCard from './MemberCard';
import MemberTableView from './MemberTableView';
import MemberGridView from './MemberGridView';

const MemberList: React.FC<MemberListProps> = ({
  members,
  loading,
  viewMode,
  selectedMembers,
  onSelectMember,
  onSelectAll,
  onViewMember,
  onEditMember,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  onLoadMore
}) => {
  // Loading skeleton
  const LoadingSkeleton = () => {
    const skeletonCount = viewMode === 'table' ? 10 : 8;
    
    return (
      <div className={`grid gap-6 ${
        viewMode === 'card' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
        viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' :
        viewMode === 'list' ? 'grid-cols-1' :
        'grid-cols-1'
      }`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-2xl shadow-lg p-6 animate-pulse ${
              viewMode === 'grid' ? 'aspect-square' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            {viewMode !== 'grid' && (
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  // Empty state
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
      <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowPathIcon className="w-4 h-4" />
        <span>Refresh</span>
      </button>
    </motion.div>
  );

  // Pagination component
  const Pagination = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4 mt-6"
    >
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-600">
          Showing {members.length} of {totalCount} members
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
          className={`p-2 rounded-lg transition-all duration-200 ${
            hasPreviousPage
              ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        
        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          className={`p-2 rounded-lg transition-all duration-200 ${
            hasNextPage
              ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
        
        {onLoadMore && hasNextPage && (
          <button
            onClick={onLoadMore}
            className="ml-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More
          </button>
        )}
      </div>
    </motion.div>
  );

  // Render different view modes
  const renderMembers = () => {
    if (viewMode === 'table') {
      return (
        <MemberTableView
          members={members}
          selectedMembers={selectedMembers}
          onSelectMember={onSelectMember}
          onSelectAll={onSelectAll}
        />
      );
    }

    if (viewMode === 'grid') {
      return (
        <MemberGridView
          members={members}
          selectedMembers={selectedMembers}
          onSelectMember={onSelectMember}
        />
      );
    }

    // Card and List views use MemberCard with different layouts
    const gridClasses = {
      card: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      list: 'grid-cols-1',
      grid: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
      table: 'grid-cols-1'
    };

    return (
      <div className={`grid gap-6 ${gridClasses[viewMode]}`}>
        <AnimatePresence mode="popLayout">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
            >
              <MemberCard
                key={member.id}
                member={member}
                selected={selectedMembers.includes(member.id)}
                onSelect={onSelectMember}
                onView={onViewMember}
                onEdit={onEditMember}
                viewMode={viewMode}
                showActions={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with selection info */}
      {selectedMembers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={() => selectedMembers.forEach(id => onSelectMember(id))}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear selection
            </button>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <LoadingSkeleton />
        ) : members.length === 0 ? (
          <EmptyState />
        ) : (
          renderMembers()
        )}
      </motion.div>

      {/* Pagination */}
      {!loading && members.length > 0 && (
        <Pagination />
      )}
    </div>
  );
};

export default MemberList;
