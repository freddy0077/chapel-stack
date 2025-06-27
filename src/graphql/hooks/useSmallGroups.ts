import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_ALL_SMALL_GROUPS, 
  GET_SINGLE_SMALL_GROUP, 
  GET_FILTERED_SMALL_GROUPS 
} from '../queries/groupQueries';
import {
  CREATE_SMALL_GROUP,
  UPDATE_SMALL_GROUP,
  DELETE_SMALL_GROUP,
  ADD_MEMBER_TO_GROUP,
  REMOVE_MEMBER_FROM_GROUP,
  UPDATE_GROUP_MEMBER
} from '../mutations/groupMutations';
import { OrganizationBranchFilterInput } from '../types/filters';

// Define TypeScript interfaces for our data structures
export enum SmallGroupStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum SmallGroupMemberRole {
  LEADER = 'LEADER',
  CO_LEADER = 'CO_LEADER',
  MEMBER = 'MEMBER',
  VISITOR = 'VISITOR'
}

export enum SmallGroupMemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Ministry {
  id: string;
  name: string;
  description?: string;
  type?: string;
  status: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  profileImageUrl?: string | null;
  gender?: string;
  phoneNumber?: string;
  status?: string;
}

export interface SmallGroupMember {
  id: string;
  role: SmallGroupMemberRole;
  joinDate: string;
  status: SmallGroupMemberStatus;
  memberId: string;
  smallGroupId?: string;
  member?: Member; // Add the member property to store detailed member info
  createdAt?: string;
  updatedAt?: string;
}

export interface SmallGroup {
  id: string;
  name: string;
  description?: string;
  type: string;
  meetingSchedule?: string;
  location?: string;
  maximumCapacity?: number;
  status: string;
  branchId?: string;
  organisationId?: string;
  ministryId?: string;
  ministry?: Ministry;
  members?: SmallGroupMember[];
  createdAt: string;
  updatedAt: string;
}

export interface SmallGroupFilterInput extends OrganizationBranchFilterInput {
  type?: string;
  status?: SmallGroupStatus;
  ministryId?: string;
  search?: string;
}

export interface CreateSmallGroupInput {
  name: string;
  description?: string;
  type?: string;
  meetingSchedule?: string;
  location?: string;
  maximumCapacity?: number;
  status?: SmallGroupStatus;
  ministryId?: string;
}

export interface UpdateSmallGroupInput {
  name?: string;
  description?: string;
  type?: string;
  meetingSchedule?: string;
  location?: string;
  maximumCapacity?: number;
  status?: SmallGroupStatus;
  ministryId?: string;
}

export interface AddGroupMemberInput {
  memberId: string;
  smallGroupId: string;
  role?: SmallGroupMemberRole;
  joinDate?: string;
  status?: SmallGroupMemberStatus;
}

export interface UpdateGroupMemberInput {
  role?: SmallGroupMemberRole;
  joinDate?: string;
  status?: SmallGroupMemberStatus;
}

export interface MutationResponse {
  success: boolean;
  message: string;
}

// Custom hook for fetching all small groups
export const useAllSmallGroups = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_SMALL_GROUPS);
  
  return {
    smallGroups: data?.smallGroups || [],
    loading,
    error,
    refetch
  };
};

// Custom hook for fetching a single small group by ID
export const useSmallGroup = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_SINGLE_SMALL_GROUP, {
    variables: { id },
    skip: !id
  });
  
  return {
    smallGroup: data?.smallGroup,
    loading,
    error,
    refetch
  };
};

// Custom hook for fetching filtered small groups
export const useFilteredSmallGroups = (filters: SmallGroupFilterInput, skip: boolean = false) => {
  const { data, loading, error, refetch } = useQuery(GET_FILTERED_SMALL_GROUPS, {
    variables: { filters },
    skip // Allow skipping the query when no valid branchId is available
  });
  
  return {
    smallGroups: data?.smallGroups || [],
    loading,
    error,
    refetch
  };
};

// Custom hook for small group mutations
export const useSmallGroupMutations = () => {
  // Create small group mutation
  const [createSmallGroupMutation] = useMutation(CREATE_SMALL_GROUP);
  // Accept all relevant fields as arguments, not as a nested input object
  const createSmallGroup = async (input: {
    name: string;
    description?: string;
    type: string;
    meetingSchedule?: string;
    location?: string;
    maximumCapacity?: number;
    status: string;
    branchId?: string;
    ministryId?: string;
  }) => {
    try {
      const { data } = await createSmallGroupMutation({
        variables: {
          name: input.name,
          description: input.description,
          type: input.type,
          meetingSchedule: input.meetingSchedule,
          location: input.location,
          maximumCapacity: input.maximumCapacity,
          status: input.status,
          branchId: input.branchId,
          ministryId: input.ministryId
        }
      });
      return data.createSmallGroup;
    } catch (error) {
      console.error('Error creating small group:', error);
      throw error;
    }
  };


  // Update small group mutation
  const [updateSmallGroupMutation] = useMutation(UPDATE_SMALL_GROUP);
  const updateSmallGroup = async (id: string, input: UpdateSmallGroupInput) => {
    try {
      const { data } = await updateSmallGroupMutation({
        variables: { id, input }
      });
      return data.updateSmallGroup;
    } catch (error) {
      console.error('Error updating small group:', error);
      throw error;
    }
  };

  // Delete small group mutation
  const [deleteSmallGroupMutation] = useMutation(DELETE_SMALL_GROUP);
  const deleteSmallGroup = async (id: string) => {
    try {
      const { data } = await deleteSmallGroupMutation({
        variables: { id }
      });
      return data.deleteSmallGroup;
    } catch (error) {
      console.error('Error deleting small group:', error);
      throw error;
    }
  };

  // Add member to group mutation
  const [addMemberToGroupMutation] = useMutation(ADD_MEMBER_TO_GROUP);
  const addMemberToGroup = async (input: AddGroupMemberInput) => {
    try {
      const { data } = await addMemberToGroupMutation({
        variables: { input }
      });
      return data.addGroupMember;
    } catch (error) {
      console.error('Error adding member to group:', error);
      throw error;
    }
  };

  // Remove member from group mutation
  const [removeMemberFromGroupMutation] = useMutation(REMOVE_MEMBER_FROM_GROUP);
  const removeMemberFromGroup = async (id: string) => {
    try {
      const { data } = await removeMemberFromGroupMutation({
        variables: { id }
      });
      return data.removeGroupMember;
    } catch (error) {
      console.error('Error removing member from group:', error);
      throw error;
    }
  };

  // Update group member mutation
  const [updateGroupMemberMutation] = useMutation(UPDATE_GROUP_MEMBER);
  const updateGroupMember = async (id: string, input: UpdateGroupMemberInput) => {
    try {
      const { data } = await updateGroupMemberMutation({
        variables: { id, input }
      });
      return data.updateGroupMember;
    } catch (error) {
      console.error('Error updating group member:', error);
      throw error;
    }
  };

  return {
    createSmallGroup,
    updateSmallGroup,
    deleteSmallGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    updateGroupMember
  };
};
