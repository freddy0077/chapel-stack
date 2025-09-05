"use client";

import { useState, useEffect } from "react";
import {
  CalendarDaysIcon,
  UserIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import {
  Card,
  Text,
  Metric,
  Badge,
  AreaChart,
  Title,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Select,
  SelectItem,
  Button,
} from "@tremor/react";
import Link from "next/link";

// Types
interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "present" | "absent" | "late" | "excused" | "unknown";
  notes?: string;
}

interface MeetingAttendance {
  id: string;
  groupId: string;
  groupName: string;
  date: Date;
  attendees: Attendee[];
  totalPresent: number;
  totalAbsent: number;
  totalExcused: number;
  notes?: string;
}

interface Group {
  id: string;
  name: string;
  members: number;
  leader: string;
  meetingDay: string;
}

// Mock data
const mockGroups: Group[] = [
  {
    id: "1",
    name: "Young Adults Bible Study",
    members: 15,
    leader: "Michael Chen",
    meetingDay: "Tuesday",
  },
  {
    id: "2",
    name: "Prayer Warriors",
    members: 12,
    leader: "Sarah Johnson",
    meetingDay: "Thursday",
  },
  {
    id: "3",
    name: "Men's Fellowship",
    members: 18,
    leader: "Marcus Williams",
    meetingDay: "Saturday",
  },
  {
    id: "4",
    name: "Women's Bible Study",
    members: 21,
    leader: "Rebecca Thomas",
    meetingDay: "Monday",
  },
  {
    id: "5",
    name: "College Ministry",
    members: 25,
    leader: "David Patel",
    meetingDay: "Wednesday",
  },
  {
    id: "6",
    name: "Seniors Group",
    members: 14,
    leader: "Elizabeth Warren",
    meetingDay: "Friday",
  },
];

// Mock members
const mockMembers: Record<string, Attendee[]> = {
  "1": [
    {
      id: "101",
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "555-1234",
      status: "present",
    },
    {
      id: "102",
      name: "Taylor Swift",
      email: "taylor@example.com",
      phone: "555-2345",
      status: "present",
    },
    {
      id: "103",
      name: "Jordan Lee",
      email: "jordan@example.com",
      phone: "555-3456",
      status: "absent",
    },
    {
      id: "104",
      name: "Morgan Chen",
      email: "morgan@example.com",
      phone: "555-4567",
      status: "present",
    },
    {
      id: "105",
      name: "Casey Kim",
      email: "casey@example.com",
      phone: "555-5678",
      status: "excused",
      notes: "Out of town",
    },
    {
      id: "106",
      name: "Riley Singh",
      email: "riley@example.com",
      phone: "555-6789",
      status: "present",
    },
    {
      id: "107",
      name: "Quinn Wu",
      email: "quinn@example.com",
      phone: "555-7890",
      status: "late",
      notes: "Work",
    },
    {
      id: "108",
      name: "Jamie Patel",
      email: "jamie@example.com",
      phone: "555-8901",
      status: "present",
    },
  ],
  "2": [
    {
      id: "201",
      name: "Dana Cruz",
      email: "dana@example.com",
      phone: "555-1111",
      status: "present",
    },
    {
      id: "202",
      name: "Sam Rodriguez",
      email: "sam@example.com",
      phone: "555-2222",
      status: "present",
    },
    {
      id: "203",
      name: "Jesse Morgan",
      email: "jesse@example.com",
      phone: "555-3333",
      status: "absent",
    },
  ],
  "3": [
    {
      id: "301",
      name: "Avery Wilson",
      email: "avery@example.com",
      phone: "555-4444",
      status: "present",
    },
    {
      id: "302",
      name: "Blake Thompson",
      email: "blake@example.com",
      phone: "555-5555",
      status: "present",
    },
    {
      id: "303",
      name: "Cameron Davis",
      email: "cameron@example.com",
      phone: "555-6666",
      status: "excused",
    },
  ],
};

// Mock attendance data
const generateAttendanceDates = (
  groupId: string,
  count: number,
): MeetingAttendance[] => {
  const attendances: MeetingAttendance[] = [];
  const group = mockGroups.find((g) => g.id === groupId);
  const members = mockMembers[groupId] || [];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7); // Weekly meetings going back

    // Randomly generate attendance statuses but keep it somewhat realistic
    const attendees = members.map((member) => ({
      ...member,
      status: generateRandomAttendanceStatus(),
    }));

    const totalPresent = attendees.filter(
      (a) => a.status === "present" || a.status === "late",
    ).length;
    const totalAbsent = attendees.filter((a) => a.status === "absent").length;
    const totalExcused = attendees.filter((a) => a.status === "excused").length;

    attendances.push({
      id: `attendance-${groupId}-${i}`,
      groupId,
      groupName: group?.name || "Unknown Group",
      date,
      attendees,
      totalPresent,
      totalAbsent,
      totalExcused,
    });
  }

  return attendances;
};

// Helper function to generate realistic but random attendance
function generateRandomAttendanceStatus():
  | "present"
  | "absent"
  | "late"
  | "excused"
  | "unknown" {
  const random = Math.random();
  if (random > 0.9) return "excused";
  if (random > 0.8) return "late";
  if (random > 0.7) return "absent";
  return "present";
}

// Combine all attendance records
const mockAttendance: Record<string, MeetingAttendance[]> = {
  "1": generateAttendanceDates("1", 10),
  "2": generateAttendanceDates("2", 8),
  "3": generateAttendanceDates("3", 12),
  "4": generateAttendanceDates("4", 9),
  "5": generateAttendanceDates("5", 7),
  "6": generateAttendanceDates("6", 11),
};

// Attendance trend data for charts
const generateAttendanceTrends = (groupId: string) => {
  const data = mockAttendance[groupId] || [];
  return data
    .slice(0, 8)
    .map((record) => ({
      date: record.date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      Attendance: (record.totalPresent / record.attendees.length) * 100,
    }))
    .reverse();
};

export default function GroupAttendance() {
  const [selectedGroup, setSelectedGroup] = useState<string>(
    mockGroups[0]?.id || "",
  );
  const [selectedDate, setSelectedDate] = useState<string>("latest");
  const [editMode, setEditMode] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendee[]>([]);

  // Get group attendance records
  const groupAttendance = selectedGroup
    ? mockAttendance[selectedGroup] || []
    : [];

  // Set default attendance data when group changes
  useEffect(() => {
    if (selectedGroup && groupAttendance.length > 0) {
      const meetingRecord =
        selectedDate === "latest"
          ? groupAttendance[0]
          : groupAttendance.find(
              (record) =>
                record.date.toISOString().split("T")[0] === selectedDate,
            );

      if (meetingRecord) {
        setAttendanceData(meetingRecord.attendees);
      } else {
        setAttendanceData([]);
      }
    } else {
      setAttendanceData([]);
    }
  }, [selectedGroup, selectedDate]);

  // Update attendance status
  const updateAttendanceStatus = (
    attendeeId: string,
    status: "present" | "absent" | "late" | "excused" | "unknown",
  ) => {
    setAttendanceData((prev) =>
      prev.map((attendee) =>
        attendee.id === attendeeId ? { ...attendee, status } : attendee,
      ),
    );
  };

  // Save attendance changes
  const saveAttendanceChanges = () => {
    // In a real app, this would update the backend
    setEditMode(false);
    alert("Attendance saved successfully!");
  };

  // Attendance rate calculations
  const attendanceRate =
    attendanceData.length > 0
      ? Math.round(
          (attendanceData.filter(
            (a) => a.status === "present" || a.status === "late",
          ).length /
            attendanceData.length) *
            100,
        )
      : 0;

  const trendData = selectedGroup
    ? generateAttendanceTrends(selectedGroup)
    : [];

  // List of available meeting dates
  const meetingDates = groupAttendance.map((record) => ({
    value: record.date.toISOString().split("T")[0],
    text: record.date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Group Attendance Tracking
              </h1>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Track attendance for all small groups and ministries
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CalendarDaysIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Create and edit attendance records
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/dashboard/groups">
                <Button variant="secondary" className="mr-3">
                  Back to Groups
                </Button>
              </Link>
              <Button icon={ArrowPathIcon} color="indigo">
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Group selection sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Groups
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a group to manage attendance
                </p>
              </div>
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {mockGroups.map((group) => (
                  <li key={group.id}>
                    <button
                      onClick={() => setSelectedGroup(group.id)}
                      className={`w-full px-4 py-4 flex items-center hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                        selectedGroup === group.id ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          selectedGroup === group.id
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <UserGroupIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4 text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {group.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {group.members} members • {group.meetingDay}s
                        </div>
                      </div>
                      {selectedGroup === group.id && (
                        <CheckIcon className="h-5 w-5 text-indigo-600 ml-auto" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Attendance statistics */}
            {selectedGroup && (
              <div className="mt-6">
                <Card>
                  <Title>Attendance Trends</Title>
                  <div className="mt-6">
                    <AreaChart
                      className="h-44"
                      data={trendData}
                      index="date"
                      categories={["Attendance"]}
                      colors={["indigo"]}
                      valueFormatter={(value) => `${value}%`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Card decoration="top" decorationColor="indigo">
                      <Text>Current Rate</Text>
                      <Metric>{attendanceRate}%</Metric>
                    </Card>
                    <Card decoration="top" decorationColor="emerald">
                      <Text>Group Size</Text>
                      <Metric>{attendanceData.length}</Metric>
                    </Card>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Attendance records */}
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {mockGroups.find((g) => g.id === selectedGroup)?.name ||
                        "Selected Group"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Leader:{" "}
                      {mockGroups.find((g) => g.id === selectedGroup)?.leader}
                    </p>
                  </div>

                  {/* Meeting date selector */}
                  <div className="w-64">
                    <Select
                      value={selectedDate}
                      onValueChange={setSelectedDate}
                    >
                      <SelectItem value="latest">Latest Meeting</SelectItem>
                      {meetingDates.map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.text}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Attendance action buttons */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge color="gray">{attendanceData.length} members</Badge>
                    <Badge color="emerald">
                      {
                        attendanceData.filter((a) => a.status === "present")
                          .length
                      }{" "}
                      present
                    </Badge>
                    <Badge color="amber">
                      {attendanceData.filter((a) => a.status === "late").length}{" "}
                      late
                    </Badge>
                    <Badge color="red">
                      {
                        attendanceData.filter((a) => a.status === "absent")
                          .length
                      }{" "}
                      absent
                    </Badge>
                    <Badge color="blue">
                      {
                        attendanceData.filter((a) => a.status === "excused")
                          .length
                      }{" "}
                      excused
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    {editMode ? (
                      <>
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="xs"
                          color="emerald"
                          onClick={saveAttendanceChanges}
                        >
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button size="xs" onClick={() => setEditMode(true)}>
                        Take Attendance
                      </Button>
                    )}
                  </div>
                </div>

                {/* Attendance table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        {editMode && (
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData.map((attendee) => (
                        <tr key={attendee.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <UserIcon className="h-6 w-6" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {attendee.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {attendee.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {attendee.status === "present" && (
                                <Badge color="emerald" icon={CheckCircleIcon}>
                                  Present
                                </Badge>
                              )}
                              {attendee.status === "absent" && (
                                <Badge color="red" icon={XCircleIcon}>
                                  Absent
                                </Badge>
                              )}
                              {attendee.status === "late" && (
                                <Badge color="amber">Late</Badge>
                              )}
                              {attendee.status === "excused" && (
                                <Badge color="blue">Excused</Badge>
                              )}
                              {attendee.status === "unknown" && (
                                <Badge
                                  color="gray"
                                  icon={QuestionMarkCircleIcon}
                                >
                                  Unknown
                                </Badge>
                              )}
                              {attendee.notes && (
                                <span className="ml-2 text-xs text-gray-500 italic">
                                  {attendee.notes}
                                </span>
                              )}
                            </div>
                          </td>
                          {editMode && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() =>
                                    updateAttendanceStatus(
                                      attendee.id,
                                      "present",
                                    )
                                  }
                                  className={`p-1 rounded-full ${attendee.status === "present" ? "bg-emerald-100 text-emerald-600" : "text-gray-400 hover:text-emerald-600"}`}
                                >
                                  <CheckCircleIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    updateAttendanceStatus(attendee.id, "late")
                                  }
                                  className={`p-1 rounded-full ${attendee.status === "late" ? "bg-amber-100 text-amber-600" : "text-gray-400 hover:text-amber-600"}`}
                                >
                                  <ClockIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    updateAttendanceStatus(
                                      attendee.id,
                                      "absent",
                                    )
                                  }
                                  className={`p-1 rounded-full ${attendee.status === "absent" ? "bg-red-100 text-red-600" : "text-gray-400 hover:text-red-600"}`}
                                >
                                  <XCircleIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    updateAttendanceStatus(
                                      attendee.id,
                                      "excused",
                                    )
                                  }
                                  className={`p-1 rounded-full ${attendee.status === "excused" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-blue-600"}`}
                                >
                                  <CalendarDaysIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty state if no attendees */}
                {attendanceData.length === 0 && (
                  <div className="text-center py-12">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No attendance data
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No attendance records found for this meeting date.
                    </p>
                    <div className="mt-6">
                      <Button size="xs" onClick={() => setEditMode(true)}>
                        Take Attendance
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No group selected
                </h3>
                <p className="mt-1 text-gray-500">
                  Please select a group from the list to manage attendance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
