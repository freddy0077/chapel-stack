import React, { useState, useEffect, useCallback } from 'react';
import { UsersIcon, HeartIcon, UserGroupIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Member } from '../../types/member.types';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_MEMBERS_ENHANCED } from '../../../../../graphql/queries/memberQueries';
import { useOrganisationBranch } from '../../../../../hooks/useOrganisationBranch';
import { useMemberRelationships } from '../../hooks/useMemberOperations';

// Simple debounce utility function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

interface FamilyRelationshipsSectionProps {
  member: Member;
}

interface FamilyRelationship {
  id: string;
  relatedMemberId: string;
  relationshipType: string;
  relatedMember: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
  };
  isEmergencyContact: boolean;
  createdAt: string;
}

interface AddFamilyRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (relationship: Omit<FamilyRelationship, 'id' | 'createdAt'>) => void;
  memberId: string;
}

const AddFamilyRelationshipModal: React.FC<AddFamilyRelationshipModalProps> = ({ isOpen, onClose, onAdd, memberId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<FamilyRelationship['relatedMember'] | null>(null);
  const [relationshipType, setRelationshipType] = useState('');
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  const [searchResults, setSearchResults] = useState<FamilyRelationship['relatedMember'][]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { organisationId, branchId } = useOrganisationBranch();
  const { createRelationship, loading: relationshipLoading } = useMemberRelationships();
  
  const [searchMembers, { data, loading, error }] = useLazyQuery(SEARCH_MEMBERS_ENHANCED, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore'
  });

  // Debounced search function to prevent infinite loops
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        await searchMembers({
          variables: {
            query: term.trim(),
            branchId,
            skip: 0,
            take: 10
          }
        });
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [searchMembers, branchId]
  );

  // Handle search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim().length >= 2) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Update search results when data changes
  useEffect(() => {
    if (data?.searchMembers) {
      // Filter out the current member to prevent self-relationships
      const filteredResults = data.searchMembers
        .filter((member: any) => member.id !== memberId)
        .map((member: any) => ({
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phoneNumber: member.phoneNumber,
          profileImageUrl: member.profileImageUrl
        }));
      setSearchResults(filteredResults);
    }
  }, [data, memberId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedMember(null);
      setRelationshipType('');
      setIsEmergencyContact(false);
      setSearchResults([]);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !relationshipType) return;

    setIsSubmitting(true);
    try {
      const newRelationship = await createRelationship({
        memberId: memberId,
        relatedMemberId: selectedMember.id,
        relationshipType,
        isEmergencyContact,
      });
      onAdd({
        relatedMemberId: selectedMember.id,
        relationshipType,
        relatedMember: selectedMember,
        isEmergencyContact
      });
    } catch (error) {
      console.error('Error adding relationship:', error);
    } finally {
      setIsSubmitting(false);
    }

    // Reset form
    setSelectedMember(null);
    setRelationshipType('');
    setIsEmergencyContact(false);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Family Relationship</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Member Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Member
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by name or email..."
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              
              {/* Selected Member Display */}
              {selectedMember && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center gap-3">
                    {selectedMember.profileImageUrl ? (
                      <img 
                        src={selectedMember.profileImageUrl} 
                        alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">
                          {selectedMember.firstName.charAt(0)}{selectedMember.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedMember.firstName} {selectedMember.lastName}
                      </p>
                      {selectedMember.email && (
                        <p className="text-sm text-gray-600">{selectedMember.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Search Results */}
              {!selectedMember && searchResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                  {searchResults.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        setSelectedMember(member);
                        setSearchTerm(`${member.firstName} ${member.lastName}`);
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                    >
                      {member.profileImageUrl ? (
                        <img 
                          src={member.profileImageUrl} 
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-medium">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        {member.email && (
                          <p className="text-sm text-gray-600">{member.email}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* No Results Message */}
              {!isSearching && searchTerm.length >= 2 && searchResults.length === 0 && !selectedMember && (
                <div className="mt-2 p-3 text-center text-gray-500 text-sm">
                  No members found matching "{searchTerm}"
                </div>
              )}
            </div>

            {/* Relationship Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship Type
              </label>
              <select
                value={relationshipType}
                onChange={(e) => setRelationshipType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select relationship...</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="sibling">Sibling</option>
                <option value="grandparent">Grandparent</option>
                <option value="grandchild">Grandchild</option>
                <option value="uncle">Uncle</option>
                <option value="aunt">Aunt</option>
                <option value="cousin">Cousin</option>
                <option value="guardian">Guardian</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Emergency Contact */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emergencyContact"
                checked={isEmergencyContact}
                onChange={(e) => setIsEmergencyContact(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emergencyContact" className="text-sm text-gray-700">
                Mark as emergency contact
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedMember || !relationshipType || isSubmitting || relationshipLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting || relationshipLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Add Relationship'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FamilyRelationshipsSection: React.FC<FamilyRelationshipsSectionProps> = ({ member }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { addMemberRelationship } = useMemberRelationships();
  const [familyRelationships, setFamilyRelationships] = useState<FamilyRelationship[]>([]);

  const getRelationshipIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'spouse':
        return <HeartIcon className="h-4 w-4 text-pink-500" />;
      case 'parent':
      case 'father':
      case 'mother':
        return <UsersIcon className="h-4 w-4 text-blue-500" />;
      case 'child':
      case 'son':
      case 'daughter':
        return <UserGroupIcon className="h-4 w-4 text-green-500" />;
      case 'sibling':
      case 'brother':
      case 'sister':
        return <UsersIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <UsersIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRelationshipColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'spouse':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'parent':
      case 'father':
      case 'mother':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'child':
      case 'son':
      case 'daughter':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'sibling':
      case 'brother':
      case 'sister':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatRelationshipType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const handleAddRelationship = async (relationship: Omit<FamilyRelationship, 'id' | 'createdAt'>) => {
    try {
      // Convert relationship type to uppercase enum format
      const relationshipTypeUpper = relationship.relationshipType.toUpperCase() as any;
      
      const newRelationship = await addMemberRelationship({
        primaryMemberId: member.id,
        relatedMemberId: relationship.relatedMemberId,
        relationshipType: relationshipTypeUpper,
        isEmergencyContact: relationship.isEmergencyContact,
      });
      setFamilyRelationships([...familyRelationships, newRelationship]);
    } catch (error) {
      console.error('Error adding relationship:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <UserGroupIcon className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Family Relationships</h3>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="ml-auto flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Relationship
        </button>
      </div>

      {familyRelationships.length > 0 ? (
        <div className="space-y-4">
          {familyRelationships.map((relationship) => (
            <div
              key={relationship.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="relative">
                  {relationship.relatedMember.profileImageUrl ? (
                    <img
                      src={relationship.relatedMember.profileImageUrl}
                      alt={`${relationship.relatedMember.firstName} ${relationship.relatedMember.lastName}`}
                      className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                      {relationship.relatedMember.firstName.charAt(0)}
                      {relationship.relatedMember.lastName.charAt(0)}
                    </div>
                  )}
                  {relationship.isEmergencyContact && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {relationship.relatedMember.firstName} {relationship.relatedMember.lastName}
                    </h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRelationshipColor(relationship.relationshipType)}`}>
                      {getRelationshipIcon(relationship.relationshipType)}
                      {formatRelationshipType(relationship.relationshipType)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {relationship.relatedMember.email && (
                      <a
                        href={`mailto:${relationship.relatedMember.email}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {relationship.relatedMember.email}
                      </a>
                    )}
                    {relationship.relatedMember.phoneNumber && (
                      <a
                        href={`tel:${relationship.relatedMember.phoneNumber}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {relationship.relatedMember.phoneNumber}
                      </a>
                    )}
                  </div>
                  
                  {relationship.isEmergencyContact && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Emergency Contact
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Relationship Date */}
              <div className="text-xs text-gray-500">
                Added {new Date(relationship.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No family relationships recorded</p>
          <p className="text-gray-400 text-xs mt-1">
            Family connections will appear here when added
          </p>
        </div>
      )}

      {/* Family Summary */}
      {member.familyId && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Family ID:</span>
            <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
              {member.familyId}
            </span>
          </div>
          {member.headOfHousehold && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Household Status:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Head of Household
              </span>
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddFamilyRelationshipModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRelationship}
          memberId={member.id}
        />
      )}
    </div>
  );
};

export default FamilyRelationshipsSection;
