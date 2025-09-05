import { gql } from "@apollo/client";

// Fragment for KPI Card data
export const KPI_CARD_FRAGMENT = gql`
  fragment KpiCardFields on KpiCard {
    title
    value
    icon
    widgetType
    # Removed fields that don't exist in backend schema:
    # id, change, changeType, description, color, trend
  }
`;

// Fragment for Chart data
export const CHART_DATA_FRAGMENT = gql`
  fragment ChartDataFields on ChartData {
    title
    chartType
    data
    # Removed fields that don't exist in backend schema:
    # id, description, config
    # Note: If 'options' should be used instead of 'config', add it here
  }
`;

// Fragment for Announcements widget
export const ANNOUNCEMENTS_WIDGET_FRAGMENT = gql`
  fragment AnnouncementsWidgetFields on AnnouncementsWidget {
    widgetType
    title
    announcements {
      id
      title
      content
      date
      author
      priority
      # Removed field that doesn't exist in backend schema:
      # imageUrl
    }
  }
`;

// Fragment for Notifications widget
export const NOTIFICATIONS_WIDGET_FRAGMENT = gql`
  fragment NotificationsWidgetFields on NotificationsWidget {
    widgetType
    title
    notifications {
      id
      type
      message
      date
      read
      # Changed 'isRead' to 'read' based on error message
      # Removed field that doesn't exist in backend schema:
      # link
    }
  }
`;

// Fragment for Tasks widget
export const TASKS_WIDGET_FRAGMENT = gql`
  fragment TasksWidgetFields on TasksWidget {
    widgetType
    title
    tasks {
      id
      title
      dueDate
      status
      priority
      # Removed fields that don't exist in backend schema:
      # description, assignedTo, category
    }
  }
`;

// Fragment for Upcoming Events widget
export const UPCOMING_EVENTS_WIDGET_FRAGMENT = gql`
  fragment UpcomingEventsWidgetFields on UpcomingEventsWidget {
    widgetType
    title
    events {
      id
      title
      description
      # Removed fields that don't exist in backend schema:
      # dateTime, location, imageUrl, attending, category
      # You may need to add alternative fields that are available in the backend
    }
  }
`;

// Fragment for Quick Links widget
export const QUICK_LINKS_WIDGET_FRAGMENT = gql`
  fragment QuickLinksWidgetFields on QuickLinksWidget {
    widgetType
    title
    links {
      title
      url
      icon
      # Removed fields that don't exist in backend schema:
      # id, category
    }
  }
`;

// Fragment for My Groups widget
export const MY_GROUPS_WIDGET_FRAGMENT = gql`
  fragment MyGroupsWidgetFields on MyGroupsWidget {
    widgetType
    title
    groups {
      id
      name
      type
      meetingTime
      nextMeeting
      # Removed fields that don't exist in backend schema:
      # memberCount, location
    }
  }
`;

// Main query for fetching dashboard data
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($branchId: ID!, $dashboardType: DashboardType!) {
    dashboardData(branchId: $branchId, dashboardType: $dashboardType) {
      branchId
      branchName
      dashboardType
      generatedAt
      kpiCards {
        ...KpiCardFields
      }
      charts {
        ...ChartDataFields
      }
      announcements {
        ...AnnouncementsWidgetFields
      }
      notifications {
        ...NotificationsWidgetFields
      }
      tasks {
        ...TasksWidgetFields
      }
      upcomingEvents {
        ...UpcomingEventsWidgetFields
      }
      quickLinks {
        ...QuickLinksWidgetFields
      }
      myGroups {
        ...MyGroupsWidgetFields
      }
    }
  }
  ${KPI_CARD_FRAGMENT}
  ${CHART_DATA_FRAGMENT}
  ${ANNOUNCEMENTS_WIDGET_FRAGMENT}
  ${NOTIFICATIONS_WIDGET_FRAGMENT}
  ${TASKS_WIDGET_FRAGMENT}
  ${UPCOMING_EVENTS_WIDGET_FRAGMENT}
  ${QUICK_LINKS_WIDGET_FRAGMENT}
  ${MY_GROUPS_WIDGET_FRAGMENT}
`;

// Query for fetching user dashboard preferences
export const GET_USER_DASHBOARD_PREFERENCE = gql`
  query GetUserDashboardPreference(
    $branchId: ID!
    $dashboardType: DashboardType!
  ) {
    userDashboardPreference(
      branchId: $branchId
      dashboardType: $dashboardType
    ) {
      id
      userId
      branchId
      dashboardType
      layoutConfig
      createdAt
      updatedAt
    }
  }
`;

// Mutation for saving user dashboard preferences
export const SAVE_USER_DASHBOARD_PREFERENCE = gql`
  mutation SaveUserDashboardPreference(
    $branchId: String!
    $dashboardType: DashboardType!
    $layoutConfig: JSON!
  ) {
    saveUserDashboardPreference(
      branchId: $branchId
      dashboardType: $dashboardType
      layoutConfig: $layoutConfig
    ) {
      id
      userId
      branchId
      dashboardType
      layoutConfig
      updatedAt
    }
  }
`;

// Query for fetching super admin dashboard data
export const GET_SUPER_ADMIN_DASHBOARD = gql`
  query SuperAdminDashboard($organisationId: ID) {
    superAdminDashboardData(organisationId: $organisationId) {
      organisationOverview {
        total
        organisations {
          id
          name
          branchCount
          adminCount
        }
      }
      branchesSummary {
        total
        branches {
          id
          name
          organisation
          status
        }
      }
      memberSummary {
        total
        newMembersThisMonth
      }
      financialOverview {
        totalContributions
        tithes
        expenses
        pledge
        offering
        donation
        specialContribution
        topGivingBranches {
          branchId
          branchName
          totalGiven
        }
      }
      attendanceOverview {
        totalAttendance
      }
      sacramentsOverview {
        totalSacraments
      }
      activityEngagement {
        recentEvents {
          id
          title
          startDate
        }
        upcomingEvents {
          id
          title
          startDate
        }
      }
      systemHealth {
        timestamp
        database {
          status
          latency
        }
        system {
          totalMemory
          freeMemory
          memoryUsage {
            rss
            heapTotal
            heapUsed
            external
          }
          cpuUsage {
            user
            system
          }
          systemUptime
          processUptime
          platform
          nodeVersion
        }
      }
      announcements {
        announcements {
          id
          title
          startDate
        }
      }
    }
  }
`;
