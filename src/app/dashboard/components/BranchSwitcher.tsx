"use client";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";

export default function BranchSwitcher() {
  const { availableBranches, currentBranch, setCurrentBranch } = useAuth();

  // Handle branch selection
  const handleBranchChange = (branchId: string) => {
    setCurrentBranch(branchId);
  };

  return (
    <div className="w-full md:w-64">
      <Listbox value={currentBranch?.id || ""} onChange={handleBranchChange}>
        {({ open }) => (
          <>
            <div className="relative">
              <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {currentBranch ? (
                  <span className="flex items-center">
                    <BuildingOfficeIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-3 block truncate">
                      {currentBranch.name}
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">Select Branch</span>
                  </span>
                )}
                <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {availableBranches.map((branch) => (
                    <Listbox.Option
                      key={branch.id}
                      className={({ active }) =>
                        `${active ? "text-white bg-indigo-600" : "text-gray-900"}
                        cursor-default select-none relative py-2 pl-3 pr-9`
                      }
                      value={branch.id}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <BuildingOfficeIcon
                              className="flex-shrink-0 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <span
                              className={`${selected ? "font-semibold" : "font-normal"} ml-3 block truncate`}
                            >
                              {branch.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={`${active ? "text-white" : "text-indigo-600"}
                                absolute inset-y-0 right-0 flex items-center pr-4`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}
