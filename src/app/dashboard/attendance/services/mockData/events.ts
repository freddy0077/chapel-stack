// Mock events data for attendance system
import { AttendanceEvent } from "../../types";

// Helper function to create date objects for events
const getNextDayOfWeek = (dayOfWeek: number, addWeeks: number = 0): Date => {
  const date = new Date();
  const diff = (dayOfWeek - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff + addWeeks * 7);
  return date;
};

// Sunday = 0, Monday = 1, etc.
const nextSunday = getNextDayOfWeek(0);
const lastSunday = getNextDayOfWeek(0, -1);
const twoSundaysAgo = getNextDayOfWeek(0, -2);
const nextWednesday = getNextDayOfWeek(3);
const lastWednesday = getNextDayOfWeek(3, -1);

// Set times for events
const setSundayServiceTimes = (date: Date): { start: Date; end: Date } => {
  const startTime = new Date(date);
  startTime.setHours(10, 0, 0, 0); // 10:00 AM

  const endTime = new Date(date);
  endTime.setHours(12, 0, 0, 0); // 12:00 PM

  return { start: startTime, end: endTime };
};

const setWednesdayBibleStudyTimes = (
  date: Date,
): { start: Date; end: Date } => {
  const startTime = new Date(date);
  startTime.setHours(19, 0, 0, 0); // 7:00 PM

  const endTime = new Date(date);
  endTime.setHours(20, 30, 0, 0); // 8:30 PM

  return { start: startTime, end: endTime };
};

// Create times for events
const lastSundayTimes = setSundayServiceTimes(lastSunday);
const twoSundaysAgoTimes = setSundayServiceTimes(twoSundaysAgo);
const nextSundayTimes = setSundayServiceTimes(nextSunday);
const lastWednesdayTimes = setWednesdayBibleStudyTimes(lastWednesday);
const nextWednesdayTimes = setWednesdayBibleStudyTimes(nextWednesday);

export const mockEvents: AttendanceEvent[] = [
  {
    id: "event_001",
    name: "Sunday Worship Service",
    type: "service",
    startTime: nextSundayTimes.start,
    endTime: nextSundayTimes.end,
    locationId: "loc_001",
    branchId: "branch_001",
    status: "scheduled",
    expectedAttendees: 150,
    recurringId: "rec_001",
    recurrencePattern: "weekly",
    dayOfWeek: 0, // Sunday
    createdBy: "admin_001",
    allowFamilyCheckIn: true,
    requiresChildPickup: true,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 30, // 30 minutes before
    allowLateCheckIn: true,
    lateCheckInWindow: 30, // 30 minutes after start
    assignedDevices: ["device_001", "device_002", "device_003"],
  },
  {
    id: "event_002",
    name: "Sunday Worship Service",
    type: "service",
    startTime: lastSundayTimes.start,
    endTime: lastSundayTimes.end,
    locationId: "loc_001",
    branchId: "branch_001",
    status: "completed",
    expectedAttendees: 150,
    recurringId: "rec_001",
    recurrencePattern: "weekly",
    dayOfWeek: 0, // Sunday
    createdBy: "admin_001",
    allowFamilyCheckIn: true,
    requiresChildPickup: true,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 30,
    allowLateCheckIn: true,
    lateCheckInWindow: 30,
    assignedDevices: ["device_001", "device_002", "device_003"],
  },
  {
    id: "event_003",
    name: "Wednesday Bible Study",
    type: "meeting",
    startTime: nextWednesdayTimes.start,
    endTime: nextWednesdayTimes.end,
    locationId: "loc_003",
    branchId: "branch_001",
    status: "scheduled",
    expectedAttendees: 35,
    recurringId: "rec_002",
    recurrencePattern: "weekly",
    dayOfWeek: 3, // Wednesday
    createdBy: "admin_001",
    allowFamilyCheckIn: false,
    requiresChildPickup: false,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 15,
    allowLateCheckIn: true,
    lateCheckInWindow: 15,
    assignedDevices: ["device_010"],
  },
  {
    id: "event_004",
    name: "Wednesday Bible Study",
    type: "meeting",
    startTime: lastWednesdayTimes.start,
    endTime: lastWednesdayTimes.end,
    locationId: "loc_003",
    branchId: "branch_001",
    status: "completed",
    expectedAttendees: 35,
    recurringId: "rec_002",
    recurrencePattern: "weekly",
    dayOfWeek: 3, // Wednesday
    createdBy: "admin_001",
    allowFamilyCheckIn: false,
    requiresChildPickup: false,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 15,
    allowLateCheckIn: true,
    lateCheckInWindow: 15,
    assignedDevices: ["device_010"],
  },
  {
    id: "event_005",
    name: "Sunday Worship Service",
    type: "service",
    startTime: nextSundayTimes.start,
    endTime: nextSundayTimes.end,
    locationId: "loc_002",
    branchId: "branch_002",
    status: "scheduled",
    expectedAttendees: 75,
    recurringId: "rec_003",
    recurrencePattern: "weekly",
    dayOfWeek: 0, // Sunday
    createdBy: "admin_002",
    allowFamilyCheckIn: true,
    requiresChildPickup: true,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 30,
    allowLateCheckIn: true,
    lateCheckInWindow: 30,
    assignedDevices: ["device_007"],
  },
  {
    id: "event_006",
    name: "Sunday Worship Service",
    type: "service",
    startTime: lastSundayTimes.start,
    endTime: lastSundayTimes.end,
    locationId: "loc_002",
    branchId: "branch_002",
    status: "completed",
    expectedAttendees: 75,
    recurringId: "rec_003",
    recurrencePattern: "weekly",
    dayOfWeek: 0, // Sunday
    createdBy: "admin_002",
    allowFamilyCheckIn: true,
    requiresChildPickup: true,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 30,
    allowLateCheckIn: true,
    lateCheckInWindow: 30,
    assignedDevices: ["device_007"],
  },
  {
    id: "event_007",
    name: "Youth Group Meeting",
    type: "meeting",
    startTime: (() => {
      const date = new Date(lastSunday);
      date.setHours(17, 0, 0, 0); // 5:00 PM
      return date;
    })(),
    endTime: (() => {
      const date = new Date(lastSunday);
      date.setHours(19, 0, 0, 0); // 7:00 PM
      return date;
    })(),
    locationId: "loc_001",
    branchId: "branch_001",
    status: "completed",
    expectedAttendees: 25,
    recurringId: "rec_004",
    recurrencePattern: "weekly",
    dayOfWeek: 0, // Sunday
    createdBy: "admin_001",
    allowFamilyCheckIn: false,
    requiresChildPickup: false,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 15,
    allowLateCheckIn: true,
    lateCheckInWindow: 15,
    assignedDevices: ["device_008"],
  },
  {
    id: "event_008",
    name: "Sunday Worship Service",
    type: "service",
    startTime: twoSundaysAgoTimes.start,
    endTime: twoSundaysAgoTimes.end,
    locationId: "loc_001",
    branchId: "branch_001",
    status: "completed",
    expectedAttendees: 145,
    recurringId: "rec_001",
    recurrencePattern: "weekly",
    dayOfWeek: 0, // Sunday
    createdBy: "admin_001",
    allowFamilyCheckIn: true,
    requiresChildPickup: true,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 30,
    allowLateCheckIn: true,
    lateCheckInWindow: 30,
    assignedDevices: ["device_001", "device_002", "device_003"],
  },
  {
    id: "event_009",
    name: "Easter Special Service",
    type: "special",
    startTime: (() => {
      // Next Easter placeholder date (for demo)
      const date = new Date();
      date.setDate(date.getDate() + 30); // 30 days from now
      date.setHours(10, 0, 0, 0); // 10:00 AM
      return date;
    })(),
    endTime: (() => {
      // Next Easter placeholder date (for demo)
      const date = new Date();
      date.setDate(date.getDate() + 30); // 30 days from now
      date.setHours(12, 30, 0, 0); // 12:30 PM
      return date;
    })(),
    locationId: "loc_001",
    branchId: "branch_001",
    status: "scheduled",
    expectedAttendees: 250,
    createdBy: "admin_001",
    allowFamilyCheckIn: true,
    requiresChildPickup: true,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 45,
    allowLateCheckIn: true,
    lateCheckInWindow: 30,
    assignedDevices: ["device_001", "device_002", "device_003", "device_009"],
  },
  {
    id: "event_010",
    name: "Small Group Leadership Training",
    type: "class",
    startTime: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 5); // 5 days from now
      date.setHours(18, 30, 0, 0); // 6:30 PM
      return date;
    })(),
    endTime: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 5); // 5 days from now
      date.setHours(20, 30, 0, 0); // 8:30 PM
      return date;
    })(),
    locationId: "loc_003",
    branchId: "branch_001",
    status: "scheduled",
    expectedAttendees: 15,
    createdBy: "admin_001",
    allowFamilyCheckIn: false,
    requiresChildPickup: false,
    allowEarlyCheckIn: true,
    earlyCheckInWindow: 15,
    allowLateCheckIn: true,
    lateCheckInWindow: 15,
    assignedDevices: ["device_010"],
  },
];
