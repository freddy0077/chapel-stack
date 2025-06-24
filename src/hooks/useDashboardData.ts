import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_DASHBOARD_DATA, 
  GET_USER_DASHBOARD_PREFERENCE,
  SAVE_USER_DASHBOARD_PREFERENCE
} from '@/graphql/queries/dashboardQueries';

// Define dashboard types enum to match backend
export enum DashboardType {
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
  MEMBER = 'MEMBER',
  MINISTRY = 'MINISTRY',
  PASTORAL = 'PASTORAL'
}

// Define type for KPI Card
export interface KpiCard {
  title: string;
  value: string | number;
  icon?: string;
  widgetType?: string;
  // Optional fields that might be used in the frontend but aren't in the backend schema
  id?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  description?: string;
  color?: string;
  trend?: Array<number>;
}

// Define type for Chart Data
export interface ChartData {
  title: string;
  chartType: string;
  data: Record<string, unknown>;
  // Optional fields that might be used in the frontend but aren't in the backend schema
  id?: string;
  description?: string;
  config?: Record<string, unknown>;
  options?: Record<string, unknown>; // Added as an alternative to config
}

// Define types for various widget items
export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: Date;
  author?: string;
  priority?: number;
  // imageUrl doesn't exist in backend schema but might be used in frontend
  imageUrl?: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  date: Date;
  read: boolean; // Changed from isRead to read based on schema
  // link doesn't exist in backend schema but might be used in frontend
  link?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: Date;
  status: string;
  priority: string;
  // Fields that don't exist in backend schema but might be used in frontend
  description?: string;
  assignedTo?: string;
  category?: string;
  completed?: boolean; // Used in frontend UI
  assignee?: string;  // Alternative name for assignedTo
}

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  // Fields that don't exist in backend schema but might be used in frontend
  date?: Date; // Alternative to dateTime
  dateTime?: Date;
  location?: string;
  imageUrl?: string;
  attending?: number;
  category?: string;
}

export interface QuickLinkItem {
  title: string;
  url: string;
  icon?: string;
  // Fields that don't exist in backend schema but might be used in frontend
  id?: string;
  category?: string;
  description?: string;
}

export interface GroupItem {
  id: string;
  name: string;
  type?: string;
  meetingTime?: string;
  nextMeeting?: Date;
  // Fields that don't exist in backend schema but might be used in frontend
  memberCount?: number;
  location?: string;
}

// Define widget types
export interface AnnouncementsWidget {
  widgetType: string;
  title: string;
  announcements: AnnouncementItem[];
}

export interface NotificationsWidget {
  widgetType: string;
  title: string;
  notifications: NotificationItem[];
}

export interface TasksWidget {
  widgetType: string;
  title: string;
  tasks: TaskItem[];
}

export interface UpcomingEventsWidget {
  widgetType: string;
  title: string;
  events: EventItem[];
}

export interface QuickLinksWidget {
  widgetType: string;
  title: string;
  links: QuickLinkItem[];
}

export interface MyGroupsWidget {
  widgetType: string;
  title: string;
  groups: GroupItem[];
}

// Define main dashboard data interface
export interface DashboardData {
  branchId: string;
  branchName?: string;
  dashboardType: DashboardType;
  generatedAt: Date;
  kpiCards: KpiCard[];
  charts: ChartData[];
  announcements?: AnnouncementsWidget;
  notifications?: NotificationsWidget;
  tasks?: TasksWidget;
  upcomingEvents?: UpcomingEventsWidget;
  quickLinks?: QuickLinksWidget;
  myGroups?: MyGroupsWidget;
}

// Define dashboard preference interface
export interface UserDashboardPreference {
  id: string;
  userId: string;
  branchId: string;
  dashboardType: DashboardType;
  layoutConfig: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard data hook
export const useDashboardData = (branchId: string, dashboardType: DashboardType, skip?: boolean) => {
  const { loading, error, data, refetch } = useQuery<{ dashboardData: DashboardData }>(GET_DASHBOARD_DATA, {
    variables: { 
      branchId, 
      dashboardType 
    },
    fetchPolicy: 'network-only', // Don't cache dashboard data
    notifyOnNetworkStatusChange: true,
    skip,
  });

  return {
    loading,
    error,
    dashboardData: data?.dashboardData,
    refetch,
  };
};

// User dashboard preference hook
export const useUserDashboardPreference = (branchId: string, dashboardType: DashboardType) => {
  const { loading, error, data, refetch } = useQuery(GET_USER_DASHBOARD_PREFERENCE, {
    variables: { 
      branchId, 
      dashboardType 
    },
    fetchPolicy: 'cache-and-network', // We can cache preferences but still check network
  });

  // Save dashboard preference mutation
  const [savePreference, { loading: saveLoading, error: saveError }] = useMutation(
    SAVE_USER_DASHBOARD_PREFERENCE
  );

  // Function to update user preference
  const updateDashboardPreference = async (layoutConfig: Record<string, unknown>) => {
    try {
      const response = await savePreference({
        variables: {
          branchId,
          dashboardType,
          layoutConfig,
        },
      });
      return response.data?.saveUserDashboardPreference;
    } catch (err) {
      console.error('Error saving dashboard preference:', err);
      throw err;
    }
  };

  return {
    loading,
    error,
    preference: data?.userDashboardPreference as UserDashboardPreference | undefined,
    updateDashboardPreference,
    saveLoading,
    saveError,
    refetch,
  };
};
