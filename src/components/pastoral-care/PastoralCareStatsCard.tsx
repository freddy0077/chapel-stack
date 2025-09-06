import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePastoralCareStats } from "@/hooks/usePastoralCareStats";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";

interface PastoralCareStatsCardProps {
  className?: string;
}

/**
 * Component to display pastoral care statistics
 * Automatically uses organisationId and branchId from user context
 * Following the same pattern as other components in the codebase
 */
export const PastoralCareStatsCard: React.FC<PastoralCareStatsCardProps> = ({
  className = "",
}) => {
  const { loading, error, data, refetch } = usePastoralCareStats();

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Pastoral Care Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Pastoral Care Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load pastoral care statistics: {error.message}
              <button 
                onClick={() => refetch()} 
                className="ml-2 underline hover:no-underline"
              >
                Try again
              </button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Pastoral Care Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: "Pastoral Visits",
      value: data.totalVisits,
      completed: data.completedVisits,
      pending: data.upcomingVisits,
      icon: Users,
      color: "bg-blue-500",
      completedLabel: "Completed",
      pendingLabel: "Upcoming",
    },
    {
      label: "Counseling Sessions",
      value: data.totalSessions,
      completed: data.completedSessions,
      pending: data.upcomingSessions,
      icon: MessageSquare,
      color: "bg-green-500",
      completedLabel: "Completed",
      pendingLabel: "Upcoming",
    },
    {
      label: "Care Requests",
      value: data.totalCareRequests,
      completed: data.resolvedCareRequests,
      pending: data.openCareRequests,
      icon: Calendar,
      color: "bg-orange-500",
      completedLabel: "Resolved",
      pendingLabel: "Open",
    },
    {
      label: "Follow-up Reminders",
      value: data.totalReminders,
      completed: data.pendingReminders,
      pending: data.overdueReminders,
      icon: Bell,
      color: "bg-purple-500",
      completedLabel: "Pending",
      pendingLabel: "Overdue",
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Pastoral Care Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium text-sm">{stat.label}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{stat.completed} {stat.completedLabel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className={`h-3 w-3 ${stat.pendingLabel === 'Overdue' ? 'text-red-500' : 'text-blue-500'}`} />
                      <span>{stat.pending} {stat.pendingLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {data.overdueReminders > 0 && (
          <Alert className="mt-4" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have {data.overdueReminders} overdue reminder{data.overdueReminders !== 1 ? 's' : ''} 
              that need attention.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PastoralCareStatsCard;
