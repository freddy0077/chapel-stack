// Attendance Service - Handles card scanning and attendance functionality

import {
  MemberCard,
  CardDevice,
  AttendanceRecord,
  AttendanceEvent,
  AttendanceStats,
  AttendanceTrend,
  AbsenceAlert,
  Member,
} from "../types";

// Mock data for demonstration purposes - would be replaced with API calls
import { mockMembers } from "./mockData/members";
import { mockCards } from "./mockData/cards";
import { mockDevices } from "./mockData/devices";
import { mockEvents } from "./mockData/events";
import { mockAttendanceRecords } from "./mockData/attendanceRecords";

// Attendance Recording Functions
export const recordAttendance = async (
  memberId: string,
  eventId: string,
  method: "card_scan" | "manual_entry" | "mobile_app" | "qr_code" = "card_scan",
  deviceId?: string,
  notes?: string,
): Promise<AttendanceRecord> => {
  // Find the member
  const member = mockMembers.find((m) => m.id === memberId);
  if (!member) {
    throw new Error(`Member with ID ${memberId} not found`);
  }

  // Find the event
  const event = mockEvents.find((e) => e.id === eventId);
  if (!event) {
    throw new Error(`Event with ID ${eventId} not found`);
  }

  // Check if already checked in
  const existingRecord = mockAttendanceRecords.find(
    (record) =>
      record.memberId === memberId &&
      record.eventId === eventId &&
      record.status === "checked_in",
  );

  if (existingRecord) {
    throw new Error("Member is already checked in for this event");
  }

  // Create new attendance record
  const newRecord: AttendanceRecord = {
    id: `att_${Date.now()}`,
    memberId,
    memberName: `${member.firstName} ${member.lastName}`,
    eventId,
    eventName: event.name,
    timestamp: new Date(),
    method,
    deviceId,
    locationId: event.locationId,
    branchId: event.branchId,
    notes,
    status: "checked_in",
    familyCheckIn: false,
  };

  // Update member's last attendance
  member.lastAttendance = new Date();

  // In a real implementation, this would save to a database
  mockAttendanceRecords.push(newRecord);

  // If this is a card scan, update the card's lastUsed date
  if (method === "card_scan" && member.hasCard && member.cardId) {
    const card = mockCards.find((c) => c.id === member.cardId);
    if (card) {
      card.lastUsed = new Date();
    }
  }

  return newRecord;
};

export const checkInFamily = async (
  primaryMemberId: string,
  familyMemberIds: string[],
  eventId: string,
  method: "card_scan" | "manual_entry" | "mobile_app" | "qr_code" = "card_scan",
  deviceId?: string,
): Promise<AttendanceRecord> => {
  // Find the primary member
  const primaryMember = mockMembers.find((m) => m.id === primaryMemberId);
  if (!primaryMember) {
    throw new Error(`Primary member with ID ${primaryMemberId} not found`);
  }

  // Find the event
  const event = mockEvents.find((e) => e.id === eventId);
  if (!event) {
    throw new Error(`Event with ID ${eventId} not found`);
  }

  // Verify family check-in is allowed for this event
  if (!event.allowFamilyCheckIn) {
    throw new Error(`Family check-in is not allowed for event: ${event.name}`);
  }

  // Get family members
  const familyMembers = mockMembers
    .filter((m) => familyMemberIds.includes(m.id))
    .map((member) => ({
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      status: "checked_in" as const,
    }));

  if (familyMembers.length === 0) {
    throw new Error("No valid family members found");
  }

  // Create primary attendance record with family members
  const newRecord: AttendanceRecord = {
    id: `att_${Date.now()}`,
    memberId: primaryMemberId,
    memberName: `${primaryMember.firstName} ${primaryMember.lastName}`,
    eventId,
    eventName: event.name,
    timestamp: new Date(),
    method,
    deviceId,
    locationId: event.locationId,
    branchId: event.branchId,
    status: "checked_in",
    familyCheckIn: true,
    familyMembers,
  };

  // Update all family members' last attendance
  primaryMember.lastAttendance = new Date();
  familyMemberIds.forEach((id) => {
    const member = mockMembers.find((m) => m.id === id);
    if (member) {
      member.lastAttendance = new Date();
    }
  });

  // In a real implementation, this would save to a database
  mockAttendanceRecords.push(newRecord);

  // If this is a card scan, update the card's lastUsed date
  if (method === "card_scan" && primaryMember.hasCard && primaryMember.cardId) {
    const card = mockCards.find((c) => c.id === primaryMember.cardId);
    if (card) {
      card.lastUsed = new Date();
    }
  }

  return newRecord;
};

export const checkOutAttendee = async (
  attendanceRecordId: string,
): Promise<AttendanceRecord> => {
  // Find the attendance record
  const record = mockAttendanceRecords.find((r) => r.id === attendanceRecordId);
  if (!record) {
    throw new Error(
      `Attendance record with ID ${attendanceRecordId} not found`,
    );
  }

  if (record.status === "checked_out") {
    throw new Error("Attendee is already checked out");
  }

  // Update record
  record.status = "checked_out";
  record.checkedOutTimestamp = new Date();

  // Handle family check-out if applicable
  if (record.familyCheckIn && record.familyMembers) {
    record.familyMembers = record.familyMembers.map((member) => ({
      ...member,
      status: "checked_out",
    }));
  }

  return record;
};

// Card Management Functions
export const registerNewCard = async (
  memberId: string,
  cardNumber: string,
  cardType: "rfid" | "nfc" | "qr" = "rfid",
  assignedBy: string,
  notes?: string,
): Promise<MemberCard> => {
  // Find the member
  const member = mockMembers.find((m) => m.id === memberId);
  if (!member) {
    throw new Error(`Member with ID ${memberId} not found`);
  }

  // Check if card number is already in use
  const existingCard = mockCards.find((c) => c.cardNumber === cardNumber);
  if (existingCard) {
    throw new Error(`Card number ${cardNumber} is already in use`);
  }

  // Deactivate any existing cards for this member
  mockCards.forEach((card) => {
    if (card.memberId === memberId && card.status === "active") {
      card.status = "inactive";
    }
  });

  // Create new card
  const newCard: MemberCard = {
    id: `card_${Date.now()}`,
    memberId,
    cardNumber,
    issueDate: new Date(),
    status: "active",
    cardType,
    assignedBy,
    notes,
  };

  // Update member record
  member.hasCard = true;
  member.cardId = newCard.id;

  // In a real implementation, this would save to a database
  mockCards.push(newCard);

  return newCard;
};

export const updateCardStatus = async (
  cardId: string,
  status: "active" | "inactive" | "lost",
): Promise<MemberCard> => {
  // Find the card
  const card = mockCards.find((c) => c.id === cardId);
  if (!card) {
    throw new Error(`Card with ID ${cardId} not found`);
  }

  // Update status
  card.status = status;

  // If card is inactive or lost, update member record
  if (status !== "active") {
    const member = mockMembers.find((m) => m.id === card.memberId);
    if (member && member.cardId === cardId) {
      member.hasCard = false;
      member.cardId = undefined;
    }
  }

  return card;
};

// Device Management Functions
export const registerNewDevice = async (
  name: string,
  locationId: string,
  branchId: string,
  deviceType: "wall-mounted" | "kiosk" | "mobile" | "admin" = "wall-mounted",
  ipAddress?: string,
  firmwareVersion?: string,
): Promise<CardDevice> => {
  // Create new device
  const newDevice: CardDevice = {
    id: `device_${Date.now()}`,
    name,
    locationId,
    branchId,
    status: "online",
    lastConnected: new Date(),
    deviceType,
    ipAddress,
    firmwareVersion,
    batteryLevel: 100,
  };

  // In a real implementation, this would save to a database
  mockDevices.push(newDevice);

  return newDevice;
};

export const updateDeviceStatus = async (
  deviceId: string,
  status: "online" | "offline" | "maintenance",
): Promise<CardDevice> => {
  // Find the device
  const device = mockDevices.find((d) => d.id === deviceId);
  if (!device) {
    throw new Error(`Device with ID ${deviceId} not found`);
  }

  // Update status
  device.status = status;

  if (status === "online") {
    device.lastConnected = new Date();
  }

  return device;
};

export const assignDeviceToEvent = async (
  deviceId: string,
  eventId: string,
): Promise<CardDevice> => {
  // Find the device
  const device = mockDevices.find((d) => d.id === deviceId);
  if (!device) {
    throw new Error(`Device with ID ${deviceId} not found`);
  }

  // Find the event
  const event = mockEvents.find((e) => e.id === eventId);
  if (!event) {
    throw new Error(`Event with ID ${eventId} not found`);
  }

  // Assign device to event
  device.assignedEventId = eventId;

  // Add device to event's assigned devices
  if (!event.assignedDevices) {
    event.assignedDevices = [];
  }

  if (!event.assignedDevices.includes(deviceId)) {
    event.assignedDevices.push(deviceId);
  }

  return device;
};

// Reporting Functions
export const getEventAttendanceStats = async (
  eventId: string,
): Promise<AttendanceStats> => {
  // Find the event
  const event = mockEvents.find((e) => e.id === eventId);
  if (!event) {
    throw new Error(`Event with ID ${eventId} not found`);
  }

  // Get attendance records for this event
  const records = mockAttendanceRecords.filter((r) => r.eventId === eventId);

  // Count unique attendees
  const uniqueAttendees = new Set(records.map((r) => r.memberId));

  // Count by check-in method
  const cardScanCount = records.filter((r) => r.method === "card_scan").length;
  const manualEntryCount = records.filter(
    (r) => r.method === "manual_entry",
  ).length;
  const mobileAppCount = records.filter(
    (r) => r.method === "mobile_app",
  ).length;
  const qrCodeCount = records.filter((r) => r.method === "qr_code").length;

  // Count family check-ins
  const familyCheckIns = records.filter((r) => r.familyCheckIn).length;

  // Count children vs adults
  const childrenCount = records.filter((r) => {
    const member = mockMembers.find((m) => m.id === r.memberId);
    return member?.isChild === true;
  }).length;

  // Count new visitors
  const newVisitors = records.filter((r) => {
    const member = mockMembers.find((m) => m.id === r.memberId);
    return member?.status === "visitor";
  }).length;

  // Create stats object
  const stats: AttendanceStats = {
    eventId,
    eventName: event.name,
    date: event.startTime,
    totalAttendees: uniqueAttendees.size,
    newVisitors,
    returningMembers: uniqueAttendees.size - newVisitors,
    childrenCount,
    adultCount: uniqueAttendees.size - childrenCount,
    familyCheckIns,
    checkInByMethod: {
      cardScan: cardScanCount,
      manualEntry: manualEntryCount,
      mobileApp: mobileAppCount,
      qrCode: qrCodeCount,
    },
  };

  return stats;
};

export const getAttendanceTrends = async (
  startDate: Date,
  endDate: Date,
  eventType?: string,
  branchId?: string,
): Promise<AttendanceTrend> => {
  // Filter events by date range, event type, and branch
  let filteredEvents = mockEvents.filter(
    (e) => e.startTime >= startDate && e.startTime <= endDate,
  );

  if (eventType) {
    filteredEvents = filteredEvents.filter((e) => e.type === eventType);
  }

  if (branchId) {
    filteredEvents = filteredEvents.filter((e) => e.branchId === branchId);
  }

  // Get attendance records for filtered events
  const eventIds = filteredEvents.map((e) => e.id);
  const records = mockAttendanceRecords.filter((r) =>
    eventIds.includes(r.eventId),
  );

  // Group by week
  const weeklyData: {
    weekStarting: Date;
    totalAttendance: number;
    uniqueAttendees: number;
    newVisitors: number;
  }[] = [];

  // Group by month
  const monthlyData: {
    month: string;
    totalAttendance: number;
    uniqueAttendees: number;
    newVisitors: number;
    averagePerService: number;
  }[] = [];

  // Calculate overall growth
  const firstMonthAttendance = 100; // Placeholder
  const lastMonthAttendance = 120; // Placeholder
  const overallGrowth =
    ((lastMonthAttendance - firstMonthAttendance) / firstMonthAttendance) * 100;

  // Find peak attendance
  const peakAttendanceDate = new Date();
  const peakAttendanceCount = 150; // Placeholder

  // Return trend data
  const trends: AttendanceTrend = {
    startDate,
    endDate,
    eventType,
    branchId,
    weeklyData,
    monthlyData,
    overallGrowth,
    peakAttendanceDate,
    peakAttendanceCount,
  };

  return trends;
};

export const getAbsenceAlerts = async (
  thresholdWeeks: number = 3,
  branchId?: string,
): Promise<AbsenceAlert[]> => {
  const today = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(today.getDate() - thresholdWeeks * 7);

  // Find active members with last attendance before threshold
  const absentMembers = mockMembers.filter(
    (member) =>
      member.status === "active" &&
      (!branchId || member.primaryBranchId === branchId) &&
      member.lastAttendance &&
      member.lastAttendance < thresholdDate,
  );

  // Create absence alerts
  const alerts: AbsenceAlert[] = absentMembers.map((member) => {
    const lastDate = member.lastAttendance || new Date();
    const daysSinceLastAttendance = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const missedEvents = Math.floor(daysSinceLastAttendance / 7); // Estimate weekly events

    return {
      id: `alert_${member.id}`,
      memberId: member.id,
      memberName: `${member.firstName} ${member.lastName}`,
      lastAttendanceDate: lastDate,
      missedEvents,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  return alerts;
};

// Utility Functions
export const findAvailableDevicesForEvent = async (
  startTime: Date,
  endTime: Date,
  locationId: string,
  branchId: string,
): Promise<CardDevice[]> => {
  // Find devices at this location/branch that aren't assigned to other events
  const overlappingEvents = mockEvents.filter(
    (event) =>
      event.startTime <= endTime &&
      event.endTime >= startTime &&
      event.status !== "cancelled",
  );

  const assignedDeviceIds = overlappingEvents.flatMap(
    (e) => e.assignedDevices || [],
  );

  const availableDevices = mockDevices.filter(
    (device) =>
      device.locationId === locationId &&
      device.branchId === branchId &&
      device.status !== "maintenance" &&
      !assignedDeviceIds.includes(device.id),
  );

  return availableDevices;
};

export const simulateCardScan = async (
  cardNumber: string,
  deviceId: string,
): Promise<AttendanceRecord> => {
  // Find the card
  const card = mockCards.find(
    (c) => c.cardNumber === cardNumber && c.status === "active",
  );
  if (!card) {
    throw new Error(`Active card with number ${cardNumber} not found`);
  }

  // Find the device
  const device = mockDevices.find((d) => d.id === deviceId);
  if (!device) {
    throw new Error(`Device with ID ${deviceId} not found`);
  }

  if (device.status !== "online") {
    throw new Error(`Device ${device.name} is not online`);
  }

  // Find the event assigned to this device
  const eventId = device.assignedEventId;
  if (!eventId) {
    throw new Error(`No event assigned to device ${device.name}`);
  }

  const event = mockEvents.find((e) => e.id === eventId);
  if (!event) {
    throw new Error(`Event with ID ${eventId} not found`);
  }

  if (event.status !== "in_progress" && event.status !== "scheduled") {
    throw new Error(`Event ${event.name} is not active`);
  }

  // Record attendance
  return recordAttendance(card.memberId, eventId, "card_scan", deviceId);
};
