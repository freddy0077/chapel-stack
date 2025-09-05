import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SCHEDULED_MESSAGES = [
  {
    id: 1,
    name: "Weekly Newsletter - April Week 3",
    recipients: "All Members",
    scheduledAt: "April 21, 2024, 9:00 AM",
    status: "Scheduled",
  },
  {
    id: 2,
    name: "Youth Camp Final Reminder",
    recipients: "Youth Group Parents",
    scheduledAt: "April 20, 2024, 5:00 PM",
    status: "Scheduled",
  },
  {
    id: 3,
    name: "Easter Service Follow-up",
    recipients: "First-time Visitors (Last 30 Days)",
    scheduledAt: "April 15, 2024, 11:00 AM",
    status: "Sent",
  },
  {
    id: 4,
    name: "Volunteer Team Meeting",
    recipients: "Ushers, Greeters",
    scheduledAt: "April 12, 2024, 1:00 PM",
    status: "Sent",
  },
];

const statusColors = {
  Scheduled: "bg-blue-100 text-blue-800",
  Sent: "bg-green-100 text-green-800",
};

export default function Scheduler() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Scheduler</h2>
          <p className="text-gray-500 mt-1">
            Manage your scheduled and automated messages.
          </p>
        </div>
        <Button className="bg-violet-600 text-white hover:bg-violet-700">
          Schedule a New Message
        </Button>
      </div>

      {/* Scheduled Messages List */}
      <Card className="shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800">
            Upcoming & Recent Messages
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Message
                </th>
                <th scope="col" className="px-6 py-3">
                  Recipients
                </th>
                <th scope="col" className="px-6 py-3">
                  Scheduled At
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {SCHEDULED_MESSAGES.map((msg) => (
                <tr key={msg.id} className="bg-white border-b hover:bg-gray-50">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {msg.name}
                  </th>
                  <td className="px-6 py-4">{msg.recipients}</td>
                  <td className="px-6 py-4">{msg.scheduledAt}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[msg.status]}`}
                    >
                      {msg.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
