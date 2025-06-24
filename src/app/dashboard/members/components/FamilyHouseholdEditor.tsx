"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, CheckIcon, UserPlusIcon, HomeIcon } from "@heroicons/react/24/outline";
import { FamilyMemberType, HouseholdType } from "./FamilyHouseholdView";

type RelationshipType = 
  | "Spouse" 
  | "Child" 
  | "Parent" 
  | "Sibling" 
  | "Grandparent" 
  | "Grandchild" 
  | "Other";

const RELATIONSHIPS: RelationshipType[] = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Grandparent",
  "Grandchild",
  "Other"
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { familyMember?: FamilyMemberType; household?: HouseholdType }) => void;
  existingMembers: { id: number; name: string }[];
  existingHouseholds: { id: number; name: string }[];
  mode: "family" | "household";
  currentMemberId: number;
}

export default function FamilyHouseholdEditor({
  isOpen,
  onClose,
  onSave,
  existingMembers,
  existingHouseholds,
  mode,
  currentMemberId
}: Props) {
  // Family form state
  const [selectedMemberId, setSelectedMemberId] = useState<number | "new">(0);
  const [memberName, setMemberName] = useState("");
  const [relationship, setRelationship] = useState<RelationshipType>("Other");
  const [familyStatus, setFamilyStatus] = useState("Active");
  
  // Household form state
  const [householdMode, setHouseholdMode] = useState<"existing" | "new">("existing");
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number>(0);
  const [householdName, setHouseholdName] = useState("");
  const [householdAddress, setHouseholdAddress] = useState("");
  const [householdMembers, setHouseholdMembers] = useState<number[]>([]);

  useEffect(() => {
    // Reset form when opened
    if (isOpen) {
      if (mode === "family") {
        setSelectedMemberId(0);
        setMemberName("");
        setRelationship("Other");
        setFamilyStatus("Active");
      } else {
        setHouseholdMode("existing");
        setSelectedHouseholdId(0);
        setHouseholdName("");
        setHouseholdAddress("");
        setHouseholdMembers([currentMemberId]); // Always include current member
      }
    }
  }, [isOpen, mode, currentMemberId]);

  if (!isOpen) return null;

  const handleSaveFamily = () => {
    if (selectedMemberId === "new" && !memberName) {
      alert("Please enter member name");
      return;
    }

    if (selectedMemberId === 0 && mode === "family") {
      alert("Please select a member or create a new one");
      return;
    }

    if (mode === "family") {
      const familyMember: FamilyMemberType = {
        id: selectedMemberId === "new" ? -1 : selectedMemberId as number, // -1 indicates new member to be created
        name: selectedMemberId === "new" ? memberName : existingMembers.find(m => m.id === selectedMemberId)?.name || "",
        relationship: relationship,
        status: familyStatus
      };
      onSave({ familyMember });
    }
  };

  const handleSaveHousehold = () => {
    if (householdMode === "existing" && selectedHouseholdId === 0) {
      alert("Please select a household");
      return;
    }

    if (householdMode === "new" && (!householdName || !householdAddress)) {
      alert("Please enter household name and address");
      return;
    }

    if (mode === "household") {
      if (householdMode === "existing") {
        // Just adding member to existing household
        onSave({ 
          household: {
            id: selectedHouseholdId,
            name: existingHouseholds.find(h => h.id === selectedHouseholdId)?.name || "",
            address: "", // Will be populated from existing data
            members: [] // Will be handled by backend
          }
        });
      } else {
        // Creating new household
        const household: HouseholdType = {
          id: -1, // Indicates new household
          name: householdName,
          address: householdAddress,
          members: householdMembers.map(id => ({
            id,
            name: id === currentMemberId 
              ? "Current Member" 
              : existingMembers.find(m => m.id === id)?.name || "",
            relationship: id === currentMemberId ? "Self" : "Other",
            status: "Active"
          }))
        };
        onSave({ household });
      }
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-xl transform transition-all sm:max-w-lg">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="px-6 pt-6 pb-8">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            {mode === "family" ? (
              <>
                <UserPlusIcon className="h-5 w-5 text-indigo-500 mr-2" />
                Add Family Connection
              </>
            ) : (
              <>
                <HomeIcon className="h-5 w-5 text-indigo-500 mr-2" />
                {householdMode === "existing" ? "Add to Household" : "Create New Household"}
              </>
            )}
          </h3>
          
          {/* Family Mode */}
          {mode === "family" && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMemberId(0)}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      selectedMemberId !== "new" && selectedMemberId !== 0
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    Existing Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMemberId("new")}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      selectedMemberId === "new"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    New Member
                  </button>
                </div>
                
                {selectedMemberId !== "new" ? (
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value={0}>Select a member</option>
                    {existingMembers
                      .filter(m => m.id !== currentMemberId) // Exclude current member
                      .map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Enter new member name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as RelationshipType)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {RELATIONSHIPS.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={familyStatus}
                  onChange={(e) => setFamilyStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Visitor">Visitor</option>
                  <option value="Former Member">Former Member</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Household Mode */}
          {mode === "household" && (
            <div className="mt-6 space-y-4">
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setHouseholdMode("existing")}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    householdMode === "existing"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Add to Existing
                </button>
                <button
                  type="button"
                  onClick={() => setHouseholdMode("new")}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    householdMode === "new"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Create New
                </button>
              </div>
              
              {householdMode === "existing" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Household
                  </label>
                  <select
                    value={selectedHouseholdId}
                    onChange={(e) => setSelectedHouseholdId(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value={0}>Select a household</option>
                    {existingHouseholds.map(household => (
                      <option key={household.id} value={household.id}>
                        {household.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Household Name
                    </label>
                    <input
                      type="text"
                      value={householdName}
                      onChange={(e) => setHouseholdName(e.target.value)}
                      placeholder="e.g., Smith Family"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={householdAddress}
                      onChange={(e) => setHouseholdAddress(e.target.value)}
                      rows={3}
                      placeholder="Enter full address"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Household Members
                    </label>
                    <div className="mt-1 p-3 border rounded-md bg-gray-50 max-h-36 overflow-y-auto">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Current Member (primary)
                        </label>
                      </div>
                      
                      {existingMembers
                        .filter(m => m.id !== currentMemberId)
                        .map(member => (
                          <div key={member.id} className="flex items-center py-1">
                            <input
                              type="checkbox"
                              id={`member-${member.id}`}
                              checked={householdMembers.includes(member.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setHouseholdMembers([...householdMembers, member.id]);
                                } else {
                                  setHouseholdMembers(householdMembers.filter(id => id !== member.id));
                                }
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`member-${member.id}`} className="ml-2 block text-sm text-gray-900">
                              {member.name}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={mode === "family" ? handleSaveFamily : handleSaveHousehold}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <CheckIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
