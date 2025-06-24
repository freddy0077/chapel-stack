import { useQuery } from '@apollo/client';
import { GET_PERMISSIONS_GROUPED_BY_SUBJECT } from '../queries/permissionQueries';

export const usePermissionsGroupedBySubject = () => {
  const { data, loading, error } = useQuery(GET_PERMISSIONS_GROUPED_BY_SUBJECT);
  // data.permissionsGroupedBySubject is Permission[][]
  return {
    grouped: data?.permissionsGroupedBySubject || [],
    loading,
    error,
  };
};
