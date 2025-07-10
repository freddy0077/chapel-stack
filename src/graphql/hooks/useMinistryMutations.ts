import { useMutation } from '@apollo/client';
import { ADD_MEMBER_TO_MINISTRY } from '../mutations/ministryMutations';
import { GET_MEMBER } from '../queries/memberQueries';

export function useMinistryMutations() {
  const [addMemberToMinistryMutation, { loading, error, data }] = useMutation(ADD_MEMBER_TO_MINISTRY);

  const addMemberToMinistry = async ({ memberId, ministryId, role, joinDate }: { memberId: string; ministryId: string; role?: string; joinDate?: string }) => {
    const result = await addMemberToMinistryMutation({
      variables: { memberId, ministryId, role, joinDate },
      refetchQueries: [
        {
          query: GET_MEMBER,
          variables: { memberId },
        },
      ],
    });
    return result.data?.addMemberToMinistry;
  };

  return {
    addMemberToMinistry,
    loading,
    error,
    data,
  };
}
