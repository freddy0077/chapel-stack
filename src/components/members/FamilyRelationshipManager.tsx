"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  UserIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  HeartIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useFamilyRelationships,
  useCreateFamilyRelationship,
  useUpdateFamilyRelationship,
  useRemoveFamilyRelationship,
  useSearchMembersForFamily,
  getRelationshipDisplayName,
  getRelationshipColor,
} from '@/graphql/hooks/useFamilyRelationships';
import {
  FamilyRelationshipType,
  FamilyRelationship,
  FamilyMember,
  CreateFamilyRelationshipInput,
} from '@/graphql/queries/familyQueries';

interface FamilyRelationshipManagerProps {
  memberId: string;
  memberName: string;
  onRelationshipsChange?: () => void;
}

interface RelationshipFormData {
  relatedMemberId: string;
  relationshipType: FamilyRelationshipType;
  familyId?: string;
}

const FamilyRelationshipManager: React.FC<FamilyRelationshipManagerProps> = ({
  memberId,
  memberName,
  onRelationshipsChange,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<FamilyRelationship | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState<RelationshipFormData>({
    relatedMemberId: '',
    relationshipType: FamilyRelationshipType.OTHER,
  });

  // Hooks
  const { relationships, loading, error, refetch } = useFamilyRelationships(memberId);
  const { create, loading: creating } = useCreateFamilyRelationship();
  const { update, loading: updating } = useUpdateFamilyRelationship();
  const { remove, loading: removing } = useRemoveFamilyRelationship();
  const { search, members, loading: searching, clearSearch } = useSearchMembersForFamily();

  // Search for members when search term changes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      search(searchTerm, memberId);
    } else {
      clearSearch();
    }
  }, [searchTerm, memberId, search, clearSearch]);

  const handleAddRelationship = () => {
    setEditingRelationship(null);
    setSelectedMember(null);
    setSearchTerm('');
    setFormData({
      relatedMemberId: '',
      relationshipType: FamilyRelationshipType.OTHER,
    });
    setShowAddModal(true);
  };

  const handleEditRelationship = (relationship: FamilyRelationship) => {
    setEditingRelationship(relationship);
    setSelectedMember(relationship.relatedMember);
    setFormData({
      relatedMemberId: relationship.relatedMember.id,
      relationshipType: relationship.relationshipType,
      familyId: relationship.family?.id,
    });
    setShowAddModal(true);
  };

  const handleSelectMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setFormData(prev => ({ ...prev, relatedMemberId: member.id }));
    setSearchTerm('');
    clearSearch();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.relatedMemberId || !formData.relationshipType) {
      return;
    }

    try {
      if (editingRelationship) {
        await update(editingRelationship.id, {
          relationshipType: formData.relationshipType,
          familyId: formData.familyId,
        });
      } else {
        const input: CreateFamilyRelationshipInput = {
          memberId,
          relatedMemberId: formData.relatedMemberId,
          relationshipType: formData.relationshipType,
          familyId: formData.familyId,
        };
        await create(input);
      }

      setShowAddModal(false);
      onRelationshipsChange?.();
      await refetch();
    } catch (error) {
      console.error('Error saving relationship:', error);
    }
  };

  const handleRemoveRelationship = async (relationshipId: string) => {
    if (confirm('Are you sure you want to remove this family relationship?')) {
      try {
        await remove(relationshipId);
        onRelationshipsChange?.();
        await refetch();
      } catch (error) {
        console.error('Error removing relationship:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingRelationship(null);
    setSelectedMember(null);
    setSearchTerm('');
    clearSearch();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
            Family Relationships
          </h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <UsersIcon className="h-5 w-5 mr-2 text-blue-500" />
          Family Relationships
        </h3>
        <Button
          type="button"
          onClick={handleAddRelationship}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Relationship
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Failed to load family relationships. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {relationships.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No family relationships added yet</p>
          <p className="text-gray-400 text-xs mt-1">Click "Add Relationship" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {relationships.map((relationship) => (
              <motion.div
                key={relationship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {relationship.relatedMember.profileImageUrl ? (
                        <img
                          src={relationship.relatedMember.profileImageUrl}
                          alt={`${relationship.relatedMember.firstName} ${relationship.relatedMember.lastName}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {relationship.relatedMember.firstName} {relationship.relatedMember.lastName}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelationshipColor(relationship.relationshipType)}`}
                        >
                          {getRelationshipDisplayName(relationship.relationshipType)}
                        </span>
                      </div>
                      {relationship.relatedMember.email && (
                        <p className="text-sm text-gray-500 truncate">
                          {relationship.relatedMember.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      onClick={() => handleEditRelationship(relationship)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleRemoveRelationship(relationship.id)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={removing}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Relationship Modal */}
      <Dialog open={showAddModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRelationship ? 'Edit' : 'Add'} Family Relationship
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Member Search */}
            {!editingRelationship && (
              <div className="space-y-2">
                <Label htmlFor="member-search">Search Family Member</Label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="member-search"
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Search Results */}
                {members.length > 0 && (
                  <div className="border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                    {members.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleSelectMember(member)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-shrink-0">
                          {member.profileImageUrl ? (
                            <img
                              src={member.profileImageUrl}
                              alt={`${member.firstName} ${member.lastName}`}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {member.firstName} {member.lastName}
                          </p>
                          {member.email && (
                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Member */}
                {selectedMember && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {selectedMember.profileImageUrl ? (
                            <img
                              src={selectedMember.profileImageUrl}
                              alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedMember.firstName} {selectedMember.lastName}
                          </p>
                          {selectedMember.email && (
                            <p className="text-xs text-gray-500">{selectedMember.email}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedMember(null);
                          setFormData(prev => ({ ...prev, relatedMemberId: '' }));
                        }}
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Relationship Type */}
            <div className="space-y-2">
              <Label htmlFor="relationship-type">Relationship Type</Label>
              <Select
                value={formData.relationshipType}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, relationshipType: value as FamilyRelationshipType }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value={FamilyRelationshipType.SPOUSE} className="text-gray-900 hover:bg-gray-50">Spouse</SelectItem>
                  <SelectItem value={FamilyRelationshipType.PARENT} className="text-gray-900 hover:bg-gray-50">Parent</SelectItem>
                  <SelectItem value={FamilyRelationshipType.CHILD} className="text-gray-900 hover:bg-gray-50">Child</SelectItem>
                  <SelectItem value={FamilyRelationshipType.SIBLING} className="text-gray-900 hover:bg-gray-50">Sibling</SelectItem>
                  <SelectItem value={FamilyRelationshipType.GRANDPARENT} className="text-gray-900 hover:bg-gray-50">Grandparent</SelectItem>
                  <SelectItem value={FamilyRelationshipType.GRANDCHILD} className="text-gray-900 hover:bg-gray-50">Grandchild</SelectItem>
                  <SelectItem value={FamilyRelationshipType.OTHER} className="text-gray-900 hover:bg-gray-50">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.relatedMemberId || !formData.relationshipType || creating || updating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {creating || updating ? 'Saving...' : editingRelationship ? 'Update' : 'Add'} Relationship
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FamilyRelationshipManager;
