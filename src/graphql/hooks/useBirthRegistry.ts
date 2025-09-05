import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { useState, useCallback } from 'react';
import {
  GET_BIRTH_REGISTERS,
  GET_BIRTH_REGISTER,
  CREATE_BIRTH_REGISTER,
  UPDATE_BIRTH_REGISTER,
  DELETE_BIRTH_REGISTER,
  UPLOAD_BIRTH_DOCUMENT,
  SCHEDULE_BAPTISM,
  GET_BIRTH_REGISTER_STATS,
  GET_BIRTH_CALENDAR,
  SEARCH_MEMBERS_FOR_PARENTS,
  BirthRegister,
  CreateBirthRegistryInput,
  UpdateBirthRegistryInput,
  UploadDocumentInput,
  ScheduleBaptismInput,
  BirthRegisterStats,
  BirthCalendarEntry,
  BirthRegistryCalendarEntry,
  ParentMember,
} from '../queries/birthQueries';

// Hook to get birth registers for an organization/branch
export const useBirthRegisters = (
  organisationId: string,
  branchId?: string,
  filters?: {
    skip?: number;
    take?: number;
    dateFrom?: string;
    dateTo?: string;
    baptismPlanned?: boolean;
    search?: string;
    gender?: string;
    placeOfBirth?: string;
  }
) => {
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_BIRTH_REGISTERS, {
    variables: {
      organisationId,
      branchId,
      filters,
    },
    skip: !organisationId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  return {
    birthRegisters: (data?.birthRegistries || []) as BirthRegister[],
    loading,
    error,
    refetch,
    fetchMore,
  };
};

// Hook to get a single birth register by ID
export const useBirthRegister = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_BIRTH_REGISTER, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
  });

  return {
    birthRegister: data?.birthRegistry as BirthRegister | undefined,
    loading,
    error,
    refetch,
  };
};

// Hook to create birth register
export const useCreateBirthRegister = () => {
  const [createBirthRegister, { loading, error }] = useMutation(CREATE_BIRTH_REGISTER);
  const client = useApolloClient();

  const create = async (input: CreateBirthRegistryInput) => {
    try {
      const result = await createBirthRegister({
        variables: { createBirthRegistryInput: input },
      });

      // Refetch birth registers and statistics
      await client.refetchQueries({
        include: [GET_BIRTH_REGISTERS, GET_BIRTH_REGISTER_STATS],
      });

      return result.data?.createBirthRegistry;
    } catch (err) {
      console.error('Error creating birth register:', err);
      throw err;
    }
  };

  return {
    create,
    loading,
    error,
  };
};

// Hook to update birth register
export const useUpdateBirthRegister = () => {
  const [updateBirthRegister, { loading, error }] = useMutation(UPDATE_BIRTH_REGISTER);
  const client = useApolloClient();

  const update = async (id: string, input: UpdateBirthRegistryInput) => {
    try {
      const result = await updateBirthRegister({
        variables: { id, updateBirthRegistryInput: input },
      });

      // Refetch birth registers and statistics
      await client.refetchQueries({
        include: [GET_BIRTH_REGISTERS, GET_BIRTH_REGISTER, GET_BIRTH_REGISTER_STATS],
      });

      return result.data?.updateBirthRegistry;
    } catch (err) {
      console.error('Error updating birth register:', err);
      throw err;
    }
  };

  return {
    update,
    loading,
    error,
  };
};

// Hook to delete birth register
export const useDeleteBirthRegister = () => {
  const [deleteBirthRegister, { loading, error }] = useMutation(DELETE_BIRTH_REGISTER);
  const client = useApolloClient();

  const deleteRecord = async (id: string) => {
    try {
      const result = await deleteBirthRegister({
        variables: { id },
      });

      // Refetch birth registers and statistics
      await client.refetchQueries({
        include: [GET_BIRTH_REGISTERS, GET_BIRTH_REGISTER_STATS],
      });

      return result.data?.removeBirthRegistry;
    } catch (err) {
      console.error('Error deleting birth register:', err);
      throw err;
    }
  };

  return {
    deleteRecord,
    loading,
    error,
  };
};

// Hook to upload birth documents
export const useUploadBirthDocument = () => {
  const [uploadDocument, { loading, error }] = useMutation(UPLOAD_BIRTH_DOCUMENT);
  const client = useApolloClient();

  const upload = async (input: UploadDocumentInput) => {
    try {
      const result = await uploadDocument({
        variables: { uploadDocumentInput: input },
      });

      // Refetch the specific birth register
      await client.refetchQueries({
        include: [GET_BIRTH_REGISTER],
      });

      return result.data?.uploadBirthRegistryDocument;
    } catch (err) {
      console.error('Error uploading birth document:', err);
      throw err;
    }
  };

  return {
    upload,
    loading,
    error,
  };
};

// Hook to schedule baptism
export const useScheduleBaptism = () => {
  const [scheduleBaptism, { loading, error }] = useMutation(SCHEDULE_BAPTISM);
  const client = useApolloClient();

  const schedule = async (input: ScheduleBaptismInput) => {
    try {
      const result = await scheduleBaptism({
        variables: input,
      });

      // Refetch birth registers and statistics
      await client.refetchQueries({
        include: [GET_BIRTH_REGISTERS, GET_BIRTH_REGISTER, GET_BIRTH_REGISTER_STATS],
      });

      return result.data?.scheduleBaptism;
    } catch (err) {
      console.error('Error scheduling baptism:', err);
      throw err;
    }
  };

  return {
    schedule,
    loading,
    error,
  };
};

// Hook to get birth register statistics
export const useBirthRegisterStats = (
  organisationId: string,
  branchId?: string
) => {
  const { data, loading, error, refetch } = useQuery(GET_BIRTH_REGISTER_STATS, {
    variables: {
      organisationId,
      branchId,
    },
    skip: !organisationId,
    errorPolicy: 'all',
    pollInterval: 60000, // Refresh every minute
  });

  return {
    stats: data?.birthRegistryStatistics as BirthRegisterStats | undefined,
    loading,
    error,
    refetch,
  };
};

// Hook to get birth calendar
export const useBirthCalendar = (
  organisationId: string,
  branchId?: string,
  month?: number,
  year?: number
) => {
  const { data, loading, error, refetch } = useQuery(GET_BIRTH_CALENDAR, {
    variables: {
      organisationId,
      branchId,
      month,
      year,
    },
    skip: !organisationId,
    errorPolicy: 'all',
  });

  return {
    calendar: (data?.birthRegistryCalendar || []) as BirthRegistryCalendarEntry[],
    loading,
    error,
    refetch,
  };
};

// Hook to search members for parent selection
export const useSearchMembersForParents = (
  organisationId: string,
  branchId: string
) => {
  const [searchMembers, { data, loading, error }] = useLazyQuery(SEARCH_MEMBERS_FOR_PARENTS);
  const [members, setMembers] = useState<ParentMember[]>([]);

  const search = useCallback(async (searchTerm: string, skip = 0, take = 10) => {
    if (!searchTerm.trim()) {
      setMembers([]);
      return;
    }

    try {
      const result = await searchMembers({
        variables: {
          organisationId,
          branchId,
          query: searchTerm,
          skip,
          take,
        },
      });

      const foundMembers = result.data?.searchMembersForParents || [];
      setMembers(foundMembers);
    } catch (err) {
      console.error('Error searching members for parents:', err);
      setMembers([]);
    }
  }, [searchMembers, organisationId, branchId]);

  const clearSearch = useCallback(() => {
    setMembers([]);
  }, []);

  return {
    search,
    clearSearch,
    members,
    loading,
    error,
  };
};

// Utility functions for birth registry
export const getBirthRegisterDisplayName = (birthRegister: BirthRegister): string => {
  const { childFirstName, childMiddleName, childLastName } = birthRegister;
  return `${childFirstName}${childMiddleName ? ` ${childMiddleName}` : ''} ${childLastName}`;
};

export const getParentDisplayName = (
  firstName?: string,
  lastName?: string,
  middleName?: string
): string => {
  if (!firstName || !lastName) return 'Unknown';
  return `${firstName}${middleName ? ` ${middleName}` : ''} ${lastName}`;
};

export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const calculateAgeInDays = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatBirthWeight = (weightInGrams?: number): string => {
  if (!weightInGrams) return 'Not recorded';
  const kg = weightInGrams / 1000;
  const lbs = weightInGrams * 0.00220462;
  return `${kg.toFixed(2)} kg (${lbs.toFixed(2)} lbs)`;
};

export const formatBirthLength = (lengthInCm?: number): string => {
  if (!lengthInCm) return 'Not recorded';
  const inches = lengthInCm * 0.393701;
  return `${lengthInCm} cm (${inches.toFixed(1)} inches)`;
};

export const getGenderIcon = (gender: string): string => {
  switch (gender.toUpperCase()) {
    case 'MALE':
      return '👦';
    case 'FEMALE':
      return '👧';
    default:
      return '👶';
  }
};

export const getGenderColor = (gender: string): string => {
  switch (gender.toUpperCase()) {
    case 'MALE':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'FEMALE':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getBaptismStatusColor = (baptismPlanned: boolean, baptismDate?: string): string => {
  if (!baptismPlanned) {
    return 'bg-gray-100 text-gray-800 border-gray-200';
  }
  
  if (baptismDate) {
    const baptismDateTime = new Date(baptismDate);
    const today = new Date();
    
    if (baptismDateTime < today) {
      return 'bg-green-100 text-green-800 border-green-200'; // Completed
    } else {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Scheduled
    }
  }
  
  return 'bg-blue-100 text-blue-800 border-blue-200'; // Planned but not scheduled
};

export const getBaptismStatusText = (baptismPlanned: boolean, baptismDate?: string): string => {
  if (!baptismPlanned) {
    return 'Not Planned';
  }
  
  if (baptismDate) {
    const baptismDateTime = new Date(baptismDate);
    const today = new Date();
    
    if (baptismDateTime < today) {
      return 'Completed';
    } else {
      return 'Scheduled';
    }
  }
  
  return 'Planned';
};
