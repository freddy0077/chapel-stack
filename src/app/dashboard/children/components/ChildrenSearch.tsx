"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ChildrenSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  ageGroup: string;
  onAgeGroupChange: (value: string) => void;
}

// Age group options for filtering
const ageGroups = [
  "All Ages",
  "Infants (0-1)",
  "Toddlers (2-3)",
  "Preschool (4-5)",
  "Elementary (6-10)",
  "Preteen (11-12)",
];

export default function ChildrenSearch({
  searchTerm,
  onSearchChange,
  ageGroup,
  onAgeGroupChange,
}: ChildrenSearchProps) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-4">
      <div className="relative rounded-md shadow-sm flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search by child name, parent name, or ID..."
        />
      </div>
      <div className="w-full sm:w-60">
        <select
          id="age-filter"
          name="age-filter"
          value={ageGroup}
          onChange={(e) => onAgeGroupChange(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {ageGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
