import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { useState, useCallback } from 'react';
import {
  GET_FAMILY_RELATIONSHIPS,
  CREATE_FAMILY_RELATIONSHIP,
  UPDATE_FAMILY_RELATIONSHIP,
  REMOVE_FAMILY_RELATIONSHIP,
  SEARCH_MEMBERS_FOR_FAMILY,
  FamilyRelationship,
  CreateFamilyRelationshipInput,
  UpdateFamilyRelationshipInput,
  FamilyMember,
} from '../queries/familyQueries';

// Hook to get family relationships for a member
export const useFamilyRelationships = (memberId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_FAMILY_RELATIONSHIPS, {
    variables: { memberId },
    skip: !memberId,
    errorPolicy: 'all',
  });

  // Filter out relationships where the member would be showing themselves
  // This can happen when the backend returns both directions of reciprocal relationships
  const filteredRelationships = (data?.familyRelationshipsByMember || []).filter((relationship: FamilyRelationship) => {
    // Only show relationships where the relatedMember is different from the current member
    return relationship.relatedMember.id !== memberId;
  });

  return {
    relationships: filteredRelationships as FamilyRelationship[],
    loading,
    error,
    refetch,
  };
};

// Hook to create family relationship
export const useCreateFamilyRelationship = () => {
  const [createRelationship, { loading, error }] = useMutation(CREATE_FAMILY_RELATIONSHIP);
  const client = useApolloClient();

  const create = async (input: CreateFamilyRelationshipInput) => {
    try {
      const result = await createRelationship({
        variables: { createFamilyRelationshipInput: input },
      });

      // Refetch family relationships for both members
      await client.refetchQueries({
        include: [GET_FAMILY_RELATIONSHIPS],
      });

      return result.data?.createFamilyRelationship;
    } catch (err) {
      console.error('Error creating family relationship:', err);
      throw err;
    }
  };

  return {
    create,
    loading,
    error,
  };
};

// Hook to update family relationship
export const useUpdateFamilyRelationship = () => {
  const [updateRelationship, { loading, error }] = useMutation(UPDATE_FAMILY_RELATIONSHIP);
  const client = useApolloClient();

  const update = async (id: string, input: UpdateFamilyRelationshipInput) => {
    try {
      const result = await updateRelationship({
        variables: { id, updateFamilyRelationshipInput: input },
      });

      // Refetch family relationships
      await client.refetchQueries({
        include: [GET_FAMILY_RELATIONSHIPS],
      });

      return result.data?.updateFamilyRelationship;
    } catch (err) {
      console.error('Error updating family relationship:', err);
      throw err;
    }
  };

  return {
    update,
    loading,
    error,
  };
};

// Hook to remove family relationship
export const useRemoveFamilyRelationship = () => {
  const [removeRelationship, { loading, error }] = useMutation(REMOVE_FAMILY_RELATIONSHIP);
  const client = useApolloClient();

  const remove = async (id: string) => {
    try {
      const result = await removeRelationship({
        variables: { id },
      });

      // Refetch family relationships
      await client.refetchQueries({
        include: [GET_FAMILY_RELATIONSHIPS],
      });

      return result.data?.removeFamilyRelationship;
    } catch (err) {
      console.error('Error removing family relationship:', err);
      throw err;
    }
  };

  return {
    remove,
    loading,
    error,
  };
};

// Hook to search members for family relationships
export const useSearchMembersForFamily = () => {
  const [searchMembers, { loading, error }] = useLazyQuery(SEARCH_MEMBERS_FOR_FAMILY);
  const [members, setMembers] = useState<FamilyMember[]>([]);

  const search = useCallback(async (searchTerm: string, excludeMemberId: string) => {
    if (!searchTerm.trim()) {
      setMembers([]);
      return;
    }

    try {
      const result = await searchMembers({
        variables: { query: searchTerm },
      });

      const foundMembers = result.data?.searchMembers || [];
      // Filter out the excluded member client-side
      const filteredMembers = foundMembers.filter((member: FamilyMember) => member.id !== excludeMemberId);
      setMembers(filteredMembers);
    } catch (err) {
      console.error('Error searching members:', err);
      setMembers([]);
    }
  }, [searchMembers]);

  const clearSearch = useCallback(() => {
    setMembers([]);
  }, []);

  return {
    search,
    clearSearch,
    members,
    loading,
    error,
  };
};

// Utility functions
export const getRelationshipDisplayName = (relationshipType: string): string => {
  switch (relationshipType) {
    case 'SPOUSE':
      return 'Spouse';
    case 'PARENT':
      return 'Parent';
    case 'CHILD':
      return 'Child';
    case 'SIBLING':
      return 'Sibling';
    case 'GRANDPARENT':
      return 'Grandparent';
    case 'GRANDCHILD':
      return 'Grandchild';
    case 'OTHER':
      return 'Other';
    default:
      return relationshipType;
  }
};

export const getRelationshipColor = (relationshipType: string): string => {
  switch (relationshipType) {
    case 'SPOUSE':
      return 'bg-pink-100 text-pink-800';
    case 'PARENT':
      return 'bg-blue-100 text-blue-800';
    case 'CHILD':
      return 'bg-green-100 text-green-800';
    case 'SIBLING':
      return 'bg-purple-100 text-purple-800';
    case 'GRANDPARENT':
      return 'bg-indigo-100 text-indigo-800';
    case 'GRANDCHILD':
      return 'bg-yellow-100 text-yellow-800';
    case 'OTHER':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
