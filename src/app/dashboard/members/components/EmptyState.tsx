"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type EmptyStateProps = {
  onResetFilters: () => void;
};

export default function EmptyState({ onResetFilters }: EmptyStateProps) {
  return (
    <div className="mt-12 text-center py-12 px-4 sm:px-6 lg:px-8 border-2 border-dashed border-gray-300 rounded-lg">
      <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No members found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter to find what you&apos;re looking for.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
