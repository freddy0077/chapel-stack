"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusIcon, HomeIcon, UsersIcon, TrashIcon } from "@heroicons/react/24/outline";
import FamilyHouseholdEditor from "./FamilyHouseholdEditor";

export type FamilyMemberType = {
  id: number;
  name: string;
  relationship: string;
  profileImage?: string;
  status: string;
};

export type HouseholdType = {
  id: number;
  name: string;
  address: string;
  members: FamilyMemberType[];
};

type FamilyHouseholdViewProps = {
  memberId: number;
  households: HouseholdType[];
  familyMembers: FamilyMemberType[];
  isEditable?: boolean;
  onAddFamilyMember?: (familyMember: FamilyMemberType) => void;
  onAddToHousehold?: (household: HouseholdType) => void;
  onRemoveFamilyMember?: (id: number) => void;
  onRemoveFromHousehold?: (householdId: number) => void;
  availableMembers?: { id: number; name: string }[];
  availableHouseholds?: { id: number; name: string }[];
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const getRelationshipColor = (relationship: string) => {
  switch (relationship.toLowerCase()) {
    case "spouse":
      return "bg-pink-100 text-pink-800";
    case "child":
      return "bg-blue-100 text-blue-800";
    case "parent":
      return "bg-purple-100 text-purple-800";
    case "sibling":
      return "bg-green-100 text-green-800";
    case "grandparent":
      return "bg-yellow-100 text-yellow-800";
    case "grandchild":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function FamilyHouseholdView({
  memberId,
  households,
  familyMembers,
  isEditable = false,
  onAddFamilyMember,
  onAddToHousehold,
  onRemoveFamilyMember,
  onRemoveFromHousehold,
  availableMembers = [],
  availableHouseholds = []
}: FamilyHouseholdViewProps) {
  const [activeTab, setActiveTab] = useState<"family" | "household">("family");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"family" | "household">("family");
  
  const handleOpenEditor = (mode: "family" | "household") => {
    setEditorMode(mode);
    setIsEditorOpen(true);
  };
  
  const handleSave = (data: { familyMember?: FamilyMemberType; household?: HouseholdType }) => {
    if (data.familyMember && onAddFamilyMember) {
      onAddFamilyMember(data.familyMember);
    } else if (data.household && onAddToHousehold) {
      onAddToHousehold(data.household);
    }
    setIsEditorOpen(false);
  };

  return (
    <>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("family")}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === "family"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex justify-center items-center">
              <UsersIcon className="mr-2 h-5 w-5" />
              Family Connections
            </div>
          </button>
          <button
            onClick={() => setActiveTab("household")}
            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === "household"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex justify-center items-center">
              <HomeIcon className="mr-2 h-5 w-5" />
              Household
            </div>
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="p-6">
        {activeTab === "family" ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Family Members</h3>
              {isEditable && onAddFamilyMember && (
                <button
                  type="button"
                  onClick={() => handleOpenEditor("family")}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                  Add Family Member
                </button>
              )}
            </div>

            {familyMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No family connections added yet.</p>
                {isEditable && onAddFamilyMember && (
                  <button
                    type="button"
                    onClick={() => handleOpenEditor("family")}
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Add Family Connection
                  </button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {familyMembers.map((member) => (
                  <li key={member.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {member.profileImage ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image 
                            src={member.profileImage} 
                            alt={member.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                          {getInitials(member.name)}
                        </div>
                      )}
                      <div className="ml-3">
                        <Link 
                          href={`/dashboard/members/${member.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {member.name}
                        </Link>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipColor(member.relationship)}`}>
                          {member.relationship}
                        </span>
                        <p className="text-sm text-gray-500 mt-0.5">
                          <span className={`inline-flex h-2 w-2 rounded-full ${member.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          <span className="ml-1">{member.status}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        href={`/dashboard/members/${member.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                      {isEditable && onRemoveFamilyMember && (
                        <button
                          onClick={() => onRemoveFamilyMember(member.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Household Information</h3>
              {isEditable && onAddToHousehold && (
                <button
                  type="button"
                  onClick={() => handleOpenEditor("household")}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                  Add to Household
                </button>
              )}
            </div>

            {households.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No household information available.</p>
                {isEditable && onAddToHousehold && (
                  <button
                    type="button"
                    onClick={() => handleOpenEditor("household")}
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                    Add to Household
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {households.map((household) => (
                  <div key={household.id} className="mb-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">{household.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            <HomeIcon className="inline-block h-4 w-4 mr-1" />
                            {household.address}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {isEditable && (
                            <button
                              type="button"
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                          )}
                          {isEditable && onRemoveFromHousehold && (
                            <button
                              onClick={() => onRemoveFromHousehold(household.id)}
                              className="text-sm font-medium text-red-600 hover:text-red-900"
                              title="Remove from household"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <h5 className="text-sm font-medium text-gray-700 mt-4 mb-2">Household Members ({household.members.length})</h5>
                      <div className="flex flex-wrap gap-2">
                        {household.members.map((member) => (
                          <Link 
                            key={member.id}
                            href={`/dashboard/members/${member.id}`}
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium ${member.id === memberId ? 'bg-indigo-100 text-indigo-800' : 'bg-white text-gray-800 border border-gray-300'}`}
                          >
                            {member.name}
                            {member.id === memberId && <span className="ml-1 text-xs">(Self)</span>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Family/Household Editor Modal */}
    <FamilyHouseholdEditor
      isOpen={isEditorOpen}
      onClose={() => setIsEditorOpen(false)}
      onSave={handleSave}
      existingMembers={availableMembers}
      existingHouseholds={availableHouseholds}
      mode={editorMode}
      currentMemberId={memberId}
    />
    </>
  );
}
