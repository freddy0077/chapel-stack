import { useLazyQuery } from '@apollo/client';
import { BIRTHDAY_MEMBERS } from '../queries/recipientQueries';

export function useBirthdayMembers() {
  const [fetchBirthdays, { data, loading, error }] = useLazyQuery(BIRTHDAY_MEMBERS);
  return {
    members: data?.birthdayMembers || [],
    fetchBirthdays,
    loading,
    error,
  };
}
