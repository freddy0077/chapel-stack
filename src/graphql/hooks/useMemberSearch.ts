import { useLazyQuery } from '@apollo/client';
import { MEMBER_SEARCH } from '../queries/recipientQueries';

export function useMemberSearch() {
  const [searchMembers, { data, loading, error }] = useLazyQuery(MEMBER_SEARCH);
  return {
    members: data?.memberSearch || [],
    searchMembers,
    loading,
    error,
  };
}
