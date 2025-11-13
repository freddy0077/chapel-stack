'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Pencil,
  User,
  Heart,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import SearchableMemberInput from '@/components/ui/SearchableMemberInput';
import {
  useFamilyRelationships,
  useCreateFamilyRelationship,
  useUpdateFamilyRelationship,
  useRemoveFamilyRelationship,
  getRelationshipDisplayName,
  getRelationshipColor,
} from '@/graphql/hooks/useFamilyRelationships';
import {
  FamilyRelationshipType,
  FamilyRelationship,
} from '@/graphql/queries/familyQueries';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  memberId?: string;
  familyId?: string;
  headOfHousehold?: boolean;
}

interface FamilyRelationshipsPanelProps {
  member: Member;
  onRelationshipsChange?: () => void;
  compact?: boolean;
  showTitle?: boolean;
  showAddButton?: boolean;
}

// Relationship icons mapping
const RELATIONSHIP_ICONS = {
  [FamilyRelationshipType.SPOUSE]: Heart,
  [FamilyRelationshipType.PARENT]: User,
  [FamilyRelationshipType.CHILD]: User,
  [FamilyRelationshipType.SIBLING]: Users,
  [FamilyRelationshipType.GRANDPARENT]: User,
  [FamilyRelationshipType.GRANDCHILD]: User,
  [FamilyRelationshipType.UNCLE_AUNT]: User,
  [FamilyRelationshipType.NEPHEW_NIECE]: User,
  [FamilyRelationshipType.COUSIN]: Users,
  [FamilyRelationshipType.GUARDIAN]: User,
  [FamilyRelationshipType.WARD]: User,
  [FamilyRelationshipType.FRIEND]: Users,
  [FamilyRelationshipType.EMERGENCY_CONTACT]: User,
  [FamilyRelationshipType.OTHER]: User,
};

export default function FamilyRelationshipsPanel({
  member,
  onRelationshipsChange,
  compact = false,
  showTitle = true,
  showAddButton = true,
}: FamilyRelationshipsPanelProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<FamilyRelationship | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedMemberName, setSelectedMemberName] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [relationshipType, setRelationshipType] = useState<FamilyRelationshipType>(
    FamilyRelationshipType.OTHER
  );

  // Hooks
  const { relationships, loading, error, refetch } = useFamilyRelationships(member.id);
  const { create, loading: creating } = useCreateFamilyRelationship();
  const { update, loading: updating } = useUpdateFamilyRelationship();
  const { remove, loading: removing } = useRemoveFamilyRelationship();

  // Handle member selection
  const handleMemberSelection = (value: string, selectedMemberData?: Member) => {
    setSelectedMemberName(value);
    setSelectedMember(selectedMemberData || null);
  };

  // Open add modal
  const handleAddClick = () => {
    setEditingRelationship(null);
    setSelectedMemberName('');
    setSelectedMember(null);
    setRelationshipType(FamilyRelationshipType.OTHER);
    setShowAddModal(true);
  };

  // Open edit modal
  const handleEditClick = (relationship: FamilyRelationship) => {
    setEditingRelationship(relationship);
    setSelectedMember(relationship.relatedMember);
    setSelectedMemberName(
      `${relationship.relatedMember.firstName} ${relationship.relatedMember.lastName}`
    );
    setRelationshipType(relationship.relationshipType);
    setShowAddModal(true);
  };

  // Submit form
  const handleSubmit = async () => {
    if (!selectedMember || !relationshipType) {
      return;
    }

    try {
      if (editingRelationship) {
        await update(editingRelationship.id, {
          relationshipType,
        });
      } else {
        await create({
          memberId: member.id,
          relatedMemberId: selectedMember.id,
          relationshipType,
        });
      }

      setShowAddModal(false);
      onRelationshipsChange?.();
      await refetch();
    } catch (error) {
      console.error('Error saving relationship:', error);
    }
  };

  // Delete relationship
  const handleDeleteConfirm = async (relationshipId: string) => {
    try {
      await remove(relationshipId);
      setShowDeleteConfirm(null);
      onRelationshipsChange?.();
      await refetch();
    } catch (error) {
      console.error('Error removing relationship:', error);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingRelationship(null);
    setSelectedMemberName('');
    setSelectedMember(null);
    setRelationshipType(FamilyRelationshipType.OTHER);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {showTitle && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Family Relationships
            </h3>
          </div>
        )}
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          Failed to load family relationships. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (relationships.length === 0) {
    return (
      <div className="space-y-4">
        {showTitle && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Family Relationships
            </h3>
            {showAddButton && (
              <Button
                type="button"
                onClick={handleAddClick}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Relationship
              </Button>
            )}
          </div>
        )}

        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No family relationships added yet</p>
          {showAddButton && (
            <p className="text-gray-400 text-xs mt-1">Click "Add Relationship" to get started</p>
          )}
        </div>

        {/* Modals */}
        <Modal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          title={editingRelationship ? 'Edit Family Relationship' : 'Add Family Relationship'}
          description="Select a member and specify the relationship type"
          size="md"
          onConfirm={handleSubmit}
          confirmText={editingRelationship ? 'Update' : 'Add'}
          cancelText="Cancel"
          isLoading={creating || updating}
        >
          <div className="space-y-4">
            {!editingRelationship && (
              <div className="space-y-2">
                <Label>Family Member</Label>
                <SearchableMemberInput
                  value={selectedMemberName}
                  onChange={handleMemberSelection}
                  placeholder="Search for a member..."
                  label=""
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="relationship-type">Relationship Type</Label>
              <Select value={relationshipType} onValueChange={(value) => setRelationshipType(value as FamilyRelationshipType)}>
                <SelectTrigger id="relationship-type">
                  <SelectValue placeholder="Select relationship type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={FamilyRelationshipType.SPOUSE}>Spouse</SelectItem>
                  <SelectItem value={FamilyRelationshipType.PARENT}>Parent</SelectItem>
                  <SelectItem value={FamilyRelationshipType.CHILD}>Child</SelectItem>
                  <SelectItem value={FamilyRelationshipType.SIBLING}>Sibling</SelectItem>
                  <SelectItem value={FamilyRelationshipType.GRANDPARENT}>Grandparent</SelectItem>
                  <SelectItem value={FamilyRelationshipType.GRANDCHILD}>Grandchild</SelectItem>
                  <SelectItem value={FamilyRelationshipType.UNCLE_AUNT}>Uncle/Aunt</SelectItem>
                  <SelectItem value={FamilyRelationshipType.NEPHEW_NIECE}>Nephew/Niece</SelectItem>
                  <SelectItem value={FamilyRelationshipType.COUSIN}>Cousin</SelectItem>
                  <SelectItem value={FamilyRelationshipType.GUARDIAN}>Guardian</SelectItem>
                  <SelectItem value={FamilyRelationshipType.WARD}>Ward</SelectItem>
                  <SelectItem value={FamilyRelationshipType.FRIEND}>Friend</SelectItem>
                  <SelectItem value={FamilyRelationshipType.EMERGENCY_CONTACT}>Emergency Contact</SelectItem>
                  <SelectItem value={FamilyRelationshipType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // Relationships list
  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Family Relationships ({relationships.length})
          </h3>
          {showAddButton && (
            <Button
              type="button"
              onClick={handleAddClick}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Relationship
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {relationships.map((relationship) => {
            const Icon = RELATIONSHIP_ICONS[relationship.relationshipType];
            const colorClass = getRelationshipColor(relationship.relationshipType);

            return (
              <motion.div
                key={relationship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {relationship.relatedMember.profileImageUrl ? (
                        <img
                          src={relationship.relatedMember.profileImageUrl}
                          alt={`${relationship.relatedMember.firstName} ${relationship.relatedMember.lastName}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Member info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {relationship.relatedMember.firstName} {relationship.relatedMember.lastName}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
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

                  {/* Actions */}
                  {showAddButton && (
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        type="button"
                        onClick={() => handleEditClick(relationship)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowDeleteConfirm(relationship.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={removing}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title={editingRelationship ? 'Edit Family Relationship' : 'Add Family Relationship'}
        description="Select a member and specify the relationship type"
        size="md"
        onConfirm={handleSubmit}
        confirmText={editingRelationship ? 'Update' : 'Add'}
        cancelText="Cancel"
        isLoading={creating || updating}
      >
        <div className="space-y-4">
          {!editingRelationship && (
            <div className="space-y-2">
              <Label>Family Member</Label>
              <SearchableMemberInput
                value={selectedMemberName}
                onChange={handleMemberSelection}
                placeholder="Search for a member..."
                label=""
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="relationship-type">Relationship Type</Label>
            <Select value={relationshipType} onValueChange={(value) => setRelationshipType(value as FamilyRelationshipType)}>
              <SelectTrigger id="relationship-type">
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FamilyRelationshipType.SPOUSE}>Spouse</SelectItem>
                <SelectItem value={FamilyRelationshipType.PARENT}>Parent</SelectItem>
                <SelectItem value={FamilyRelationshipType.CHILD}>Child</SelectItem>
                <SelectItem value={FamilyRelationshipType.SIBLING}>Sibling</SelectItem>
                <SelectItem value={FamilyRelationshipType.GRANDPARENT}>Grandparent</SelectItem>
                <SelectItem value={FamilyRelationshipType.GRANDCHILD}>Grandchild</SelectItem>
                <SelectItem value={FamilyRelationshipType.UNCLE_AUNT}>Uncle/Aunt</SelectItem>
                <SelectItem value={FamilyRelationshipType.NEPHEW_NIECE}>Nephew/Niece</SelectItem>
                <SelectItem value={FamilyRelationshipType.COUSIN}>Cousin</SelectItem>
                <SelectItem value={FamilyRelationshipType.GUARDIAN}>Guardian</SelectItem>
                <SelectItem value={FamilyRelationshipType.WARD}>Ward</SelectItem>
                <SelectItem value={FamilyRelationshipType.FRIEND}>Friend</SelectItem>
                <SelectItem value={FamilyRelationshipType.EMERGENCY_CONTACT}>Emergency Contact</SelectItem>
                <SelectItem value={FamilyRelationshipType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDeleteConfirm(showDeleteConfirm)}
        title="Delete Family Relationship"
        message="Are you sure you want to remove this family relationship? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={removing}
      />
    </div>
  );
}
