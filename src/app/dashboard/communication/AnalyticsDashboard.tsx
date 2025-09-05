import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Placeholder for a chart component - in a real app, this would be a library like Recharts or Chart.js
const EngagementChart = () => (
  <div className="h-80 w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed">
    <p className="text-gray-500">Engagement Over Time Chart</p>
  </div>
);

const KPIS = [
  {
    title: "Total Recipients",
    value: "12,840",
    change: "+12.5%",
    changeType: "positive",
  },
  {
    title: "Overall Open Rate",
    value: "71.2%",
    change: "+2.1%",
    changeType: "positive",
  },
  {
    title: "Click-through Rate",
    value: "15.8%",
    change: "-0.5%",
    changeType: "negative",
  },
  {
    title: "Unsubscribe Rate",
    value: "0.8%",
    change: "+0.1%",
    changeType: "negative",
  },
];

const TOP_CAMPAIGNS = [
  { name: "Easter Sunday Special", openRate: "85%", clickRate: "25%" },
  { name: "Weekly Newsletter - April 1st", openRate: "65%", clickRate: "12%" },
  { name: "Youth Camp Registration", openRate: "92%", clickRate: "45%" },
];

const CHANNEL_PERFORMANCE = [
  { channel: "Email", sent: 8200, openRate: "71.2%", clickRate: "15.8%" },
  { channel: "SMS", sent: 3140, openRate: "98.1%", clickRate: "22.3%" },
  { channel: "In-App", sent: 1500, openRate: "N/A", clickRate: "8.9%" },
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Communication Analytics
          </h2>
          <p className="text-gray-500 mt-1">
            Analyze the performance of your messaging campaigns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Placeholder for Date Range Picker */}
          <Button variant="outline">Last 30 Days</Button>
          <Button className="bg-violet-600 text-white hover:bg-violet-700">
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPIS.map((kpi) => (
          <Card key={kpi.title} className="p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-500">{kpi.title}</div>
            <div className="mt-1 text-3xl font-bold text-gray-900">
              {kpi.value}
            </div>
            <div
              className={`mt-1 text-sm ${kpi.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
            >
              {kpi.change}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Engagement Trend
        </h3>
        <EngagementChart />
      </Card>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Top Performing Campaigns
          </h3>
          <ul className="space-y-4">
            {TOP_CAMPAIGNS.map((campaign) => (
              <li
                key={campaign.name}
                className="flex justify-between items-center"
              >
                <div className="font-medium text-gray-800">{campaign.name}</div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {campaign.openRate} Open Rate
                  </div>
                  <div className="text-xs text-gray-400">
                    {campaign.clickRate} Click Rate
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Channel Performance
          </h3>
          <ul className="space-y-4">
            {CHANNEL_PERFORMANCE.map((channel) => (
              <li key={channel.channel} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div className="font-medium text-gray-800">
                    {channel.channel}
                  </div>
                  <div className="text-sm text-gray-500">
                    {channel.sent.toLocaleString()} Sent
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Open Rate: {channel.openRate}</span>
                  <span>Click Rate: {channel.clickRate}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
