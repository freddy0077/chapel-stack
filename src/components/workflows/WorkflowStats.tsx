"use client";

import { useMemo } from "react";
import { Activity, CheckCircle, Clock, XCircle, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowTemplate, WorkflowExecution } from "@/graphql/workflows";

interface WorkflowStatsProps {
  workflows: WorkflowTemplate[];
  executions: WorkflowExecution[];
}

export default function WorkflowStats({
  workflows,
  executions,
}: WorkflowStatsProps) {
  const stats = useMemo(() => {
    const totalWorkflows = workflows?.length;
    const activeWorkflows = workflows?.filter(
      (w) => w.status === "ACTIVE",
    ).length;
    const totalExecutions = executions?.length;
    const completedExecutions = executions?.filter(
      (e) => e.status === "COMPLETED",
    ).length;
    const failedExecutions = executions?.filter(
      (e) => e.status === "FAILED",
    ).length;
    const runningExecutions = executions?.filter(
      (e) => e.status === "RUNNING",
    ).length;

    const successRate =
      totalExecutions > 0 ? (completedExecutions / totalExecutions) * 100 : 0;

    // Get executions from last 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const recentExecutions = executions.filter(
      (e) => e.createdAt && new Date(e.createdAt) > last24Hours,
    ).length;

    return {
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      completedExecutions,
      failedExecutions,
      runningExecutions,
      successRate,
      recentExecutions,
    };
  }, [workflows, executions]);

  const statCards = [
    {
      title: "Total Workflows",
      value: stats.totalWorkflows,
      description: `${stats.activeWorkflows} active`,
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Executions",
      value: stats.totalExecutions,
      description: `${stats.recentExecutions} in last 24h`,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate.toFixed(1)}%`,
      description: `${stats.completedExecutions} completed`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Failed Executions",
      value: stats.failedExecutions,
      description:
        stats.runningExecutions > 0
          ? `${stats.runningExecutions} running`
          : "None running",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
