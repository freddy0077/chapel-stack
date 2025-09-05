import { gql } from "@apollo/client";

// Pastoral Visit Queries and Mutations
export const GET_PASTORAL_VISITS = gql`
  query GetPastoralVisits(
    $filter: PastoralVisitFilterInput!
    $skip: Int
    $take: Int
  ) {
    pastoralVisits(filter: $filter, skip: $skip, take: $take) {
      id
      memberId
      pastorId
      title
      description
      visitType
      scheduledDate
      actualDate
      location
      notes
      status
      followUpDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const GET_PASTORAL_VISIT_BY_ID = gql`
  query GetPastoralVisitById($id: String!) {
    pastoralVisit(id: $id) {
      id
      memberId
      pastorId
      title
      description
      visitType
      scheduledDate
      actualDate
      location
      notes
      status
      followUpDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PASTORAL_VISIT = gql`
  mutation CreatePastoralVisit($input: CreatePastoralVisitInput!) {
    createPastoralVisit(input: $input) {
      id
      memberId
      pastorId
      title
      description
      visitType
      scheduledDate
      actualDate
      location
      notes
      status
      followUpDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PASTORAL_VISIT = gql`
  mutation UpdatePastoralVisit($input: UpdatePastoralVisitInput!) {
    updatePastoralVisit(input: $input) {
      id
      memberId
      pastorId
      title
      description
      visitType
      scheduledDate
      actualDate
      location
      notes
      status
      followUpDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PASTORAL_VISIT = gql`
  mutation DeletePastoralVisit($id: String!) {
    deletePastoralVisit(id: $id)
  }
`;

// Counseling Session Queries and Mutations
export const GET_COUNSELING_SESSIONS = gql`
  query GetCounselingSessions(
    $filter: CounselingSessionFilterInput!
    $skip: Int
    $take: Int
  ) {
    counselingSessions(filter: $filter, skip: $skip, take: $take) {
      id
      memberId
      primaryMemberId
      counselorId
      title
      description
      scheduledDate
      actualDate
      duration
      sessionType
      status
      isConfidential
      followUpDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const GET_COUNSELING_SESSION_BY_ID = gql`
  query GetCounselingSessionById($id: String!) {
    counselingSession(id: $id) {
      id
      memberId
      primaryMemberId
      counselorId
      title
      description
      scheduledDate
      actualDate
      duration
      sessionType
      status
      isConfidential
      followUpDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_COUNSELING_SESSION = gql`
  mutation CreateCounselingSession($input: CreateCounselingSessionInput!) {
    createCounselingSession(input: $input) {
      id
      memberId
      primaryMemberId
      counselorId
      title
      description
      scheduledDate
      actualDate
      duration
      sessionType
      status
      isConfidential
      followUpDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COUNSELING_SESSION = gql`
  mutation UpdateCounselingSession($input: UpdateCounselingSessionInput!) {
    updateCounselingSession(input: $input) {
      id
      memberId
      primaryMemberId
      counselorId
      title
      description
      scheduledDate
      actualDate
      duration
      sessionType
      status
      isConfidential
      followUpDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COUNSELING_SESSION = gql`
  mutation DeleteCounselingSession($id: String!) {
    deleteCounselingSession(id: $id)
  }
`;

// Care Request Queries and Mutations
export const GET_CARE_REQUESTS = gql`
  query GetCareRequests(
    $filter: CareRequestFilterInput!
    $skip: Int
    $take: Int
  ) {
    careRequests(filter: $filter, skip: $skip, take: $take) {
      id
      memberId
      requesterId
      title
      description
      requestType
      priority
      status
      urgentNotes
      contactInfo
      preferredContactMethod
      assignedPastorId
      assistantId
      assignedDate
      requestDate
      responseDate
      completionDate
      responseNotes
      resolutionNotes
      actionsTaken
      notes
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
      requester {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      assignedPastor {
        id
        firstName
        lastName
        email
      }
      creator {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_CARE_REQUEST_BY_ID = gql`
  query GetCareRequestById($id: String!) {
    careRequest(id: $id) {
      id
      memberId
      requesterId
      title
      description
      requestType
      priority
      status
      urgentNotes
      contactInfo
      preferredContactMethod
      assignedPastorId
      assistantId
      assignedDate
      requestDate
      responseDate
      completionDate
      responseNotes
      resolutionNotes
      actionsTaken
      notes
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
      requester {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      assignedPastor {
        id
        firstName
        lastName
        email
      }
      creator {
        id
        firstName
        lastName
      }
    }
  }
`;

export const CREATE_CARE_REQUEST = gql`
  mutation CreateCareRequest($input: CreateCareRequestInput!) {
    createCareRequest(input: $input) {
      id
      memberId
      requesterId
      title
      description
      requestType
      priority
      requestDate
      assignedPastorId
      assistantId
      notes
      status
      completionDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CARE_REQUEST = gql`
  mutation UpdateCareRequest($input: UpdateCareRequestInput!) {
    updateCareRequest(input: $input) {
      id
      memberId
      requesterId
      title
      description
      requestType
      priority
      requestDate
      assignedPastorId
      assistantId
      notes
      status
      completionDate
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CARE_REQUEST = gql`
  mutation DeleteCareRequest($id: String!) {
    deleteCareRequest(id: $id)
  }
`;

// Follow-up Reminder Queries and Mutations
export const GET_FOLLOW_UP_REMINDERS = gql`
  query GetFollowUpReminders(
    $filter: FollowUpReminderFilterInput!
    $skip: Int
    $take: Int
  ) {
    followUpReminders(filter: $filter, skip: $skip, take: $take) {
      id
      memberId
      followUpType
      title
      description
      dueDate
      reminderDate
      assignedToId
      notes
      status
      completedDate
      actionRequired
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const GET_FOLLOW_UP_REMINDER_BY_ID = gql`
  query GetFollowUpReminderById($id: String!) {
    followUpReminder(id: $id) {
      id
      memberId
      followUpType
      title
      description
      dueDate
      reminderDate
      assignedToId
      notes
      status
      completedDate
      actionRequired
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_FOLLOW_UP_REMINDER = gql`
  mutation CreateFollowUpReminder($input: CreateFollowUpReminderInput!) {
    createFollowUpReminder(input: $input) {
      id
      memberId
      followUpType
      title
      description
      dueDate
      reminderDate
      assignedToId
      notes
      status
      completedDate
      actionRequired
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FOLLOW_UP_REMINDER = gql`
  mutation UpdateFollowUpReminder($input: UpdateFollowUpReminderInput!) {
    updateFollowUpReminder(input: $input) {
      id
      memberId
      followUpType
      title
      description
      dueDate
      reminderDate
      assignedToId
      notes
      status
      completedDate
      actionRequired
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const COMPLETE_FOLLOW_UP_REMINDER = gql`
  mutation CompleteFollowUpReminder($id: String!, $notes: String) {
    completeFollowUpReminder(id: $id, notes: $notes) {
      id
      status
      completedDate
    }
  }
`;

// Dashboard and Statistics Queries
export const GET_PASTORAL_CARE_STATS = gql`
  query GetPastoralCareStats {
    pastoralCareStats {
      totalVisits
      totalSessions
      totalCareRequests
      totalReminders
      completedVisits
      completedSessions
      resolvedCareRequests
      overdueReminders
      upcomingVisits
      upcomingSessions
      openCareRequests
    }
  }
`;

export const GET_PASTORAL_CARE_DASHBOARD = gql`
  query GetPastoralCareDashboard {
    pastoralCareDashboard {
      stats {
        totalVisits
        totalSessions
        totalCareRequests
        totalReminders
        completedVisits
        completedSessions
        resolvedCareRequests
        overdueReminders
        upcomingVisits
        upcomingSessions
        openCareRequests
      }
      upcomingVisits {
        id
        title
        scheduledDate
        visitType
        status
        memberId
        pastorId
      }
      upcomingSessions {
        id
        title
        scheduledDate
        sessionType
        status
        primaryMemberId
        counselorId
      }
      urgentCareRequests {
        id
        title
        requestType
        priority
        status
        requestDate
        requesterId
        assignedPastorId
      }
      dueTodayReminders {
        id
        title
        followUpType
        dueDate
        status
        memberId
        assignedToId
      }
      overdueReminders {
        id
        title
        followUpType
        dueDate
        status
        memberId
        assignedToId
      }
    }
  }
`;

export const GET_PASTORAL_CARE_RECENT_ACTIVITY = gql`
  query GetPastoralCareRecentActivity($days: Int = 7) {
    pastoralCareRecentActivity(days: $days) {
      id
      type
      title
      description
      date
      memberName
      pastorName
    }
  }
`;

// TypeScript interfaces for the GraphQL responses
export interface PastoralVisit {
  id: string;
  memberId: string;
  pastorId?: string;
  title: string;
  description?: string;
  visitType: string;
  scheduledDate: string;
  actualDate?: string;
  location?: string;
  notes?: string;
  status: string;
  followUpDate?: string;
  organisationId: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CounselingSession {
  id: string;
  memberId: string;
  primaryMemberId: string;
  counselorId?: string;
  title: string;
  description?: string;
  scheduledDate: string;
  actualDate?: string;
  duration: number;
  sessionType: string;
  status: string;
  isConfidential: boolean;
  followUpDate?: string;
  organisationId: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareRequest {
  id: string;
  memberId: string;
  requesterId: string;
  title: string;
  description?: string;
  requestType: string;
  priority: string;
  requestDate: string;
  assignedPastorId?: string;
  assistantId?: string;
  notes?: string;
  status: string;
  completionDate?: string;
  organisationId: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpReminder {
  id: string;
  memberId?: string;
  followUpType: string;
  title: string;
  description?: string;
  dueDate: string;
  reminderDate?: string;
  assignedToId?: string;
  notes?: string;
  status: string;
  completedDate?: string;
  actionRequired?: string;
  organisationId: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PastoralCareStats {
  totalVisits: number;
  totalSessions: number;
  totalCareRequests: number;
  totalReminders: number;
  completedVisits: number;
  completedSessions: number;
  resolvedCareRequests: number;
  overdueReminders: number;
  upcomingVisits: number;
  upcomingSessions: number;
  openCareRequests: number;
}

export interface PastoralCareActivity {
  id: string;
  type: string;
  title: string;
  description?: string;
  date: string;
  memberName?: string;
  pastorName?: string;
}
