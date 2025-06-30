import { useQuery, gql } from '@apollo/client';

export const DASHBOARD_DATA_QUERY = gql`
  query DashboardData($branchId: ID, $dashboardType: DashboardType!, $organisationId: ID) {
    dashboardData(
      branchId: $branchId
      dashboardType: $dashboardType
      organisationId: $organisationId
    ) {
      organisationId
      branchId
      branchName
      dashboardType
      generatedAt
      layout
      widgets {
        __typename
        ... on KpiCard {
          title
          value
          percentChange
          icon
          widgetType
        }
        ... on ChartData {
          title
          widgetType
          chartType
          data
        }
        ... on MinistryInvolvementWidget {
          title
          widgetType
          ministries {
            ministryName
            memberCount
          }
        }
        ... on RecentSacramentsWidget {
          title
          widgetType
          sacraments {
            id
            type
            recipientName
            date
          }
        }
        ... on PrayerRequestSummaryWidget {
          title
          widgetType
          summary {
            status
            count
          }
        }
        ... on AnnouncementsWidget {
          title
          widgetType
          announcements {
            id
            title
            content
            date
            author
          }
        }
        ... on QuickLinksWidget {
          title
          widgetType
          links {
            title
            url
            icon
          }
        }
        ... on UpcomingEventsWidget {
          title
          widgetType
          events {
            id
            title
            startDate
            endDate
            location
            description
          }
        }
        ... on NotificationsWidget {
          title
          widgetType
          notifications {
            id
            message
            date
            type
            read
          }
        }
      }
    }
  }
`;

export interface KPI {
  title: string;
  value: string;
  percentChange: number;
  icon: string;
  widgetType: 'KPI_CARD';
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
}

export interface Chart {
  title: string;
  widgetType: string;
  chartType: string;
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface QuickLink {
  title: string;
  url: string;
  icon: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  type: string;
  read: boolean;
}

export interface MinistryInvolvementItem {
  ministryName: string;
  memberCount: number;
}

export interface SacramentItem {
  id: string;
  type: string;
  recipientName: string;
  date: string;
}

export interface PrayerRequestSummaryData {
  status: string;
  count: number;
}

export type DashboardWidget =
  | ({ __typename: 'KpiCard' } & KPI)
  | ({ __typename: 'ChartData' } & Chart)
  | { __typename: 'MinistryInvolvementWidget'; title: string; widgetType: string; ministries: MinistryInvolvementItem[] }
  | { __typename: 'RecentSacramentsWidget'; title: string; widgetType: string; sacraments: SacramentItem[] }
  | { __typename: 'PrayerRequestSummaryWidget'; title: string; widgetType: string; summary: PrayerRequestSummaryData[] }
  | { __typename: 'AnnouncementsWidget'; title: string; widgetType: string; announcements: Announcement[] }
  | { __typename: 'QuickLinksWidget'; title: string; widgetType: string; links: QuickLink[] }
  | { __typename: 'UpcomingEventsWidget'; title: string; widgetType: string; events: UpcomingEvent[] }
  | { __typename: 'NotificationsWidget'; title: string; widgetType: string; notifications: Notification[] };

export interface DashboardData {
  organisationId: string;
  branchId: string;
  branchName: string;
  dashboardType: string;
  generatedAt: string;
  widgets: DashboardWidget[];
  layout: any;
}

export function useDashboardWithFilter({ branchId, organisationId, dashboardType }: { branchId?: string; organisationId?: string; dashboardType: string; }) {
  const { data, loading, error, refetch } = useQuery<{ dashboardData: DashboardData }>(DASHBOARD_DATA_QUERY, {
    variables: { branchId, organisationId, dashboardType },
    skip: !dashboardType,
    fetchPolicy: 'cache-and-network',
  });

  return {
    data: data?.dashboardData,
    loading,
    error,
    refetch,
  };
}
