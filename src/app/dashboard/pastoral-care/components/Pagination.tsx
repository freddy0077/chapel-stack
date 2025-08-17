'use client';

import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  loading?: boolean;
  className?: string;
}

const itemsPerPageOptions = [10, 25, 50, 100];

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  loading = false,
  className = '',
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate range
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add middle pages
    rangeWithDots.push(...range);

    // Add last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (newItemsPerPage !== itemsPerPage && !loading) {
      // Calculate what page we should be on to show the same item
      const currentFirstItem = (currentPage - 1) * itemsPerPage + 1;
      const newPage = Math.ceil(currentFirstItem / newItemsPerPage);
      onItemsPerPageChange(newItemsPerPage);
      if (newPage !== currentPage) {
        onPageChange(newPage);
      }
    }
  };

  if (totalPages <= 1) {
    return (
      <div className={`flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 ${className}`}>
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {totalItems > 0 ? startItem : 0} to {endItem} of {totalItems} results
          </span>
        </div>
        <div className="flex items-center">
          <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-700">
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            disabled={loading}
            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 ${className}`}>
      {/* Results info */}
      <div className="flex items-center text-sm text-gray-700">
        <span>
          Showing {totalItems > 0 ? startItem : 0} to {endItem} of {totalItems} results
        </span>
        {loading && (
          <div className="ml-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-xs text-gray-500">Loading...</span>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-4">
        {/* Items per page selector */}
        <div className="flex items-center">
          <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-700">
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            disabled={loading}
            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <nav className="flex items-center space-x-1">
          {/* First page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || loading}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            title="First page"
          >
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          </button>

          {/* Previous page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            title="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-700"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isCurrentPage = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={loading}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-md ${
                    isCurrentPage
                      ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Next page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            title="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>

          {/* Last page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            title="Last page"
          >
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
