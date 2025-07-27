"use client";

import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  showInfo?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  showInfo = true,
  className = '',
  size = 'md',
}) => {
  const itemsPerPageOptions = [5, 10, 20, 50, 100];
  
  const sizeClasses = {
    sm: {
      button: 'px-2 py-1 text-xs',
      select: 'text-xs px-2 py-1',
      text: 'text-xs',
    },
    md: {
      button: 'px-3 py-2 text-sm',
      select: 'text-sm px-3 py-2',
      text: 'text-sm',
    },
    lg: {
      button: 'px-4 py-3 text-base',
      select: 'text-base px-4 py-3',
      text: 'text-base',
    },
  };

  const classes = sizeClasses[size];

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && !showInfo) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Items per page selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <span className={`text-gray-700 font-medium ${classes.text}`}>Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className={`border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${classes.select}`}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className={`text-gray-700 ${classes.text}`}>per page</span>
        </div>
      )}

      {/* Page info */}
      {showInfo && (
        <div className={`text-gray-700 font-medium ${classes.text}`}>
          Showing <span className="font-bold text-gray-900">{startItem}</span> to{' '}
          <span className="font-bold text-gray-900">{endItem}</span> of{' '}
          <span className="font-bold text-gray-900">{totalItems}</span> results
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`${classes.button} border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm`}
            title="First page"
          >
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          </button>

          {/* Previous page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${classes.button} border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm`}
            title="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className={`${classes.button} text-gray-500`}>...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`${classes.button} border rounded-lg transition-all duration-200 font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                      : 'border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Next page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${classes.button} border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm`}
            title="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>

          {/* Last page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`${classes.button} border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm`}
            title="Last page"
          >
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
