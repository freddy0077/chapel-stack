'use client';

import { useCallback, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ME_QUERY, USERS_QUERY, USER_QUERY, MY_SESSIONS_QUERY, MY_PERMISSIONS_QUERY } from '../queries/user';

export function useUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user (me) query
  const { 
    data: meData, 
    loading: meLoading, 
    error: meError,
    refetch: refetchMe 
  } = useQuery(ME_QUERY, {
    fetchPolicy: 'network-only', // Don't use cache for this query
  });
  
  // Get users query - only for admins
  const { 
    data: usersData, 
    loading: usersLoading, 
    error: usersError,
    refetch: refetchUsers
  } = useQuery(USERS_QUERY, {
    skip: !isAdmin(), // Only run this query for admin users
  });
  
  // Get sessions query
  const {
    data: sessionsData,
    loading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions
  } = useQuery(MY_SESSIONS_QUERY);
  
  // Get permissions query
  const {
    data: permissionsData,
    loading: permissionsLoading,
    error: permissionsError,
    refetch: refetchPermissions
  } = useQuery(MY_PERMISSIONS_QUERY);
  
  // Check if current user is admin
  function isAdmin() {
    if (typeof window === 'undefined') return false;
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return false;
      
      const user = JSON.parse(userStr);
      return user.role === 'ADMIN';
    } catch {
      return false;
    }
  }
  
  // Get a specific user by ID (admin only)
  const getUser = useCallback(async (id: string) => {
    if (!isAdmin()) {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }
    
    try {
      const { data } = await refetchMe({ id });
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [refetchMe]);

  return {
    currentUser: meData?.me,
    users: usersData?.users || [],
    sessions: sessionsData?.mySessions || [],
    permissions: permissionsData?.myPermissions || [],
    isAdmin: isAdmin(),
    loading: meLoading || usersLoading || sessionsLoading || permissionsLoading,
    refetchUsers,
    refetchMe,
    refetchSessions,
    refetchPermissions,
    getUser
  };
}
