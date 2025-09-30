import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  CREATE_FAMILY,
  UPDATE_FAMILY,
  REMOVE_FAMILY,
  ADD_MEMBER_TO_FAMILY,
  REMOVE_MEMBER_FROM_FAMILY,
  GET_FAMILIES_LIST,
  GET_FAMILIES_COUNT,
  CreateFamilyInput,
  UpdateFamilyInput,
} from '@/graphql/queries/familyQueries';

export const useFamilyOperations = () => {
  const [createFamilyMutation] = useMutation(CREATE_FAMILY, {
    refetchQueries: [
      { query: GET_FAMILIES_LIST },
      { query: GET_FAMILIES_COUNT },
    ],
    awaitRefetchQueries: true,
  });

  const [updateFamilyMutation] = useMutation(UPDATE_FAMILY, {
    refetchQueries: [
      { query: GET_FAMILIES_LIST },
    ],
    awaitRefetchQueries: true,
  });

  const [removeFamilyMutation] = useMutation(REMOVE_FAMILY, {
    refetchQueries: [
      { query: GET_FAMILIES_LIST },
      { query: GET_FAMILIES_COUNT },
    ],
    awaitRefetchQueries: true,
  });

  const [addMemberToFamilyMutation] = useMutation(ADD_MEMBER_TO_FAMILY, {
    refetchQueries: [
      { query: GET_FAMILIES_LIST },
    ],
    awaitRefetchQueries: true,
  });

  const [removeMemberFromFamilyMutation] = useMutation(REMOVE_MEMBER_FROM_FAMILY, {
    refetchQueries: [
      { query: GET_FAMILIES_LIST },
    ],
    awaitRefetchQueries: true,
  });

  const createFamily = async (input: CreateFamilyInput) => {
    try {
      const result = await createFamilyMutation({
        variables: { createFamilyInput: input },
      });
      toast.success('Family created successfully!');
      return result.data?.createFamily;
    } catch (error: any) {
      toast.error(`Failed to create family: ${error.message}`);
      throw error;
    }
  };

  const updateFamily = async (id: string, input: UpdateFamilyInput) => {
    try {
      const result = await updateFamilyMutation({
        variables: { id, updateFamilyInput: input },
      });
      toast.success('Family updated successfully!');
      return result.data?.updateFamily;
    } catch (error: any) {
      toast.error(`Failed to update family: ${error.message}`);
      throw error;
    }
  };

  const removeFamily = async (id: string) => {
    try {
      await removeFamilyMutation({
        variables: { id },
      });
      toast.success('Family deleted successfully!');
      return true;
    } catch (error: any) {
      toast.error(`Failed to delete family: ${error.message}`);
      throw error;
    }
  };

  const addMemberToFamily = async (familyId: string, memberId: string) => {
    try {
      const result = await addMemberToFamilyMutation({
        variables: { familyId, memberId },
      });
      toast.success('Member added to family successfully!');
      return result.data?.addMemberToFamily;
    } catch (error: any) {
      toast.error(`Failed to add member to family: ${error.message}`);
      throw error;
    }
  };

  const removeMemberFromFamily = async (familyId: string, memberId: string) => {
    try {
      const result = await removeMemberFromFamilyMutation({
        variables: { familyId, memberId },
      });
      toast.success('Member removed from family successfully!');
      return result.data?.removeMemberFromFamily;
    } catch (error: any) {
      toast.error(`Failed to remove member from family: ${error.message}`);
      throw error;
    }
  };

  return {
    createFamily,
    updateFamily,
    removeFamily,
    addMemberToFamily,
    removeMemberFromFamily,
  };
};
