"use client";

import { useState } from "react";
import ChildrenHeader from "./components/ChildrenHeader";
import ChildrenStats from "./components/ChildrenStats";
import ChildrenSearch from "./components/ChildrenSearch";
import ChildrenList, { mockChildren, Child } from "./components/ChildrenList";
import ChildDetailModal from "./components/ChildDetailModal";

export default function ChildrenMinistry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All Ages");
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter children based on search term and age group
  const filteredChildren = mockChildren.filter((child) => {
    const matchesSearch =
      `${child.firstName} ${child.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAgeGroup =
      selectedAgeGroup === "All Ages" || child.ageGroup === selectedAgeGroup;

    return matchesSearch && matchesAgeGroup;
  });

  // Statistics for the dashboard
  const totalChildren = mockChildren.length;
  const checkedInToday = mockChildren.filter((child) => child.checkedIn).length;
  const classrooms = [...new Set(mockChildren.map((child) => child.classroom))]
    .length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with title and add button */}
      <ChildrenHeader onOpenAddChild={() => setIsAddModalOpen(true)} />

      {/* Statistics cards */}
      <ChildrenStats
        totalChildren={totalChildren}
        checkedInToday={checkedInToday}
        classrooms={classrooms}
      />

      {/* Search and filter bar */}
      <ChildrenSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        ageGroup={selectedAgeGroup}
        onAgeGroupChange={setSelectedAgeGroup}
      />

      {/* Children table/list */}
      <ChildrenList
        children={filteredChildren}
        onSelectChild={setSelectedChild}
      />

      {/* Child detail modal */}
      {selectedChild && (
        <ChildDetailModal
          child={selectedChild}
          onClose={() => setSelectedChild(null)}
        />
      )}

      {/* Add Child modal would go here - not implemented in this component breakdown */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-indigo-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Add New Child
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      This modal would contain a form to add a new child to the
                      system.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Add Child
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
