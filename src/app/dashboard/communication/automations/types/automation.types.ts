/**
 * Automation Types and Interfaces
 * Defines all types used in the communication automation system
 */

export enum AutomationType {
  BIRTHDAY = 'BIRTHDAY',
  ANNIVERSARY = 'ANNIVERSARY',
  SACRAMENTAL_ANNIVERSARY = 'SACRAMENTAL_ANNIVERSARY',
  ABSENCE = 'ABSENCE',
  FIRST_TIMER = 'FIRST_TIMER',
  VISITOR_FOLLOWUP = 'VISITOR_FOLLOWUP',
  NEW_CONVERT = 'NEW_CONVERT',
  PAYMENT_RECEIPT = 'PAYMENT_RECEIPT',
  PAYMENT_THANK_YOU = 'PAYMENT_THANK_YOU',
  RECURRING_GIVING_REMINDER = 'RECURRING_GIVING_REMINDER',
  RETURN_WELCOME = 'RETURN_WELCOME',
  EVENT_REMINDER = 'EVENT_REMINDER',
}

export enum AutomationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PAUSED = 'PAUSED',
  ERROR = 'ERROR',
}

export enum MessageChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum TriggerType {
  TIME_BASED = 'TIME_BASED', // Cron schedule
  EVENT_BASED = 'EVENT_BASED', // On specific event
  CONDITION_BASED = 'CONDITION_BASED', // When condition met
}

export interface AutomationConfig {
  id: string;
  name: string;
  description: string;
  type: AutomationType;
  status: AutomationStatus;
  isEnabled: boolean;
  triggerType: TriggerType;
  schedule?: string; // Cron expression for time-based
  channels: MessageChannel[];
  templateId?: string;
  conditions?: AutomationCondition[];
  lastRun?: Date;
  nextRun?: Date;
  successRate?: number;
  totalRuns?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface AutomationStats {
  totalAutomations: number;
  activeAutomations: number;
  totalMessagesSent: number;
  successRate: number;
  recentRuns: AutomationRun[];
}

export interface AutomationRun {
  id: string;
  automationId: string;
  automationName: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  recipientCount: number;
  successCount: number;
  failedCount: number;
  errorMessage?: string;
  executedAt: Date;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  type: MessageChannel;
  subject?: string;
  bodyText: string;
  bodyHtml?: string;
  variables: string[]; // Available placeholders
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Predefined automation configurations
export const AUTOMATION_DEFINITIONS: Record<AutomationType, Omit<AutomationConfig, 'id' | 'createdAt' | 'updatedAt' | 'lastRun' | 'nextRun' | 'successRate' | 'totalRuns'>> = {
  [AutomationType.BIRTHDAY]: {
    name: 'Birthday Messages',
    description: 'Automatically send birthday wishes to members on their birthday',
    type: AutomationType.BIRTHDAY,
    status: AutomationStatus.ACTIVE,
    isEnabled: true,
    triggerType: TriggerType.TIME_BASED,
    schedule: '0 8 * * *', // Daily at 8 AM
    channels: [MessageChannel.EMAIL, MessageChannel.SMS],
  },
  [AutomationType.ANNIVERSARY]: {
    name: 'Anniversary Messages',
    description: 'Send wedding anniversary wishes to married couples',
    type: AutomationType.ANNIVERSARY,
    status: AutomationStatus.ACTIVE,
    isEnabled: true,
    triggerType: TriggerType.TIME_BASED,
    schedule: '0 8 * * *',
    channels: [MessageChannel.EMAIL, MessageChannel.SMS],
  },
  [AutomationType.SACRAMENTAL_ANNIVERSARY]: {
    name: 'Sacramental Anniversaries',
    description: 'Celebrate baptism, confirmation, and other sacramental anniversaries',
    type: AutomationType.SACRAMENTAL_ANNIVERSARY,
    status: AutomationStatus.ACTIVE,
    isEnabled: true,
    triggerType: TriggerType.TIME_BASED,
    schedule: '0 8 * * *',
    channels: [MessageChannel.EMAIL],
  },
  [AutomationType.ABSENCE]: {
    name: 'Absence Messages',
    description: 'Send follow-up messages to members absent from services',
    type: AutomationType.ABSENCE,
    status: AutomationStatus.INACTIVE,
    isEnabled: false,
    triggerType: TriggerType.CONDITION_BASED,
    channels: [MessageChannel.EMAIL, MessageChannel.SMS],
    conditions: [
      { field: 'absenceWeeks', operator: 'greater_than', value: 2 }
    ],
  },
  [AutomationType.FIRST_TIMER]: {
    name: 'First-Timer Welcome',
    description: 'Welcome first-time attendees and introduce them to the church',
    type: AutomationType.FIRST_TIMER,
    status: AutomationStatus.INACTIVE,
    isEnabled: false,
    triggerType: TriggerType.EVENT_BASED,
    channels: [MessageChannel.EMAIL, MessageChannel.SMS],
  },
  [AutomationType.VISITOR_FOLLOWUP]: {
    name: 'Visitor Follow-up',
    description: 'Follow up with visitors after their visit',
    type: AutomationType.VISITOR_FOLLOWUP,
    status: AutomationStatus.INACTIVE,
    isEnabled: false,
    triggerType: TriggerType.EVENT_BASED,
    channels: [MessageChannel.EMAIL],
  },
  [AutomationType.NEW_CONVERT]: {
    name: 'New Convert Nurturing',
    description: 'Nurture new converts with a discipleship series',
    type: AutomationType.NEW_CONVERT,
    status: AutomationStatus.INACTIVE,
    isEnabled: false,
    triggerType: TriggerType.EVENT_BASED,
    channels: [MessageChannel.EMAIL, MessageChannel.SMS],
  },
  [AutomationType.PAYMENT_RECEIPT]: {
    name: 'Payment Receipts',
    description: 'Automatically send receipts for donations and payments',
    type: AutomationType.PAYMENT_RECEIPT,
    status: AutomationStatus.INACTIVE,
    isEnabled: false,
    triggerType: TriggerType.EVENT_BASED,
    channels: [MessageChannel.EMAIL],
  },
  [AutomationType.PAYMENT_THANK_YOU]: {
    name: 'Payment Thank You',
    description: 'Send thank you messages for donations and tithes',
    type: AutomationType.PAYMENT_THANK_YOU,
    status: AutomationStatus.INACTIVE,
    isEnabled: false,
    triggerType: TriggerType.EVENT_BASED,
    channels: [MessageChannel.EMAIL, MessageChannel.SMS],
  },
  [AutomationType.RECURRING_GIVING_REMINDER]: {
    name: 'Recurring Giving Reminders',
    description: 'Remind recurring givers before their scheduled giving date',
    type: AutomationType.RECURRING_GIVING_REMINDER,
    status: AutomationStatus.INACTIVE,
    isEnabled: false,
    triggerType: TriggerType.TIME_BASED,
    schedule: '0 9 * * 0', // Sunday at 9 AM
    channels: [MessageChannel.EMAIL],
  },
  [AutomationType.RETURN_WELCOME]: {
    name: 'Return Welcome',
    description: 'Welcome back members who return after being absent',
    type: AutomationType.RETURN_WELCOME,
    status: AutomationStatus.INACTIVE,
    isEnabled: false,
    triggerType: TriggerType.EVENT_BASED,
    channels: [MessageChannel.EMAIL, MessageChannel.SMS],
  },
  [AutomationType.EVENT_REMINDER]: {
    name: 'Event Reminders',
    description: 'Send reminders for upcoming church events',
    type: AutomationType.EVENT_REMINDER,
    status: AutomationStatus.INACTIVE,
    isEnabled: false,
    triggerType: TriggerType.TIME_BASED,
    channels: [MessageChannel.EMAIL, MessageChannel.SMS, MessageChannel.PUSH],
  },
};

// Helper functions
export const getAutomationIcon = (type: AutomationType): string => {
  const icons: Record<AutomationType, string> = {
    [AutomationType.BIRTHDAY]: '🎂',
    [AutomationType.ANNIVERSARY]: '💍',
    [AutomationType.SACRAMENTAL_ANNIVERSARY]: '✝️',
    [AutomationType.ABSENCE]: '📅',
    [AutomationType.FIRST_TIMER]: '👋',
    [AutomationType.VISITOR_FOLLOWUP]: '🤝',
    [AutomationType.NEW_CONVERT]: '🙏',
    [AutomationType.PAYMENT_RECEIPT]: '🧾',
    [AutomationType.PAYMENT_THANK_YOU]: '💰',
    [AutomationType.RECURRING_GIVING_REMINDER]: '🔔',
    [AutomationType.RETURN_WELCOME]: '🎉',
    [AutomationType.EVENT_REMINDER]: '📢',
  };
  return icons[type] || '📧';
};

export const getAutomationColor = (type: AutomationType): string => {
  const colors: Record<AutomationType, string> = {
    [AutomationType.BIRTHDAY]: 'pink',
    [AutomationType.ANNIVERSARY]: 'rose',
    [AutomationType.SACRAMENTAL_ANNIVERSARY]: 'purple',
    [AutomationType.ABSENCE]: 'orange',
    [AutomationType.FIRST_TIMER]: 'blue',
    [AutomationType.VISITOR_FOLLOWUP]: 'cyan',
    [AutomationType.NEW_CONVERT]: 'green',
    [AutomationType.PAYMENT_RECEIPT]: 'gray',
    [AutomationType.PAYMENT_THANK_YOU]: 'yellow',
    [AutomationType.RECURRING_GIVING_REMINDER]: 'amber',
    [AutomationType.RETURN_WELCOME]: 'emerald',
    [AutomationType.EVENT_REMINDER]: 'indigo',
  };
  return colors[type] || 'blue';
};

export const getStatusColor = (status: AutomationStatus): string => {
  const colors: Record<AutomationStatus, string> = {
    [AutomationStatus.ACTIVE]: 'green',
    [AutomationStatus.INACTIVE]: 'gray',
    [AutomationStatus.PAUSED]: 'yellow',
    [AutomationStatus.ERROR]: 'red',
  };
  return colors[status];
};

export const formatCronSchedule = (cron?: string): string => {
  if (!cron) return 'On event';
  
  // Simple cron parser for common patterns
  const patterns: Record<string, string> = {
    '0 8 * * *': 'Daily at 8:00 AM',
    '0 9 * * 0': 'Every Sunday at 9:00 AM',
    '0 0 * * *': 'Daily at midnight',
    '0 12 * * *': 'Daily at noon',
  };
  
  return patterns[cron] || cron;
};
