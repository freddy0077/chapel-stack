'use client';

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
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/empty-state';
import { PastoralVisitsManagement } from '@/components/pastoral-care/PastoralVisitsManagement';
import { CareRequestsManagement } from '@/components/pastoral-care/CareRequestsManagement';
import { FollowUpRemindersManagement } from '@/components/pastoral-care/FollowUpRemindersManagement';
import { CounselingSessionsManagement } from '@/components/pastoral-care/CounselingSessionsManagement';

export default function PastoralCarePage() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [activeTab, setActiveTab] = useState('dashboard');

  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useQuery(
    GET_PASTORAL_CARE_DASHBOARD,
    {
      variables: { organisationId, branchId },
      skip: !organisationId,
    }
  );

  const { data: activityData, loading: activityLoading } = useQuery(
    GET_PASTORAL_CARE_RECENT_ACTIVITY,
    {
      variables: { days: 7 },
      skip: !organisationId,
    }
  );

  if (dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600 font-medium">Loading Pastoral Care Dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Unable to Load Dashboard</h3>
          <p className="text-gray-600 mb-6">{dashboardError.message}</p>
          <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const dashboard = dashboardData?.pastoralCareDashboard;
  const stats = dashboard?.stats;
  const recentActivity = activityData?.pastoralCareRecentActivity || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
              Pastoral Care Management
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Nurture your community with comprehensive pastoral care tools designed for modern ministry
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                New Activity
              </Button>
              <Button variant="outline" size="lg" className="border-2 hover:bg-gray-50">
                <Filter className="h-5 w-5 mr-2" />
                Filter & Search
              </Button>
            </div>
          </div>

          {/* Modern Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Visits */}
            <Card className="relative overflow-hidden border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10" />
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{stats?.totalVisits || 0}</div>
                    <div className="text-sm text-blue-600 font-medium">Total Visits</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {stats?.completedVisits || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Counseling Sessions */}
            <Card className="relative overflow-hidden border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10" />
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{stats?.totalSessions || 0}</div>
                    <div className="text-sm text-green-600 font-medium">Sessions</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {stats?.completedSessions || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Care Requests */}
            <Card className="relative overflow-hidden border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10" />
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{stats?.totalCareRequests || 0}</div>
                    <div className="text-sm text-purple-600 font-medium">Care Requests</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Open</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {stats?.openCareRequests || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Follow-ups */}
            <Card className="relative overflow-hidden border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10" />
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{stats?.totalReminders || 0}</div>
                    <div className="text-sm text-orange-600 font-medium">Follow-ups</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overdue</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {stats?.overdueReminders || 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Modern Tab Navigation */}
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl h-14 bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-2">
              <TabsTrigger 
                value="dashboard" 
                className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Activity className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="visits"
                className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Users className="h-4 w-4 mr-2" />
                Visits
              </TabsTrigger>
              <TabsTrigger 
                value="sessions"
                className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Sessions
              </TabsTrigger>
              <TabsTrigger 
                value="requests"
                className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Heart className="h-4 w-4 mr-2" />
                Requests
              </TabsTrigger>
              <TabsTrigger 
                value="reminders"
                className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Bell className="h-4 w-4 mr-2" />
                Follow-ups
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Dashboard Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Upcoming Visits */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      Upcoming Visits
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {dashboard?.upcomingVisits?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboard?.upcomingVisits?.length > 0 ? (
                    dashboard.upcomingVisits.slice(0, 3).map((visit: any) => (
                      <div key={visit.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{visit.title}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(visit.scheduledDate), 'MMM dd, yyyy')} • {visit.visitType}
                            </p>
                          </div>
                          <Badge variant={visit.status === 'SCHEDULED' ? 'default' : 'secondary'} className="ml-3">
                            {visit.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<Calendar className="h-12 w-12 text-gray-400" />}
                      title="No upcoming visits"
                      description="Schedule a pastoral visit to get started"
                    />
                  )}
                  {dashboard?.upcomingVisits?.length > 3 && (
                    <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      View all visits <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Urgent Care Requests */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      Urgent Requests
                    </CardTitle>
                    <Badge variant="destructive" className="bg-red-100 text-red-700">
                      {dashboard?.urgentCareRequests?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboard?.urgentCareRequests?.length > 0 ? (
                    dashboard.urgentCareRequests.slice(0, 3).map((request: any) => (
                      <div key={request.id} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{request.title}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(request.requestDate), 'MMM dd, yyyy')} • {request.requestType}
                            </p>
                          </div>
                          <Badge variant="destructive" className="ml-3">
                            {request.priority}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<Heart className="h-12 w-12 text-gray-400" />}
                      title="No urgent requests"
                      description="All care requests are being handled"
                    />
                  )}
                  {dashboard?.urgentCareRequests?.length > 3 && (
                    <Button variant="ghost" className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50">
                      View all requests <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      Upcoming Sessions
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {dashboard?.upcomingSessions?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboard?.upcomingSessions?.length > 0 ? (
                    dashboard.upcomingSessions.slice(0, 3).map((session: any) => (
                      <div key={session.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{session.title}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(session.scheduledDate), 'MMM dd, yyyy')} • {session.sessionType}
                            </p>
                          </div>
                          <Badge variant={session.status === 'SCHEDULED' ? 'default' : 'secondary'} className="ml-3">
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<MessageSquare className="h-12 w-12 text-gray-400" />}
                      title="No upcoming sessions"
                      description="Schedule a counseling session to get started"
                    />
                  )}
                  {dashboard?.upcomingSessions?.length > 3 && (
                    <Button variant="ghost" className="w-full mt-4 text-green-600 hover:text-green-700 hover:bg-green-50">
                      View all sessions <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Section */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    Recent Activity
                  </CardTitle>
                  <Button variant="outline" size="sm" className="border-2">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((activity: any, index: number) => (
                      <div key={activity.id} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border hover:shadow-md transition-all duration-200">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span>{activity.type}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(activity.date), 'MMM dd, yyyy')}</span>
                            {activity.memberName && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{activity.memberName}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-4">
                          {activity.type}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<Clock className="h-12 w-12 text-gray-400" />}
                      title="No recent activity"
                      description="Recent pastoral care activities will appear here"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8">
              <PastoralVisitsManagement />
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8">
              <CounselingSessionsManagement />
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8">
              <CareRequestsManagement />
            </div>
          </TabsContent>

          <TabsContent value="reminders">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8">
              <FollowUpRemindersManagement />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
