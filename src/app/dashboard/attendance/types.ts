// Attendance Tracking System Types

export interface MemberCard {
  id: string;
  memberId: string;
  cardNumber: string;
  issueDate: Date;
  status: "active" | "inactive" | "lost";
  lastUsed?: Date;
  cardType: "rfid" | "nfc" | "qr";
  assignedBy: string;
  notes?: string;
}

export interface CardDevice {
  id: string;
  name: string;
  locationId: string;
  branchId: string;
  status: "online" | "offline" | "maintenance";
  lastConnected: Date;
  assignedEventId?: string;
  deviceType: "wall-mounted" | "kiosk" | "mobile" | "admin";
  ipAddress?: string;
  firmwareVersion?: string;
  batteryLevel?: number;
}

export interface AttendanceRecord {
  id: string;
  checkInTime: string;
  checkOutTime?: string;
  checkInMethod?: string;
  notes?: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  recordedById?: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
  session?: {
    id: string;
    name?: string;
    date?: string;
    type?: string;
  };
  event?: {
    id: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    category?: string;
  };
  member?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  recordedBy?: {
    id: string;
  };
  branch?: {
    id: string;
    name?: string;
  };
  // Legacy fields for backward compatibility
  memberId?: string;
  memberName?: string;
  eventId?: string;
  eventName?: string;
  timestamp?: Date;
  method?: "card_scan" | "manual_entry" | "mobile_app" | "qr_code";
  deviceId?: string;
  locationId?: string;
  status?: "checked_in" | "checked_out" | "pending";
  checkedOutTimestamp?: Date;
  familyCheckIn?: boolean;
  familyMembers?: {
    memberId: string;
    memberName: string;
    status: "checked_in" | "checked_out" | "pending";
  }[];
}

export interface AttendanceEvent {
  id: string;
  name: string;
  type: "service" | "meeting" | "class" | "special" | "other";
  startTime: Date;
  endTime: Date;
  locationId: string;
  branchId: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  expectedAttendees?: number;
  recurringId?: string;
  recurrencePattern?: "weekly" | "monthly" | "custom";
  dayOfWeek?: number;
  createdBy: string;
  allowFamilyCheckIn: boolean;
  requiresChildPickup: boolean;
  allowEarlyCheckIn: boolean; // Minutes before event start
  earlyCheckInWindow?: number;
  allowLateCheckIn: boolean;
  lateCheckInWindow?: number;
  assignedDevices?: string[];
}

export interface AttendanceStats {
  eventId: string;
  eventName: string;
  date: Date;
  totalAttendees: number;
  newVisitors: number;
  returningMembers: number;
  childrenCount: number;
  adultCount: number;
  familyCheckIns: number;
  averageDuration?: number;
  checkInByMethod: {
    cardScan: number;
    manualEntry: number;
    mobileApp: number;
    qrCode: number;
  };
  comparisonToPrevious?: {
    percentChange: number;
    previousCount: number;
  };
}

export interface AttendanceTrend {
  startDate: Date;
  endDate: Date;
  eventType?: string;
  branchId?: string;
  weeklyData: {
    weekStarting: Date;
    totalAttendance: number;
    uniqueAttendees: number;
    newVisitors: number;
  }[];
  monthlyData: {
    month: string;
    totalAttendance: number;
    uniqueAttendees: number;
    newVisitors: number;
    averagePerService: number;
  }[];
  overallGrowth: number;
  peakAttendanceDate: Date;
  peakAttendanceCount: number;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  status: "active" | "inactive" | "visitor" | "former";
  joinDate?: Date;
  lastAttendance?: Date;
  homeAddress?: string;
  birthDate?: Date;
  familyId?: string;
  primaryBranchId: string;
  hasCard: boolean;
  cardId?: string;
  attendanceStreak?: number;
  attendanceRate?: number; // Percentage of attended events in last 3 months
  isChild: boolean;
  childPickupPeople?: string[]; // Member IDs authorized for pickup
  tags?: string[];
}

export interface AbsenceAlert {
  id: string;
  memberId: string;
  memberName: string;
  lastAttendanceDate: Date;
  missedEvents: number;
  status: "new" | "in_progress" | "resolved" | "dismissed";
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  followUpActions?: string[];
}
