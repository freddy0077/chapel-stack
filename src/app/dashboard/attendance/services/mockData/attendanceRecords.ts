// Mock attendance records for demo purposes
import { AttendanceRecord } from '../../types';

export const mockAttendanceRecords: AttendanceRecord[] = [
  // Last Sunday Service Attendance (event_002)
  {
    id: 'att_001',
    memberId: 'mem_001',
    memberName: 'John Smith',
    eventId: 'event_002',
    eventName: 'Sunday Worship Service',
    timestamp: new Date('2025-04-06T09:45:00'), // 15 minutes early
    method: 'card_scan',
    deviceId: 'device_001',
    locationId: 'loc_001',
    branchId: 'branch_001',
    status: 'checked_in',
    familyCheckIn: true,
    familyMembers: [
      {
        memberId: 'mem_002',
        memberName: 'Mary Smith',
        status: 'checked_in'
      },
      {
        memberId: 'mem_003',
        memberName: 'Emma Smith',
        status: 'checked_in'
      }
    ]
  },
  {
    id: 'att_002',
    memberId: 'mem_004',
    memberName: 'Michael Johnson',
    eventId: 'event_002',
    eventName: 'Sunday Worship Service',
    timestamp: new Date('2025-04-06T09:52:00'),
    method: 'card_scan',
    deviceId: 'device_002',
    locationId: 'loc_001',
    branchId: 'branch_001',
    status: 'checked_in',
    familyCheckIn: true,
    familyMembers: [
      {
        memberId: 'mem_005',
        memberName: 'Sarah Johnson',
        status: 'checked_in'
      }
    ]
  },
  {
    id: 'att_003',
    memberId: 'mem_008',
    memberName: 'Robert Jones',
    eventId: 'event_002',
    eventName: 'Sunday Worship Service',
    timestamp: new Date('2025-04-06T10:05:00'), // 5 minutes late
    method: 'manual_entry',
    deviceId: 'device_001',
    locationId: 'loc_001',
    branchId: 'branch_001',
    status: 'checked_in',
    notes: 'First-time visitor, welcome packet provided'
  },
  {
    id: 'att_004',
    memberId: 'mem_007',
    memberName: 'Jennifer Brown',
    eventId: 'event_006', // Branch 2 Sunday Service
    eventName: 'Sunday Worship Service',
    timestamp: new Date('2025-04-06T09:50:00'),
    method: 'card_scan',
    deviceId: 'device_007',
    locationId: 'loc_002',
    branchId: 'branch_002',
    status: 'checked_in'
  },
  {
    id: 'att_005',
    memberId: 'mem_010',
    memberName: 'James Martinez',
    eventId: 'event_006', // Branch 2 Sunday Service
    eventName: 'Sunday Worship Service',
    timestamp: new Date('2025-04-06T09:48:00'),
    method: 'card_scan',
    deviceId: 'device_007',
    locationId: 'loc_002',
    branchId: 'branch_002',
    status: 'checked_in'
  },
  
  // Last Wednesday Bible Study (event_004)
  {
    id: 'att_006',
    memberId: 'mem_001',
    memberName: 'John Smith',
    eventId: 'event_004',
    eventName: 'Wednesday Bible Study',
    timestamp: new Date('2025-04-09T19:02:00'),
    method: 'card_scan',
    deviceId: 'device_010',
    locationId: 'loc_003',
    branchId: 'branch_001',
    status: 'checked_in'
  },
  {
    id: 'att_007',
    memberId: 'mem_002',
    memberName: 'Mary Smith',
    eventId: 'event_004',
    eventName: 'Wednesday Bible Study',
    timestamp: new Date('2025-04-09T19:02:00'),
    method: 'card_scan',
    deviceId: 'device_010',
    locationId: 'loc_003',
    branchId: 'branch_001',
    status: 'checked_in'
  },
  {
    id: 'att_008',
    memberId: 'mem_010',
    memberName: 'James Martinez',
    eventId: 'event_004',
    eventName: 'Wednesday Bible Study',
    timestamp: new Date('2025-04-09T18:57:00'),
    method: 'mobile_app',
    locationId: 'loc_003',
    branchId: 'branch_001',
    status: 'checked_in',
    notes: 'Checked in via mobile app - group leader'
  },
  
  // Youth Group Meeting (event_007)
  {
    id: 'att_009',
    memberId: 'mem_006',
    memberName: 'David Williams',
    eventId: 'event_007',
    eventName: 'Youth Group Meeting',
    timestamp: new Date('2025-04-06T16:55:00'),
    method: 'card_scan',
    deviceId: 'device_008',
    locationId: 'loc_001',
    branchId: 'branch_001',
    status: 'checked_in',
    checkedOutTimestamp: new Date('2025-04-06T19:05:00')
  },
  
  // Previous Sunday Service (2 weeks ago - event_008)
  {
    id: 'att_010',
    memberId: 'mem_001',
    memberName: 'John Smith',
    eventId: 'event_008',
    eventName: 'Sunday Worship Service',
    timestamp: new Date('2025-03-30T09:50:00'),
    method: 'card_scan',
    deviceId: 'device_001',
    locationId: 'loc_001',
    branchId: 'branch_001',
    status: 'checked_in',
    familyCheckIn: true,
    familyMembers: [
      {
        memberId: 'mem_002',
        memberName: 'Mary Smith',
        status: 'checked_in'
      },
      {
        memberId: 'mem_003',
        memberName: 'Emma Smith',
        status: 'checked_in'
      }
    ]
  },
  {
    id: 'att_011',
    memberId: 'mem_004',
    memberName: 'Michael Johnson',
    eventId: 'event_008',
    eventName: 'Sunday Worship Service',
    timestamp: new Date('2025-03-30T09:55:00'),
    method: 'card_scan',
    deviceId: 'device_002',
    locationId: 'loc_001',
    branchId: 'branch_001',
    status: 'checked_in',
    familyCheckIn: true,
    familyMembers: [
      {
        memberId: 'mem_005',
        memberName: 'Sarah Johnson',
        status: 'checked_in'
      }
    ]
  },
  {
    id: 'att_012',
    memberId: 'mem_006',
    memberName: 'David Williams',
    eventId: 'event_008',
    eventName: 'Sunday Worship Service',
    timestamp: new Date('2025-03-30T10:03:00'),
    method: 'card_scan',
    deviceId: 'device_002',
    locationId: 'loc_001',
    branchId: 'branch_001',
    status: 'checked_in'
  },
  {
    id: 'att_013',
    memberId: 'mem_009',
    memberName: 'William Taylor',
    eventId: 'event_008',
    eventName: 'Sunday Worship Service',
    timestamp: new Date('2025-03-30T09:48:00'),
    method: 'card_scan',
    deviceId: 'device_001',
    locationId: 'loc_001',
    branchId: 'branch_001',
    status: 'checked_in',
    notes: 'Last attendance before becoming inactive'
  }
];
