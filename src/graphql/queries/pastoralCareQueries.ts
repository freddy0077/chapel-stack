import { gql } from '@apollo/client';

// Get pastoral care statistics
export const GET_PASTORAL_CARE_STATS = gql`
  query GetPastoralCareStats {
    pastoralCareStats {
      totalVisits
      completedVisits
      upcomingVisits
      totalSessions
      completedSessions
      upcomingSessions
      totalCareRequests
      openCareRequests
      resolvedCareRequests
      totalReminders
      pendingReminders
      overdueReminders
    }
  }
`;

// Get pastoral care dashboard data
export const GET_PASTORAL_CARE_DASHBOARD = gql`
  query GetPastoralCareDashboard {
    pastoralCareDashboard {
      stats {
        totalVisits
        completedVisits
        upcomingVisits
        totalSessions
        completedSessions
        upcomingSessions
        totalCareRequests
        openCareRequests
        resolvedCareRequests
        totalReminders
        pendingReminders
        overdueReminders
      }
      upcomingVisits {
        id
        title
        scheduledDate
        visitType
        status
        memberId
      }
      upcomingSessions {
        id
        title
        scheduledDate
        sessionType
        status
        memberId
      }
      urgentCareRequests {
        id
        title
        requestDate
        requestType
        priority
        status
        memberId
      }
    }
  }
`;

// Get recent pastoral care activity
export const GET_PASTORAL_CARE_RECENT_ACTIVITY = gql`
  query GetPastoralCareRecentActivity($days: Int!) {
    pastoralCareRecentActivity(days: $days) {
      id
      type
      title
      description
      date
      pastorName
    }
  }
`;

// Get care requests with filtering
export const GET_CARE_REQUESTS = gql`
  query GetCareRequests($filter: CareRequestFilterInput!, $skip: Int, $take: Int) {
    careRequests(filter: $filter, skip: $skip, take: $take) {
      id
      title
      description
      requestType
      priority
      requestDate
      assignedPastorId
      notes
      status
      completionDate
      memberId
      requesterId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Get single care request
export const GET_CARE_REQUEST = gql`
  query GetCareRequest($id: String!) {
    careRequest(id: $id) {
      id
      title
      description
      requestType
      priority
      requestDate
      assignedPastorId
      notes
      status
      completionDate
      memberId
      requesterId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Get care requests count
export const GET_CARE_REQUESTS_COUNT = gql`
  query GetCareRequestsCount($filter: CareRequestFilterInput!) {
    careRequestsCount(filter: $filter)
  }
`;

// Get my care requests (for members)
export const GET_MY_CARE_REQUESTS = gql`
  query GetMyCareRequests($status: CareRequestStatus) {
    myCareRequests(status: $status) {
      id
      title
      description
      requestType
      priority
      requestDate
      assignedPastorId
      notes
      status
      completionDate
      memberId
      requesterId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Get pastor care requests
export const GET_PASTOR_CARE_REQUESTS = gql`
  query GetPastorCareRequests($pastorId: String!, $status: CareRequestStatus) {
    pastorCareRequests(pastorId: $pastorId, status: $status) {
      id
      title
      description
      requestType
      priority
      requestDate
      assignedPastorId
      notes
      status
      completionDate
      memberId
      requesterId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Get overdue care requests
export const GET_OVERDUE_CARE_REQUESTS = gql`
  query GetOverdueCareRequests {
    overdueCareRequests {
      id
      title
      description
      requestType
      priority
      requestDate
      assignedPastorId
      notes
      status
      completionDate
      memberId
      requesterId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Get pastoral visits
export const GET_PASTORAL_VISITS = gql`
  query GetPastoralVisits($filter: PastoralVisitFilterInput!, $skip: Int, $take: Int) {
    pastoralVisits(filter: $filter, skip: $skip, take: $take) {
      id
      title
      description
      visitType
      scheduledDate
      status
      memberId
      pastorId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Get counseling sessions
export const GET_COUNSELING_SESSIONS = gql`
  query GetCounselingSessions($filter: CounselingSessionFilterInput!, $skip: Int, $take: Int) {
    counselingSessions(filter: $filter, skip: $skip, take: $take) {
      id
      title
      description
      sessionType
      scheduledDate
      status
      memberId
      counselorId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Get follow-up reminders
export const GET_FOLLOW_UP_REMINDERS = gql`
  query GetFollowUpReminders($filter: FollowUpReminderFilterInput!, $skip: Int, $take: Int) {
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

// MUTATIONS

// Create care request
export const CREATE_CARE_REQUEST = gql`
  mutation CreateCareRequest($input: CreateCareRequestInput!) {
    createCareRequest(input: $input) {
      id
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
      memberId
      requesterId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Update care request
export const UPDATE_CARE_REQUEST = gql`
  mutation UpdateCareRequest($input: UpdateCareRequestInput!) {
    updateCareRequest(input: $input) {
      id
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
      memberId
      requesterId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Delete care request
export const DELETE_CARE_REQUEST = gql`
  mutation DeleteCareRequest($id: String!) {
    deleteCareRequest(id: $id)
  }
`;

// Create pastoral visit
export const CREATE_PASTORAL_VISIT = gql`
  mutation CreatePastoralVisit($input: CreatePastoralVisitInput!) {
    createPastoralVisit(input: $input) {
      id
      title
      description
      visitType
      scheduledDate
      completedDate
      status
      notes
      memberId
      pastorId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Update pastoral visit
export const UPDATE_PASTORAL_VISIT = gql`
  mutation UpdatePastoralVisit($input: UpdatePastoralVisitInput!) {
    updatePastoralVisit(input: $input) {
      id
      title
      description
      visitType
      scheduledDate
      completedDate
      status
      notes
      memberId
      pastorId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Delete pastoral visit
export const DELETE_PASTORAL_VISIT = gql`
  mutation DeletePastoralVisit($id: String!) {
    deletePastoralVisit(id: $id)
  }
`;

// Create counseling session
export const CREATE_COUNSELING_SESSION = gql`
  mutation CreateCounselingSession($input: CreateCounselingSessionInput!) {
    createCounselingSession(input: $input) {
      id
      title
      description
      sessionType
      scheduledDate
      completedDate
      status
      notes
      memberId
      counselorId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Update counseling session
export const UPDATE_COUNSELING_SESSION = gql`
  mutation UpdateCounselingSession($input: UpdateCounselingSessionInput!) {
    updateCounselingSession(input: $input) {
      id
      title
      description
      sessionType
      scheduledDate
      completedDate
      status
      notes
      memberId
      counselorId
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// Delete counseling session
export const DELETE_COUNSELING_SESSION = gql`
  mutation DeleteCounselingSession($id: String!) {
    deleteCounselingSession(id: $id)
  }
`;

// Create follow-up reminder
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

// Update follow-up reminder
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

// Delete follow-up reminder
export const DELETE_FOLLOW_UP_REMINDER = gql`
  mutation DeleteFollowUpReminder($id: String!) {
    deleteFollowUpReminder(id: $id)
  }
`;
