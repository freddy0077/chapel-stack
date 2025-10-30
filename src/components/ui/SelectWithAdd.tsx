"use client";

import React, { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface SelectWithAddProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  onAddNew?: (newValue: string) => void;
  allowCustom?: boolean;
}

export default function SelectWithAdd({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  className = "",
  onAddNew,
  allowCustom = true,
}: SelectWithAddProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [customOptions, setCustomOptions] = useState<string[]>([]);

  // Combine standard and custom options
  const allOptions = [...options, ...customOptions].sort();

  const handleAddNew = () => {
    if (newValue.trim()) {
      const trimmedValue = newValue.trim();
      
      // Add to custom options
      if (!allOptions.includes(trimmedValue)) {
        setCustomOptions([...customOptions, trimmedValue]);
      }
      
      // Set as selected value
      onChange(trimmedValue);
      
      // Call callback if provided
      if (onAddNew) {
        onAddNew(trimmedValue);
      }
      
      // Reset
      setNewValue("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNew();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewValue("");
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {isAdding ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Enter new ${label.toLowerCase()}`}
            className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAddNew}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            title="Add"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewValue("");
            }}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            title="Cancel"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select
            value={value}
            onChange={(e) => {
              if (e.target.value === "__ADD_NEW__") {
                setIsAdding(true);
              } else {
                onChange(e.target.value);
              }
            }}
            className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            required={required}
          >
            <option value="">{placeholder}</option>
            {allOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {allowCustom && (
              <>
                <option disabled>──────────</option>
                <option value="__ADD_NEW__">➕ Add New...</option>
              </>
            )}
          </select>
        </div>
      )}
      
      {customOptions.length > 0 && (
        <p className="mt-1 text-xs text-gray-500">
          Custom options added: {customOptions.join(", ")}
        </p>
      )}
    </div>
  );
}
