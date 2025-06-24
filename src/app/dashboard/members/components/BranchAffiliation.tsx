"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon, CheckIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

export type BranchType = {
  id: string;
  name: string;
  location: string;
  region: string;
};

export type MemberBranchAffiliationType = {
  id: string;
  branchId: string;
  branchName: string;
  isPrimary: boolean;
  attendancePercentage?: number;
  lastVisit?: string;
  joinedDate: string;
  notes?: string;
};

type BranchAffiliationProps = {
  memberId: number;
  affiliations: MemberBranchAffiliationType[];
  availableBranches: BranchType[];
  isEditable?: boolean;
  onAddAffiliation?: (branchId: string, isPrimary: boolean) => void;
  onRemoveAffiliation?: (affiliationId: string) => void;
  onSetPrimaryBranch?: (affiliationId: string) => void;
};

export default function BranchAffiliation({
  // memberId is used in prop type but not in component logic
  affiliations,
  availableBranches,
  isEditable = false,
  onAddAffiliation,
  onRemoveAffiliation,
  onSetPrimaryBranch
}: BranchAffiliationProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [makePrimary, setMakePrimary] = useState<boolean>(false);

  const handleAdd = () => {
    if (!selectedBranchId) return;
    
    if (onAddAffiliation) {
      onAddAffiliation(selectedBranchId, makePrimary);
      // Reset form
      setSelectedBranchId("");
      setMakePrimary(false);
      setShowAddForm(false);
    }
  };

  const getUnaffiliatedBranches = () => {
    const affiliatedBranchIds = affiliations.map(a => a.branchId);
    return availableBranches.filter(branch => !affiliatedBranchIds.includes(branch.id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Branch Affiliations</h3>
          {isEditable && onAddAffiliation && !showAddForm && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-1" aria-hidden="true" />
              Add Branch
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add Branch Affiliation</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="branch-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Branch
                </label>
                <select
                  id="branch-select"
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a branch</option>
                  {getUnaffiliatedBranches().map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.region})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="primary-branch"
                  name="primary-branch"
                  type="checkbox"
                  checked={makePrimary}
                  onChange={(e) => setMakePrimary(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="primary-branch" className="ml-2 block text-sm text-gray-900">
                  Set as primary branch
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!selectedBranchId}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {affiliations.length === 0 ? (
          <div className="text-center py-8">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No branch affiliations</h3>
            <p className="mt-1 text-sm text-gray-500">
              This member is not affiliated with any branch yet.
            </p>
            {isEditable && onAddAffiliation && !showAddForm && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Branch Affiliation
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {affiliations.map((affiliation) => (
              <div
                key={affiliation.id}
                className={`rounded-lg p-4 ${
                  affiliation.isPrimary ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-base font-medium text-gray-900">
                        {affiliation.branchName}
                      </h4>
                      {affiliation.isPrimary && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Member since {affiliation.joinedDate}</p>
                    {affiliation.lastVisit && (
                      <p className="text-sm text-gray-500">
                        Last visit: {affiliation.lastVisit}
                      </p>
                    )}
                    {affiliation.attendancePercentage !== undefined && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Attendance (last 3 months)</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              affiliation.attendancePercentage > 75
                                ? "bg-green-500"
                                : affiliation.attendancePercentage > 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${affiliation.attendancePercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right mt-1">{affiliation.attendancePercentage}%</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {!affiliation.isPrimary && isEditable && onSetPrimaryBranch && (
                      <button
                        onClick={() => onSetPrimaryBranch(affiliation.id)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                        title="Set as primary branch"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                    )}
                    {isEditable && onRemoveAffiliation && (
                      <button
                        onClick={() => onRemoveAffiliation(affiliation.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-900"
                        title="Remove affiliation"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                {affiliation.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">{affiliation.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
