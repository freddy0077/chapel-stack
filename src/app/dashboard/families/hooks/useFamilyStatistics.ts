import { useQuery } from '@apollo/client';
import { GET_FAMILIES_COUNT, GET_FAMILIES_LIST } from '@/graphql/queries/familyQueries';

interface FamilyStatistics {
  totalFamilies: number;
  averageFamilySize: number;
  recentFamilies: number;
  totalMembers: number;
  loading: boolean;
  error: any;
}

export const useFamilyStatistics = (): FamilyStatistics => {
  const {
    data: countData,
    loading: countLoading,
    error: countError,
  } = useQuery(GET_FAMILIES_COUNT, {
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: familiesData,
    loading: familiesLoading,
    error: familiesError,
  } = useQuery(GET_FAMILIES_LIST, {
    variables: { skip: 0, take: 100 }, // Get recent families for statistics
    fetchPolicy: 'cache-and-network',
  });

  const families = familiesData?.families || [];
  const totalFamilies = countData?.familiesCount || 0;
  
  // Calculate statistics
  const totalMembers = families.reduce((sum, family) => sum + (family.members?.length || 0), 0);
  const averageFamilySize = totalFamilies > 0 ? totalMembers / totalFamilies : 0;
  
  // Count families created in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentFamilies = families.filter(family => 
    new Date(family.createdAt) > thirtyDaysAgo
  ).length;

  return {
    totalFamilies,
    averageFamilySize: Math.round(averageFamilySize * 10) / 10, // Round to 1 decimal
    recentFamilies,
    totalMembers,
    loading: countLoading || familiesLoading,
    error: countError || familiesError,
  };
};
