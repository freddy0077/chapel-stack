"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Plus, Trash2, Users } from 'lucide-react';
import { Member } from '../types/member.types';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import SearchableMemberOrTextInput from '@/components/ui/SearchableMemberOrTextInput';
import {
  useFamilyRelationships,
  useCreateFamilyRelationship,
  useRemoveFamilyRelationship,
} from '@/graphql/hooks/useFamilyRelationships';
import {
  FamilyRelationshipType as GraphQLFamilyRelationshipType,
  FamilyRelationship,
} from '@/graphql/queries/familyQueries';

// Use GraphQL relationship types
const FamilyRelationshipType = GraphQLFamilyRelationshipType;

// Relationship display labels
const RELATIONSHIP_LABELS = {
  [FamilyRelationshipType.SPOUSE]: 'Spouse',
  [FamilyRelationshipType.PARENT]: 'Parent',
  [FamilyRelationshipType.CHILD]: 'Child',
  [FamilyRelationshipType.SIBLING]: 'Sibling',
  [FamilyRelationshipType.GRANDPARENT]: 'Grandparent',
  [FamilyRelationshipType.GRANDCHILD]: 'Grandchild',
  [FamilyRelationshipType.OTHER]: 'Other',
};

interface FamilyRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onSuccess?: () => void;
}

export default function FamilyRelationshipModal({
  isOpen,
  onClose,
  member,
  onSuccess,
}: FamilyRelationshipModalProps) {
  const [selectedMemberName, setSelectedMemberName] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [relationshipType, setRelationshipType] = useState<GraphQLFamilyRelationshipType>(GraphQLFamilyRelationshipType.OTHER);

  // Use GraphQL hooks
  const { relationships, loading, error, refetch } = useFamilyRelationships(member.id);
  const { create: createRelationship, loading: creating, error: createError } = useCreateFamilyRelationship();
  const { remove: removeRelationship, loading: removing, error: removeError } = useRemoveFamilyRelationship();

  // Handle member selection from SearchableMemberOrTextInput
  const handleMemberSelection = (value: string, selectedMemberData?: Member) => {
    setSelectedMemberName(value);
    setSelectedMember(selectedMemberData || null);
  };

  const handleAddRelationship = async () => {
    if (!selectedMember || !relationshipType) {
      toast.error('Please select a member and relationship type');
      return;
    }

    try {
      await createRelationship({
        memberId: member.id,
        relatedMemberId: selectedMember.id,
        relationshipType: relationshipType,
      });

      toast.success('Family relationship added successfully');
      setSelectedMemberName('');
      setSelectedMember(null);
      setRelationshipType(GraphQLFamilyRelationshipType.OTHER);
      await refetch();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding relationship:', error);
      toast.error('Failed to add family relationship');
    }
  };

  const handleRemoveRelationship = async (relationshipId: string) => {
    try {
      await removeRelationship(relationshipId);
      toast.success('Family relationship removed successfully');
      await refetch();
      onSuccess?.();
    } catch (error) {
      console.error('Error removing relationship:', error);
      toast.error('Failed to remove family relationship');
    }
  };


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        Family Relationships
                      </Dialog.Title>
                      <p className="text-sm text-gray-600">
                        Manage family relationships for {member.firstName} {member.lastName}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Add New Relationship Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Relationship</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Member Selection */}
                      <div className="md:col-span-2">
                        <SearchableMemberOrTextInput
                          value={selectedMemberName}
                          onChange={handleMemberSelection}
                          placeholder="Search for a member..."
                          label="Select Member"
                          allowTextInput={false}
                          required
                        />
                      </div>

                      {/* Relationship Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relationship Type
                        </label>
                        <select
                          value={relationshipType}
                          onChange={(e) => setRelationshipType(e.target.value as FamilyRelationshipType)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.entries(RELATIONSHIP_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={handleAddRelationship}
                        disabled={!selectedMember || creating}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {creating ? 'Adding...' : 'Add Relationship'}
                      </Button>
                    </div>
                  </div>

                  {/* Existing Relationships */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Current Relationships</h4>
                    
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading relationships...</p>
                      </div>
                    ) : relationships.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No family relationships found</p>
                        <p className="text-xs text-gray-400 mt-1">Add relationships using the form above</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {relationships.map((relationship) => (
                          <div
                            key={relationship.id}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {relationship.relatedMember?.firstName?.[0]}
                                  {relationship.relatedMember?.lastName?.[0]}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {relationship.relatedMember?.firstName} {relationship.relatedMember?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {RELATIONSHIP_LABELS[relationship.relationshipType]}
                                </p>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleRemoveRelationship(relationship.id)}
                              disabled={removing}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
