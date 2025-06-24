"use client";

import { Fragment, useState } from 'react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid';
import { Button, DateRangePicker } from '@tremor/react';
import { DateRangePickerValue } from '@tremor/react';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'pending', label: 'Pending' }
];

const membershipOptions = [
  { value: '<6mo', label: 'Less than 6 months' },
  { value: '6mo-1y', label: 'Between 6 months and 1 year' },
  { value: '1-3y', label: 'Between 1 and 3 years' },
  { value: '>3y', label: 'More than 3 years' }
];

const ageOptions = [
  { value: '<18', label: 'Under 18' },
  { value: '18-25', label: 'Between 18 and 25' },
  { value: '26-35', label: 'Between 26 and 35' },
  { value: '36-50', label: 'Between 36 and 50' },
  { value: '>50', label: 'Over 50' }
];

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

const ministryOptions = [
  { value: 'worship', label: 'Worship' },
  { value: 'youth', label: 'Youth' },
  { value: 'children', label: "Children's" },
  { value: 'outreach', label: 'Outreach' },
  { value: 'media', label: 'Media' }
];

interface FilterOption {
  value: string;
  label: string;
  checked?: boolean;
}

interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
  activeFilters: Record<string, string[]>;
  onClose: () => void;
}

export default function AdvancedFilters({ onFilterChange, activeFilters, onClose }: AdvancedFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRangePickerValue>({
    from: undefined,
    to: undefined,
  });

  const filterGroups: FilterGroup[] = [
    { id: 'status', name: 'Member Status', options: statusOptions },
    { id: 'membership', name: 'Membership Duration', options: membershipOptions },
    { id: 'age', name: 'Age Group', options: ageOptions },
    { id: 'gender', name: 'Gender', options: genderOptions },
    { id: 'ministry', name: 'Ministry', options: ministryOptions },
  ];

  const handleFilterChange = (groupId: string, optionValue: string, isChecked: boolean) => {
    const updatedFilters = { ...activeFilters };
    
    if (!updatedFilters[groupId]) {
      updatedFilters[groupId] = [];
    }
    
    if (isChecked) {
      if (!updatedFilters[groupId].includes(optionValue)) {
        updatedFilters[groupId] = [...updatedFilters[groupId], optionValue];
      }
    } else {
      updatedFilters[groupId] = updatedFilters[groupId].filter(v => v !== optionValue);
      if (updatedFilters[groupId].length === 0) {
        delete updatedFilters[groupId];
      }
    }
    
    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    onFilterChange({});
  };

  const applyFilters = () => {
    // Could apply date range filter here as well
    onClose();
  };

  const countActiveFilters = () => {
    return Object.values(activeFilters).reduce((count, values) => count + values.length, 0);
  };

  return (
    <div className="bg-white h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button
          type="button"
          className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <span className="sr-only">Close panel</span>
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Filters */}
      <div className="p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Date Joined</h3>
            <DateRangePicker
              className="mt-2"
              value={dateRange}
              onValueChange={setDateRange}
              enableSelect={false}
              placeholder="Select date range"
            />
          </div>

          {filterGroups.map((group) => (
            <Disclosure as="div" key={group.id} className="border-b border-gray-200 py-4">
              {({ open }) => (
                <>
                  <h3 className="-mx-2 -my-3">
                    <Disclosure.Button className="flex w-full items-center justify-between px-2 py-3 text-sm text-gray-700">
                      <span className="font-medium text-gray-900">{group.name}</span>
                      <span className="ml-6 flex items-center">
                        {activeFilters[group.id]?.length > 0 && (
                          <span className="mr-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {activeFilters[group.id]?.length}
                          </span>
                        )}
                        <ChevronDownIcon
                          className={`${open ? '-rotate-180' : 'rotate-0'} h-5 w-5 transform text-gray-500`}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </h3>
                  <Disclosure.Panel className="pt-4">
                    <div className="space-y-2">
                      {group.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${group.id}-${optionIdx}`}
                            name={`${group.id}[]`}
                            defaultValue={option.value}
                            type="checkbox"
                            checked={activeFilters[group.id]?.includes(option.value) || false}
                            onChange={(e) => handleFilterChange(group.id, option.value, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-${group.id}-${optionIdx}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>

        <div className="mt-8 flex justify-between space-x-4">
          <Button 
            variant="secondary" 
            onClick={clearAllFilters} 
            color="gray" 
            disabled={countActiveFilters() === 0 && !dateRange.from && !dateRange.to}
            className="w-1/2"
          >
            Clear all
          </Button>
          <Button 
            onClick={applyFilters} 
            color="indigo" 
            className="w-1/2"
          >
            Apply filters
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FilterButton({ activeFilters, onFilterChange }: { activeFilters: Record<string, string[]>, onFilterChange: (filters: Record<string, string[]>) => void }) {
  const [open, setOpen] = useState(false);
  
  const activeFilterCount = Object.values(activeFilters).reduce((count, values) => count + values.length, 0);
  
  return (
    <>
      <Popover className="relative">
        <Popover.Button
          className="inline-flex items-center gap-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <FunnelIcon className="h-4 w-4 text-gray-700" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
              {activeFilterCount}
            </span>
          )}
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 origin-top-right">
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-2 bg-white rounded-lg">
                <button
                  onClick={() => setOpen(true)}
                  className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <span>Advanced filters</span>
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>

      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto py-4 pb-6 shadow-xl bg-white">
                <AdvancedFilters 
                  activeFilters={activeFilters}
                  onFilterChange={onFilterChange}
                  onClose={() => setOpen(false)}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
