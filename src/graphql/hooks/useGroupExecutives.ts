import { useQuery, useMutation } from "@apollo/client";
import {
  GET_GROUP_EXECUTIVES,
  GET_GROUP_EXECUTIVE,
} from "../queries/groupExecutiveQueries";
import {
  CREATE_GROUP_EXECUTIVE,
  UPDATE_GROUP_EXECUTIVE,
  REMOVE_GROUP_EXECUTIVE,
} from "../mutations/groupExecutiveMutations";
import { GroupExecutive, GroupExecutiveRole } from "./useSmallGroups";

export interface CreateGroupExecutiveInput {
  role: GroupExecutiveRole;
  memberId: string;
  ministryId?: string;
  smallGroupId?: string;
}

export interface UpdateGroupExecutiveInput {
  role?: GroupExecutiveRole;
  status?: string;
}

export interface GroupExecutiveFilterInput {
  id?: string;
  role?: GroupExecutiveRole;
  status?: string;
  memberId?: string;
  ministryId?: string;
  smallGroupId?: string;
}

// Custom hook for fetching all group executives
export const useGroupExecutives = (filters?: GroupExecutiveFilterInput) => {
  const { data, loading, error, refetch } = useQuery(GET_GROUP_EXECUTIVES, {
    variables: { filters },
    skip: !filters,
  });

  return {
    executives: (data?.groupExecutives || []) as GroupExecutive[],
    loading,
    error,
    refetch,
  };
};

// Custom hook for fetching a single group executive
export const useGroupExecutive = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_GROUP_EXECUTIVE, {
    variables: { id },
    skip: !id,
  });

  return {
    executive: data?.groupExecutive as GroupExecutive | undefined,
    loading,
    error,
    refetch,
  };
};

// Custom hook for group executive mutations
export const useGroupExecutiveMutations = () => {
  const [createGroupExecutiveMutation] = useMutation(CREATE_GROUP_EXECUTIVE);
  const [updateGroupExecutiveMutation] = useMutation(UPDATE_GROUP_EXECUTIVE);
  const [removeGroupExecutiveMutation] = useMutation(REMOVE_GROUP_EXECUTIVE);

  const createGroupExecutive = async (input: CreateGroupExecutiveInput) => {
    try {
      const { data } = await createGroupExecutiveMutation({
        variables: { input },
      });
      return data.createGroupExecutive;
    } catch (error) {
      console.error("Error creating group executive:", error);
      throw error;
    }
  };

  const updateGroupExecutive = async (
    id: string,
    input: UpdateGroupExecutiveInput,
  ) => {
    try {
      const { data } = await updateGroupExecutiveMutation({
        variables: { id, input },
      });
      return data.updateGroupExecutive;
    } catch (error) {
      console.error("Error updating group executive:", error);
      throw error;
    }
  };

  const removeGroupExecutive = async (id: string) => {
    try {
      const { data } = await removeGroupExecutiveMutation({
        variables: { id },
      });
      return data.removeGroupExecutive;
    } catch (error) {
      console.error("Error removing group executive:", error);
      throw error;
    }
  };

  return {
    createGroupExecutive,
    updateGroupExecutive,
    removeGroupExecutive,
  };
};
