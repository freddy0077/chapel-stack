import { useQuery } from '@apollo/client';
import { GET_RECIPIENT_GROUPS } from '../queries/recipientQueries';

export function useRecipientGroups() {
  const { data, loading, error } = useQuery(GET_RECIPIENT_GROUPS);
  return {
    groups: data?.recipientGroups || [],
    loading,
    error,
  };
}
