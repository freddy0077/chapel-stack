import { useMutation } from '@apollo/client';
import { CREATE_MEMBER } from '../graphql/queries/memberQueries';
import { toast } from 'sonner';

export const useCreateMember = () => {
  const [createMember, { data, loading, error }] = useMutation(CREATE_MEMBER, {
    onCompleted: (data) => {
      toast.success(`Member ${data.createMember.firstName} ${data.createMember.lastName} created successfully!`);
      // Here you might want to refetch queries to update the members list
      // e.g., refetchQueries: [{ query: GET_MEMBERS_LIST }]
    },
    onError: (error) => {
      toast.error(`Error creating member: ${error.message}`);
    },
  });

  return { createMember, data, loading, error };
};
