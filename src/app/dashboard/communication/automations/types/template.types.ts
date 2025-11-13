/**
 * Template Types and Interfaces
 * Defines all types used in the message template system
 */

import { MessageChannel } from './automation.types';

export enum TemplateCategory {
  CELEBRATIONS = 'CELEBRATIONS',
  MEMBERSHIP = 'MEMBERSHIP',
  ATTENDANCE = 'ATTENDANCE',
  GIVING = 'GIVING',
  EVENTS = 'EVENTS',
  PASTORAL = 'PASTORAL',
  GENERAL = 'GENERAL',
}

export interface MessageTemplate {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  type: MessageChannel;
  subject?: string; // For email
  bodyText: string; // Plain text version
  bodyHtml?: string; // HTML version for email
  variables: TemplateVariable[];
  isActive: boolean;
  isSystem: boolean; // System templates can't be deleted
  organisationId?: string;
  branchId?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount?: number; // How many times used
}

export interface TemplateVariable {
  key: string;
  label: string;
  description?: string;
  example?: string;
  required?: boolean;
}

// Available template variables
export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  {
    key: '{firstName}',
    label: 'First Name',
    description: 'Member\'s first name',
    example: 'John',
    required: false,
  },
  {
    key: '{lastName}',
    label: 'Last Name',
    description: 'Member\'s last name',
    example: 'Doe',
    required: false,
  },
  {
    key: '{fullName}',
    label: 'Full Name',
    description: 'Member\'s full name',
    example: 'John Doe',
    required: false,
  },
  {
    key: '{email}',
    label: 'Email',
    description: 'Member\'s email address',
    example: 'john@example.com',
    required: false,
  },
  {
    key: '{phoneNumber}',
    label: 'Phone Number',
    description: 'Member\'s phone number',
    example: '+233 24 123 4567',
    required: false,
  },
  {
    key: '{churchName}',
    label: 'Church Name',
    description: 'Name of the church/organization',
    example: 'Grace Chapel',
    required: false,
  },
  {
    key: '{branchName}',
    label: 'Branch Name',
    description: 'Name of the branch',
    example: 'Accra Branch',
    required: false,
  },
  {
    key: '{date}',
    label: 'Current Date',
    description: 'Today\'s date',
    example: 'November 8, 2025',
    required: false,
  },
  {
    key: '{eventName}',
    label: 'Event Name',
    description: 'Name of the event',
    example: 'Sunday Service',
    required: false,
  },
  {
    key: '{eventDate}',
    label: 'Event Date',
    description: 'Date of the event',
    example: 'November 10, 2025',
    required: false,
  },
  {
    key: '{eventTime}',
    label: 'Event Time',
    description: 'Time of the event',
    example: '9:00 AM',
    required: false,
  },
  {
    key: '{eventLocation}',
    label: 'Event Location',
    description: 'Location of the event',
    example: 'Main Sanctuary',
    required: false,
  },
  {
    key: '{amount}',
    label: 'Amount',
    description: 'Payment/donation amount',
    example: 'GH₵ 100.00',
    required: false,
  },
  {
    key: '{paymentDate}',
    label: 'Payment Date',
    description: 'Date of payment',
    example: 'November 8, 2025',
    required: false,
  },
  {
    key: '{receiptNumber}',
    label: 'Receipt Number',
    description: 'Payment receipt number',
    example: 'RCP-2025-001',
    required: false,
  },
];

// Predefined system templates
export const SYSTEM_TEMPLATES: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>[] = [
  {
    name: 'Birthday Wishes',
    description: 'Send birthday greetings to members',
    category: TemplateCategory.CELEBRATIONS,
    type: MessageChannel.EMAIL,
    subject: 'Happy Birthday {firstName}! 🎂',
    bodyText: `Dear {firstName},

Happy Birthday! 🎂🎉

On this special day, we want you to know how blessed we are to have you as part of our {churchName} family. May this year bring you abundant joy, peace, and countless blessings.

We pray that God's grace and favor will follow you all the days of your life.

With love and prayers,
{churchName} Family`,
    bodyHtml: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #ec4899;">Happy Birthday {firstName}! 🎂</h2>
  <p>Dear {firstName},</p>
  <p>On this special day, we want you to know how blessed we are to have you as part of our <strong>{churchName}</strong> family.</p>
  <p>May this year bring you abundant joy, peace, and countless blessings.</p>
  <p>We pray that God's grace and favor will follow you all the days of your life.</p>
  <p style="margin-top: 30px;">With love and prayers,<br/><strong>{churchName} Family</strong></p>
</div>`,
    variables: [
      TEMPLATE_VARIABLES.find(v => v.key === '{firstName}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{churchName}')!,
    ],
    isActive: true,
    isSystem: true,
  },
  {
    name: 'Anniversary Wishes',
    description: 'Send wedding anniversary greetings',
    category: TemplateCategory.CELEBRATIONS,
    type: MessageChannel.EMAIL,
    subject: 'Happy Anniversary {firstName}! 💍',
    bodyText: `Dear {fullName},

Happy Anniversary! 💍❤️

Congratulations on another year of love, commitment, and partnership. Your marriage is a beautiful testimony of God's faithfulness.

May your love continue to grow stronger with each passing year, and may God's blessings overflow in your home.

Celebrating with you,
{churchName} Family`,
    bodyHtml: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #f43f5e;">Happy Anniversary {firstName}! 💍</h2>
  <p>Dear {fullName},</p>
  <p>Congratulations on another year of love, commitment, and partnership. Your marriage is a beautiful testimony of God's faithfulness.</p>
  <p>May your love continue to grow stronger with each passing year, and may God's blessings overflow in your home.</p>
  <p style="margin-top: 30px;">Celebrating with you,<br/><strong>{churchName} Family</strong></p>
</div>`,
    variables: [
      TEMPLATE_VARIABLES.find(v => v.key === '{firstName}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{fullName}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{churchName}')!,
    ],
    isActive: true,
    isSystem: true,
  },
  {
    name: 'Absence Follow-up',
    description: 'Follow up with members who have been absent',
    category: TemplateCategory.ATTENDANCE,
    type: MessageChannel.SMS,
    bodyText: `Hi {firstName}, we missed you at {churchName}! We hope all is well. Looking forward to seeing you soon. God bless! 🙏`,
    variables: [
      TEMPLATE_VARIABLES.find(v => v.key === '{firstName}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{churchName}')!,
    ],
    isActive: true,
    isSystem: true,
  },
  {
    name: 'First-Timer Welcome',
    description: 'Welcome first-time visitors',
    category: TemplateCategory.MEMBERSHIP,
    type: MessageChannel.EMAIL,
    subject: 'Welcome to {churchName}! 👋',
    bodyText: `Dear {firstName},

Thank you for visiting {churchName}! We are thrilled to have you worship with us.

We hope you felt welcomed and experienced God's presence during the service. We would love to get to know you better and help you feel at home in our church family.

If you have any questions or would like to learn more about our church, please don't hesitate to reach out.

Blessings,
{churchName} Team`,
    bodyHtml: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #3b82f6;">Welcome to {churchName}! 👋</h2>
  <p>Dear {firstName},</p>
  <p>Thank you for visiting <strong>{churchName}</strong>! We are thrilled to have you worship with us.</p>
  <p>We hope you felt welcomed and experienced God's presence during the service. We would love to get to know you better and help you feel at home in our church family.</p>
  <p>If you have any questions or would like to learn more about our church, please don't hesitate to reach out.</p>
  <p style="margin-top: 30px;">Blessings,<br/><strong>{churchName} Team</strong></p>
</div>`,
    variables: [
      TEMPLATE_VARIABLES.find(v => v.key === '{firstName}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{churchName}')!,
    ],
    isActive: true,
    isSystem: true,
  },
  {
    name: 'Payment Thank You',
    description: 'Thank members for their donations',
    category: TemplateCategory.GIVING,
    type: MessageChannel.EMAIL,
    subject: 'Thank You for Your Generous Gift',
    bodyText: `Dear {firstName},

Thank you for your generous gift of {amount} on {paymentDate}.

Your faithful giving enables us to continue our ministry and reach more people with the Gospel. We are deeply grateful for your partnership in advancing God's kingdom.

May God bless you abundantly for your generosity.

Receipt Number: {receiptNumber}

In gratitude,
{churchName}`,
    bodyHtml: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #10b981;">Thank You for Your Generous Gift</h2>
  <p>Dear {firstName},</p>
  <p>Thank you for your generous gift of <strong>{amount}</strong> on {paymentDate}.</p>
  <p>Your faithful giving enables us to continue our ministry and reach more people with the Gospel. We are deeply grateful for your partnership in advancing God's kingdom.</p>
  <p>May God bless you abundantly for your generosity.</p>
  <p style="margin-top: 20px; padding: 10px; background: #f3f4f6; border-radius: 5px;">
    <strong>Receipt Number:</strong> {receiptNumber}
  </p>
  <p style="margin-top: 30px;">In gratitude,<br/><strong>{churchName}</strong></p>
</div>`,
    variables: [
      TEMPLATE_VARIABLES.find(v => v.key === '{firstName}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{amount}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{paymentDate}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{receiptNumber}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{churchName}')!,
    ],
    isActive: true,
    isSystem: true,
  },
  {
    name: 'Event Reminder',
    description: 'Remind members about upcoming events',
    category: TemplateCategory.EVENTS,
    type: MessageChannel.SMS,
    bodyText: `Hi {firstName}! Reminder: {eventName} is coming up on {eventDate} at {eventTime}. Location: {eventLocation}. See you there! 📅`,
    variables: [
      TEMPLATE_VARIABLES.find(v => v.key === '{firstName}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{eventName}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{eventDate}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{eventTime}')!,
      TEMPLATE_VARIABLES.find(v => v.key === '{eventLocation}')!,
    ],
    isActive: true,
    isSystem: true,
  },
];

// Helper functions
export const getCategoryIcon = (category: TemplateCategory): string => {
  const icons: Record<TemplateCategory, string> = {
    [TemplateCategory.CELEBRATIONS]: '🎉',
    [TemplateCategory.MEMBERSHIP]: '👥',
    [TemplateCategory.ATTENDANCE]: '📅',
    [TemplateCategory.GIVING]: '💰',
    [TemplateCategory.EVENTS]: '📢',
    [TemplateCategory.PASTORAL]: '🙏',
    [TemplateCategory.GENERAL]: '📧',
  };
  return icons[category];
};

export const getCategoryColor = (category: TemplateCategory): string => {
  const colors: Record<TemplateCategory, string> = {
    [TemplateCategory.CELEBRATIONS]: 'pink',
    [TemplateCategory.MEMBERSHIP]: 'blue',
    [TemplateCategory.ATTENDANCE]: 'orange',
    [TemplateCategory.GIVING]: 'green',
    [TemplateCategory.EVENTS]: 'purple',
    [TemplateCategory.PASTORAL]: 'indigo',
    [TemplateCategory.GENERAL]: 'gray',
  };
  return colors[category];
};

export const getChannelIcon = (channel: MessageChannel): string => {
  const icons: Record<MessageChannel, string> = {
    [MessageChannel.EMAIL]: '📧',
    [MessageChannel.SMS]: '📱',
    [MessageChannel.PUSH]: '🔔',
    [MessageChannel.IN_APP]: '💬',
  };
  return icons[channel];
};

export const renderTemplate = (template: string, variables: Record<string, string>): string => {
  let rendered = template;
  Object.entries(variables).forEach(([key, value]) => {
    rendered = rendered.replace(new RegExp(key, 'g'), value);
  });
  return rendered;
};

export const extractVariables = (template: string): string[] => {
  const regex = /\{([^}]+)\}/g;
  const matches = template.match(regex) || [];
  return [...new Set(matches)];
};
