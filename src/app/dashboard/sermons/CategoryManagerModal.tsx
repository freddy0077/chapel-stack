"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCategories } from "@/graphql/hooks/useSermon";

// Main Category Viewer Modal
export const CategoryManagerModal = ({ open, onClose }) => {
  const { categories, loading, error } = useCategories();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            Categories are currently read-only in the system. Contact your
            administrator to add or modify categories.
          </p>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="py-4 text-center">Loading categories...</div>
          ) : error ? (
            <div className="py-4 text-center text-red-500">
              Error loading categories
            </div>
          ) : categories.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              No categories found
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
