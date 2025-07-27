import { useQuery, useMutation } from '@apollo/client';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import {
  GET_PASTORAL_CARE_STATS,
  GET_PASTORAL_CARE_DASHBOARD,
  GET_PASTORAL_CARE_RECENT_ACTIVITY,
  GET_CARE_REQUESTS,
  GET_CARE_REQUEST,
  GET_CARE_REQUESTS_COUNT,
  GET_MY_CARE_REQUESTS,
  GET_PASTOR_CARE_REQUESTS,
  GET_OVERDUE_CARE_REQUESTS,
  GET_PASTORAL_VISITS,
  GET_COUNSELING_SESSIONS,
  GET_FOLLOW_UP_REMINDERS,
  CREATE_CARE_REQUEST,
  UPDATE_CARE_REQUEST,
  DELETE_CARE_REQUEST,
  CREATE_PASTORAL_VISIT,
  UPDATE_PASTORAL_VISIT,
  CREATE_COUNSELING_SESSION,
  UPDATE_COUNSELING_SESSION,
  CREATE_FOLLOW_UP_REMINDER,
  UPDATE_FOLLOW_UP_REMINDER,
} from '../queries/pastoralCareQueries';

// Types based on actual backend schema
export interface PastoralCareStats {
  totalVisits: number;
  completedVisits: number;
  upcomingVisits: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  totalCareRequests: number;
  openCareRequests: number;
  resolvedCareRequests: number;
  totalReminders: number;
  pendingReminders: number;
  overdueReminders: number;
}

export interface PastoralCareActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  memberName?: string;
  pastorName?: string;
}

export interface CareRequest {
  id: string;
  title: string;
  description: string;
  requestType: string;
  priority: string;
  requestDate: string;
  assignedPastorId?: string;
  notes?: string;
  status: string;
  completionDate?: string;
  memberId: string;
  requesterId: string;
  organisationId: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PastoralVisit {
  id: string;
  title: string;
  description: string;
  visitType: string;
  scheduledDate: string;
  completedDate?: string;
  status: string;
  notes?: string;
  memberId: string;
  pastorId: string;
  organisationId: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CounselingSession {
  id: string;
  title: string;
  description: string;
  sessionType: string;
  scheduledDate: string;
  completedDate?: string;
  status: string;
  notes?: string;
  memberId: string;
  counselorId: string;
  organisationId: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpReminder {
  id: string;
  title: string;
  description: string;
  reminderType: string;
  scheduledDate: string;
  completedDate?: string;
  status: string;
  notes?: string;
  relatedEntityType: string;
  relatedEntityId: string;
  assignedToId: string;
  organisationId: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Filter interfaces
export interface CareRequestFilterInput {
  memberId?: string;
  assignedPastorId?: string;
  requestType?: string;
  priority?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  organisationId: string;
  branchId?: string;
}

export interface PastoralVisitFilterInput {
  memberId?: string;
  pastorId?: string;
  visitType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  organisationId: string;
  branchId?: string;
}

export interface CounselingSessionFilterInput {
  memberId?: string;
  counselorId?: string;
  sessionType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  organisationId: string;
  branchId?: string;
}

export interface FollowUpReminderFilterInput {
  assignedToId?: string;
  reminderType?: string;
  status?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  startDate?: string;
  endDate?: string;
  organisationId: string;
  branchId?: string;
}

// Input interfaces for mutations
export interface CreateCareRequestInput {
  memberId: string;
  title: string;
  requestType: string;
  priority?: string;
  description: string;
  requestDate: string;
  assignedPastorId?: string;
  notes?: string;
  status?: string;
  organisationId: string;
  branchId?: string;
}

export interface UpdateCareRequestInput {
  id: string;
  memberId?: string;
  requestType?: string;
  priority?: string;
  description?: string;
  assignedPastorId?: string;
  notes?: string;
  status?: string;
  completionDate?: string;
}

// Hooks

// Get pastoral care statistics
export function usePastoralCareStats() {
  const { data, loading, error } = useQuery(GET_PASTORAL_CARE_STATS);
  
  return {
    stats: data?.pastoralCareStats as PastoralCareStats | undefined,
    loading,
    error,
  };
}

// Get pastoral care dashboard
export function usePastoralCareDashboard() {
  const { data, loading, error } = useQuery(GET_PASTORAL_CARE_DASHBOARD);
  
  return {
    dashboard: data?.pastoralCareDashboard,
    loading,
    error,
  };
}

// Get recent pastoral care activity
export function usePastoralCareRecentActivity(days: number = 7) {
  const { data, loading, error } = useQuery(GET_PASTORAL_CARE_RECENT_ACTIVITY, {
    variables: { days },
  });
  
  return {
    activity: data?.pastoralCareRecentActivity as PastoralCareActivity[] | undefined,
    loading,
    error,
  };
}

// Get care requests with filtering
export function useCareRequests(filter?: Partial<CareRequestFilterInput>, skip?: number, take?: number) {
  const { organisationId, branchId } = useOrganisationBranch();
  
  const finalFilter: CareRequestFilterInput = {
    organisationId: organisationId || '',
    branchId,
    ...filter,
  };

  const { data, loading, error, refetch } = useQuery(GET_CARE_REQUESTS, {
    variables: { 
      filter: finalFilter,
      skip: skip || 0,
      take: take || 50,
    },
    skip: !organisationId,
  });
  
  return {
    careRequests: data?.careRequests as CareRequest[] | undefined,
    loading,
    error,
    refetch,
  };
}

// Get single care request
export function useCareRequest(id: string) {
  const { data, loading, error } = useQuery(GET_CARE_REQUEST, {
    variables: { id },
    skip: !id,
  });
  
  return {
    careRequest: data?.careRequest as CareRequest | undefined,
    loading,
    error,
  };
}

// Get care requests count
export function useCareRequestsCount(filter?: Partial<CareRequestFilterInput>) {
  const { organisationId, branchId } = useOrganisationBranch();
  
  const finalFilter: CareRequestFilterInput = {
    organisationId: organisationId || '',
    branchId,
    ...filter,
  };

  const { data, loading, error } = useQuery(GET_CARE_REQUESTS_COUNT, {
    variables: { filter: finalFilter },
    skip: !organisationId,
  });
  
  return {
    count: data?.careRequestsCount as number | undefined,
    loading,
    error,
  };
}

// Get my care requests (for members)
export function useMyCareRequests(status?: string) {
  const { data, loading, error } = useQuery(GET_MY_CARE_REQUESTS, {
    variables: { status },
  });
  
  return {
    myCareRequests: data?.myCareRequests as CareRequest[] | undefined,
    loading,
    error,
  };
}

// Get pastor care requests
export function usePastorCareRequests(pastorId: string, status?: string) {
  const { data, loading, error } = useQuery(GET_PASTOR_CARE_REQUESTS, {
    variables: { pastorId, status },
    skip: !pastorId,
  });
  
  return {
    pastorCareRequests: data?.pastorCareRequests as CareRequest[] | undefined,
    loading,
    error,
  };
}

// Get overdue care requests
export function useOverdueCareRequests() {
  const { data, loading, error } = useQuery(GET_OVERDUE_CARE_REQUESTS);
  
  return {
    overdueCareRequests: data?.overdueCareRequests as CareRequest[] | undefined,
    loading,
    error,
  };
}

// Get pastoral visits
export function usePastoralVisits(filter?: Partial<PastoralVisitFilterInput>, skip?: number, take?: number) {
  const { organisationId, branchId } = useOrganisationBranch();
  
  const finalFilter: PastoralVisitFilterInput = {
    organisationId: organisationId || '',
    branchId,
    ...filter,
  };

  const { data, loading, error } = useQuery(GET_PASTORAL_VISITS, {
    variables: { 
      filter: finalFilter,
      skip: skip || 0,
      take: take || 50,
    },
    skip: !organisationId,
  });
  
  return {
    pastoralVisits: data?.pastoralVisits as PastoralVisit[] | undefined,
    loading,
    error,
  };
}

// Get counseling sessions
export function useCounselingSessions(filter?: Partial<CounselingSessionFilterInput>, skip?: number, take?: number) {
  const { organisationId, branchId } = useOrganisationBranch();
  
  const finalFilter: CounselingSessionFilterInput = {
    organisationId: organisationId || '',
    branchId,
    ...filter,
  };

  const { data, loading, error } = useQuery(GET_COUNSELING_SESSIONS, {
    variables: { 
      filter: finalFilter,
      skip: skip || 0,
      take: take || 50,
    },
    skip: !organisationId,
  });
  
  return {
    counselingSessions: data?.counselingSessions as CounselingSession[] | undefined,
    loading,
    error,
  };
}

// Get follow-up reminders
export function useFollowUpReminders(filter?: Partial<FollowUpReminderFilterInput>, skip?: number, take?: number) {
  const { organisationId, branchId } = useOrganisationBranch();
  
  const finalFilter: FollowUpReminderFilterInput = {
    organisationId: organisationId || '',
    branchId,
    ...filter,
  };

  const { data, loading, error } = useQuery(GET_FOLLOW_UP_REMINDERS, {
    variables: { 
      filter: finalFilter,
      skip: skip || 0,
      take: take || 50,
    },
    skip: !organisationId,
  });
  
  return {
    followUpReminders: data?.followUpReminders as FollowUpReminder[] | undefined,
    loading,
    error,
  };
}

// Mutation hooks

// Create care request
export function useCreateCareRequest() {
  const [createCareRequest, { loading, error }] = useMutation(CREATE_CARE_REQUEST);
  
  return {
    createCareRequest: async (input: CreateCareRequestInput) => {
      const result = await createCareRequest({ variables: { input } });
      return result.data?.createCareRequest as CareRequest;
    },
    loading,
    error,
  };
}

// Update care request
export function useUpdateCareRequest() {
  const [updateCareRequest, { loading, error }] = useMutation(UPDATE_CARE_REQUEST);
  
  return {
    updateCareRequest: async (id: string, updates: Partial<UpdateCareRequestInput>) => {
      const input: UpdateCareRequestInput = { id, ...updates };
      const result = await updateCareRequest({ variables: { input } });
      return result.data?.updateCareRequest as CareRequest;
    },
    loading,
    error,
  };
}

// Delete care request
export function useDeleteCareRequest() {
  const [deleteCareRequest, { loading, error }] = useMutation(DELETE_CARE_REQUEST);
  
  return {
    deleteCareRequest: async (id: string) => {
      const result = await deleteCareRequest({ variables: { id } });
      return result.data?.deleteCareRequest;
    },
    loading,
    error,
  };
}

// Create pastoral visit
export function useCreatePastoralVisit() {
  const [createPastoralVisit, { loading, error }] = useMutation(CREATE_PASTORAL_VISIT);
  
  return {
    createPastoralVisit: async (input: any) => {
      const result = await createPastoralVisit({ variables: { input } });
      return result.data?.createPastoralVisit as PastoralVisit;
    },
    loading,
    error,
  };
}

// Update pastoral visit
export function useUpdatePastoralVisit() {
  const [updatePastoralVisit, { loading, error }] = useMutation(UPDATE_PASTORAL_VISIT);
  
  return {
    updatePastoralVisit: async (input: any) => {
      const result = await updatePastoralVisit({ variables: { input } });
      return result.data?.updatePastoralVisit as PastoralVisit;
    },
    loading,
    error,
  };
}

// Create counseling session
export function useCreateCounselingSession() {
  const [createCounselingSession, { loading, error }] = useMutation(CREATE_COUNSELING_SESSION);
  
  return {
    createCounselingSession: async (input: any) => {
      const result = await createCounselingSession({ variables: { input } });
      return result.data?.createCounselingSession as CounselingSession;
    },
    loading,
    error,
  };
}

// Update counseling session
export function useUpdateCounselingSession() {
  const [updateCounselingSession, { loading, error }] = useMutation(UPDATE_COUNSELING_SESSION);
  
  return {
    updateCounselingSession: async (input: any) => {
      const result = await updateCounselingSession({ variables: { input } });
      return result.data?.updateCounselingSession as CounselingSession;
    },
    loading,
    error,
  };
}

// Create follow-up reminder
export function useCreateFollowUpReminder() {
  const [createFollowUpReminder, { loading, error }] = useMutation(CREATE_FOLLOW_UP_REMINDER);
  
  return {
    createFollowUpReminder: async (input: any) => {
      const result = await createFollowUpReminder({ variables: { input } });
      return result.data?.createFollowUpReminder as FollowUpReminder;
    },
    loading,
    error,
  };
}

// Update follow-up reminder
export function useUpdateFollowUpReminder() {
  const [updateFollowUpReminder, { loading, error }] = useMutation(UPDATE_FOLLOW_UP_REMINDER);
  
  return {
    updateFollowUpReminder: async (input: any) => {
      const result = await updateFollowUpReminder({ variables: { input } });
      return result.data?.updateFollowUpReminder as FollowUpReminder;
    },
    loading,
    error,
  };
}
