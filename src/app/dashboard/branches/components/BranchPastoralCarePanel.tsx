"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart,
  Users,
  MessageSquare,
  Bell,
  Calendar,
  Plus,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { GET_PASTORAL_CARE_DASHBOARD, GET_PASTORAL_CARE_RECENT_ACTIVITY } from '@/graphql/pastoral-care';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/empty-state';
import { PastoralVisitsManagement } from '@/components/pastoral-care/PastoralVisitsManagement';
import { CareRequestsManagement } from '@/components/pastoral-care/CareRequestsManagement';
import { FollowUpRemindersManagement } from '@/components/pastoral-care/FollowUpRemindersManagement';
import { CounselingSessionsManagement } from '@/components/pastoral-care/CounselingSessionsManagement';

interface BranchPastoralCarePanelProps {
  branchId: string;
}

const BranchPastoralCarePanel: React.FC<BranchPastoralCarePanelProps> = ({ branchId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useQuery(
    GET_PASTORAL_CARE_DASHBOARD,
    {
      variables: { organisationId: '', branchId },
      skip: !branchId,
    }
  );

  const { data: activityData, loading: activityLoading } = useQuery(
    GET_PASTORAL_CARE_RECENT_ACTIVITY,
    {
      variables: { days: 7 },
      skip: !branchId,
    }
  );

  if (dashboardLoading) {
    return <Loading />;
  }

  if (dashboardError) {
    return (
      <div className="p-6">
        <EmptyState
          title="Error Loading Pastoral Care Data"
          description="There was an error loading the pastoral care information. Please try again."
          action={
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  const stats = dashboardData?.pastoralCareDashboard?.stats;
  const upcomingVisits = dashboardData?.pastoralCareDashboard?.upcomingVisits || [];
  const upcomingSessions = dashboardData?.pastoralCareDashboard?.upcomingSessions || [];
  const urgentCareRequests = dashboardData?.pastoralCareDashboard?.urgentCareRequests || [];
  const dueTodayReminders = dashboardData?.pastoralCareDashboard?.dueTodayReminders || [];
  const overdueReminders = dashboardData?.pastoralCareDashboard?.overdueReminders || [];
  const recentActivity = activityData?.pastoralCareRecentActivity || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pastoral Care</h2>
          <p className="text-gray-600">Manage pastoral visits, counseling, and member care</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Care Activity
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="counseling">Counseling</TabsTrigger>
          <TabsTrigger value="care-requests">Care Requests</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Visits</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalVisits || 0}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">Completed</span>
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                    {stats?.completedVisits || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Counseling Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalSessions || 0}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">Completed</span>
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                    {stats?.completedSessions || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Care Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalCareRequests || 0}</p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Heart className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">Open</span>
                  <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                    {stats?.openCareRequests || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reminders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalReminders || 0}</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Bell className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">Overdue</span>
                  <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">
                    {stats?.overdueReminders || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Urgent Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Urgent Care Requests */}
                {urgentCareRequests.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Urgent Care Requests</h4>
                    <div className="space-y-2">
                      {urgentCareRequests.slice(0, 3).map((request: any) => (
                        <div key={request.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{request.title}</p>
                            <p className="text-xs text-gray-600">{request.requestType}</p>
                          </div>
                          <Badge variant="destructive">{request.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overdue Reminders */}
                {overdueReminders.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Overdue Reminders</h4>
                    <div className="space-y-2">
                      {overdueReminders.slice(0, 3).map((reminder: any) => (
                        <div key={reminder.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{reminder.title}</p>
                            <p className="text-xs text-gray-600">Due: {format(new Date(reminder.dueDate), 'MMM d, yyyy')}</p>
                          </div>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            Overdue
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {urgentCareRequests.length === 0 && overdueReminders.length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No urgent items at this time</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((activity: any) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-600">
                            {activity.memberName && `Member: ${activity.memberName}`}
                            {activity.pastorName && ` • Pastor: ${activity.pastorName}`}
                          </p>
                          <p className="text-xs text-gray-500">{format(new Date(activity.date), 'MMM d, h:mm a')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Visits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-500" />
                    Upcoming Visits
                  </span>
                  <Badge variant="secondary">{upcomingVisits.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingVisits.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingVisits.slice(0, 4).map((visit: any) => (
                      <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{visit.title}</p>
                          <p className="text-xs text-gray-600">{visit.visitType}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(visit.scheduledDate), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <Badge variant="outline">{visit.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No upcoming visits scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
                    Upcoming Sessions
                  </span>
                  <Badge variant="secondary">{upcomingSessions.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingSessions.slice(0, 4).map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{session.title}</p>
                          <p className="text-xs text-gray-600">{session.sessionType}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(session.scheduledDate), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        <Badge variant="outline">{session.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No upcoming sessions scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visits">
          <PastoralVisitsManagement />
        </TabsContent>

        <TabsContent value="counseling">
          <CounselingSessionsManagement />
        </TabsContent>

        <TabsContent value="care-requests">
          <CareRequestsManagement />
        </TabsContent>

        <TabsContent value="reminders">
          <FollowUpRemindersManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BranchPastoralCarePanel;
