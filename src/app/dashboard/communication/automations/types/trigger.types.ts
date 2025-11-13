/**
 * Trigger Configuration Types
 * Defines types for event-based and condition-based automation triggers
 */

// Event Types
export enum EventType {
  // Member Events
  MEMBER_CREATED = 'MEMBER_CREATED',
  MEMBER_UPDATED = 'MEMBER_UPDATED',
  MEMBER_BIRTHDAY = 'MEMBER_BIRTHDAY',
  MEMBER_ANNIVERSARY = 'MEMBER_ANNIVERSARY',
  
  // Attendance Events
  ATTENDANCE_MARKED = 'ATTENDANCE_MARKED',
  ATTENDANCE_ABSENT = 'ATTENDANCE_ABSENT',
  FIRST_TIME_ATTENDANCE = 'FIRST_TIME_ATTENDANCE',
  
  // Giving Events
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PLEDGE_CREATED = 'PLEDGE_CREATED',
  PLEDGE_COMPLETED = 'PLEDGE_COMPLETED',
  
  // Event Registration
  EVENT_REGISTERED = 'EVENT_REGISTERED',
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  
  // Membership Events
  MEMBERSHIP_APPROVED = 'MEMBERSHIP_APPROVED',
  MEMBERSHIP_EXPIRED = 'MEMBERSHIP_EXPIRED',
  
  // Sacrament Events
  SACRAMENT_RECEIVED = 'SACRAMENT_RECEIVED',
  SACRAMENT_ANNIVERSARY = 'SACRAMENT_ANNIVERSARY',
}

// Condition Operators
export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
  BETWEEN = 'between',
}

// Field Types
export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  ENUM = 'enum',
  ARRAY = 'array',
}

// Logical Operators
export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
}

// Condition Field Definition
export interface ConditionField {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[]; // For enum types
  description?: string;
}

// Single Condition
export interface Condition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: any;
  fieldType?: FieldType;
}

// Condition Group (supports nested conditions)
export interface ConditionGroup {
  id: string;
  operator: LogicalOperator;
  conditions: (Condition | ConditionGroup)[];
}

// Event Configuration
export interface EventTriggerConfig {
  eventType: EventType;
  conditions?: ConditionGroup;
  delay?: number; // Delay in minutes before sending
  maxOccurrences?: number; // Max times this can trigger per member
}

// Condition Configuration
export interface ConditionTriggerConfig {
  conditions: ConditionGroup;
  checkInterval?: string; // Cron expression for checking
  delay?: number; // Delay in minutes before sending
}

// Combined Trigger Config
export type TriggerConfig = EventTriggerConfig | ConditionTriggerConfig | null;

// Available Fields for Conditions
export const MEMBER_FIELDS: ConditionField[] = [
  { key: 'firstName', label: 'First Name', type: FieldType.STRING },
  { key: 'lastName', label: 'Last Name', type: FieldType.STRING },
  { key: 'email', label: 'Email', type: FieldType.STRING },
  { key: 'phone', label: 'Phone', type: FieldType.STRING },
  { key: 'gender', label: 'Gender', type: FieldType.ENUM, options: [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ]},
  { key: 'maritalStatus', label: 'Marital Status', type: FieldType.ENUM, options: [
    { value: 'SINGLE', label: 'Single' },
    { value: 'MARRIED', label: 'Married' },
    { value: 'DIVORCED', label: 'Divorced' },
    { value: 'WIDOWED', label: 'Widowed' },
  ]},
  { key: 'dateOfBirth', label: 'Date of Birth', type: FieldType.DATE },
  { key: 'age', label: 'Age', type: FieldType.NUMBER },
  { key: 'membershipStatus', label: 'Membership Status', type: FieldType.ENUM, options: [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending' },
  ]},
  { key: 'membershipDate', label: 'Membership Date', type: FieldType.DATE },
  { key: 'branchId', label: 'Branch', type: FieldType.STRING },
];

export const ATTENDANCE_FIELDS: ConditionField[] = [
  { key: 'attendanceCount', label: 'Attendance Count', type: FieldType.NUMBER },
  { key: 'lastAttendanceDate', label: 'Last Attendance Date', type: FieldType.DATE },
  { key: 'consecutiveAbsences', label: 'Consecutive Absences', type: FieldType.NUMBER },
  { key: 'attendanceRate', label: 'Attendance Rate (%)', type: FieldType.NUMBER },
];

export const GIVING_FIELDS: ConditionField[] = [
  { key: 'totalGiving', label: 'Total Giving', type: FieldType.NUMBER },
  { key: 'lastGivingDate', label: 'Last Giving Date', type: FieldType.DATE },
  { key: 'averageGiving', label: 'Average Giving', type: FieldType.NUMBER },
  { key: 'givingFrequency', label: 'Giving Frequency', type: FieldType.ENUM, options: [
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'OCCASIONAL', label: 'Occasional' },
  ]},
];

// Event Type Metadata
export const EVENT_TYPE_METADATA: Record<EventType, {
  label: string;
  description: string;
  icon: string;
  category: 'member' | 'attendance' | 'giving' | 'event' | 'membership' | 'sacrament';
}> = {
  [EventType.MEMBER_CREATED]: {
    label: 'Member Created',
    description: 'When a new member is added to the system',
    icon: '👤',
    category: 'member',
  },
  [EventType.MEMBER_UPDATED]: {
    label: 'Member Updated',
    description: 'When member information is updated',
    icon: '✏️',
    category: 'member',
  },
  [EventType.MEMBER_BIRTHDAY]: {
    label: 'Member Birthday',
    description: 'On member\'s birthday',
    icon: '🎂',
    category: 'member',
  },
  [EventType.MEMBER_ANNIVERSARY]: {
    label: 'Member Anniversary',
    description: 'On member\'s wedding anniversary',
    icon: '💑',
    category: 'member',
  },
  [EventType.ATTENDANCE_MARKED]: {
    label: 'Attendance Marked',
    description: 'When attendance is recorded',
    icon: '✅',
    category: 'attendance',
  },
  [EventType.ATTENDANCE_ABSENT]: {
    label: 'Attendance Absent',
    description: 'When member is marked absent',
    icon: '❌',
    category: 'attendance',
  },
  [EventType.FIRST_TIME_ATTENDANCE]: {
    label: 'First Time Attendance',
    description: 'When someone attends for the first time',
    icon: '🆕',
    category: 'attendance',
  },
  [EventType.PAYMENT_RECEIVED]: {
    label: 'Payment Received',
    description: 'When a payment is recorded',
    icon: '💰',
    category: 'giving',
  },
  [EventType.PLEDGE_CREATED]: {
    label: 'Pledge Created',
    description: 'When a new pledge is made',
    icon: '🤝',
    category: 'giving',
  },
  [EventType.PLEDGE_COMPLETED]: {
    label: 'Pledge Completed',
    description: 'When a pledge is fully paid',
    icon: '✨',
    category: 'giving',
  },
  [EventType.EVENT_REGISTERED]: {
    label: 'Event Registered',
    description: 'When someone registers for an event',
    icon: '📅',
    category: 'event',
  },
  [EventType.EVENT_CANCELLED]: {
    label: 'Event Cancelled',
    description: 'When event registration is cancelled',
    icon: '🚫',
    category: 'event',
  },
  [EventType.MEMBERSHIP_APPROVED]: {
    label: 'Membership Approved',
    description: 'When membership is approved',
    icon: '✅',
    category: 'membership',
  },
  [EventType.MEMBERSHIP_EXPIRED]: {
    label: 'Membership Expired',
    description: 'When membership expires',
    icon: '⏰',
    category: 'membership',
  },
  [EventType.SACRAMENT_RECEIVED]: {
    label: 'Sacrament Received',
    description: 'When a sacrament is received',
    icon: '✝️',
    category: 'sacrament',
  },
  [EventType.SACRAMENT_ANNIVERSARY]: {
    label: 'Sacrament Anniversary',
    description: 'On sacrament anniversary',
    icon: '🎊',
    category: 'sacrament',
  },
};

// Operator Labels
export const OPERATOR_LABELS: Record<ConditionOperator, string> = {
  [ConditionOperator.EQUALS]: 'equals',
  [ConditionOperator.NOT_EQUALS]: 'does not equal',
  [ConditionOperator.GREATER_THAN]: 'is greater than',
  [ConditionOperator.LESS_THAN]: 'is less than',
  [ConditionOperator.GREATER_THAN_OR_EQUAL]: 'is greater than or equal to',
  [ConditionOperator.LESS_THAN_OR_EQUAL]: 'is less than or equal to',
  [ConditionOperator.CONTAINS]: 'contains',
  [ConditionOperator.NOT_CONTAINS]: 'does not contain',
  [ConditionOperator.STARTS_WITH]: 'starts with',
  [ConditionOperator.ENDS_WITH]: 'ends with',
  [ConditionOperator.IN]: 'is in',
  [ConditionOperator.NOT_IN]: 'is not in',
  [ConditionOperator.IS_EMPTY]: 'is empty',
  [ConditionOperator.IS_NOT_EMPTY]: 'is not empty',
  [ConditionOperator.BETWEEN]: 'is between',
};

// Get operators for field type
export function getOperatorsForFieldType(fieldType: FieldType): ConditionOperator[] {
  switch (fieldType) {
    case FieldType.STRING:
      return [
        ConditionOperator.EQUALS,
        ConditionOperator.NOT_EQUALS,
        ConditionOperator.CONTAINS,
        ConditionOperator.NOT_CONTAINS,
        ConditionOperator.STARTS_WITH,
        ConditionOperator.ENDS_WITH,
        ConditionOperator.IS_EMPTY,
        ConditionOperator.IS_NOT_EMPTY,
      ];
    case FieldType.NUMBER:
      return [
        ConditionOperator.EQUALS,
        ConditionOperator.NOT_EQUALS,
        ConditionOperator.GREATER_THAN,
        ConditionOperator.LESS_THAN,
        ConditionOperator.GREATER_THAN_OR_EQUAL,
        ConditionOperator.LESS_THAN_OR_EQUAL,
        ConditionOperator.BETWEEN,
      ];
    case FieldType.DATE:
      return [
        ConditionOperator.EQUALS,
        ConditionOperator.NOT_EQUALS,
        ConditionOperator.GREATER_THAN,
        ConditionOperator.LESS_THAN,
        ConditionOperator.BETWEEN,
      ];
    case FieldType.BOOLEAN:
      return [
        ConditionOperator.EQUALS,
      ];
    case FieldType.ENUM:
      return [
        ConditionOperator.EQUALS,
        ConditionOperator.NOT_EQUALS,
        ConditionOperator.IN,
        ConditionOperator.NOT_IN,
      ];
    case FieldType.ARRAY:
      return [
        ConditionOperator.CONTAINS,
        ConditionOperator.NOT_CONTAINS,
        ConditionOperator.IS_EMPTY,
        ConditionOperator.IS_NOT_EMPTY,
      ];
    default:
      return [ConditionOperator.EQUALS, ConditionOperator.NOT_EQUALS];
  }
}
